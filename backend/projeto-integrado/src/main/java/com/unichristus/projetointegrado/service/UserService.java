package com.unichristus.projetointegrado.service;

import com.unichristus.projetointegrado.domain.dto.user.UserCreateDTO;
import com.unichristus.projetointegrado.domain.dto.user.UserResponseDTO;
import com.unichristus.projetointegrado.domain.dto.user.UserUpdateDTO;
import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import com.unichristus.projetointegrado.domain.model.User;
import com.unichristus.projetointegrado.exception.DuplicateResourceException;
import com.unichristus.projetointegrado.exception.InvalidPasswordException;
import com.unichristus.projetointegrado.exception.ResourceNotFoundException;
import com.unichristus.projetointegrado.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private static final java.security.SecureRandom RANDOM = new java.security.SecureRandom();

    private String gerarMatriculaUnica(TipoPerfil perfil) {
        String prefixo = switch (perfil) {
            case ALUNO -> "ALU";
            case PROFESSOR -> "PRO";
            case ADMIN -> "ADM";
        };
        String ano = String.valueOf(java.time.LocalDate.now().getYear());

        String candidata;
        int tentativas = 0;
        do {
            if (++tentativas > 10) {
                // Praticamente impossível com 1 milhão de combinações por ano,
                // mas evita loop infinito em caso de bug ou volume anômalo.
                throw new IllegalStateException("Não foi possível gerar uma matrícula única.");
            }
            String sufixo = String.format("%06d", RANDOM.nextInt(1_000_000));
            candidata = prefixo + ano + sufixo;
        } while (repository.existsByMatricula(candidata));

        return candidata;
    }


    private static final int TAMANHO_MINIMO_SENHA = 8;
    private static final Pattern MAIUSCULA = Pattern.compile("\\p{Lu}");
    private static final Pattern MINUSCULA = Pattern.compile("\\p{L1}");
    private static final Pattern ESPECIAL = Pattern.compile("[^\\\\p{L}\\\\p{N}\\\\s]");

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDTO cadastrarUsuario(UserCreateDTO dto) {
        String email = normalizarEmail(dto.getEmail());
        String matricula = gerarMatriculaUnica(dto.getPerfil());

        validarSenha(dto.getSenha());
        validarUnicidade(email, matricula);

        User user = new User();
        user.setNome(dto.getNome().trim());
        user.setEmail(email);
         user.setMatricula(matricula);
        user.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        user.setPerfil(dto.getPerfil());
        user.setStatusAtivo(Boolean.TRUE);
        user.setDataCriacao(LocalDateTime.now());

        try {
            User salvo = repository.saveAndFlush(user);
            log.info("Usuario {} cadastrado com perfil {}", salvo.getId(), salvo.getPerfil());
            return toResponse(salvo);
        } catch (DataIntegrityViolationException ex) {
           throw new DuplicateResourceException("Email ou matricula ja cadastrado.");
        }
    }

    @Transactional
    public UserResponseDTO atualizarUsuario(Long id, UserUpdateDTO dto) {
        User user = buscarEntidade(id);
        String novoEmail = normalizarEmail(dto.getEmail());

        if (repository.existsByEmailAndIdNot(novoEmail, id)) {
            throw new DuplicateResourceException("Email ja cadastrado: " + novoEmail);
        }

        user.setNome(dto.getNome().trim());
        user.setEmail(novoEmail);

        try {
            return toResponse(repository.saveAndFlush(user));
        } catch (DataIntegrityViolationException ex) {
            throw new DuplicateResourceException("Email ja cadastrado: " + novoEmail);
        }
    }

    public UserResponseDTO buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public Page<UserResponseDTO> listarUsuariosPaginado(String busca, TipoPerfil perfil, Pageable pageable) {
        String termo = (busca == null) ? "" : busca.trim();
        return repository.buscarPorTermoEPerfil(termo, perfil, pageable)
                .map(this::toResponse);
    }


    @Transactional
    public void desativarUsuario(Long id) {
        User user = buscarEntidade(id);
        if (Boolean.TRUE.equals(user.getStatusAtivo())) {
            user.setStatusAtivo(Boolean.FALSE);
            repository.save(user);
            log.info("Usuario desativado");
        }
    }

    private User buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: id= " + id));
    }

    private void validarUnicidade(String email, String matricula) {
        if(repository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email ja cadastrado: " + email);
        }
    }
    private void validarSenha(String senha) {
        List<String> falhas = new ArrayList<>();

        if (senha == null || senha.length() < TAMANHO_MINIMO_SENHA) {
            falhas.add("ter no mínimo " + TAMANHO_MINIMO_SENHA + " caracteres");
        }
        if (senha == null || !MAIUSCULA.matcher(senha).find()) {
            falhas.add("conter ao menos uma letra maiúscula");
        }
        if (senha == null || !MINUSCULA.matcher(senha).find()) {
            falhas.add("conter ao menos uma letra minúscula");
        }
        if (senha == null || !ESPECIAL.matcher(senha).find()) {
            falhas.add("conter ao menos um caractere especial");
        }

        if (!falhas.isEmpty()) {
            throw new InvalidPasswordException("A senha deve " + String.join("; ", falhas) + ".");
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(
        user.getId(),
        user.getNome(),
        user.getEmail(),
        user.getMatricula(),
        user.getPerfil(),
        user.getStatusAtivo());
    }

}
