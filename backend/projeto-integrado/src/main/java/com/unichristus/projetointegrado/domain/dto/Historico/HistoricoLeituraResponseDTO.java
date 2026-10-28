package com.unichristus.projetointegrado.domain.dto.Historico;

import com.unichristus.projetointegrado.domain.model.TipoAcesso;

import java.time.LocalDateTime;

public record HistoricoLeituraResponseDTO(
        Long id,
        Long materialId,
        String materialTitulo,
        TipoAcesso tipoAcesso,
        LocalDateTime dataAcesso) {
}