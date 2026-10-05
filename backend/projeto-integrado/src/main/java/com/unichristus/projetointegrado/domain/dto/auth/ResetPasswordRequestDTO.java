package com.unichristus.projetointegrado.domain.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequestDTO(
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "E-mail em formato inválido.")
        String email,

        @NotBlank(message = "O token de recuperação é obrigatório.")
        String resetToken,

        @NotBlank(message = "A nova senha é obrigatória.")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres.")
        String novaSenha) {
}
