const btnCamera  = document.getElementById("btn-camera");
const btnGaleria = document.getElementById("btn-galeria");
const video      = document.getElementById("video");
const canvas     = document.getElementById("canvas");
const btnTirar   = document.getElementById("btn-tirar");
const btnCancelar = document.getElementById("btn-cancelar-camera");
const previewImg = document.getElementById("preview-img");
const previewContainer = document.getElementById("preview-container");
const cameraContainer  = document.getElementById("camera-container");
const inputFoto  = document.getElementById("input-foto");
const fotoDefault = document.getElementById("foto-default");

let stream = null;

// Funcao para acessar o estado compartilhado (lazy - evita problema de ordem de carregamento)
function getState() {
    return window.denunciaState || (window.denunciaState = { fotoArquivo: null });
}

// Abre a camera
btnCamera.onclick = async () => {
    try {
        fotoDefault.style.display = "none";
        cameraContainer.style.display = "flex";

        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;

    } catch (err) {
        alert("Nao foi possivel acessar a camera. Verifique as permissoes.");
        fotoDefault.style.display = "block";
        cameraContainer.style.display = "none";
    }
};

// Cancela a camera
btnCancelar.onclick = () => {
    pararCamera();
    cameraContainer.style.display = "none";
    fotoDefault.style.display = "block";
};

// Tira a foto
btnTirar.onclick = () => {
    const ctx = canvas.getContext("2d");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // JPEG com qualidade 0.8 fica bem menor que PNG (limite do servidor: 5MB)
    canvas.toBlob(blob => {
        const state = getState();
        state.fotoArquivo = new File([blob], "foto.jpg", { type: "image/jpeg" });
        previewImg.src = URL.createObjectURL(blob);

        pararCamera();
        cameraContainer.style.display = "none";
        previewContainer.style.display = "flex";
    }, "image/jpeg", 0.8);
};

// Abre a galeria
btnGaleria.onclick = () => inputFoto.click();

inputFoto.onchange = () => {
    const file = inputFoto.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("A foto e maior que 5MB. Escolha uma menor.");
        inputFoto.value = "";
        return;
    }

    const state = getState();
    state.fotoArquivo = file;
    previewImg.src = URL.createObjectURL(file);
    fotoDefault.style.display = "none";
    previewContainer.style.display = "flex";
};

// Remove a foto
document.getElementById("btn-remover").onclick = () => {
    previewImg.src = "";
    inputFoto.value = "";
    const state = getState();
    state.fotoArquivo = null;
    previewContainer.style.display = "none";
    fotoDefault.style.display = "block";
};

// Para o stream da camera
function pararCamera() {
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
}