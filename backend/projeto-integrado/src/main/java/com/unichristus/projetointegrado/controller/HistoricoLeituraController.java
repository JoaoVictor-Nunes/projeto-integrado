package com.unichristus.projetointegrado.controller;

import com.unichristus.projetointegrado.domain.dto.Historico.HistoricoLeituraResponseDTO;
import com.unichristus.projetointegrado.domain.dto.Historico.RegistrarAcessoRequestDTO;
import com.unichristus.projetointegrado.security.UserDetailsImpl;
import com.unichristus.projetointegrado.service.HistoricoLeituraService;
import jakarta.validation.Valid;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/historico")
public class HistoricoLeituraController {

    private final HistoricoLeituraService historicoService;

    public HistoricoLeituraController(HistoricoLeituraService historicoService) {
        this.historicoService = historicoService;
    }

    @GetMapping
    public ResponseEntity<PagedModel<HistoricoLeituraResponseDTO>> listar(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var pagina = historicoService.listarRecentes(principal.getUser().getId(), page, size);
        return ResponseEntity.ok(new PagedModel<>(pagina));
    }

    @PostMapping
    public ResponseEntity<Void> registrar(
            @AuthenticationPrincipal UserDetailsImpl principal,
            @Valid @RequestBody RegistrarAcessoRequestDTO dto) {

        historicoService.registrarAcesso(principal.getUser().getId(), dto.materialId(), dto.tipoAcesso());
        return ResponseEntity.accepted().build();
    }
}