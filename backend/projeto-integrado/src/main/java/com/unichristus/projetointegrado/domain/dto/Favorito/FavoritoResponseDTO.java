package com.unichristus.projetointegrado.domain.dto.Favorito;

import com.unichristus.projetointegrado.domain.dto.material.MaterialResponseDTO;

import java.time.LocalDateTime;

public class FavoritoResponseDTO {

    private Long id;

    private MaterialResponseDTO material;

    private LocalDateTime dataAdicao;
}
