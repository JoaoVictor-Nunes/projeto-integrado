package com.unichristus.projetointegrado.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="tb_material")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String autor;

    @Column(nullable = false)
    private String resumo;

    @Column(nullable = false)
    private String arquivoPdfUrl;

    @Column
    private String capaUrl;

    @Column(nullable = false)
    private Double tamanhoMb;

    @Enumerated(EnumType.STRING)
    private EtapaEnsino etapaEnsino;

    @Column(nullable = false)
    private LocalDateTime dataCadastro;

    @ManyToMany
    @JoinTable(
            name = "tb_material_disciplina",
            joinColumns = @JoinColumn(name = "material_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id")
    )
    private Set<Disciplina> disciplinas;

}