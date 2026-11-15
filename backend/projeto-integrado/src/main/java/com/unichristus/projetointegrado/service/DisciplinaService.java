package com.unichristus.projetointegrado.service;

import java.util.List;

import com.unichristus.projetointegrado.domain.dto.disciplina.DisciplinaRequestDTO;
import com.unichristus.projetointegrado.domain.dto.disciplina.DisciplinaResponseDTO;
import com.unichristus.projetointegrado.domain.model.Disciplina;
import com.unichristus.projetointegrado.exception.BusinessRuleException;
import com.unichristus.projetointegrado.exception.DuplicateResourceException;
import com.unichristus.projetointegrado.exception.ResourceNotFoundException;
import com.unichristus.projetointegrado.repository.DisciplinaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** CRUD de disciplinas (categorias dos materiais). */
@Service
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;

    public DisciplinaService(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    @Transactional(readOnly = true)
    public List<DisciplinaResponseDTO> listar() {
        return disciplinaRepository.findAll(Sort.by("nome").ascending()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DisciplinaResponseDTO buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public DisciplinaResponseDTO criar(DisciplinaRequestDTO dto) {
        String nome = dto.nome().trim();
        if (disciplinaRepository.existsByNomeIgnoreCase(nome)) {
            throw new DuplicateResourceException("Já existe uma disciplina com o nome: " + nome);
        }

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(nome);
        disciplina.setDescricao(dto.descricao().trim());
        return toResponse(disciplinaRepository.save(disciplina));
    }

    @Transactional
    public DisciplinaResponseDTO atualizar(Long id, DisciplinaRequestDTO dto) {
        Disciplina disciplina = buscarEntidade(id);
        String nome = dto.nome().trim();

        if (disciplinaRepository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new DuplicateResourceException("Já existe uma disciplina com o nome: " + nome);
        }

        disciplina.setNome(nome);
        disciplina.setDescricao(dto.descricao().trim());
        return toResponse(disciplinaRepository.save(disciplina));
    }

    /**
     * Exclui a disciplina. Se ainda houver materiais associados, o banco
     * recusa (chave estrangeira) e devolvemos uma mensagem clara.
     */
    public void excluir(Long id) {
        Disciplina disciplina = buscarEntidade(id);
        try {
            disciplinaRepository.delete(disciplina);
        } catch (DataIntegrityViolationException ex) {
            throw new BusinessRuleException(
                    "Não é possível excluir: a disciplina está associada a materiais do acervo.");
        }
    }

    private Disciplina buscarEntidade(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada: id=" + id));
    }

    private DisciplinaResponseDTO toResponse(Disciplina d) {
        return new DisciplinaResponseDTO(d.getId(), d.getNome(), d.getDescricao());
    }
}