import { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import api from "@/api/api";

const etapaLabels = {
  FUNDAMENTAL: "Ensino Fundamental",
  MEDIO: "Ensino Médio",
  AMBOS: "Fundamental e Médio",
};

const Acervo = () => {
  const [filtros, setFiltros] = useState({
    titulo: "", autor: "", disciplina: "", palavrasChave: "", etapaEnsino: "",
  });
  const [materiais, setMateriais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro("");
    const params = Object.fromEntries(
      Object.entries(filtros).filter(([, valor]) => valor.trim() !== "")
    );
    api.get("/materiais", { params })
      .then(({ data }) => {
        if (!ativo) return;
        const lista = Array.isArray(data) ? data : data.content ?? data.materiais ?? [];
        setMateriais(lista);
      })
      .catch(() => {
        if (ativo) {
          setMateriais([]);
          setErro("Não foi possível carregar o acervo. Verifique se o backend está em execução e se a rota /api/materiais está disponível.");
        }
      })
      .finally(() => ativo && setCarregando(false));
    return () => { ativo = false; };
  }, [filtros]);

  const atualizar = (campo) => (evento) =>
    setFiltros((atual) => ({ ...atual, [campo]: evento.target.value }));

  const limpar = () => setFiltros({
    titulo: "", autor: "", disciplina: "", palavrasChave: "", etapaEnsino: "",
  });

  const quantidadeFiltros = useMemo(
    () => Object.values(filtros).filter((valor) => valor.trim() !== "").length,
    [filtros]
  );

  return (
    <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, md: 4 }, py: 4 }}>
      <Typography variant="overline" color="primary" fontWeight={700}>BIBLIOTECA VIRTUAL</Typography>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Explore o acervo</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Encontre materiais didáticos por título, autor, disciplina, palavras-chave ou nível de ensino.
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <FilterAltOutlinedIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>Pesquisa e filtros</Typography>
            {quantidadeFiltros > 0 && <Chip size="small" label={`${quantidadeFiltros} ativo(s)`} />}
          </Stack>
          <TextField
            fullWidth
            label="Título do material"
            placeholder="Ex.: Matemática básica"
            value={filtros.titulo}
            onChange={atualizar("titulo")}
            InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ mr: 1, color: "text.secondary" }} /> }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField label="Autor" placeholder="Nome do autor" value={filtros.autor} onChange={atualizar("autor")} />
            <TextField label="Disciplina escolar" placeholder="Ex.: Ciências, História..." value={filtros.disciplina} onChange={atualizar("disciplina")} />
            <TextField label="Palavras-chave" placeholder="Separe termos por vírgula" value={filtros.palavrasChave} onChange={atualizar("palavrasChave")} />
            <FormControl fullWidth>
              <InputLabel id="etapa-label">Nível de ensino</InputLabel>
              <Select labelId="etapa-label" label="Nível de ensino" value={filtros.etapaEnsino} onChange={atualizar("etapaEnsino")}>
                <MenuItem value="">Todos os níveis</MenuItem>
                <MenuItem value="FUNDAMENTAL">Ensino Fundamental</MenuItem>
                <MenuItem value="MEDIO">Ensino Médio</MenuItem>
                <MenuItem value="AMBOS">Fundamental e Médio</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={limpar} startIcon={<RestartAltOutlinedIcon />} disabled={quantidadeFiltros === 0}>
              Limpar filtros
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>Materiais encontrados</Typography>
        {!carregando && <Typography color="text.secondary" variant="body2">{materiais.length} resultado(s)</Typography>}
      </Stack>

      {erro && <Alert severity="warning" sx={{ mb: 2 }}>{erro}</Alert>}
      {carregando ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>
      ) : materiais.length === 0 ? (
        <Card variant="outlined" sx={{ textAlign: "center", p: 4, borderRadius: 3 }}>
          <Typography fontWeight={700}>Nenhum material encontrado</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Tente alterar os termos ou limpar os filtros.</Typography>
        </Card>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 }}>
          {materiais.map((material) => {
            const disciplinas = material.disciplinas ?? [];
            return (
              <Card key={material.id} variant="outlined" sx={{ borderRadius: 3, display: "flex", flexDirection: "column" }}>
                {material.capaUrl && <Box component="img" src={material.capaUrl} alt={`Capa de ${material.titulo}`} sx={{ width: "100%", height: 170, objectFit: "cover" }} />}
                <CardContent sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={700}>{material.titulo}</Typography>
                  <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>Por {material.autor || "Autor não informado"}</Typography>
                  <Typography variant="body2" sx={{ my: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {material.resumo || "Sem descrição disponível."}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: "auto", mb: 2 }}>
                    {disciplinas.map((disciplina) => <Chip key={disciplina.id ?? disciplina.nome} size="small" label={disciplina.nome ?? disciplina} />)}
                    {material.etapaEnsino && <Chip size="small" variant="outlined" label={etapaLabels[material.etapaEnsino] ?? material.etapaEnsino} />}
                  </Stack>
                  {material.arquivoPdfUrl && <Button component="a" href={material.arquivoPdfUrl} target="_blank" rel="noreferrer" variant="contained">Abrir material</Button>}
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Acervo;
