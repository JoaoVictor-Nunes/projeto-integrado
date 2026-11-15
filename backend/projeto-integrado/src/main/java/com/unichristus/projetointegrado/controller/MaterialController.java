package com.unichristus.projetointegrado.controller;

import java.net.URI;
import java.util.List;

import com.unichristus.projetointegrado.domain.dto.material.LinkArquivoDTO;
import com.unichristus.projetointegrado.domain.dto.material.MaterialRequestDTO;
import com.unichristus.projetointegrado.domain.dto.material.MaterialResponseDTO;
import com.unichristus.projetointegrado.domain.model.EtapaEnsino;
import com.unichristus.projetointegrado.security.UserDetailsImpl;
import com.unichristus.projetointegrado.service.MaterialService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Acervo de materiais. Consulta: qualquer usuário autenticado.
 * Cadastro, edição e exclusão: somente ADMINISTRADOR (regra no
 * SecurityConfig, ver snippets/SecurityConfig-materiais.txt).
 *
 * Cadastro e edição são multipart/form-data com as partes:
 *   "dados"   → JSON com titulo, autor, resumo, etapaEnsino, disciplinaIds
 *               (a parte precisa ter Content-Type application/json)
 *   "arquivo" → o PDF
 *   "capa"    → imagem (opcional)
 */
@RestController
@RequestMapping("/api/materiais")
public class MaterialController {

    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    /** GET /api/materiais?titulo=&autor=&disciplina=&palavrasChave=&etapaEnsino= */
    @GetMapping
    public List<MaterialResponseDTO> pesquisar(
            @RequestParam(required = false) String titulo,
            @RequestParam(required = false) String autor,
            @RequestParam(required = false) String disciplina,
            @RequestParam(required = false) String palavrasChave,
            @RequestParam(required = false) EtapaEnsino etapaEnsino) {
        return materialService.pesquisar(titulo, autor, disciplina, palavrasChave, etapaEnsino);
    }

    @GetMapping("/{id}")
    public MaterialResponseDTO buscarPorId(@PathVariable Long id) {
        return materialService.buscarPorId(id);
    }

    /**
     * GET /api/materiais/{id}/arquivo?download=false
     * Devolve um link temporário do PDF e registra o acesso no histórico.
     */
    @GetMapping("/{id}/arquivo")
    public LinkArquivoDTO linkArquivo(@PathVariable Long id,
                                      @RequestParam(defaultValue = "false") boolean download,
                                      @AuthenticationPrincipal UserDetailsImpl principal) {
        return materialService.gerarLinkArquivo(id, principal.getUser().getId(), download);
    }

    /** POST /api/materiais — cadastra o material com o PDF (obrigatório) e a capa (opcional). */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MaterialResponseDTO> criar(
            @Valid @RequestPart("dados") MaterialRequestDTO dados,
            @RequestPart("arquivo") MultipartFile arquivo,
            @RequestPart(value = "capa", required = false) MultipartFile capa) {

        MaterialResponseDTO criado = materialService.criar(dados, arquivo, capa);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(criado.id()).toUri();
        return ResponseEntity.created(location).body(criado);
    }

    /** PUT /api/materiais/{id} — edita os dados; "arquivo" e "capa" só se quiser trocá-los. */
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MaterialResponseDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestPart("dados") MaterialRequestDTO dados,
            @RequestPart(value = "arquivo", required = false) MultipartFile arquivo,
            @RequestPart(value = "capa", required = false) MultipartFile capa) {

        return materialService.atualizar(id, dados, arquivo, capa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        materialService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}