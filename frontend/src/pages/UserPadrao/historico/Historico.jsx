import { useMemo } from 'react';
import { Alert, Box, Button, Skeleton, Typography } from '@mui/material';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useHistorico } from '@/hooks/useHistorico';
import { AppLayout } from '@/components/layout/AppLayout';
import { HistoricoItem } from './components/HistoricoItem';
import { agruparPorDia } from './utils/agruparPorDia';
import { colors } from '@/theme/tokens';

/**
 * Histórico de leitura do usuário. Os registros NÃO são criados aqui:
 * eles são gravados automaticamente, em segundo plano, quando a pessoa
 * abre ou baixa uma obra (useRegistrarAcesso / registrarAcesso). Esta
 * página só mostra o que já foi registrado, agrupado por dia.
 */
const Historico = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { itens, loading, loadingMore, error, hasMore, carregarMais, recarregar } = useHistorico({
    enabled: Boolean(user), // visitante não tem histórico: nem tenta buscar
  });

  const grupos = useMemo(() => agruparPorDia(itens), [itens]);

  if (!user) return <Navigate to="/login" replace />;

  // ASSUMIDO: rota de detalhe/leitura da obra. Ajuste ao seu routes/.
  const abrirMaterial = (item) => navigate(`/acervo/${item.materialId}`);

  return (
    <AppLayout>
      <Typography
        component="h1"
        sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.ink, letterSpacing: '-0.015em' }}
      >
        Histórico de leitura
      </Typography>
      <Typography sx={{ color: colors.muted, mt: 0.5, mb: 4 }}>
        As obras que você abriu ou baixou aparecem aqui automaticamente.
      </Typography>

      {loading && (
        <Box aria-busy="true" aria-label="Carregando histórico" sx={{ display: 'grid', gap: 1.5, maxWidth: 820 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" height={74} />
          ))}
        </Box>
      )}

      {!loading && error && (
        <Alert
          severity="error"
          sx={{ maxWidth: 820 }}
          action={<Button color="inherit" size="small" onClick={recarregar}>Tentar de novo</Button>}
        >
          Não foi possível carregar o seu histórico.
        </Alert>
      )}

      {!loading && !error && itens.length === 0 && (
        <Box
          sx={{
            maxWidth: 820,
            textAlign: 'center',
            padding: '56px 24px',
            backgroundColor: colors.white,
            border: `1px dashed ${colors.restBorder}`,
            borderRadius: '20px',
          }}
        >
          <HistoryOutlinedIcon sx={{ fontSize: 48, color: colors.tealLight }} />
          <Typography sx={{ fontWeight: 600, color: colors.ink, mt: 1 }}>
            Você ainda não acessou nenhuma obra
          </Typography>
          <Typography sx={{ color: colors.muted, mt: 0.5, mb: 3 }}>
            Quando você ler ou baixar um material, ele aparece aqui.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/acervo')} sx={{ borderRadius: '9999px', px: 4 }}>
            Explorar acervo
          </Button>
        </Box>
      )}

      {!loading && !error && grupos.length > 0 && (
        <Box sx={{ maxWidth: 820, display: 'grid', gap: 4 }}>
          {grupos.map((grupo) => (
            <Box component="section" key={grupo.chave} aria-label={grupo.rotulo}>
              <Typography
                component="h2"
                sx={{ fontWeight: 600, fontSize: '1.05rem', color: colors.tealDeep, mb: 1.5 }}
              >
                {grupo.rotulo}
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                {grupo.itens.map((item) => (
                  <HistoricoItem key={item.id} item={item} onOpen={abrirMaterial} />
                ))}
              </Box>
            </Box>
          ))}

          {hasMore && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={carregarMais}
                disabled={loadingMore}
                sx={{ borderRadius: '9999px', px: 4 }}
              >
                {loadingMore ? 'Carregando...' : 'Carregar mais'}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </AppLayout>
  );
};
export default Historico;