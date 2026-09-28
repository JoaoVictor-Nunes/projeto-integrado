package com.unichristus.projetointegrado.domain.dto.user;

import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResponseDTO {
    private Long id;

    private String nome;

    private String email;

    private String matricula;

    private TipoPerfil perfil;

    private Boolean statusAtivo;
}
