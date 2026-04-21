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

// Abre a câmera
btnCamera.onclick = async () => {
    try {
        fotoDefault.style.display = "none";
        cameraContainer.style.display = "flex";

        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        });
        video.srcObject = stream;

    } catch (err) {
        alert("Não foi possível acessar a câmera. Verifique as permissões.");
        fotoDefault.style.display = "block";
        cameraContainer.style.display = "none";
    }
};

// Cancela a câmera
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

    const img = canvas.toDataURL("image/png");
    previewImg.src = img;

    pararCamera();
    cameraContainer.style.display = "none";
    previewContainer.style.display = "flex";
};

// Abre a galeria
btnGaleria.onclick = () => inputFoto.click();

inputFoto.onchange = () => {
    const file = inputFoto.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        previewImg.src = reader.result;
        fotoDefault.style.display = "none";
        previewContainer.style.display = "flex";
    };
    reader.readAsDataURL(file);
};

// Remove a foto
document.getElementById("btn-remover").onclick = () => {
    previewImg.src = "";
    inputFoto.value = "";
    previewContainer.style.display = "none";
    fotoDefault.style.display = "block";
};

// Para o stream da câmera
function pararCamera() {
    if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
    }
}