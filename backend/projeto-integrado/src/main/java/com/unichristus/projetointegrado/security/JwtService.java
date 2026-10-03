package com.unichristus.projetointegrado.security;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Geração e validação de tokens JWT (access e refresh).
 *
 * jwt.secret deve ser uma string Base64 de pelo menos 256 bits (32 bytes)
 * para o algoritmo HS256. Gere uma com, por exemplo:
 *   openssl rand -base64 32
 */
@Service
public class JwtService {

    private final Key signingKey;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiration-ms:3600000}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-token-expiration-ms:604800000}") long refreshTokenExpirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    public String gerarAccessToken(String email) {
        return gerarToken(email, accessTokenExpirationMs, "access");
    }

    public String gerarRefreshToken(String email) {
        return gerarToken(email, refreshTokenExpirationMs, "refresh");
    }

    private String gerarToken(String email, long expirationMs, String tipo) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(email)
                .claim("tipo", tipo)
                .setIssuedAt(agora)
                .setExpiration(expiracao)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    /** @return o e-mail (subject) do token, ou {@code null} se inválido/expirado. */
    public String extrairEmail(String token) {
        try {
            return extrairClaims(token).getSubject();
        } catch (io.jsonwebtoken.JwtException ex) {
            return null;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            return "refresh".equals(extrairClaims(token).get("tipo", String.class));
        } catch (io.jsonwebtoken.JwtException ex) {
            return false;
        }
    }

    public boolean isTokenValido(String token, String emailEsperado) {
        try {
            String email = extrairClaims(token).getSubject();
            return email.equalsIgnoreCase(emailEsperado);
        } catch (io.jsonwebtoken.JwtException ex) {
            return false;
        }
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}