package com.unichristus.projetointegrado.domain.dto.material;

import com.unichristus.projetointegrado.domain.model.EtapaEnsino;

import java.util.Set;

public class MaterialUpdateDTO {
    private String titulo;

    private String autor;

    private String resumo;

    private EtapaEnsino etapaEnsino;

    private Set<Long> disciplinasId;
}
