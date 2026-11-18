// Controle do tipo de residuo selecionado
let tipoSelecionado = "Reciclável";

document.querySelectorAll(".type-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tipoSelecionado = btn.dataset.tipo;
    };
});

// Inicializa estado compartilhado para a foto
window.denunciaState = window.denunciaState || { fotoArquivo: null };

// Submit do formulario
document.getElementById("form-denuncia").onsubmit = async (e) => {
    e.preventDefault();

    const botao = e.target.querySelector("button[type=submit]");
    botao.disabled = true;
    botao.textContent = "Enviando...";

    const formData = new FormData();
    formData.append("descricao", document.getElementById("descricao").value.trim());
    formData.append("tipoResiduo", tipoSelecionado);
    formData.append("localizacao", document.getElementById("localizacao").value.trim());
    formData.append("contato", document.getElementById("contato").value.trim());
    if (window.denunciaState.fotoArquivo) formData.append("foto", window.denunciaState.fotoArquivo);

    try {
        const response = await fetch(`${API_URL}/denuncia`, { method: "POST", body: formData });

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            let errorMsg = "Erro ao enviar";
            try {
                const errorJson = JSON.parse(errorText);
                errorMsg = errorJson.message || errorJson.error || errorMsg;
            } catch {
                errorMsg = errorText || errorMsg;
            }
            throw new Error(errorMsg);
        }

        window.location.href = "sucesso.html";

    } catch (error) {
        alert("Erro ao enviar denuncia: " + error.message);
        botao.disabled = false;
        botao.innerHTML = '<i class="ph ph-paper-plane-tilt"></i> ENVIAR DENUNCIA';
    }
};