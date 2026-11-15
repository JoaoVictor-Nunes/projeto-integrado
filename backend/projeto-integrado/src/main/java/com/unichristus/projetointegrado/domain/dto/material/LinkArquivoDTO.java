package com.unichristus.projetointegrado.domain.dto.material;

import java.time.Instant;

/** Link temporário para abrir ou baixar o PDF de um material. */
public record LinkArquivoDTO(String url, Instant expiraEm) {
}