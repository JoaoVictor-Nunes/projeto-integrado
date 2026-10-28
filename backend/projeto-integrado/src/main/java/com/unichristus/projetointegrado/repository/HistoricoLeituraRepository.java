package com.unichristus.projetointegrado.repository;

import java.time.LocalDateTime;

import com.unichristus.projetointegrado.domain.model.HistoricoLeitura;
import com.unichristus.projetointegrado.domain.model.TipoAcesso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoLeituraRepository extends JpaRepository<HistoricoLeitura, Long> {

    @EntityGraph(attributePaths = "material")
    Page<HistoricoLeitura> findByUsuarioIdOrderByDataAcessoDesc(Long usuarioId, Pageable pageable);

    /** Usado para descartar registros repetidos num intervalo curto. */
    boolean existsByUsuarioIdAndMaterialIdAndTipoAcessoAndDataAcessoAfter(
            Long usuarioId, Long materialId, TipoAcesso tipoAcesso, LocalDateTime limite);
}