package com.unichristus.projetointegrado.domain.dto.Historico;

import com.unichristus.projetointegrado.domain.model.TipoAcesso;
import jakarta.validation.constraints.NotNull;

public record RegistrarAcessoRequestDTO(
        @NotNull(message = "O material é obrigatório.") Long materialId,
        @NotNull(message = "O tipo de acesso é obrigatório.") TipoAcesso tipoAcesso) {
}