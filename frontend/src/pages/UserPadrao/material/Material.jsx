import { useEffect, useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PdfReader from "./components/PdfReader";
import { abrirLeitura } from "@/services/leitura.service";
import { useFavorito } from "@/hooks/useFavorito";
import { useSalvarProgresso } from "@/hooks/useSalvarProgresso";
import { mensagemDeErro } from "@/pages/admin//gestaoAcervo/utils/mensagemDeErro";
import { colors } from "@/theme/tokens";

/**
 * Tela de leitura de um material (rota /material/:id).
 * Ao abrir, o backend já grava a visualização no histórico, devolve o link
 * do PDF e a última página lida. A cada página virada, o progresso é salvo.
 */
export default function Material() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leitura, setLeitura] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0); // incrementa para recarregar o link

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro("");
    abrirLeitura(id)
      .then((dados) => ativo && setLeitura(dados))
      .catch((e) => ativo && setErro(mensagemDeErro(e, "Não foi possível abrir o material.")))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [id, tentativa]);

  const salvarProgresso = useSalvarProgresso(id);
  const { favorito, salvando, alternar } = useFavorito(id, leitura?.favorito);

  const voltar = () => navigate("/acervo");
  const recarregar = () => setTentativa((t) => t + 1);

  return (
    <AppLayout>
      <Box sx={{ maxWidth: 1080, mx: "auto" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={voltar} sx={{ mb: 2 }}>
          Voltar ao acervo
        </Button>

        {carregando && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress aria-label="Abrindo o material" />
          </Box>
        )}

        {!carregando && erro && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={recarregar}>Tentar de novo</Button>}>
            {erro}
          </Alert>
        )}

        {!carregando && leitura && (
          <>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2} sx={{ mb: 3 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, color: colors.ink, letterSpacing: "-0.015em" }}>
                  {leitura.titulo}
                </Typography>
                <Typography sx={{ color: colors.muted }}>Por {leitura.autor || "autor não informado"}</Typography>
                {leitura.paginaAtual > 1 && (
                  <Chip size="small" sx={{ mt: 1 }} label={`Retomando da página ${leitura.paginaAtual}`} />
                )}
              </Box>

              <Tooltip title={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
                <span>
                  <IconButton
                    onClick={alternar}
                    disabled={salvando}
                    aria-pressed={favorito}
                    aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    sx={{ color: favorito ? colors.danger : colors.muted }}
                  >
                    {favorito ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>

            {/* key=url: se o link for renovado, o leitor é recriado com o PDF novo. */}
            <PdfReader
              key={leitura.url}
              url={leitura.url}
              paginaInicial={leitura.paginaAtual}
              onPaginaChange={salvarProgresso}
              onErro={() => setErro("O PDF não pôde ser carregado. O link pode ter expirado.")}
            />
          </>
        )}
      </Box>
    </AppLayout>
  );
}