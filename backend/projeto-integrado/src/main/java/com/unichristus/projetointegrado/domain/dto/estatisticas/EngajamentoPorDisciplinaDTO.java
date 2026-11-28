package com.unichristus.projetointegrado.domain.dto.estatisticas;

public record EngajamentoPorDisciplinaDTO(
        Long disciplinaId,
        String nomeCategoria,
        Long quantidadeAcessos,
        Long quantidadeMateriais) {
}
