package com.unichristus.projetointegrado.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Data
// "materiais" fica de fora de equals/hashCode/toString: Disciplina e Material
// apontam um para o outro, e incluir a coleção cria um ciclo infinito
// (StackOverflowError) assim que uma disciplina entra num Set ou é impressa.
@EqualsAndHashCode(exclude = "materiais")
@ToString(exclude = "materiais")
@Entity
@Table(name = "tb_categorias")
public class Disciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // sem isso o id nunca é gerado
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @ManyToMany(mappedBy = "disciplinas")
    private Set<Material> materiais;
}