package com.lixozero.backend;

import com.lixozero.backend.model.Denuncia;
import com.lixozero.backend.model.FotoDenuncia;
import com.lixozero.backend.repository.DenunciaRepository;
import com.lixozero.backend.repository.FotoDenunciaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class DenunciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DenunciaRepository denunciaRepository;

    @Autowired
    private FotoDenunciaRepository fotoRepository;

    @BeforeEach
    void cleanUp() {
        fotoRepository.deleteAll();
        denunciaRepository.deleteAll();
    }

    @Test
    void criarDenuncia_semFoto_deveRetornar201() throws Exception {
        mockMvc.perform(multipart("/denuncia")
                        .param("descricao", "Lixo na rua")
                        .param("tipoResiduo", "Reciclável")
                        .param("localizacao", "Rua A")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.descricao").value("Lixo na rua"))
                .andExpect(jsonPath("$.tipoResiduo").value("Reciclável"))
                .andExpect(jsonPath("$.localizacao").value("Rua A"))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.temFoto").value(false));
    }

    @Test
    void criarDenuncia_comFoto_deveRetornar201ComFoto() throws Exception {
        // JPEG magic bytes: FF D8 FF + dados mínimos
        byte[] jpegBytes = new byte[] {
                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10,
                0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
                0x00, 0x48, 0x00, 0x00
        };
        MockMultipartFile foto = new MockMultipartFile("foto", "test.jpg", "image/jpeg", jpegBytes);

        mockMvc.perform(multipart("/denuncia")
                        .file(foto)
                        .param("descricao", "Com foto")
                        .param("tipoResiduo", "Comum")
                        .param("localizacao", "Rua B")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.temFoto").value(true));
    }

    @Test
    void criarDenuncia_tipoInvalido_deveRetornar400() throws Exception {
        mockMvc.perform(multipart("/denuncia")
                        .param("descricao", "Teste")
                        .param("tipoResiduo", "Invalido")
                        .param("localizacao", "Local")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Argumento inválido"));
    }

    @Test
    void criarDenuncia_descricaoFaltando_deveRetornar400() throws Exception {
        mockMvc.perform(multipart("/denuncia")
                        .param("tipoResiduo", "Reciclável")
                        .param("localizacao", "Local")
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isBadRequest());
    }

    @Test
    void listarDenuncias_deveRetornarLista() throws Exception {
        Denuncia d1 = new Denuncia();
        d1.setDescricao("Teste 1");
        d1.setTipoResiduo("Reciclável");
        d1.setLocalizacao("Local 1");
        denunciaRepository.save(d1);

        Denuncia d2 = new Denuncia();
        d2.setDescricao("Teste 2");
        d2.setTipoResiduo("Comum");
        d2.setLocalizacao("Local 2");
        denunciaRepository.save(d2);

        mockMvc.perform(get("/denuncia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void buscarPorId_existente_deveRetornarDenuncia() throws Exception {
        Denuncia d = new Denuncia();
        d.setDescricao("Teste busca");
        d.setTipoResiduo("Reciclável");
        d.setLocalizacao("Local teste");
        d = denunciaRepository.save(d);

        mockMvc.perform(get("/denuncia/{id}", d.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.descricao").value("Teste busca"));
    }

    @Test
    void buscarPorId_inexistente_deveRetornar404() throws Exception {
        mockMvc.perform(get("/denuncia/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void buscarFoto_existente_deveRetornarImagem() throws Exception {
        Denuncia d = new Denuncia();
        d.setDescricao("Com foto");
        d.setTipoResiduo("Reciclável");
        d.setLocalizacao("Local");
        d.setTemFoto(true);
        d = denunciaRepository.save(d);

        FotoDenuncia foto = new FotoDenuncia();
        foto.setDenuncia(d);
        foto.setTipo("image/jpeg");
        foto.setDados("fake image".getBytes());
        foto = fotoRepository.save(foto);

        mockMvc.perform(get("/denuncia/{id}/foto", d.getId()))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "image/jpeg"))
                .andExpect(content().bytes("fake image".getBytes()));
    }

    @Test
    void buscarFoto_inexistente_deveRetornar404() throws Exception {
        mockMvc.perform(get("/denuncia/{id}/foto", 999L))
                .andExpect(status().isNotFound());
    }
}