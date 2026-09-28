package com.unichristus.projetointegrado.domain.dto.user;

import com.unichristus.projetointegrado.domain.model.TipoPerfil;

public class UserResponseDTO {
    private Long id;

    private String nome;

    private String email;

    private String matricula;

    private TipoPerfil perfil;

    private Boolean statusAtivo;
}
