package com.unichristus.projetointegrado.domain.dto;

import com.unichristus.projetointegrado.domain.dto.user.UserResponseDTO;

public record LoginResponseDTO(
        String access_token,
        String refresh_token,
        UserResponseDTO user) {
}
