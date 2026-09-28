package com.unichristus.projetointegrado.domain.dto.material;

import com.unichristus.projetointegrado.domain.dto.disciplina.DisciplinaResponseDTO;
import com.unichristus.projetointegrado.domain.model.EtapaEnsino;

import java.util.Set;

public class MaterialResponseDTO {
    private Long id;

    private String titulo;

    private String autor;

    private String resumo;

    private String capaUrl;

    private String arquivoPrfUrl;

    private Double tamanhoMb;

    private EtapaEnsino etapaEnsino;

    private Boolean statusAtivo;

    Set<DisciplinaResponseDTO> disciplinas;
}
