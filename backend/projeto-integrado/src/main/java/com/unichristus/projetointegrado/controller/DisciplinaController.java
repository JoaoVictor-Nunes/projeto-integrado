package com.unichristus.projetointegrado.controller;

import java.net.URI;
import java.util.List;

import com.unichristus.projetointegrado.domain.dto.disciplina.DisciplinaRequestDTO;
import com.unichristus.projetointegrado.domain.dto.disciplina.DisciplinaResponseDTO;
import com.unichristus.projetointegrado.service.DisciplinaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Disciplinas (categorias). Consulta: qualquer usuário logado.
 * Cadastro, edição e exclusão: somente ADMINISTRADOR
 * (regra no SecurityConfig, ver snippets/SecurityConfig-materiais.txt).
 */
@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @GetMapping
    public List<DisciplinaResponseDTO> listar() {
        return disciplinaService.listar();
    }

    @GetMapping("/{id}")
    public DisciplinaResponseDTO buscarPorId(@PathVariable Long id) {
        return disciplinaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<DisciplinaResponseDTO> criar(@Valid @RequestBody DisciplinaRequestDTO dto) {
        DisciplinaResponseDTO criada = disciplinaService.criar(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(criada.id()).toUri();
        return ResponseEntity.created(location).body(criada);
    }

    @PutMapping("/{id}")
    public DisciplinaResponseDTO atualizar(@PathVariable Long id, @Valid @RequestBody DisciplinaRequestDTO dto) {
        return disciplinaService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        disciplinaService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}