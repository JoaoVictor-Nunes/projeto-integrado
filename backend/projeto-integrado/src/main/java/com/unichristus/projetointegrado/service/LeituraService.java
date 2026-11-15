package com.unichristus.projetointegrado.service;

import com.unichristus.projetointegrado.domain.dto.Favorito.FavoritoResponseDTO;
import com.unichristus.projetointegrado.domain.dto.LeituraResponseDTO;
import com.unichristus.projetointegrado.domain.dto.ProgressoRequestDTO;
import com.unichristus.projetointegrado.domain.dto.material.LinkArquivoDTO;
import com.unichristus.projetointegrado.domain.dto.material.MaterialResponseDTO;
import com.unichristus.projetointegrado.domain.model.Favorito;
import com.unichristus.projetointegrado.domain.model.ProgressoLeitura;
import com.unichristus.projetointegrado.exception.BusinessRuleException;
import com.unichristus.projetointegrado.exception.ResourceNotFoundException;
import com.unichristus.projetointegrado.repository.FavoritoRepository;
import com.unichristus.projetointegrado.repository.MaterialRepository;
import com.unichristus.projetointegrado.repository.ProgressoLeituraRepository;
import com.unichristus.projetointegrado.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Experiência de leitura: abrir um material, lembrar onde o usuário parou
 * e favoritar. O histórico é gravado como efeito de abrir o material.
 */
@Service
public class LeituraService {

    private final MaterialService materialService;
    private final MaterialRepository materialRepository;
    private final UserRepository userRepository;
    private final FavoritoRepository favoritoRepository;
    private final ProgressoLeituraRepository progressoRepository;

    public LeituraService(MaterialService materialService,
                          MaterialRepository materialRepository,
                          UserRepository userRepository,
                          FavoritoRepository favoritoRepository,
                          ProgressoLeituraRepository progressoRepository) {
        this.materialService = materialService;
        this.materialRepository = materialRepository;
        this.userRepository = userRepository;
        this.favoritoRepository = favoritoRepository;
        this.progressoRepository = progressoRepository;
    }

    /**
     * Abre o material para leitura. Gera o link temporário do PDF e, no mesmo
     * passo, registra a visualização no histórico (em segundo plano). Por isso
     * o front não precisa registrar histórico à parte.
     */
    public LeituraResponseDTO abrir(Long materialId, Long usuarioId) {
        MaterialResponseDTO material = materialService.buscarPorId(materialId); // 404 se não existe
        LinkArquivoDTO link = materialService.gerarLinkArquivo(materialId, usuarioId, false);

        var progresso = progressoRepository.findByUsuarioIdAndMaterialId(usuarioId, materialId);
        boolean favorito = favoritoRepository.existsByUsuarioIdAndMaterialId(usuarioId, materialId);

        return new LeituraResponseDTO(
                material.id(), material.titulo(), material.autor(),
                link.url(), link.expiraEm(),
                progresso.map(ProgressoLeitura::getPaginaAtual).orElse(1),
                progresso.map(ProgressoLeitura::getTotalPaginas).orElse(null),
                favorito);
    }

    /** Grava (ou atualiza) a página onde o usuário parou. */
    @Transactional
    public void salvarProgresso(Long materialId, Long usuarioId, ProgressoRequestDTO dto) {
        Integer total = dto.totalPaginas();
        if (total != null && dto.paginaAtual() > total) {
            throw new BusinessRuleException("A página atual não pode ser maior que o total de páginas.");
        }

        ProgressoLeitura progresso = progressoRepository
                .findByUsuarioIdAndMaterialId(usuarioId, materialId)
                .orElseGet(() -> novoProgresso(materialId, usuarioId));

        progresso.setPaginaAtual(dto.paginaAtual());
        if (total != null) {
            progresso.setTotalPaginas(total);
        }
        progressoRepository.save(progresso);
    }

    /** Favorita o material. Repetir a chamada não faz nada (idempotente). */
    @Transactional
    public void favoritar(Long materialId, Long usuarioId) {
        if (favoritoRepository.existsByUsuarioIdAndMaterialId(usuarioId, materialId)) {
            return;
        }
        garantirMaterialExiste(materialId);

        Favorito favorito = new Favorito();
        favorito.setUsuario(userRepository.getReferenceById(usuarioId));
        favorito.setMaterial(materialRepository.getReferenceById(materialId));
        favoritoRepository.save(favorito);
    }

    /** Materiais favoritados pelo usuário, do mais recente para o mais antigo. */
    @Transactional(readOnly = true)
    public List<FavoritoResponseDTO> listarFavoritos(Long usuarioId) {
        return favoritoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId).stream()
                .map(f -> new FavoritoResponseDTO(
                        f.getId(), materialService.toResponse(f.getMaterial()), f.getDataCriacao()))
                .toList();
    }

    /** Remove o favorito. Se não estava favoritado, não faz nada. */
    @Transactional
    public void desfavoritar(Long materialId, Long usuarioId) {
        favoritoRepository.deleteByUsuarioIdAndMaterialId(usuarioId, materialId);
    }

    private ProgressoLeitura novoProgresso(Long materialId, Long usuarioId) {
        garantirMaterialExiste(materialId);
        ProgressoLeitura progresso = new ProgressoLeitura();
        progresso.setUsuario(userRepository.getReferenceById(usuarioId));
        progresso.setMaterial(materialRepository.getReferenceById(materialId));
        return progresso;
    }

    private void garantirMaterialExiste(Long materialId) {
        if (!materialRepository.existsById(materialId)) {
            throw new ResourceNotFoundException("Material não encontrado: id=" + materialId);
        }
    }
}