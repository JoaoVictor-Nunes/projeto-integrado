package com.unichristus.projetointegrado.repository;

import com.unichristus.projetointegrado.domain.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    boolean existsByNomeIgnoreCase(String nome);

    /** Usado na edição: ignora a própria disciplina ao checar nome repetido. */
    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
}