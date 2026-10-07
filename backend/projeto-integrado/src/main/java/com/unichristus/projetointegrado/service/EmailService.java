package com.unichristus.projetointegrado.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigoRecuperacao(String destinatario, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("SIBV - Código para recuperação de senha");
        message.setText("""
                Olá!

                Recebemos uma solicitação para recuperar a senha da sua conta no SIBV.

                Seu código de verificação é: %s

                O código expira em 10 minutos e só pode ser usado uma vez.
                Se você não solicitou essa recuperação, ignore este e-mail.

                SIBV - Sistema Integrado de Biblioteca Virtual
                """.formatted(codigo));

        mailSender.send(message);
    }
    public void enviarCodigoConfirmacaoCadastro(String destinatario, String codigo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(destinatario);
        message.setSubject("SIBV - Código para confirmar seu cadastro");
        message.setText("""
                Olá!

                Recebemos uma solicitação para criar uma conta no SIBV usando este e-mail.

                Seu código de confirmação é: %s

                O código expira em 10 minutos e só pode ser usado uma vez.
                Se você não solicitou este cadastro, ignore este e-mail.

                SIBV - Sistema Integrado de Biblioteca Virtual
                """.formatted(codigo));

        mailSender.send(message);
    }

}
