package com.unichristus.projetointegrado.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Material favoritado por um usuário. O par (usuário, material) é único:
 * favoritar duas vezes não cria duas linhas.
 */
@Entity
@Table(
        name = "tb_favorito",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_favorito_usuario_material", columnNames = {"usuario_id", "material_id"}))
@Getter
@Setter
@NoArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;
}