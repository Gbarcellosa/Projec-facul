package com.lixozero.backend.controller;

import com.lixozero.backend.service.DenunciaService;
import com.lixozero.backend.model.Denuncia;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/denuncia")
@CrossOrigin(origins = "*")
public class DenunciaController {

    private final DenunciaService service;

    public DenunciaController(DenunciaService service) {
        this.service = service;
    }

    // POST /denuncia — cria nova denúncia
    @PostMapping
    public ResponseEntity<Denuncia> criarDenuncia(
            @RequestParam("descricao") String descricao,
            @RequestParam("tipoResiduo") String tipoResiduo,
            @RequestParam("localizacao") String localizacao,
            @RequestParam(value = "contato", required = false) String contato) {

        Denuncia denuncia = service.criarDenuncia(descricao, tipoResiduo, localizacao, contato);
        return ResponseEntity.ok(denuncia);
    }

    // GET /denuncia — lista todas
    @GetMapping
    public ResponseEntity<List<Denuncia>> listarDenuncias() {
        return ResponseEntity.ok(service.listarDenuncias());
    }

    // GET /denuncia/{id} — busca por ID
    @GetMapping("/{id}")
    public ResponseEntity<Denuncia> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}