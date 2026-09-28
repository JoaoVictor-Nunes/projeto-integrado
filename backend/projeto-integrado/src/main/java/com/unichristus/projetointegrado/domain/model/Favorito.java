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
@Table(name = "tb_favoritos")
public class Favorito {
    @Id
    private Long id;

    @ManyToOne
    @Column(nullable = false)
    private User usuario;

    @ManyToOne
    @Column(nullable = false)
    private Material material;

    @Column(nullable = false)
    private LocalDateTime dataFavoritado;
}
