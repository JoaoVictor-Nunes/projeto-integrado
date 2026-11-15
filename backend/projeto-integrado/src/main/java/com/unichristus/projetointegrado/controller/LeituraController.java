package com.unichristus.projetointegrado.controller;

import com.unichristus.projetointegrado.domain.dto.LeituraResponseDTO;
import com.unichristus.projetointegrado.domain.dto.ProgressoRequestDTO;
import com.unichristus.projetointegrado.security.UserDetailsImpl;
import com.unichristus.projetointegrado.service.LeituraService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Leitura de materiais pelo usuário LOGADO. Fica em /api/leitura (e não
 * em /api/materiais) de propósito: qualquer usuário logado pode usar, e o
 * SecurityConfig restringe a escrita em /api/materiais a administradores.
 * O id do usuário vem sempre do token.
 */
@RestController
@RequestMapping("/api/leitura")
public class LeituraController {

    private final LeituraService leituraService;

    public LeituraController(LeituraService leituraService) {
        this.leituraService = leituraService;
    }

    /** GET /api/leitura/{materialId} — abre o material (link, progresso, favorito) e grava no histórico. */
    @GetMapping("/{materialId}")
    public LeituraResponseDTO abrir(@PathVariable Long materialId,
                                    @AuthenticationPrincipal UserDetailsImpl principal) {
        return leituraService.abrir(materialId, principal.getUser().getId());
    }

    /** PUT /api/leitura/{materialId}/progresso — salva a página atual. */
    @PutMapping("/{materialId}/progresso")
    public ResponseEntity<Void> salvarProgresso(@PathVariable Long materialId,
                                                @Valid @RequestBody ProgressoRequestDTO dto,
                                                @AuthenticationPrincipal UserDetailsImpl principal) {
        leituraService.salvarProgresso(materialId, principal.getUser().getId(), dto);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{materialId}/favorito")
    public ResponseEntity<Void> favoritar(@PathVariable Long materialId,
                                          @AuthenticationPrincipal UserDetailsImpl principal) {
        leituraService.favoritar(materialId, principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{materialId}/favorito")
    public ResponseEntity<Void> desfavoritar(@PathVariable Long materialId,
                                             @AuthenticationPrincipal UserDetailsImpl principal) {
        leituraService.desfavoritar(materialId, principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }
}