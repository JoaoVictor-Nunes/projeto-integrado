package com.unichristus.projetointegrado.controller;

import com.unichristus.projetointegrado.domain.model.EtapaEnsino;
import com.unichristus.projetointegrado.domain.model.Material;
import com.unichristus.projetointegrado.repository.MaterialRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/materiais")
public class MaterialController {

    private final MaterialRepository materialRepository;

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @GetMapping
    public List<Map<String, Object>> pesquisar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String disciplina,
            @RequestParam(required = false) String palavrasChave,
            @RequestParam(required = false) EtapaEnsino etapaEnsino) {

        return materialRepository.pesquisar(
                normalizar(titulo), normalizar(autor), normalizar(disciplina),
                normalizar(palavrasChave), etapaEnsino
        ).stream().map(this::paraResposta).toList();
    }

    private String normalizar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private Map<String, Object> paraResposta(Material material) {
        return Map.of(
                "id", material.getId(),
                "titulo", material.getTitulo(),
                "autor", material.getAutor(),
                "resumo", material.getResumo() == null ? "" : material.getResumo(),
                "capaUrl", material.getCapaUrl() == null ? "" : material.getCapaUrl(),
                "arquivoPdfUrl", material.getArquivoPdfUrl() == null ? "" : material.getArquivoPdfUrl(),
                "etapaEnsino", material.getEtapaEnsino() == null ? "" : material.getEtapaEnsino().name(),
                "disciplinas", material.getDisciplinas() == null ? List.of() :
                    material.getDisciplinas().stream().map(d -> Map.of(
                        "id", d.getId(), "nome", d.getNome()
                    )).toList()
        );
    }
}
