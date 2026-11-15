package com.unichristus.projetointegrado.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ProgressoRequestDTO(
        @NotNull(message = "A página atual é obrigatória.")
        @Min(value = 1, message = "A página atual deve ser pelo menos 1.")
        Integer paginaAtual,

        @Min(value = 1, message = "O total de páginas deve ser pelo menos 1.")
        Integer totalPaginas) {
}