package com.unichristus.projetointegrado.domain.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDTO(
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "E-mail em formato inválido.")
        String email) {
}
