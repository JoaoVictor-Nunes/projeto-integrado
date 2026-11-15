package com.unichristus.projetointegrado.service;

import com.unichristus.projetointegrado.exception.BusinessRuleException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Component
public class ArquivoValidator {

    private static final long TAMANHO_MAXIMO_PDF = 50L * 1024 * 1024;
    private static final long TAMANHO_MAXIMO_CAPA = 5L * 1024 * 1024;

    private static final byte[] ASSINATURA_PDF = {'%', 'P', 'D', 'F', '-'};
    private static final byte[] ASSINATURA_JPEG = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] ASSINATURA_PNG = {(byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A};
    private static final byte[] ASSINATURA_RIFF = {'R', 'I', 'F', 'F'};

    /** Extensão e Content-Type confiáveis de uma imagem já validada. */
    public record TipoImagem(String extensao, String contentType) {
    }

    public void validarPdf(MultipartFile arquivo) {
        validarPresencaETamanho(arquivo, TAMANHO_MAXIMO_PDF);
        if (!comecaCom(cabecalho(arquivo), ASSINATURA_PDF)) {
            throw new BusinessRuleException("O arquivo enviado não é um PDF válido.");
        }
    }

    public TipoImagem validarCapa(MultipartFile arquivo) {
        validarPresencaETamanho(arquivo, TAMANHO_MAXIMO_CAPA);
        byte[] h = cabecalho(arquivo);

        if (comecaCom(h, ASSINATURA_JPEG)) {
            return new TipoImagem("jpg", "image/jpeg");
        }
        if (comecaCom(h, ASSINATURA_PNG)) {
            return new TipoImagem("png", "image/png");
        }
        // WebP: "RIFF" + 4 bytes de tamanho + "WEBP"
        if (h.length >= 12 && comecaCom(h, ASSINATURA_RIFF)
                && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') {
            return new TipoImagem("webp", "image/webp");
        }
        throw new BusinessRuleException("A capa deve ser uma imagem JPEG, PNG ou WebP.");
    }

    private void validarPresencaETamanho(MultipartFile arquivo, long maximo) {
        if (arquivo == null || arquivo.isEmpty()) {
            throw new BusinessRuleException("Nenhum arquivo foi enviado.");
        }
        if (arquivo.getSize() > maximo) {
            throw new BusinessRuleException(
                    "O arquivo excede o tamanho máximo de " + (maximo / (1024 * 1024)) + " MB.");
        }
    }

    private byte[] cabecalho(MultipartFile arquivo) {
        try (InputStream in = arquivo.getInputStream()) {
            return in.readNBytes(12);
        } catch (IOException ex) {
            throw new BusinessRuleException("Não foi possível ler o arquivo enviado.");
        }
    }

    private boolean comecaCom(byte[] dados, byte[] assinatura) {
        if (dados.length < assinatura.length) {
            return false;
        }
        for (int i = 0; i < assinatura.length; i++) {
            if (dados[i] != assinatura[i]) {
                return false;
            }
        }
        return true;
    }
}

