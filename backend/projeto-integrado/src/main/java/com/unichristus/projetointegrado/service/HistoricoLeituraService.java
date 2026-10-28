package com.unichristus.projetointegrado.service;

import java.time.Duration;
import java.time.LocalDateTime;

import com.unichristus.projetointegrado.domain.dto.Historico.HistoricoLeituraResponseDTO;
import com.unichristus.projetointegrado.domain.model.HistoricoLeitura;
import com.unichristus.projetointegrado.domain.model.TipoAcesso;
import com.unichristus.projetointegrado.repository.HistoricoLeituraRepository;
import com.unichristus.projetointegrado.repository.MaterialRepository;
import com.unichristus.projetointegrado.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistoricoLeituraService {

    private static final Logger log = LoggerFactory.getLogger(HistoricoLeituraService.class);

    private static final Duration JANELA_DEDUPLICACAO = Duration.ofSeconds(30);

    private static final int TAMANHO_MAXIMO_PAGINA = 100;

    private final HistoricoLeituraRepository historicoRepository;
    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;

    public HistoricoLeituraService(HistoricoLeituraRepository historicoRepository,
                                   UserRepository userRepository,
                                   MaterialRepository materialRepository) {
        this.historicoRepository = historicoRepository;
        this.userRepository = userRepository;
        this.materialRepository = materialRepository;
    }

    @Async
    public void registrarAcesso(Long usuarioId, Long materialId, TipoAcesso tipoAcesso) {
        try {
            LocalDateTime agora = LocalDateTime.now();

            boolean repetido = historicoRepository
                    .existsByUsuarioIdAndMaterialIdAndTipoAcessoAndDataAcessoAfter(
                            usuarioId, materialId, tipoAcesso, agora.minus(JANELA_DEDUPLICACAO));
            if (repetido) {
                return;
            }

            if (!materialRepository.existsById(materialId)) {
                log.debug("Histórico ignorado: material {} inexistente", materialId);
                return;
            }

            HistoricoLeitura registro = new HistoricoLeitura();
            registro.setUsuario(userRepository.getReferenceById(usuarioId));
            registro.setMaterial(materialRepository.getReferenceById(materialId));
            registro.setTipoAcesso(tipoAcesso);
            registro.setDataAcesso(agora);
            historicoRepository.save(registro);
        } catch (RuntimeException ex) {
            log.warn("Falha ao registrar histórico (ignorada): usuario={}, material={}, tipo={}",
                    usuarioId, materialId, tipoAcesso, ex);
        }
    }

    /** Acessos recentes do usuário, do mais novo para o mais antigo. */
    @Transactional(readOnly = true)
    public Page<HistoricoLeituraResponseDTO> listarRecentes(Long usuarioId, int page, int size) {
        int tamanho = Math.min(Math.max(size, 1), TAMANHO_MAXIMO_PAGINA);
        PageRequest pageable = PageRequest.of(Math.max(page, 0), tamanho);

        return historicoRepository
                .findByUsuarioIdOrderByDataAcessoDesc(usuarioId, pageable)
                .map(this::toResponse);
    }

    private HistoricoLeituraResponseDTO toResponse(HistoricoLeitura h) {
        return new HistoricoLeituraResponseDTO(
                h.getId(),
                h.getMaterial().getId(),
                h.getMaterial().getTitulo(),
                h.getTipoAcesso(),
                h.getDataAcesso());
    }
}