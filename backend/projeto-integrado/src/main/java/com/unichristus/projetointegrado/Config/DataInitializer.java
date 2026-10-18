package com.unichristus.projetointegrado.Config;

import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import com.unichristus.projetointegrado.domain.model.User;
import com.unichristus.projetointegrado.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Criar Administrador
            if (!userRepository.existsByEmail("admin@sibv.com")) {
                User admin = new User();
                admin.setNome("Administrador SIBV");
                admin.setEmail("admin@sibv.com");
                admin.setMatricula("ADM0001");
                admin.setSenhaHash(passwordEncoder.encode("Admin123")); // campo senha_hash
                admin.setPerfil(TipoPerfil.ADMIN);
                admin.setStatusAtivo(true);                             // campo status_ativo
                admin.setDataCriacao(LocalDateTime.now());              // campo data_criacao (NOT NULL)

                userRepository.save(admin);
                System.out.println(">>> Usuário admin@sibv.com criado com sucesso!");
            }

            // 2. Criar Professor / Usuário Padrão
            if (!userRepository.existsByEmail("professor@sibv.com")) {
                User professor = new User();
                professor.setNome("Professor Teste");
                professor.setEmail("professor@sibv.com");
                professor.setMatricula("PROF0001");
                professor.setSenhaHash(passwordEncoder.encode("Professor123"));
                professor.setPerfil(TipoPerfil.ALUNO); 
                professor.setStatusAtivo(true);
                professor.setDataCriacao(LocalDateTime.now());

                userRepository.save(professor);
                System.out.println(">>> Usuário professor@sibv.com criado com sucesso!");
            }
        };
    }
}