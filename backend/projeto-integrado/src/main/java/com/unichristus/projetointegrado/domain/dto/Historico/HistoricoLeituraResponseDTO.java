package com.unichristus.projetointegrado.domain.dto.Historico;

import com.unichristus.projetointegrado.domain.dto.material.MaterialResponseDTO;
import com.unichristus.projetointegrado.domain.model.TipoAcesso;

import java.time.LocalDateTime;

public class HistoricoLeituraResponseDTO {
    private Long id;

    private MaterialResponseDTO material;

    private LocalDateTime dataAcesso;

    private TipoAcesso tipoAcesso;
}
