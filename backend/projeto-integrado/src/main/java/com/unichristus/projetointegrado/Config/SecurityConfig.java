package com.unichristus.projetointegrado.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuração de segurança da API.
 *
 * ATENÇÃO: liberar /api/users para todos é aceitável apenas em desenvolvimento.
 * Em produção, o RF001 deve exigir autenticação e perfil ADMINISTRADOR
 * (ex.: .requestMatchers("/api/users/**").hasRole("ADMINISTRADOR")).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // API REST stateless consumida por Postman/front-end: CSRF não se aplica.
                // (Sem isso, POST/PUT/DELETE retornariam 403 após liberar o acesso.)
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users", "/api/users/**").permitAll()
                        .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}