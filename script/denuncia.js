// Controle do tipo de resíduo selecionado
let tipoSelecionado = "Reciclável";

document.querySelectorAll(".type-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        tipoSelecionado = btn.dataset.tipo;
    };
});

// Submit do formulário
document.getElementById("form-denuncia").onsubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("descricao", document.getElementById("descricao").value);
    formData.append("tipoResiduo", tipoSelecionado);
    formData.append("localizacao", document.getElementById("localizacao").value);
    formData.append("contato", document.getElementById("contato").value);

    try {
       const response = await fetch("https://projec-facul-production.up.railway.app/denuncia", {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Erro ao enviar");

        const denuncia = await response.json();
        console.log("Denúncia criada:", denuncia);
        window.location.href = "sucesso.html";

    } catch (error) {
        alert("Erro ao enviar denúncia. Verifique se o servidor está rodando.");
    }
};