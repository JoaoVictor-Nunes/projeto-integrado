package com.unichristus.projetointegrado.repository;

import com.unichristus.projetointegrado.domain.model.Favorito;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    boolean existsByUsuarioIdAndMaterialId(Long usuarioId, Long materialId);

    /** Favoritos do usuário, do mais recente para o mais antigo, já com material e disciplinas. */
    @EntityGraph(attributePaths = {"material", "material.disciplinas"})
    List<Favorito> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    /** Precisa ser chamado dentro de uma transação (o service já anota). */
    long deleteByUsuarioIdAndMaterialId(Long usuarioId, Long materialId);
}
