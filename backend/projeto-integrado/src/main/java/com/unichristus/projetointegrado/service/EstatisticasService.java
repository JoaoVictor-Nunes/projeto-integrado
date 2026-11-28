package com.unichristus.projetointegrado.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.unichristus.projetointegrado.domain.dto.estatisticas.AcessosPorDiaDTO;
import com.unichristus.projetointegrado.domain.dto.estatisticas.DashboardMetricsDTO;
import com.unichristus.projetointegrado.domain.dto.estatisticas.EngajamentoPorDisciplinaDTO;
import com.unichristus.projetointegrado.domain.dto.estatisticas.MateriaisMaisAcessadosDTO;
import com.unichristus.projetointegrado.domain.model.Disciplina;
import com.unichristus.projetointegrado.domain.model.TipoAcesso;
import com.unichristus.projetointegrado.repository.DisciplinaRepository;
import com.unichristus.projetointegrado.repository.FavoritoRepository;
import com.unichristus.projetointegrado.repository.HistoricoLeituraRepository;
import com.unichristus.projetointegrado.repository.MaterialRepository;
import com.unichristus.projetointegrado.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Agrega métricas de uso do acervo para o painel administrativo de Estatísticas:
 * materiais mais consultados, engajamento por disciplina e evolução de acessos.
 */
@Service
public class EstatisticasService {

    private static final int LIMITE_MATERIAIS_TOP = 8;
    private static final int PERIODO_PADRAO_DIAS = 30;
    private static final int PERIODO_MAXIMO_DIAS = 365;

    private final UserRepository userRepository;
    private final MaterialRepository materialRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final HistoricoLeituraRepository historicoRepository;
    private final FavoritoRepository favoritoRepository;

    public EstatisticasService(UserRepository userRepository,
                               MaterialRepository materialRepository,
                               DisciplinaRepository disciplinaRepository,
                               HistoricoLeituraRepository historicoRepository,
                               FavoritoRepository favoritoRepository) {
        this.userRepository = userRepository;
        this.materialRepository = materialRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.historicoRepository = historicoRepository;
        this.favoritoRepository = favoritoRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDTO obterMetricas(Integer diasInformados) {
        int periodoDias = normalizarPeriodo(diasInformados);
        LocalDate hoje = LocalDate.now();
        LocalDate dataInicio = hoje.minusDays(periodoDias - 1L);
        LocalDateTime inicioPeriodo = dataInicio.atStartOfDay();

        long totalUsuarios = userRepository.count();
        long usuariosAtivos = userRepository.countByStatusAtivoTrue();
        long totalMateriais = materialRepository.count();
        long materiaisAtivos = materialRepository.countAtivos();
        long totalLeiturasGeral = historicoRepository.count();
        long totalAcessosPeriodo = historicoRepository.countByDataAcessoGreaterThanEqual(inicioPeriodo);
        long totalLeiturasOnlinePeriodo = historicoRepository
                .countByTipoAcessoAndDataAcessoGreaterThanEqual(TipoAcesso.LEITURA_ONLINE, inicioPeriodo);
        long totalDownloadsPeriodo = historicoRepository
                .countByTipoAcessoAndDataAcessoGreaterThanEqual(TipoAcesso.DOWNLOAD, inicioPeriodo);
        long totalFavoritos = favoritoRepository.count();

        List<MateriaisMaisAcessadosDTO> materiaisMaisAcessados = buscarTopMateriais(inicioPeriodo);
        List<EngajamentoPorDisciplinaDTO> engajamentoPorDisciplina = buscarEngajamentoDisciplinas(inicioPeriodo);
        List<AcessosPorDiaDTO> acessosPorDia = montarSerieDiaria(dataInicio, hoje, inicioPeriodo);

        return new DashboardMetricsDTO(
                totalUsuarios,
                usuariosAtivos,
                totalMateriais,
                materiaisAtivos,
                totalLeiturasGeral,
                totalAcessosPeriodo,
                totalLeiturasOnlinePeriodo,
                totalDownloadsPeriodo,
                totalFavoritos,
                periodoDias,
                materiaisMaisAcessados,
                engajamentoPorDisciplina,
                acessosPorDia);
    }

    private List<MateriaisMaisAcessadosDTO> buscarTopMateriais(LocalDateTime inicioPeriodo) {
        return historicoRepository
                .buscarMateriaisMaisAcessados(inicioPeriodo, PageRequest.of(0, LIMITE_MATERIAIS_TOP))
                .stream()
                .map(row -> new MateriaisMaisAcessadosDTO(
                        toLong(row[0]),
                        (String) row[1],
                        (String) row[2],
                        (String) row[3],
                        toLong(row[4]),
                        toLong(row[5]),
                        toLong(row[6])))
                .toList();
    }

    private List<EngajamentoPorDisciplinaDTO> buscarEngajamentoDisciplinas(LocalDateTime inicioPeriodo) {
        Map<Long, Long> acessosPorDisciplina = new HashMap<>();
        for (Object[] row : historicoRepository.buscarEngajamentoPorDisciplina(inicioPeriodo)) {
            acessosPorDisciplina.put(toLong(row[0]), toLong(row[2]));
        }

        Map<Long, Long> materiaisPorDisciplina = new HashMap<>();
        for (Object[] row : materialRepository.contarMateriaisAtivosPorDisciplina()) {
            materiaisPorDisciplina.put(toLong(row[0]), toLong(row[1]));
        }

        List<Disciplina> todasDisciplinas = disciplinaRepository.findAll();
        return todasDisciplinas.stream()
                .map(d -> new EngajamentoPorDisciplinaDTO(
                        d.getId(),
                        d.getNome(),
                        acessosPorDisciplina.getOrDefault(d.getId(), 0L),
                        materiaisPorDisciplina.getOrDefault(d.getId(), 0L)))
                .sorted(Comparator
                        .comparingLong(EngajamentoPorDisciplinaDTO::quantidadeAcessos).reversed()
                        .thenComparing(EngajamentoPorDisciplinaDTO::nomeCategoria, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private List<AcessosPorDiaDTO> montarSerieDiaria(LocalDate inicio, LocalDate fim, LocalDateTime inicioPeriodo) {
        Map<LocalDate, long[]> mapa = new LinkedHashMap<>();
        for (LocalDate data = inicio; !data.isAfter(fim); data = data.plusDays(1)) {
            mapa.put(data, new long[] {0L, 0L}); // [0] leiturasOnline, [1] downloads
        }

        for (Object[] row : historicoRepository.listarDatasETiposDesde(inicioPeriodo)) {
            LocalDateTime dataAcesso = (LocalDateTime) row[0];
            TipoAcesso tipo = (TipoAcesso) row[1];
            if (dataAcesso == null) {
                continue;
            }
            long[] contadores = mapa.get(dataAcesso.toLocalDate());
            if (contadores == null) {
                continue;
            }
            if (tipo == TipoAcesso.DOWNLOAD) {
                contadores[1]++;
            } else {
                contadores[0]++;
            }
        }

        return mapa.entrySet().stream()
                .map(entry -> {
                    long leituras = entry.getValue()[0];
                    long downloads = entry.getValue()[1];
                    return new AcessosPorDiaDTO(entry.getKey(), leituras + downloads, leituras, downloads);
                })
                .toList();
    }

    private int normalizarPeriodo(Integer dias) {
        if (dias == null || dias <= 0) {
            return PERIODO_PADRAO_DIAS;
        }
        return Math.min(dias, PERIODO_MAXIMO_DIAS);
    }

    private long toLong(Object valor) {
        return valor == null ? 0L : ((Number) valor).longValue();
    }
}
