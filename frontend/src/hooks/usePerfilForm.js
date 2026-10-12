import { useState } from 'react';
import { atualizarUsuario, alterarSenha } from '@/services/user.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MIN = 8; // mesmo mínimo da redefinição de senha
const SENHAS_VAZIAS = { atual: '', nova: '', confirmar: '' };

const extrairMensagem = (err, padrao) => {
  const data = err?.response?.data;
  if (data?.erros) return Object.values(data.erros).join(' | ');
  return data?.detail || padrao;
};

/**
 * Controla o formulário de perfil: dados pessoais + troca de senha opcional.
 *
 * @param {object} user         usuário logado (vem do useAuth)
 * @param {Function} refreshUser recarrega o usuário no contexto após salvar
 */
export const usePerfilForm = (user, refreshUser) => {
  // Valores "salvos": voltam a ser recalculados quando o refreshUser atualiza o user.
  const original = { nome: user?.nome ?? '', email: user?.email ?? '' };

  const [dados, setDados] = useState(original);
  const [senhas, setSenhas] = useState(SENHAS_VAZIAS);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { tipo: 'success' | 'error' | 'info', mensagem }

  const dadosAlterados =
    dados.nome.trim() !== original.nome || dados.email.trim() !== original.email;
  const senhaPreenchida = Object.values(senhas).some(Boolean);
  const isDirty = dadosAlterados || senhaPreenchida;

  const limparErro = (campo) =>
    setErros((prev) => (prev[campo] ? { ...prev, [campo]: undefined } : prev));

  const updateDado = (campo, valor) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    limparErro(campo);
  };

  const updateSenha = (campo, valor) => {
    setSenhas((prev) => ({ ...prev, [campo]: valor }));
    limparErro(campo);
  };

  const validar = () => {
    const novos = {};

    if (dados.nome.trim().length < 3) novos.nome = 'Informe seu nome completo.';
    if (!EMAIL_REGEX.test(dados.email.trim())) novos.email = 'Informe um e-mail válido.';

    if (senhaPreenchida) {
      if (!senhas.atual) novos.atual = 'Informe a senha atual.';
      if (senhas.nova.length < SENHA_MIN) {
        novos.nova = `A nova senha precisa ter ao menos ${SENHA_MIN} caracteres.`;
      } else if (senhas.nova === senhas.atual) {
        novos.nova = 'A nova senha deve ser diferente da atual.';
      }
      if (senhas.confirmar !== senhas.nova) novos.confirmar = 'As senhas não coincidem.';
    }

    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const salvar = async (e) => {
    e?.preventDefault();
    if (loading || !isDirty) return;
    if (!validar()) return;

    setLoading(true);
    setFeedback(null);
    let dadosSalvos = false;

    try {
      if (dadosAlterados) {
        await atualizarUsuario(user.id, {
          nome: dados.nome.trim(),
          email: dados.email.trim(),
        });
        dadosSalvos = true;
      }

      if (senhaPreenchida) {
        await alterarSenha(user.id, { senhaAtual: senhas.atual, novaSenha: senhas.nova });
        setSenhas(SENHAS_VAZIAS);
      }

      await refreshUser();
      setFeedback({ tipo: 'success', mensagem: 'Alterações salvas com sucesso.' });
    } catch (err) {
      // Se os dados já foram gravados e só a senha falhou, mantém o contexto em dia.
      if (dadosSalvos) await refreshUser().catch(() => {});
      setFeedback({
        tipo: 'error',
        mensagem: extrairMensagem(err, 'Não foi possível salvar as alterações. Tente novamente.'),
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    setDados(original);
    setSenhas(SENHAS_VAZIAS);
    setErros({});
    setFeedback(null);
  };

  const notificar = (tipo, mensagem) => setFeedback({ tipo, mensagem });
  const fecharFeedback = () => setFeedback(null);

  return {
    dados,
    senhas,
    erros,
    loading,
    feedback,
    isDirty,
    updateDado,
    updateSenha,
    salvar,
    cancelar,
    notificar,
    fecharFeedback,
  };
};
