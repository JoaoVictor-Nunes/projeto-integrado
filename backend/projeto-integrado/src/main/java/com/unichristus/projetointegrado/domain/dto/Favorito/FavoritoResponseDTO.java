package com.unichristus.projetointegrado.domain.dto.Favorito;

import com.unichristus.projetointegrado.domain.dto.material.MaterialResponseDTO;

import java.time.LocalDateTime;

/** Um material favoritado pelo usuário, com a data em que foi salvo. */
public record FavoritoResponseDTO(
        Long id,
        MaterialResponseDTO material,
        LocalDateTime dataAdicao) {
}
