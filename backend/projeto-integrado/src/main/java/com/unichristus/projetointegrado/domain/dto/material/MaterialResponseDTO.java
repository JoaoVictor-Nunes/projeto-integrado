package com.unichristus.projetointegrado.domain.dto.material;

import java.util.List;

import com.unichristus.projetointegrado.domain.model.EtapaEnsino;

/**
 * Material como o front-end enxerga. O link do PDF NÃO vai aqui: ele é
 * pedido sob demanda em GET /api/materiais/{id}/arquivo (link
 * temporário), então a listagem não expõe o arquivo a quem só navega.
 * "capaUrl" já vem pronta para uso em <img>, válida por 1 hora.
 */
public record MaterialResponseDTO(
        Long id,
        String titulo,
        String autor,
        String resumo,
        String capaUrl,
        boolean possuiArquivo,
        EtapaEnsino etapaEnsino,
        List<DisciplinaResumoDTO> disciplinas) {
}