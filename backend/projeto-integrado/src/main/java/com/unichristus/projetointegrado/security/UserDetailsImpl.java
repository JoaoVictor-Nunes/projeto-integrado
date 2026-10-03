package com.unichristus.projetointegrado.security;

import java.util.Collection;
import java.util.List;

import com.unichristus.projetointegrado.domain.model.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private final User user;

    /** Acesso à entidade original, usado pelo AuthController para montar a resposta. */
    public User getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Prefixo ROLE_ é a convenção do Spring Security para hasRole("ALUNO"), etc.
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getPerfil().name()));
    }

    @Override
    public String getPassword() {
        return user.getSenhaHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Usuário inativado (soft delete) não deve conseguir logar.
        return Boolean.TRUE.equals(user.getStatusAtivo());
    }
}

