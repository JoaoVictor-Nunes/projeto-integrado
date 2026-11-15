package com.unichristus.projetointegrado.domain.dto.disciplina;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DisciplinaRequestDTO(
        @NotBlank(message = "O nome é obrigatório.")
        @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres.")
        String nome,

        @NotBlank(message = "A descrição é obrigatória.")
        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
        String descricao) {
}