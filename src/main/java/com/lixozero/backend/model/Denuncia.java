package com.lixozero.backend.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Denuncia {

    private Long id;
    private String descricao;
    private String tipoResiduo;
    private String localizacao;
    private String contato;
    private String status;
    private LocalDateTime dataHora;

    public Denuncia() {
        this.status = "PENDENTE";
        this.dataHora = LocalDateTime.now();
    }
}