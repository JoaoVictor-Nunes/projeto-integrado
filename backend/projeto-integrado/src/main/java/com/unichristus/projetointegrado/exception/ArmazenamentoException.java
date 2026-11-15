package com.unichristus.projetointegrado.exception;

/**
 * Falha ao falar com o armazenamento de arquivos (MinIO/S3 fora do ar,
 * credencial inválida etc.). Mapeada para HTTP 503 no handler global.
 */
public class ArmazenamentoException extends RuntimeException {

    public ArmazenamentoException(String message, Throwable cause) {
        super(message, cause);
    }
}
