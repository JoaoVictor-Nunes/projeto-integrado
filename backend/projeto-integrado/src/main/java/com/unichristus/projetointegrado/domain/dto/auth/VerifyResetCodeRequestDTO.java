package com.unichristus.projetointegrado.domain.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyResetCodeRequestDTO(
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "E-mail em formato inválido.")
        String email,
        @NotBlank(message = "O código é obrigatório.")
        @Pattern(regexp = "\\d{6}", message = "O código deve conter 6 dígitos.")
        String code) {
}
