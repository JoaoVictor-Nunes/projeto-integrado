package com.unichristus.projetointegrado.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="tb_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String matricula;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPerfil perfil;

    @Column(nullable = false)
    private Boolean statusAtivo;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    /**
     * SHA-256 (hex) do refresh token vigente. Nulo = sem sessão ativa
     * (nunca logou ou já fez logout). Guarda-se o hash, nunca o token.
     */
    @Column(name = "refresh_token_hash", length = 64)
    private String refreshTokenHash;
}
