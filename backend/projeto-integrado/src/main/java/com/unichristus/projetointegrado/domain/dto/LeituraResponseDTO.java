package com.unichristus.projetointegrado.domain.dto;

import java.time.Instant;

/**
 * Tudo que a tela de leitura precisa numa chamada só: o link temporário do
 * PDF, a página onde o usuário parou (1 se nunca leu) e se é favorito.
 */
public record LeituraResponseDTO(
        Long materialId,
        String titulo,
        String autor,
        String url,
        Instant expiraEm,
        int paginaAtual,
        Integer totalPaginas,
        boolean favorito) {
}