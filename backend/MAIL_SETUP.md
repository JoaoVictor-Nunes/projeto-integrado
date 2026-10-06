# Configuração do envio de e-mail

O fluxo de recuperação usa o `JavaMailSender` do Spring Boot com SMTP do Gmail.
O Spring Boot cria o `JavaMailSender` automaticamente quando o starter de mail e as propriedades `spring.mail.*` estão configurados.

## 1. Conta Gmail

Use uma conta Gmail dedicada ao projeto, se possível.

Na conta Google, ative a verificação em duas etapas e gere uma **Senha de app (App Password)** para o projeto.
A senha de app é diferente da senha normal da conta.

## 2. Variáveis de ambiente

Antes de iniciar o backend, configure:

### PowerShell

```powershell
$env:MAIL_USERNAME="seu-email@gmail.com"
$env:MAIL_APP_PASSWORD="sua-senha-de-app"
```

Depois, na mesma janela:

```powershell
./mvnw spring-boot:run
```

Não salve esses valores em `application.properties`, `application-mail.example.properties`, no frontend ou no Git.

## 3. Fluxo implementado

- `POST /api/auth/forgot-password`: recebe o e-mail, gera um código de 6 dígitos e envia por e-mail.
- O código expira em 10 minutos.
- O código pode ser usado uma única vez.
- O backend limita a 5 tentativas de validação por código.
- `POST /api/auth/verify-reset-code`: valida o código enviado.

A resposta de solicitação é genérica para não revelar se determinado e-mail está cadastrado.

## 4. Frontend

O formulário existente de "Esqueci minha senha" agora chama a API real. O visual e a animação da autenticação não foram alterados.
