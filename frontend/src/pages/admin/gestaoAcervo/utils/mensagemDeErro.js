/**
 * Extrai uma mensagem legível de um erro do axios.
 * O backend responde no formato Problem Details: "detail" traz a
 * mensagem geral e, em erros de validação (400), "erros" traz um mapa
 * campo → mensagem, que é mais útil para o usuário.
 */
export function mensagemDeErro(error, padrao = 'Ocorreu um erro inesperado.') {
  const data = error?.response?.data;

  if (data?.erros && typeof data.erros === 'object') {
    const mensagens = Object.values(data.erros);
    if (mensagens.length > 0) return mensagens.join(' ');
  }
  return data?.detail || padrao;
}