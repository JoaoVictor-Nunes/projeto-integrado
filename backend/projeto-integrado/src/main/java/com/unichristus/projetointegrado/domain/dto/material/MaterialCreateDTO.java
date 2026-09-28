package com.unichristus.projetointegrado.domain.dto.material;

import com.unichristus.projetointegrado.domain.model.EtapaEnsino;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public class MaterialCreateDTO {
    private String titulo;

    private String autor;

    private String resumo;

    private EtapaEnsino etapaEnsino;

    Set<Long> disciplinasIds;

    private MultipartFile arquivoPdf;

    private MultipartFile capa;

}
