package com.unichristus.projetointegrado.repository;

import com.unichristus.projetointegrado.domain.model.EtapaEnsino;
import com.unichristus.projetointegrado.domain.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query("""
        select distinct m from Material m
        left join m.disciplinas d
        where (cast(:titulo as string) is null or lower(m.titulo) like lower(concat('%', cast(:titulo as string), '%')))
          and (cast(:autor as string) is null or lower(m.autor) like lower(concat('%', cast(:autor as string), '%')))
          and (cast(:disciplina as string) is null or lower(d.nome) like lower(concat('%', cast(:disciplina as string), '%')))
          and (cast(:palavrasChave as string) is null or lower(m.resumo) like lower(concat('%', cast(:palavrasChave as string), '%'))
               or lower(m.titulo) like lower(concat('%', cast(:palavrasChave as string), '%')))
          and (:etapaEnsino is null or m.etapaEnsino = :etapaEnsino or m.etapaEnsino = com.unichristus.projetointegrado.domain.model.EtapaEnsino.AMBOS)
        order by m.titulo
        """)
    List<Material> pesquisar(
            @Param("titulo") String titulo,
            @Param("autor") String autor,
            @Param("disciplina") String disciplina,
            @Param("palavrasChave") String palavrasChave,
            @Param("etapaEnsino") EtapaEnsino etapaEnsino
    );

    /**
     * Busca um material já com as disciplinas carregadas. Usado quando a
     * entidade vai ser lida fora de uma transação (ex.: depois de um upload),
     * para não estourar LazyInitializationException.
     */
    @Query("select m from Material m left join fetch m.disciplinas where m.id = :id")
    Optional<Material> findDetalhadoById(@Param("id") Long id);
}