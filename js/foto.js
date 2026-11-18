const btnCamera = document.getElementById("btn-camera");
const btnGaleria = document.getElementById("btn-galeria");
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const btnTirar = document.getElementById("btn-tirar");
const previewImg = document.getElementById("preview-img");
const previewContainer = document.getElementById("preview-container");
const inputFoto = document.getElementById("input-foto");

let stream;

// CAMERA WEB
btnCamera.onclick = async () => {
    document.getElementById("camera-container").style.display = "block";

    stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
    });

    video.srcObject = stream;
};

// TIRAR FOTO
btnTirar.onclick = () => {
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const img = canvas.toDataURL("image/png");

    previewImg.src = img;
    previewContainer.style.display = "block";

    stream.getTracks().forEach(t => t.stop());
    document.getElementById("camera-container").style.display = "none";
};

// GALERIA
btnGaleria.onclick = () => inputFoto.click();

inputFoto.onchange = () => {
    const file = inputFoto.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        previewImg.src = reader.result;
        previewContainer.style.display = "block";
    };

    reader.readAsDataURL(file);
};