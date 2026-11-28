package com.unichristus.projetointegrado.repository;

import java.time.LocalDateTime;
import java.util.List;

import com.unichristus.projetointegrado.domain.model.HistoricoLeitura;
import com.unichristus.projetointegrado.domain.model.TipoAcesso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoricoLeituraRepository extends JpaRepository<HistoricoLeitura, Long> {

    @EntityGraph(attributePaths = "material")
    Page<HistoricoLeitura> findByUsuarioIdOrderByDataAcessoDesc(Long usuarioId, Pageable pageable);

    /** Usado para descartar registros repetidos num intervalo curto. */
    boolean existsByUsuarioIdAndMaterialIdAndTipoAcessoAndDataAcessoAfter(
            Long usuarioId, Long materialId, TipoAcesso tipoAcesso, LocalDateTime limite);

    long countByDataAcessoGreaterThanEqual(LocalDateTime inicio);

    long countByTipoAcessoAndDataAcessoGreaterThanEqual(TipoAcesso tipoAcesso, LocalDateTime inicio);

    @Query("""
            select h.dataAcesso, h.tipoAcesso
            from HistoricoLeitura h
            where h.dataAcesso >= :inicio
            order by h.dataAcesso asc
            """)
    List<Object[]> listarDatasETiposDesde(@Param("inicio") LocalDateTime inicio);

    @Query("""
            select m.id, m.titulo, m.autor, m.generoLiterario,
                   count(h.id),
                   sum(case when h.tipoAcesso = com.unichristus.projetointegrado.domain.model.TipoAcesso.LEITURA_ONLINE then 1L else 0L end),
                   sum(case when h.tipoAcesso = com.unichristus.projetointegrado.domain.model.TipoAcesso.DOWNLOAD then 1L else 0L end)
            from HistoricoLeitura h
            join h.material m
            where h.dataAcesso >= :inicio
            group by m.id, m.titulo, m.autor, m.generoLiterario
            order by count(h.id) desc, m.titulo asc
            """)
    List<Object[]> buscarMateriaisMaisAcessados(@Param("inicio") LocalDateTime inicio, Pageable pageable);

    @Query("""
            select d.id, d.nome, count(h.id)
            from HistoricoLeitura h
            join h.material m
            join m.disciplinas d
            where h.dataAcesso >= :inicio
            group by d.id, d.nome
            order by count(h.id) desc, d.nome asc
            """)
    List<Object[]> buscarEngajamentoPorDisciplina(@Param("inicio") LocalDateTime inicio);
}