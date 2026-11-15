package com.unichristus.projetointegrado.domain.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Onde o usuário parou em cada material. Uma linha por (usuário, material),
 * sempre atualizada, ao contrário do histórico, que guarda cada acesso.
 */
@Entity
@Table(
        name = "tb_progresso_leitura",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_progresso_usuario_material", columnNames = {"usuario_id", "material_id"}))
@Getter
@Setter
@NoArgsConstructor
public class ProgressoLeitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(nullable = false)
    private Integer paginaAtual;

    /** Total de páginas do PDF, informado pelo leitor do front-end. */
    private Integer totalPaginas;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime atualizadoEm;
}