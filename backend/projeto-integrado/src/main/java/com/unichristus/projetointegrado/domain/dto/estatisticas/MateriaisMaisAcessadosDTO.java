package com.unichristus.projetointegrado.domain.dto.estatisticas;

public record MateriaisMaisAcessadosDTO(
        Long materialId,
        String titulo,
        String autor,
        String generoLiterario,
        Long quantidadeAcessos,
        Long leiturasOnline,
        Long downloads) {
}
