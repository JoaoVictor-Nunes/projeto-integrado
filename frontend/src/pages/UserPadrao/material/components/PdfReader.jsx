import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert, Box, CircularProgress, IconButton, LinearProgress, Stack, TextField, Tooltip, Typography
} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { colors } from "@/theme/tokens";

// O pdf.js processa o PDF num worker separado. Este formato funciona com o Vite.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const ESCALA_MIN = 0.6;
const ESCALA_MAX = 2;
const PASSO_ESCALA = 0.2;
const LARGURA_MAXIMA = 1000;

/**
 * Leitor de PDF página a página, com navegação, zoom e barra de progresso.
 * Não sabe nada de API: só avisa quem o usa quando a página muda.
 *
 * @param {string} url - link temporário do PDF
 * @param {number} paginaInicial - página onde retomar a leitura
 * @param {(pagina:number, total:number) => void} onPaginaChange
 * @param {() => void} onErro - chamado se o PDF não carregar (ex.: link expirado)
 */
export default function PdfReader({ url, paginaInicial = 1, onPaginaChange, onErro }) {
  const inicial = Math.max(1, paginaInicial);
  const [total, setTotal] = useState(null);
  const [pagina, setPagina] = useState(inicial);
  const [campo, setCampo] = useState(String(inicial));
  const [escala, setEscala] = useState(1);
  const [largura, setLargura] = useState(800);
  const areaRef = useRef(null);
  const primeiraRender = useRef(true);

  // Ajusta a página à largura disponível (e acompanha o redimensionamento).
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const observador = new ResizeObserver(([entrada]) => setLargura(Math.floor(entrada.contentRect.width)));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const irPara = useCallback(
    (destino) => {
      if (!total) return;
      const n = Math.min(Math.max(1, Math.round(destino)), total);
      setCampo(String(n));
      if (n === pagina) return;
      setPagina(n);
      onPaginaChange?.(n, total);
    },
    [total, pagina, onPaginaChange]
  );

  const aoCarregar = ({ numPages }) => {
    setTotal(numPages);
    const n = Math.min(Math.max(1, pagina), numPages);
    setPagina(n);
    setCampo(String(n));
    onPaginaChange?.(n, numPages); // grava também o total de páginas
  };

  // Setas do teclado viram a página (menos quando se está digitando num campo).
  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.target instanceof HTMLElement && ["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") irPara(pagina + 1);
      if (e.key === "ArrowLeft") irPara(pagina - 1);
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [irPara, pagina]);

  // Ao virar a página, volta ao topo do leitor (sem rolar na primeira abertura).
  useEffect(() => {
    if (primeiraRender.current) {
      primeiraRender.current = false;
      return;
    }
    areaRef.current?.scrollIntoView({ block: "start" });
  }, [pagina]);

  const progresso = total ? Math.round((pagina / total) * 100) : 0;
  const larguraPagina = Math.min(largura - 16, LARGURA_MAXIMA) * escala;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Página anterior">
            <span>
              <IconButton aria-label="Página anterior" onClick={() => irPara(pagina - 1)} disabled={!total || pagina <= 1}>
                <NavigateBeforeIcon />
              </IconButton>
            </span>
          </Tooltip>
          <TextField
            size="small"
            value={campo}
            disabled={!total}
            onChange={(e) => setCampo(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && irPara(Number(campo) || pagina)}
            onBlur={() => irPara(Number(campo) || pagina)}
            slotProps={{
              htmlInput: { "aria-label": "Ir para a página", inputMode: "numeric", style: { textAlign: "center", width: 48 } },
            }}
          />
          <Typography sx={{ color: colors.muted }}>de {total ?? "—"}</Typography>
          <Tooltip title="Próxima página">
            <span>
              <IconButton aria-label="Próxima página" onClick={() => irPara(pagina + 1)} disabled={!total || pagina >= total}>
                <NavigateNextIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Diminuir zoom">
            <span>
              <IconButton aria-label="Diminuir zoom" onClick={() => setEscala((e) => Math.max(ESCALA_MIN, +(e - PASSO_ESCALA).toFixed(1)))} disabled={escala <= ESCALA_MIN}>
                <ZoomOutIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Typography sx={{ color: colors.muted, minWidth: 44, textAlign: "center" }}>{Math.round(escala * 100)}%</Typography>
          <Tooltip title="Aumentar zoom">
            <span>
              <IconButton aria-label="Aumentar zoom" onClick={() => setEscala((e) => Math.min(ESCALA_MAX, +(e + PASSO_ESCALA).toFixed(1)))} disabled={escala >= ESCALA_MAX}>
                <ZoomInIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      <LinearProgress variant="determinate" value={progresso} aria-label="Progresso de leitura" sx={{ mb: 1.5, height: 6, borderRadius: 3 }} />

      <Box
        ref={areaRef}
        sx={{
          display: "flex",
          justifyContent: escala > 1 ? "flex-start" : "center",
          overflowX: "auto",
          minHeight: 320,
          p: 1,
          backgroundColor: colors.white,
          border: `1px solid ${colors.restBorder}`,
          borderRadius: "12px",
        }}
      >
        <Document
          file={url}
          onLoadSuccess={aoCarregar}
          onLoadError={() => onErro?.()}
          loading={<CircularProgress sx={{ m: "auto", mt: 8 }} aria-label="Carregando o PDF" />}
          error={<Alert severity="error" sx={{ m: 2 }}>Não foi possível carregar o PDF.</Alert>}
        >
          <Page pageNumber={pagina} width={larguraPagina} />
        </Document>
      </Box>
    </Box>
  );
}