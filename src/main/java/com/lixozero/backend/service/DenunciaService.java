package com.lixozero.backend.service;

import com.lixozero.backend.model.Denuncia;
import com.lixozero.backend.model.FotoDenuncia;
import com.lixozero.backend.repository.DenunciaRepository;
import com.lixozero.backend.repository.FotoDenunciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class DenunciaService {

    private static final Set<String> TIPOS = Set.of("Reciclável", "Comum", "Entulho");
    private static final long MAX_FOTO_SIZE = 5 * 1024 * 1024; // 5MB

    // Magic bytes (assinaturas) de formatos de imagem permitidos
    private static final byte[][] IMAGE_MAGIC_BYTES = {
            {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF},         // JPEG (FF D8 FF)
            {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A}, // PNG
            {(byte) 0x52, 0x49, 0x46, 0x46},                 // WebP (RIFF header)
            {(byte) 0x47, 0x49, 0x46, 0x38, 0x37, 0x61},     // GIF87a
            {(byte) 0x47, 0x49, 0x46, 0x38, 0x39, 0x61}      // GIF89a
    };

    private final DenunciaRepository repository;
    private final FotoDenunciaRepository fotoRepository;

    public DenunciaService(DenunciaRepository repository, FotoDenunciaRepository fotoRepository) {
        this.repository = repository;
        this.fotoRepository = fotoRepository;
    }

    @Transactional
    public Denuncia criarDenuncia(String descricao, String tipoResiduo, String localizacao,
                                  String contato, MultipartFile foto) {
        if (descricao == null || descricao.isBlank() || localizacao == null || localizacao.isBlank()) {
            throw new IllegalArgumentException("Descrição e localização são obrigatórias");
        }
        if (!TIPOS.contains(tipoResiduo)) {
            throw new IllegalArgumentException("Tipo de resíduo inválido. Valores permitidos: Reciclável, Comum, Entulho");
        }

        boolean temFoto = foto != null && !foto.isEmpty();
        if (temFoto) {
            String tipo = foto.getContentType();
            if (tipo == null || !tipo.startsWith("image/")) {
                throw new IllegalArgumentException("O arquivo precisa ser uma imagem");
            }
            if (foto.getSize() > MAX_FOTO_SIZE) {
                throw new IllegalArgumentException("A foto deve ter no máximo 5MB");
            }

            // Validação de magic bytes (assinatura do arquivo) — evita upload de arquivos disfarçados
            try {
                byte[] header = foto.getInputStream().readNBytes(12); // Lê até 12 bytes (maior assinatura)
                if (!validarMagicBytes(header)) {
                    throw new IllegalArgumentException("Arquivo de imagem inválido ou corrompido (assinatura não reconhecida)");
                }
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        }

        Denuncia d = new Denuncia();
        d.setDescricao(limitar(descricao.trim(), 1000));
        d.setTipoResiduo(tipoResiduo);
        d.setLocalizacao(limitar(localizacao.trim(), 300));
        d.setContato(contato == null || contato.isBlank() ? null : limitar(contato.trim(), 100));
        d.setTemFoto(temFoto);
        d = repository.save(d);

        if (temFoto) {
            FotoDenuncia f = new FotoDenuncia();
            f.setDenuncia(d);
            f.setTipo(foto.getContentType());
            try {
                f.setDados(foto.getBytes());
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
            fotoRepository.save(f);
            d.setFoto(f);
        }
        return d;
    }

    public List<Denuncia> listarDenuncias() {
        return repository.findTop50ByOrderByDataHoraDesc();
    }

    public Optional<Denuncia> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Optional<FotoDenuncia> buscarFoto(Long denunciaId) {
        return fotoRepository.findByDenunciaId(denunciaId);
    }

    private static String limitar(String s, int max) {
        return s.length() > max ? s.substring(0, max) : s;
    }

    /**
     * Valida se os bytes iniciais do arquivo correspondem a um formato de imagem permitido.
     * @param header Primeiros bytes do arquivo (até 12 bytes)
     * @return true se for JPEG, PNG, WebP ou GIF válido
     */
    private static boolean validarMagicBytes(byte[] header) {
        if (header == null || header.length < 3) return false;

        for (byte[] magic : IMAGE_MAGIC_BYTES) {
            if (header.length >= magic.length) {
                boolean match = true;
                for (int i = 0; i < magic.length; i++) {
                    if (header[i] != magic[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    // Para WebP, precisa verificar também "WEBP" nos bytes 8-11
                    if (magic[0] == 0x52 && magic[1] == 0x49 && magic[2] == 0x46 && magic[3] == 0x46) {
                        if (header.length >= 12) {
                            return header[8] == 0x57 && header[9] == 0x45 && header[10] == 0x42 && header[11] == 0x50;
                        }
                        return false;
                    }
                    return true;
                }
            }
        }
        return false;
    }
}
