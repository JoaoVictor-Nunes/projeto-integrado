package com.unichristus.projetointegrado.repository;

import java.util.Optional;

import com.unichristus.projetointegrado.domain.model.ProgressoLeitura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressoLeituraRepository extends JpaRepository<ProgressoLeitura, Long> {

    Optional<ProgressoLeitura> findByUsuarioIdAndMaterialId(Long usuarioId, Long materialId);
}