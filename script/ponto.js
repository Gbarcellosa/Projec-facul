async function buscarPorCep() {
    const cep = document.getElementById("cepInput").value.trim().replace("-", "");

    if (!cep || cep.length < 8) {
        alert("Digite um CEP válido com 8 dígitos");
        return;
    }

    mostrarCarregando("Buscando endereço...");

    try {
        // 1. CEP → endereço via ViaCEP
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (data.erro) {
            mostrarErro("CEP não encontrado. Tente outro.");
            return;
        }

        renderizarResultado(data);

    } catch (error) {
        mostrarErro("Erro ao buscar. Verifique sua conexão.");
    }
}

function renderizarResultado(data) {
    const lista = document.getElementById("pointsList");
    const cidade = `${data.localidade} - ${data.uf}`;
    const endereco = `${data.logradouro || data.localidade}, ${data.localidade}, ${data.uf}`;

    // Links pro Maps com buscas diferentes
    const linkReciclagem  = `https://www.google.com/maps/search/${encodeURIComponent("ponto de reciclagem perto de " + endereco)}`;
    const linkEcoponto    = `https://www.google.com/maps/search/${encodeURIComponent("ecoponto perto de " + endereco)}`;
    const linkDescarte    = `https://www.google.com/maps/search/${encodeURIComponent("descarte de lixo perto de " + endereco)}`;
    const linkMais        = `https://www.google.com/maps/search/${encodeURIComponent("coleta seletiva perto de " + endereco)}`;

    lista.innerHTML = `
        <div class="endereco-card">
            <i class="ph ph-map-pin" style="color:#16a34a; font-size:20px; flex-shrink:0;"></i>
            <div>
                <strong>${cidade}</strong>
                <span>${data.logradouro || ""} ${data.bairro ? "— " + data.bairro : ""}</span>
            </div>
        </div>

        <div class="section-title">Pontos próximos a ${cidade}</div>

        <a href="${linkReciclagem}" target="_blank" class="point-item">
            <div class="point-icon green">
                <i class="ph ph-recycle"></i>
            </div>
            <div class="point-info">
                <strong>Pontos de Reciclagem</strong>
                <span>Plástico, Papel, Metal, Vidro</span>
                <span class="point-badge badge-green">Reciclável</span>
            </div>
            <i class="ph ph-arrow-square-out" style="color:#d1d5db; font-size:16px;"></i>
        </a>

        <a href="${linkEcoponto}" target="_blank" class="point-item">
            <div class="point-icon blue">
                <i class="ph ph-buildings"></i>
            </div>
            <div class="point-info">
                <strong>Ecopontos</strong>
                <span>Entulho, Móveis, Eletrônicos</span>
                <span class="point-badge badge-blue">Ecoponto</span>
            </div>
            <i class="ph ph-arrow-square-out" style="color:#d1d5db; font-size:16px;"></i>
        </a>

        <a href="${linkDescarte}" target="_blank" class="point-item">
            <div class="point-icon orange">
                <i class="ph ph-trash"></i>
            </div>
            <div class="point-info">
                <strong>Locais de Descarte</strong>
                <span>Lixo comum e especial</span>
                <span class="point-badge badge-orange">Descarte</span>
            </div>
            <i class="ph ph-arrow-square-out" style="color:#d1d5db; font-size:16px;"></i>
        </a>

        <a href="${linkMais}" target="_blank" class="btn-mais-pontos">
            <i class="ph ph-map-trifold"></i> Ver mais pontos no Maps
        </a>
    `;
}

function mostrarCarregando(msg) {
    document.getElementById("pointsList").innerHTML = `
        <div class="loading-state">${msg}</div>
    `;
}

function mostrarErro(msg) {
    document.getElementById("pointsList").innerHTML = `
        <div class="error-state">
            <i class="ph ph-warning-circle" style="font-size:24px; display:block; margin-bottom:8px;"></i>
            ${msg}
        </div>
    `;
}