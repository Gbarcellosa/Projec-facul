package com.lixozero.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@ToString(exclude = "denuncia")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "fotos_denuncia")
public class FotoDenuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "denuncia_id", nullable = false, unique = true)
    @JsonIgnore // Evita referência circular na serialização JSON
    private Denuncia denuncia;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String tipo;

    @Lob
    @Column(nullable = false, columnDefinition = "BYTEA")
    private byte[] dados;
}
