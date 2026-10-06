package com.unichristus.projetointegrado.controller;

import com.unichristus.projetointegrado.domain.dto.LoginRequestDTO;
import com.unichristus.projetointegrado.domain.dto.auth.ForgotPasswordRequestDTO;
import com.unichristus.projetointegrado.domain.dto.auth.VerifyResetCodeRequestDTO;
import com.unichristus.projetointegrado.domain.dto.auth.VerifyResetCodeResponseDTO;
import com.unichristus.projetointegrado.domain.dto.auth.ResetPasswordRequestDTO;
import com.unichristus.projetointegrado.domain.dto.LoginResponseDTO;
import com.unichristus.projetointegrado.domain.dto.RefreshTokenRequestDTO;
import com.unichristus.projetointegrado.domain.dto.user.UserResponseDTO;
import com.unichristus.projetointegrado.security.JwtService;
import com.unichristus.projetointegrado.security.UserDetailsImpl;
import com.unichristus.projetointegrado.security.UserDetailsServiceImpl;
import com.unichristus.projetointegrado.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtService jwtService;
    private final PasswordResetService passwordResetService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsServiceImpl userDetailsService,
                          JwtService jwtService,
                          PasswordResetService passwordResetService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.passwordResetService = passwordResetService;
    }

    /**
     * POST /auth/login
     * Credenciais inválidas e usuário desativado (RN de soft delete) viram 401,
     * tratados pelo GlobalExceptionHandler (BadCredentialsException/DisabledException).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha()));

        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(dto.email());
        var user = userDetails.getUser();

        String accessToken = jwtService.gerarAccessToken(user.getEmail());
        String refreshToken = jwtService.gerarRefreshToken(user.getEmail());

        UserResponseDTO userResponse = new UserResponseDTO(
                user.getId(), user.getNome(), user.getEmail(),
                user.getMatricula(), user.getPerfil(), user.getStatusAtivo());

        return ResponseEntity.ok(new LoginResponseDTO(accessToken, refreshToken, userResponse));
    }

    /**
     * POST /auth/forgot-password
     * Gera e envia por e-mail um código temporário de recuperação.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto) {
        passwordResetService.solicitarCodigo(dto.email());
        return ResponseEntity.accepted().build();
    }

    /**
     * POST /auth/verify-reset-code
     * Valida o código enviado por e-mail e o invalida após o uso.
     */
    @PostMapping("/verify-reset-code")
    public ResponseEntity<VerifyResetCodeResponseDTO> verifyResetCode(@Valid @RequestBody VerifyResetCodeRequestDTO dto) {
        String resetToken = passwordResetService.verificarCodigo(dto.email(), dto.code());
        return ResponseEntity.ok(new VerifyResetCodeResponseDTO(resetToken));
    }

    /**
     * POST /auth/reset-password
     * Altera a senha após a validação do código de recuperação.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO dto) {
        passwordResetService.redefinirSenha(dto.email(), dto.resetToken(), dto.novaSenha());
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /auth/refresh-token
     * Gera um novo access token a partir de um refresh token ainda válido.
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponseDTO> refreshToken(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        String email = jwtService.extrairEmail(dto.refreshToken());

        if (email == null || !jwtService.isRefreshToken(dto.refreshToken())) {
            throw new BadCredentialsException("Refresh token inválido ou expirado.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!userDetails.isEnabled()) {
            throw new DisabledException("Usuário inativo.");
        }

        String novoAccessToken = jwtService.gerarAccessToken(email);
        String novoRefreshToken = jwtService.gerarRefreshToken(email);

        return ResponseEntity.ok(new LoginResponseDTO(novoAccessToken, novoRefreshToken, null));
    }

    /**
     * GET /auth/me
     * Retorna os dados do usuário dono do token enviado no header Authorization.
     * Usado pelo front-end para restaurar a sessão ao recarregar a página.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> me(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        var user = userDetails.getUser();

        return ResponseEntity.ok(new UserResponseDTO(
                user.getId(), user.getNome(), user.getEmail(),
                user.getMatricula(), user.getPerfil(), user.getStatusAtivo()));
    }
}

