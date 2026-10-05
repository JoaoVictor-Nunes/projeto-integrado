package com.unichristus.projetointegrado.service;

import com.unichristus.projetointegrado.repository.UserRepository;
import com.unichristus.projetointegrado.exception.InvalidPasswordException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetService {

    private static final int CODE_EXPIRATION_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final Map<String, ResetCode> pendingCodes = new ConcurrentHashMap<>();

    public PasswordResetService(UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void solicitarCodigo(String email) {
        String normalizedEmail = normalizeEmail(email);

        // A resposta da API é genérica para não revelar se um e-mail está cadastrado.
        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isEmpty()) {
            return;
        }

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        pendingCodes.put(normalizedEmail,
                new ResetCode(code, LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES), 0));

        try {
            emailService.enviarCodigoRecuperacao(normalizedEmail, code);
        } catch (RuntimeException ex) {
            pendingCodes.remove(normalizedEmail);
            throw ex;
        }
    }

    public String verificarCodigo(String email, String code) {
        String normalizedEmail = normalizeEmail(email);
        ResetCode resetCode = pendingCodes.get(normalizedEmail);

        if (resetCode == null || resetCode.expiraEm().isBefore(LocalDateTime.now())) {
            pendingCodes.remove(normalizedEmail);
            throw new BadCredentialsException("Código inválido ou expirado.");
        }

        synchronized (resetCode) {
            if (resetCode.isVerified() || !resetCode.code().equals(code)) {
                resetCode.incrementAttempts();
                if (resetCode.attempts() >= MAX_ATTEMPTS) {
                    pendingCodes.remove(normalizedEmail);
                }
                throw new BadCredentialsException("Código inválido ou expirado.");
            }

            String resetToken = UUID.randomUUID().toString();
            resetCode.markVerified(resetToken);
            return resetToken;
        }
    }

    public void redefinirSenha(String email, String resetToken, String novaSenha) {
        String normalizedEmail = normalizeEmail(email);
        ResetCode resetCode = pendingCodes.get(normalizedEmail);

        if (resetCode == null || resetCode.expiraEm().isBefore(LocalDateTime.now())
                || !resetCode.isVerified() || !resetToken.equals(resetCode.resetToken())) {
            pendingCodes.remove(normalizedEmail);
            throw new BadCredentialsException("Sessão de recuperação inválida ou expirada.");
        }

        validarSenha(novaSenha);

        var user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Sessão de recuperação inválida ou expirada."));

        user.setSenhaHash(passwordEncoder.encode(novaSenha));
        userRepository.save(user);
        pendingCodes.remove(normalizedEmail);
    }

    private void validarSenha(String senha) {
        List<String> falhas = new ArrayList<>();
        if (senha == null || senha.length() < 8) falhas.add("ter no mínimo 8 caracteres");
        if (senha == null || !Pattern.compile("\\p{Lu}").matcher(senha).find()) falhas.add("conter ao menos uma letra maiúscula");
        if (senha == null || !Pattern.compile("\\p{Ll}").matcher(senha).find()) falhas.add("conter ao menos uma letra minúscula");
        if (senha == null || !Pattern.compile("[^\\p{L}\\p{N}\\s]").matcher(senha).find()) falhas.add("conter ao menos um caractere especial");
        if (!falhas.isEmpty()) throw new InvalidPasswordException("A senha deve " + String.join("; ", falhas) + ".");
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static final class ResetCode {
        private final String code;
        private final LocalDateTime expiraEm;
        private int attempts;
        private String resetToken;
        private boolean verified;

        private ResetCode(String code, LocalDateTime expiraEm, int attempts) {
            this.code = code;
            this.expiraEm = expiraEm;
            this.attempts = attempts;
        }

        private String code() {
            return code;
        }

        private LocalDateTime expiraEm() {
            return expiraEm;
        }

        private int attempts() {
            return attempts;
        }

        private boolean isVerified() {
            return verified;
        }

        private String resetToken() {
            return resetToken;
        }

        private void markVerified(String resetToken) {
            this.resetToken = resetToken;
            this.verified = true;
        }

        private void incrementAttempts() {
            attempts++;
        }
    }
}
