package com.lixozero.backend.service;

import com.lixozero.backend.model.Denuncia;
import com.lixozero.backend.repository.DenunciaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DenunciaService {

    private final DenunciaRepository repository;

    public DenunciaService(DenunciaRepository repository) {
        this.repository = repository;
    }

    public Denuncia criarDenuncia(String descricao, String tipoResiduo,
                                   String localizacao, String contato) {
        Denuncia denuncia = new Denuncia();
        denuncia.setDescricao(descricao);
        denuncia.setTipoResiduo(tipoResiduo);
        denuncia.setLocalizacao(localizacao);
        denuncia.setContato(contato);
        return repository.salvar(denuncia);
    }

    public List<Denuncia> listarDenuncias() {
        return repository.listarTodas();
    }

    public Optional<Denuncia> buscarPorId(Long id) {
        return repository.buscarPorId(id);
    }
}