package com.unichristus.projetointegrado.domain.dto.estatisticas;

import java.util.List;

public class DashboardMetricsDTO {
    private Long totalUsuarios;

    private Long totalMateriais;

    private Long totalLeituras;

    private List<MateriaisMaisAcessadosDTO> materiaisMaisAcessados;

    private List<EngajamentoPorDisciplinaDTO> engajamentoPorDisciplina;
}
