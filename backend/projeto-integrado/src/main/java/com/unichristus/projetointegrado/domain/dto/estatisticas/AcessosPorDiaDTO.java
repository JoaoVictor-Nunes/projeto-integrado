package com.unichristus.projetointegrado.domain.dto.estatisticas;

import java.time.LocalDate;

public record AcessosPorDiaDTO(
        LocalDate data,
        Long totalAcessos,
        Long leiturasOnline,
        Long downloads) {
}
