package com.unichristus.projetointegrado.repository;

import com.unichristus.projetointegrado.domain.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    boolean existsByUsuarioIdAndMaterialId(Long usuarioId, Long materialId);

    /** Precisa ser chamado dentro de uma transação (o service já anota). */
    long deleteByUsuarioIdAndMaterialId(Long usuarioId, Long materialId);
}