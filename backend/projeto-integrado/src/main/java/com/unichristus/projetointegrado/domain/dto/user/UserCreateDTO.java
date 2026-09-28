package com.unichristus.projetointegrado.domain.dto.user;

import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import lombok.Data;

@Data
public class UserCreateDTO {
    private String nome;

    private String email;

    private String matricula;

    private String senha;

    private TipoPerfil perfil;
}
