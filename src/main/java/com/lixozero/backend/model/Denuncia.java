package com.lixozero.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@ToString(exclude = "foto")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "denuncias")
public class Denuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank(message = "Descrição é obrigatória")
    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    @Column(nullable = false, length = 1000)
    private String descricao;

    @NotBlank(message = "Tipo de resíduo é obrigatório")
    @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String tipoResiduo;

    @NotBlank(message = "Localização é obrigatória")
    @Size(max = 300, message = "Localização deve ter no máximo 300 caracteres")
    @Column(nullable = false, length = 300)
    private String localizacao;

    @Size(max = 100, message = "Contato deve ter no máximo 100 caracteres")
    @Column(length = 100)
    private String contato;

    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String status = "PENDENTE";

    // Instant serializa com "Z" (UTC), então o navegador converte certo para o fuso local
    @Column(nullable = false, updatable = false)
    private Instant dataHora = Instant.now();

    // Relacionamento 1:1 com FotoDenuncia
    @OneToOne(mappedBy = "denuncia", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore // Evita referência circular na serialização JSON
    private FotoDenuncia foto;

    // A foto fica em outra tabela (FotoDenuncia) para não pesar a listagem
    @Column(nullable = false)
    private boolean temFoto = false;
}
