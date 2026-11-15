package com.unichristus.projetointegrado.domain.model;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Reconstruída a partir do SQL do log (tb_material + tb_material_disciplina).
 * Os nomes das colunas são os mesmos de antes, então não precisa migrar nada.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
// A coleção fica de fora de equals/hashCode/toString para não formar ciclo
// com Disciplina.materiais (StackOverflowError).
@EqualsAndHashCode(exclude = "disciplinas")
@ToString(exclude = "disciplinas")
@Entity
@Table(name = "tb_material")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String autor;

    @Column(length = 2000)
    private String resumo;

    /** Guarda a CHAVE do PDF no MinIO (ex.: materiais/ab12.pdf), não uma URL. */
    @Column(nullable = false, length = 500)
    private String arquivoPdfUrl;

    /** Guarda a chave da capa no MinIO. Opcional. */
    @Column(length = 500)
    private String capaUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtapaEnsino etapaEnsino;

    /** Tamanho do PDF em MB, calculado no upload. */
    private Double tamanhoMb;

    /** Preenchida sozinha pelo Hibernate na criação. */
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @ManyToMany
    @JoinTable(
            name = "tb_material_disciplina",
            joinColumns = @JoinColumn(name = "material_id"),
            inverseJoinColumns = @JoinColumn(name = "disciplina_id"))
    private Set<Disciplina> disciplinas;
}