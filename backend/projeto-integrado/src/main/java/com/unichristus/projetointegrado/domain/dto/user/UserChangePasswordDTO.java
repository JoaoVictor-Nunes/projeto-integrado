package com.unichristus.projetointegrado.domain.dto.user;

import jakarta.validation.constraints.NotBlank;

public record UserChangePasswordDTO(
        @NotBlank(message = "Informe a senha atual.") String senhaAtual,
        @NotBlank(message = "Informe a nova senha.") String novaSenha) {
}
