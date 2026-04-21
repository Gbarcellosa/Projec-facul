package com.lixozero.backend.repository;

import com.lixozero.backend.model.Denuncia;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class DenunciaRepository {

    private final List<Denuncia> denuncias = new ArrayList<>();
    private final AtomicLong contador = new AtomicLong(1);

    public Denuncia salvar(Denuncia denuncia) {
        denuncia.setId(contador.getAndIncrement());
        denuncias.add(denuncia);
        return denuncia;
    }

    public List<Denuncia> listarTodas() {
        return new ArrayList<>(denuncias);
    }

    public Optional<Denuncia> buscarPorId(Long id) {
        return denuncias.stream()
                .filter(d -> d.getId().equals(id))
                .findFirst();
    }
}