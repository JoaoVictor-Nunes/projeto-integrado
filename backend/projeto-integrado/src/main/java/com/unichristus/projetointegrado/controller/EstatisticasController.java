package com.unichristus.projetointegrado.controller;

import com.unichristus.projetointegrado.domain.dto.estatisticas.DashboardMetricsDTO;
import com.unichristus.projetointegrado.service.EstatisticasService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Métricas e indicadores do painel administrativo de Estatísticas.
 */
@RestController
@RequestMapping("/api/estatisticas")
public class EstatisticasController {

    private final EstatisticasService estatisticasService;

    public EstatisticasController(EstatisticasService estatisticasService) {
        this.estatisticasService = estatisticasService;
    }

    /** GET /api/estatisticas/dashboard?dias=30 */
    @GetMapping("/dashboard")
    public DashboardMetricsDTO dashboard(@RequestParam(defaultValue = "30") Integer dias) {
        return estatisticasService.obterMetricas(dias);
    }
}
