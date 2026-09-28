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
@Table(name = "tb_historico_leitura")
public class HistoricoLeitura {
    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User usuario;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Material material;

    @Column(nullable = false)
    private LocalDateTime dataAcesso;

    @Column(nullable = false)
    private TipoAcesso tipoAcesso;
}
