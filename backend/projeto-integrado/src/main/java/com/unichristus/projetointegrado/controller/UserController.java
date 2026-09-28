package com.unichristus.projetointegrado.controller;

import java.net.URI;


import com.unichristus.projetointegrado.domain.dto.user.UserCreateDTO;
import com.unichristus.projetointegrado.domain.dto.user.UserResponseDTO;
import com.unichristus.projetointegrado.domain.dto.user.UserUpdateDTO;
import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import com.unichristus.projetointegrado.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> cadastrar(@Valid @RequestBody UserCreateDTO dto) {
        UserResponseDTO criado = service.cadastrarUsuario(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/id")
                .buildAndExpand(criado.getId())
                .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @GetMapping
    public ResponseEntity<PagedModel<UserResponseDTO>> listar(
            @RequestParam(required = false) String busca,
            @RequestParam(required = false)TipoPerfil perfil,
            @PageableDefault(size = 20, sort = "nome", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<UserResponseDTO> pagina = service.listarUsuariosPaginado(busca,perfil, pageable);
        return ResponseEntity.ok(new PagedModel<>(pagina));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> atualizar(@PathVariable Long id,
                                                     @Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(service.atualizarUsuario(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
