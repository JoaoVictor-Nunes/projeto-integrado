const formatoDia = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
});

const chaveDoDia = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function rotuloDoDia(data, agora) {
  const ontem = new Date(agora);
  ontem.setDate(agora.getDate() - 1);

  if (chaveDoDia(data) === chaveDoDia(agora)) return 'Hoje';
  if (chaveDoDia(data) === chaveDoDia(ontem)) return 'Ontem';

  const texto = formatoDia.format(data);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Agrupa os acessos (já ordenados do mais novo ao mais antigo) por dia,
 * mantendo a ordem. Retorna [{ chave, rotulo, itens }].
 */
export function agruparPorDia(itens, agora = new Date()) {
  const grupos = [];

  itens.forEach((item) => {
    const data = new Date(item.dataAcesso);
    const chave = chaveDoDia(data);
    const ultimo = grupos[grupos.length - 1];

    if (ultimo && ultimo.chave === chave) {
      ultimo.itens.push(item);
    } else {
      grupos.push({ chave, rotulo: rotuloDoDia(data, agora), itens: [item] });
    }
  });

  return grupos;
}