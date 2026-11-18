package com.lixozero.backend.repository;

import com.lixozero.backend.model.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {

    List<Denuncia> findTop50ByOrderByDataHoraDesc();
}
