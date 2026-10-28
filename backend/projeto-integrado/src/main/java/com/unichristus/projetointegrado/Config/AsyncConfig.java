package com.unichristus.projetointegrado.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Habilita @Async. O registro de histórico roda em outra thread para
 * nunca atrasar nem derrubar a requisição principal do usuário.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
}