package com.lixozero.backend.repository;

import com.lixozero.backend.model.FotoDenuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FotoDenunciaRepository extends JpaRepository<FotoDenuncia, Long> {

    Optional<FotoDenuncia> findByDenunciaId(Long denunciaId);
}
