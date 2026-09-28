package com.unichristus.projetointegrado.domain.dto.user;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String nome;

    private String email;

    private String senha;
}
