package com.lixozero.backend.controller;

import com.lixozero.backend.model.Denuncia;
import com.lixozero.backend.service.DenunciaService;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/denuncia")
public class DenunciaController {

    private final DenunciaService service;

    public DenunciaController(DenunciaService service) {
        this.service = service;
    }

    // POST /denuncia — cria nova denúncia (foto opcional)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Denuncia> criarDenuncia(
            @RequestParam("descricao") String descricao,
            @RequestParam("tipoResiduo") String tipoResiduo,
            @RequestParam("localizacao") String localizacao,
            @RequestParam(value = "contato", required = false) String contato,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        Denuncia denuncia = service.criarDenuncia(descricao, tipoResiduo, localizacao, contato, foto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(denuncia.getId())
                .toUri();
        return ResponseEntity.created(location).body(denuncia);
    }

    // GET /denuncia — últimas 50, da mais recente para a mais antiga
    @GetMapping
    public ResponseEntity<List<Denuncia>> listarDenuncias() {
        return ResponseEntity.ok(service.listarDenuncias());
    }

    // GET /denuncia/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Denuncia> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /denuncia/{id}/foto
    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> foto(@PathVariable Long id) {
        return service.buscarFoto(id)
                .map(f -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(f.getTipo()))
                        .cacheControl(CacheControl.maxAge(Duration.ofDays(7)))
                        .body(f.getDados()))
                .orElse(ResponseEntity.notFound().build());
    }
}
