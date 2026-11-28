package com.unichristus.projetointegrado.domain.dto.estatisticas;

import java.util.List;

public record DashboardMetricsDTO(
        Long totalUsuarios,
        Long usuariosAtivos,
        Long totalMateriais,
        Long materiaisAtivos,
        Long totalLeituras,
        Long totalAcessosPeriodo,
        Long totalLeiturasOnlinePeriodo,
        Long totalDownloadsPeriodo,
        Long totalFavoritos,
        Integer periodoDias,
        List<MateriaisMaisAcessadosDTO> materiaisMaisAcessados,
        List<EngajamentoPorDisciplinaDTO> engajamentoPorDisciplina,
        List<AcessosPorDiaDTO> acessosPorDia) {
}
