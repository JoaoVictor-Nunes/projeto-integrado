package com.unichristus.projetointegrado.exception;

import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;


@RestControllerAdvice
public class GlobalExceptioHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptioHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        return problem(HttpStatus.NOT_FOUND, "Recurso não encontrado", ex.getMessage());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ProblemDetail handleDuplicate(DuplicateResourceException ex) {
        return problem(HttpStatus.CONFLICT, "Recurso duplicado", ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        // Mensagem genérica de propósito: não revela se o e-mail existe ou não.
        return problem(HttpStatus.UNAUTHORIZED, "Falha na autenticação", "E-mail ou senha inválidos.");
    }

    @ExceptionHandler(DisabledException.class)
    public ProblemDetail handleDisabled(DisabledException ex) {
        return problem(HttpStatus.UNAUTHORIZED, "Usuário inativo", "Esta conta está desativada.");
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ProblemDetail handleBusinessRule(BusinessRuleException ex) {
        return problem(HttpStatus.UNPROCESSABLE_ENTITY, "Regra de negócio violada", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleBeanValidation(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> erros.putIfAbsent(fe.getField(), fe.getDefaultMessage()));

        ProblemDetail pd = problem(HttpStatus.BAD_REQUEST, "Dados inválidos",
                "Um ou mais campos não passaram na validação.");
        pd.setProperty("erros", erros);
        return pd;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleUnexpected(Exception ex) {
        log.error("Erro inesperado", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno",
                "Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }

    private ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setType(URI.create("about:blank"));
        return pd;
    }

    // Arquivo maior que spring.servlet.multipart.max-file-size (50MB)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ProblemDetail handleUploadGrande(MaxUploadSizeExceededException ex) {
        return problem(HttpStatus.CONTENT_TOO_LARGE, "Arquivo muito grande",
                "O arquivo excede o tamanho máximo permitido.");
    }

    // MinIO/S3 fora do ar, credencial inválida etc.
    @ExceptionHandler(ArmazenamentoException.class)
    public ProblemDetail handleArmazenamento(ArmazenamentoException ex) {
        log.error("Falha no armazenamento de arquivos", ex);
        return problem(HttpStatus.SERVICE_UNAVAILABLE, "Armazenamento indisponível",
                "Não foi possível acessar o armazenamento de arquivos. Tente novamente em instantes.");
    }

    // Erros do CLIENTE que o handler genérico (Exception.class) estava
    // transformando em 500: parte do multipart ausente, JSON malformado,
    // enum inválido no corpo, parâmetro faltando ou com tipo errado
    // (ex.: ?etapaEnsino=XYZ).
    @ExceptionHandler({
            MissingServletRequestPartException.class,
            MissingServletRequestParameterException.class,
            HttpMessageNotReadableException.class,
            MethodArgumentTypeMismatchException.class })
    public ProblemDetail handleRequisicaoInvalida(Exception ex) {
        return problem(HttpStatus.BAD_REQUEST, "Requisição inválida",
                "A requisição está incompleta ou com valores inválidos.");
    }


}
