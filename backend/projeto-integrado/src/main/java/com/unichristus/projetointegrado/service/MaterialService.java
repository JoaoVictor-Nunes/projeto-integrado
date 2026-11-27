package com.unichristus.projetointegrado.service;

import java.text.Normalizer;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import com.unichristus.projetointegrado.domain.dto.material.DisciplinaResumoDTO;
import com.unichristus.projetointegrado.domain.dto.material.LinkArquivoDTO;
import com.unichristus.projetointegrado.domain.dto.material.MaterialRequestDTO;
import com.unichristus.projetointegrado.domain.dto.material.MaterialResponseDTO;
import com.unichristus.projetointegrado.domain.model.Disciplina;
import com.unichristus.projetointegrado.domain.model.EtapaEnsino;
import com.unichristus.projetointegrado.domain.model.Material;
import com.unichristus.projetointegrado.domain.model.TipoAcesso;
import com.unichristus.projetointegrado.exception.ResourceNotFoundException;
import com.unichristus.projetointegrado.repository.DisciplinaRepository;
import com.unichristus.projetointegrado.repository.MaterialRepository;
import com.unichristus.projetointegrado.service.ArquivoValidator.TipoArquivo;
import com.unichristus.projetointegrado.service.ArquivoValidator.TipoImagem;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Regras do acervo: CRUD de materiais, associação com disciplinas e upload
 * do PDF e da capa para o MinIO.
 *
 * Criar e atualizar recebem os dados e os arquivos JUNTOS. A ordem é sempre:
 * validar tudo → enviar arquivos ao MinIO → gravar no banco. Se a gravação
 * falhar, os arquivos recém-enviados são apagados; assim nunca existe
 * material sem PDF nem arquivo solto no bucket.
 *
 * Esses métodos não são @Transactional de propósito, para não prender a
 * conexão do banco durante um upload de até 50 MB.
 */
@Service
public class MaterialService {

    private static final Duration VALIDADE_LEITURA = Duration.ofMinutes(15);
    private static final Duration VALIDADE_CAPA = Duration.ofHours(1);

    private final MaterialRepository materialRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final ArmazenamentoArquivoService armazenamento;
    private final ArquivoValidator validator;
    private final HistoricoLeituraService historicoService;

    public MaterialService(MaterialRepository materialRepository,
                           DisciplinaRepository disciplinaRepository,
                           ArmazenamentoArquivoService armazenamento,
                           ArquivoValidator validator,
                           HistoricoLeituraService historicoService) {
        this.materialRepository = materialRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.armazenamento = armazenamento;
        this.validator = validator;
        this.historicoService = historicoService;
    }

    // ------------------------------------------------------------------
    // Consulta
    // ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public List<MaterialResponseDTO> pesquisar(String titulo, String autor, String disciplina,
                                               String palavrasChave, EtapaEnsino etapaEnsino,
                                               String generoLiterario, boolean incluirInativos) {
        return materialRepository
                .pesquisar(normalizar(titulo), normalizar(autor), normalizar(disciplina),
                        normalizar(palavrasChave), etapaEnsino, normalizar(generoLiterario), incluirInativos)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MaterialResponseDTO buscarPorId(Long id) {
        return toResponse(buscarDetalhado(id));
    }

    /**
     * Gera o link temporário do PDF e registra o acesso no histórico do
     * usuário (em segundo plano, sem atrasar a resposta).
     *
     * @param download true = baixar (DOWNLOAD); false = abrir no navegador (VISUALIZACAO)
     */
    public LinkArquivoDTO gerarLinkArquivo(Long id, Long usuarioId, boolean download) {
        Material material = materialRepository.findById(id).orElseThrow(() -> naoEncontrado(id));

        String url = armazenamento.gerarUrlLeitura(
                material.getArquivoPdfUrl(), VALIDADE_LEITURA, download, nomeArquivoDownload(material));

        historicoService.registrarAcesso(usuarioId, id, download ? TipoAcesso.DOWNLOAD : TipoAcesso.LEITURA_ONLINE);

        return new LinkArquivoDTO(url, Instant.now().plus(VALIDADE_LEITURA));
    }

    // ------------------------------------------------------------------
    // Cadastro e edição
    // ------------------------------------------------------------------

    /** Cadastra um material. O arquivo (PDF ou ePub) é obrigatório; a capa é opcional. */
    public MaterialResponseDTO criar(MaterialRequestDTO dto, MultipartFile arquivo, MultipartFile capa) {
        // 1) Validar tudo ANTES de enviar qualquer coisa ao MinIO
        TipoArquivo tipoArquivo = validator.validarArquivoMaterial(arquivo);
        TipoImagem tipoCapa = temArquivo(capa) ? validator.validarCapa(capa) : null;
        Set<Disciplina> disciplinas = carregarDisciplinas(dto.disciplinaIds());

        Material material = new Material();
        material.setStatusAtivo(Boolean.TRUE);
        aplicarDados(material, dto, disciplinas);

        // 2) Enviar os arquivos e 3) gravar no banco; se falhar, desfaz os envios
        List<String> enviados = new ArrayList<>();
        try {
            material.setArquivoPdfUrl(enviarArquivo(arquivo, tipoArquivo, enviados));
            material.setTamanhoMb(tamanhoEmMb(arquivo));
            if (tipoCapa != null) {
                material.setCapaUrl(enviarCapa(capa, tipoCapa, enviados));
            }
            return toResponse(materialRepository.save(material));
        } catch (RuntimeException ex) {
            enviados.forEach(armazenamento::remover);
            throw ex;
        }
    }

    /**
     * Atualiza os dados e, só se vierem, troca o PDF/ePub e/ou a capa.
     * Os arquivos antigos só são apagados depois que o banco confirma.
     */
    public MaterialResponseDTO atualizar(Long id, MaterialRequestDTO dto,
                                         MultipartFile arquivo, MultipartFile capa) {
        Material material = buscarDetalhado(id); // 404 antes de qualquer upload

        boolean trocaArquivo = temArquivo(arquivo);
        boolean trocaCapa = temArquivo(capa);
        TipoArquivo tipoArquivo = trocaArquivo ? validator.validarArquivoMaterial(arquivo) : null;
        TipoImagem tipoCapa = trocaCapa ? validator.validarCapa(capa) : null;
        Set<Disciplina> disciplinas = carregarDisciplinas(dto.disciplinaIds());

        String arquivoAntigo = material.getArquivoPdfUrl();
        String capaAntiga = material.getCapaUrl();
        aplicarDados(material, dto, disciplinas);

        List<String> enviados = new ArrayList<>();
        try {
            if (trocaArquivo) {
                material.setArquivoPdfUrl(enviarArquivo(arquivo, tipoArquivo, enviados));
                material.setTamanhoMb(tamanhoEmMb(arquivo));
            }
            if (trocaCapa) {
                material.setCapaUrl(enviarCapa(capa, tipoCapa, enviados));
            }
            Material salvo = materialRepository.save(material);

            if (trocaArquivo) {
                armazenamento.remover(arquivoAntigo);
            }
            if (trocaCapa) {
                armazenamento.remover(capaAntiga);
            }
            return toResponse(salvo);
        } catch (RuntimeException ex) {
            enviados.forEach(armazenamento::remover);
            throw ex;
        }
    }

    // ------------------------------------------------------------------
    // Inativação / Reativação (soft delete)
    // ------------------------------------------------------------------

    /**
     * Inativa o material (soft delete). Ele deixa de aparecer para os
     * usuários comuns sem quebrar históricos de leitura ou favoritos.
     */
    @Transactional
    public void excluir(Long id) {
        Material material = materialRepository.findById(id).orElseThrow(() -> naoEncontrado(id));
        material.setStatusAtivo(Boolean.FALSE);
        materialRepository.save(material);
    }

    /** Reativa um material previamente inativado. */
    @Transactional
    public MaterialResponseDTO reativar(Long id) {
        Material material = buscarDetalhado(id);
        material.setStatusAtivo(Boolean.TRUE);
        return toResponse(materialRepository.save(material));
    }

    // ------------------------------------------------------------------
    // Auxiliares
    // ------------------------------------------------------------------

    private void aplicarDados(Material material, MaterialRequestDTO dto, Set<Disciplina> disciplinas) {
        material.setTitulo(dto.titulo().trim());
        material.setAutor(dto.autor().trim());
        material.setResumo(vazio(dto.resumo()) ? null : dto.resumo().trim());
        material.setEtapaEnsino(dto.etapaEnsino());
        material.setGeneroLiterario(vazio(dto.generoLiterario()) ? null : dto.generoLiterario().trim());
        material.setDisciplinas(disciplinas);
    }

    /** Envia o PDF ou ePub e registra a chave em "enviados" (para desfazer se algo falhar depois). */
    private String enviarArquivo(MultipartFile arquivo, TipoArquivo tipo, List<String> enviados) {
        String chave = "materiais/%s.%s".formatted(UUID.randomUUID(), tipo.extensao());
        armazenamento.enviar(chave, arquivo, tipo.contentType());
        enviados.add(chave);
        return chave;
    }

    private String enviarCapa(MultipartFile capa, TipoImagem tipo, List<String> enviados) {
        String chave = "capas/%s.%s".formatted(UUID.randomUUID(), tipo.extensao());
        armazenamento.enviar(chave, capa, tipo.contentType());
        enviados.add(chave);
        return chave;
    }

    private double tamanhoEmMb(MultipartFile arquivo) {
        return Math.round(arquivo.getSize() / (1024.0 * 1024.0) * 100.0) / 100.0;
    }

    private boolean temArquivo(MultipartFile arquivo) {
        return arquivo != null && !arquivo.isEmpty();
    }

    /** Busca as disciplinas informadas; se alguma não existir, recusa e diz quais. */
    private Set<Disciplina> carregarDisciplinas(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        Set<Long> pedidos = new HashSet<>(ids);
        List<Disciplina> encontradas = disciplinaRepository.findAllById(pedidos);

        if (encontradas.size() != pedidos.size()) {
            Set<Long> achados = encontradas.stream().map(Disciplina::getId).collect(Collectors.toSet());
            pedidos.removeAll(achados);
            throw new ResourceNotFoundException("Disciplina(s) não encontrada(s): " + pedidos);
        }
        return new HashSet<>(encontradas);
    }

    private Material buscarDetalhado(Long id) {
        return materialRepository.findDetalhadoById(id).orElseThrow(() -> naoEncontrado(id));
    }

    private ResourceNotFoundException naoEncontrado(Long id) {
        return new ResourceNotFoundException("Material não encontrado: id=" + id);
    }

    /** Converte a entidade para o DTO da API. As disciplinas precisam estar carregadas. */
    public MaterialResponseDTO toResponse(Material m) {
        List<DisciplinaResumoDTO> disciplinas = m.getDisciplinas() == null ? List.of()
                : m.getDisciplinas().stream()
                .map(d -> new DisciplinaResumoDTO(d.getId(), d.getNome()))
                .sorted(Comparator.comparing(DisciplinaResumoDTO::nome, String.CASE_INSENSITIVE_ORDER))
                .toList();

        String capaUrl = vazio(m.getCapaUrl()) ? null
                : armazenamento.gerarUrlLeitura(m.getCapaUrl(), VALIDADE_CAPA, false, null);

        String formato = formatoDoArquivo(m.getArquivoPdfUrl());

        return new MaterialResponseDTO(
                m.getId(), m.getTitulo(), m.getAutor(), m.getResumo(),
                capaUrl, !vazio(m.getArquivoPdfUrl()), m.getEtapaEnsino(), disciplinas,
                m.getGeneroLiterario(), formato, m.getTamanhoMb(),
                !Boolean.FALSE.equals(m.getStatusAtivo()));
    }

    /** Nome sugerido ao baixar: título sem acento nem símbolos, ex.: "Calculo_I.pdf". */
    private String nomeArquivoDownload(Material m) {
        String base = Normalizer.normalize(m.getTitulo(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .replaceAll("[^A-Za-z0-9._-]+", "_")
                .replaceAll("^_+|_+$", "");
        String extensao = "EPUB".equals(formatoDoArquivo(m.getArquivoPdfUrl())) ? ".epub" : ".pdf";
        return (base.isBlank() ? "material" : base) + extensao;
    }

    private String formatoDoArquivo(String chave) {
        if (vazio(chave)) {
            return null;
        }
        return chave.toLowerCase().endsWith(".epub") ? "EPUB" : "PDF";
    }

    private String normalizar(String valor) {
        return vazio(valor) ? null : valor.trim();
    }

    private boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }
}