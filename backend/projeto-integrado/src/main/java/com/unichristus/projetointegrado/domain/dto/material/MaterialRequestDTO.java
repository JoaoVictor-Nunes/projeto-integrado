package com.unichristus.projetointegrado.domain.dto.material;

import java.util.List;

import com.unichristus.projetointegrado.domain.model.EtapaEnsino;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Dados de cadastro/edição de um material. Os arquivos (PDF e capa)
 * NÃO vêm aqui: são enviados à parte, em endpoints próprios.
 */
public record MaterialRequestDTO(
        @NotBlank(message = "O título é obrigatório.")
        @Size(max = 255, message = "O título deve ter no máximo 255 caracteres.")
        String titulo,

        @NotBlank(message = "O autor é obrigatório.")
        @Size(max = 255, message = "O autor deve ter no máximo 255 caracteres.")
        String autor,

        @Size(max = 2000, message = "O resumo deve ter no máximo 2000 caracteres.")
        String resumo,

        @NotNull(message = "A etapa de ensino é obrigatória.")
        EtapaEnsino etapaEnsino,

        /** Disciplinas (categorias) associadas. Pode ser vazio. */
        List<Long> disciplinaIds) {
}