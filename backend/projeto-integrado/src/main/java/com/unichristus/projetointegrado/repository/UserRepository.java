package com.unichristus.projetointegrado.repository;

import com.unichristus.projetointegrado.domain.model.TipoPerfil;
import com.unichristus.projetointegrado.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByMatricula(String matricula);

    boolean existsByEmailAndIdNot(String email, Long id);

    @Query("""
            select u from User u
            where (:perfil is null or u.perfil = :perfil)
              and (lower(u.nome)  like lower(concat('%', :busca, '%'))
                or lower(u.email) like lower(concat('%', :busca, '%')))
        
""")
    Page<User> buscarPorTermoEPerfil(@Param("bucas") String busca,
                                     @Param("perfil")TipoPerfil perfil,
                                     Pageable pageable);

}
