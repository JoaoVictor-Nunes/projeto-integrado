package com.unichristus.projetointegrado.service;

import com.unichristus.projetointegrado.exception.ArmazenamentoException;
import io.minio.*;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.Duration;
import java.util.Map;

@Service
public class ArmazenamentoArquivoService {

    private static final Logger log = LoggerFactory.getLogger(ArmazenamentoArquivoService.class);

    private final MinioClient minio;
    private final String bucket;

    public ArmazenamentoArquivoService(MinioClient minio, @Value("${minio.bucketName}") String bucket) {
        this.minio = minio;
        this.bucket = bucket;
    }

    /**
     * Cria o bucket na subida se ele ainda não existir (útil no
     * desenvolvimento). Se o MinIO estiver fora do ar, só avisa no log
     * para a aplicação não deixar de subir.
     */
    @PostConstruct
    void garantirBucket() {
        try {
            if (!minio.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
                minio.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
                log.info("Bucket '{}' criado.", bucket);
            }
        } catch (Exception ex) {
            log.warn("Não foi possível verificar o bucket '{}': {}", bucket, ex.getMessage());
        }
    }

    /** Envia o arquivo para o bucket sob a chave informada. */
    public void enviar(String chave, MultipartFile arquivo, String contentType) {
        try (InputStream in = arquivo.getInputStream()) {
            minio.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(chave)
                    .stream(in, arquivo.getSize(), -1L) // -1: o cliente escolhe o tamanho das partes
                    .contentType(contentType)
                    .build());
        } catch (Exception ex) {
            throw new ArmazenamentoException("Falha ao enviar o arquivo para o armazenamento.", ex);
        }
    }

    /**
     * Gera um link temporário de leitura. O bucket é privado: só quem
     * recebe este link, e só até ele expirar, consegue abrir o arquivo.
     *
     * @param download true força o navegador a baixar; false abre no navegador
     * @param nomeDownload nome sugerido ao salvar (usado só em download)
     */
    public String gerarUrlLeitura(String chave, Duration validade, boolean download, String nomeDownload) {
        // Dado antigo, de quando o campo guardava a URL completa: devolve como está.
        if (ehUrlCompleta(chave)) {
            return chave;
        }

        String disposicao = download ? "attachment; filename=\"" + nomeDownload + "\"" : "inline";

        try {
            return minio.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .method(Http.Method.GET)
                    .bucket(bucket)
                    .object(chave)
                    .expiry((int) validade.toSeconds())
                    .extraQueryParams(Map.of("response-content-disposition", disposicao))
                    .build());
        } catch (Exception ex) {
            throw new ArmazenamentoException("Falha ao gerar o link do arquivo.", ex);
        }
    }

    /**
     * Remove o arquivo. Melhor esforço: se falhar, só registra no log,
     * porque um arquivo órfão no bucket é menos grave do que travar a
     * operação do usuário.
     */
    public void remover(String chave) {
        if (chave == null || chave.isBlank() || ehUrlCompleta(chave)) {
            return;
        }
        try {
            minio.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(chave).build());
        } catch (Exception ex) {
            log.warn("Não foi possível remover '{}' do armazenamento (ficou órfão).", chave, ex);
        }
    }

    private boolean ehUrlCompleta(String valor) {
        return valor.startsWith("http://") || valor.startsWith("https://");
    }
}


