package com.unichristus.projetointegrado.service;

import com.unichristus.projetointegrado.domain.dto.auth.RegisterEmailVerificationRequestDTO;
import com.unichristus.projetointegrado.domain.dto.user.UserResponseDTO;
import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import com.unichristus.projetointegrado.exception.DuplicateResourceException;
import com.unichristus.projetointegrado.exception.InvalidPasswordException;
import com.unichristus.projetointegrado.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class RegisterEmailVerificationService {
    private static final int CODE_EXPIRATION_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Pattern UPPER = Pattern.compile("\\p{Lu}");
    private static final Pattern LOWER = Pattern.compile("\\p{Ll}");
    private static final Pattern SPECIAL = Pattern.compile("[^\\p{L}\\p{N}\\s]");

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final Map<String, PendingRegistration> pending = new ConcurrentHashMap<>();

    public RegisterEmailVerificationService(UserRepository userRepository, EmailService emailService,
                                            PasswordEncoder passwordEncoder, UserService userService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
    }

    public void solicitarCodigo(RegisterEmailVerificationRequestDTO dto) {
        String email = normalize(dto.email());
        validarSenha(dto.senha());
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email ja cadastrado: " + email);
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        PendingRegistration registration = new PendingRegistration(
                dto.nome().trim(), email, passwordEncoder.encode(dto.senha()), dto.perfil(),
                code, LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES), 0);
        pending.put(email, registration);

        try {
            emailService.enviarCodigoConfirmacaoCadastro(email, code);
        } catch (RuntimeException ex) {
            pending.remove(email);
            throw ex;
        }
    }

    public UserResponseDTO verificarCodigo(String email, String code) {
        String normalizedEmail = normalize(email);
        PendingRegistration registration = pending.get(normalizedEmail);

        if (registration == null || registration.expiresAt().isBefore(LocalDateTime.now())) {
            pending.remove(normalizedEmail);
            throw new org.springframework.security.authentication.BadCredentialsException("Código inválido ou expirado.");
        }

        synchronized (registration) {
            if (!registration.code().equals(code)) {
                registration.incrementAttempts();
                if (registration.attempts() >= MAX_ATTEMPTS) pending.remove(normalizedEmail);
                throw new org.springframework.security.authentication.BadCredentialsException("Código inválido ou expirado.");
            }

            if (userRepository.existsByEmail(normalizedEmail)) {
                pending.remove(normalizedEmail);
                throw new DuplicateResourceException("Email ja cadastrado: " + normalizedEmail);
            }

            UserResponseDTO created = userService.cadastrarUsuarioVerificado(
                    registration.nome(), registration.email(), registration.perfil(), registration.senhaHash());
            pending.remove(normalizedEmail);
            return created;
        }
    }

    private void validarSenha(String senha) {
        List<String> falhas = new ArrayList<>();
        if (senha == null || senha.length() < 8) falhas.add("ter no mínimo 8 caracteres");
        if (senha == null || !UPPER.matcher(senha).find()) falhas.add("conter ao menos uma letra maiúscula");
        if (senha == null || !LOWER.matcher(senha).find()) falhas.add("conter ao menos uma letra minúscula");
        if (senha == null || !SPECIAL.matcher(senha).find()) falhas.add("conter ao menos um caractere especial");
        if (!falhas.isEmpty()) throw new InvalidPasswordException("A senha deve " + String.join("; ", falhas) + ".");
    }

    private String normalize(String email) { return email.trim().toLowerCase(Locale.ROOT); }

    private static final class PendingRegistration {
        private final String nome, email, senhaHash, code;
        private final TipoPerfil perfil;
        private final LocalDateTime expiresAt;
        private int attempts;

        private PendingRegistration(String nome, String email, String senhaHash, TipoPerfil perfil, String code, LocalDateTime expiresAt, int attempts) {
            this.nome = nome; this.email = email; this.senhaHash = senhaHash; this.perfil = perfil; this.code = code; this.expiresAt = expiresAt; this.attempts = attempts;
        }
        String nome() { return nome; } String email() { return email; } String senhaHash() { return senhaHash; } TipoPerfil perfil() { return perfil; } String code() { return code; } LocalDateTime expiresAt() { return expiresAt; } int attempts() { return attempts; }
        void incrementAttempts() { attempts++; }
    }
}
