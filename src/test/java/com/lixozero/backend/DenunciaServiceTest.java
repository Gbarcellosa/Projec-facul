package com.lixozero.backend;

import com.lixozero.backend.model.Denuncia;
import com.lixozero.backend.model.FotoDenuncia;
import com.lixozero.backend.repository.DenunciaRepository;
import com.lixozero.backend.repository.FotoDenunciaRepository;
import com.lixozero.backend.service.DenunciaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DenunciaServiceTest {

    @Autowired
    private DenunciaService service;

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
    void criarDenuncia_semFoto_deveSalvarComSucesso() {
        Denuncia d = service.criarDenuncia(
                "Lixo na rua",
                "Reciclável",
                "Rua A, 123",
                "11999999999",
                null
        );

        assertThat(d.getId()).isNotNull();
        assertThat(d.getDescricao()).isEqualTo("Lixo na rua");
        assertThat(d.getTipoResiduo()).isEqualTo("Reciclável");
        assertThat(d.getLocalizacao()).isEqualTo("Rua A, 123");
        assertThat(d.getContato()).isEqualTo("11999999999");
        assertThat(d.getStatus()).isEqualTo("PENDENTE");
        assertThat(d.isTemFoto()).isFalse();
        assertThat(d.getDataHora()).isNotNull();
    }

    @Test
    void criarDenuncia_comFoto_deveSalvarFotoEVincular() {
        // JPEG magic bytes válidos + payload de teste
        byte[] jpegBytes = new byte[] {
                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10,
                0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
                0x00, 0x48, 0x00, 0x00
        };
        MockMultipartFile foto = new MockMultipartFile(
                "foto", "test.jpg", "image/jpeg", jpegBytes
        );

        Denuncia d = service.criarDenuncia(
                "Entulho na calcada",
                "Entulho",
                "Av. B, 456",
                null,
                foto
        );

        assertThat(d.isTemFoto()).isTrue();
        assertThat(d.getFoto()).isNotNull();
        assertThat(d.getFoto().getDados()).isEqualTo(jpegBytes);
        assertThat(d.getFoto().getTipo()).isEqualTo("image/jpeg");
        assertThat(d.getFoto().getDenuncia()).isEqualTo(d);
    }

    @Test
    void criarDenuncia_tipoInvalido_deveLancarExcecao() {
        assertThatThrownBy(() -> service.criarDenuncia(
                "Teste", "Invalido", "Local", null, null
        )).isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("Tipo de resíduo inválido");
    }

    @Test
    void criarDenuncia_descricaoVazia_deveLancarExcecao() {
        assertThatThrownBy(() -> service.criarDenuncia(
                "", "Reciclável", "Local", null, null
        )).isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("obrigatórias");
    }

    @Test
    void criarDenuncia_localizacaoVazia_deveLancarExcecao() {
        assertThatThrownBy(() -> service.criarDenuncia(
                "Descricao", "Reciclável", "", null, null
        )).isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("obrigatórias");
    }

    @Test
    void criarDenuncia_fotoNaoImagem_deveLancarExcecao() {
        MockMultipartFile pdf = new MockMultipartFile(
                "foto", "doc.pdf", "application/pdf", "pdf content".getBytes()
        );

        assertThatThrownBy(() -> service.criarDenuncia(
                "Teste", "Reciclável", "Local", null, pdf
        )).isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("precisa ser uma imagem");
    }

    @Test
    void criarDenuncia_fotoMuitoGrande_deveLancarExcecao() {
        byte[] largeContent = new byte[6 * 1024 * 1024]; // 6MB
        MockMultipartFile largeFile = new MockMultipartFile(
                "foto", "large.jpg", "image/jpeg", largeContent
        );

        assertThatThrownBy(() -> service.criarDenuncia(
                "Teste", "Reciclável", "Local", null, largeFile
        )).isInstanceOf(IllegalArgumentException.class)
         .hasMessageContaining("5MB");
    }

    @Test
    void listarDenuncias_deveRetornarOrdenadoPorDataDesc() {
        service.criarDenuncia("Primeira", "Reciclável", "Local 1", null, null);
        service.criarDenuncia("Segunda", "Comum", "Local 2", null, null);
        service.criarDenuncia("Terceira", "Entulho", "Local 3", null, null);

        List<Denuncia> lista = service.listarDenuncias();

        assertThat(lista).hasSize(3);
        assertThat(lista.get(0).getDescricao()).isEqualTo("Terceira");
        assertThat(lista.get(1).getDescricao()).isEqualTo("Segunda");
        assertThat(lista.get(2).getDescricao()).isEqualTo("Primeira");
    }

    @Test
    void buscarPorId_deveRetornarDenuncia() {
        Denuncia criada = service.criarDenuncia("Teste", "Reciclável", "Local", null, null);

        Optional<Denuncia> encontrada = service.buscarPorId(criada.getId());

        assertThat(encontrada).isPresent();
        assertThat(encontrada.get().getDescricao()).isEqualTo("Teste");
    }

    @Test
    void buscarPorId_inexistente_deveRetornarVazio() {
        Optional<Denuncia> encontrada = service.buscarPorId(999L);

        assertThat(encontrada).isEmpty();
    }

    @Test
    void buscarFoto_deveRetornarFotoDaDenuncia() {
        byte[] jpegBytes = new byte[] {
                (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0x00, 0x10,
                0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
                0x00, 0x48, 0x00, 0x00
        };
        MockMultipartFile foto = new MockMultipartFile(
                "foto", "test.jpg", "image/jpeg", jpegBytes
        );
        Denuncia d = service.criarDenuncia("Com foto", "Reciclável", "Local", null, foto);

        Optional<FotoDenuncia> fotoEncontrada = service.buscarFoto(d.getId());

        assertThat(fotoEncontrada).isPresent();
        assertThat(fotoEncontrada.get().getDenuncia().getId()).isEqualTo(d.getId());
    }

    @Test
    void criarDenuncia_contatoOpcional_podeSerNulo() {
        Denuncia d = service.criarDenuncia(
                "Sem contato", "Reciclável", "Local", null, null
        );

        assertThat(d.getContato()).isNull();
    }

    @Test
    void criarDenuncia_contatoComEspacos_deveTrimmar() {
        Denuncia d = service.criarDenuncia(
                "Teste", "Reciclável", "Local", "  11999999999  ", null
        );

        assertThat(d.getContato()).isEqualTo("11999999999");
    }

    @Test
    void criarDenuncia_limiteDescricao_naoDeveCortarInadequadamente() {
        String descricaoLonga = "a".repeat(1500);
        Denuncia d = service.criarDenuncia(descricaoLonga, "Reciclável", "Local", null, null);

        assertThat(d.getDescricao()).hasSize(1000);
    }
}