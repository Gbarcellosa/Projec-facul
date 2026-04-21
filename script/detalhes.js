// Pega o ponto salvo pelo pontos.html
const ponto = JSON.parse(localStorage.getItem("pontoSelecionado"));

function verificarAberto(horario) {
    // Simplificado — verifica se tem "Todos os dias" ou dia da semana atual
    const agora = new Date();
    const dia = agora.getDay(); // 0=Dom, 1=Seg... 6=Sab
    const hora = agora.getHours();

    if (!horario) return false;
    if (horario.toLowerCase().includes("todos")) return hora >= 6 && hora < 20;
    if (horario.toLowerCase().includes("seg-sex")) return dia >= 1 && dia <= 5 && hora >= 8 && hora < 17;
    if (horario.toLowerCase().includes("seg-sab")) return dia >= 1 && dia <= 6 && hora >= 7 && hora < 16;
    return true;
}

function escolherIcone(tipos) {
    if (!tipos) return "ph-recycle";
    const t = tipos.toLowerCase();
    if (t.includes("eletr")) return "ph-cpu";
    if (t.includes("entulho")) return "ph-building";
    if (t.includes("leo")) return "ph-drop";
    return "ph-recycle";
}

function gerarBadges(tipos) {
    if (!tipos) return "";
    const cores = ["badge-green", "badge-blue", "badge-orange", "badge-purple"];
    return tipos.split(",").map((tipo, i) =>
        `<span class="badge ${cores[i % cores.length]}">${tipo.trim()}</span>`
    ).join("");
}

function abrirMaps(endereco) {
    const query = encodeURIComponent(endereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
}

function renderizarDetalhes(ponto) {
    const aberto = verificarAberto(ponto.horarioFuncionamento);
    const icone = escolherIcone(ponto.tiposAceitos);

    document.getElementById("conteudo").innerHTML = `
        <div class="hero-card">
            <div class="hero-icon">
                <i class="ph ${icone}" style="font-size:26px; color:#16a34a;"></i>
            </div>
            <h2>${ponto.nome}</h2>
            <div class="status-row">
                <div class="status-dot" style="background:${aberto ? '#22c55e' : '#ef4444'}"></div>
                <span class="status-text" style="color:${aberto ? '#16a34a' : '#ef4444'}">
                    ${aberto ? "Aberto agora" : "Fechado agora"}
                </span>
            </div>
            <span class="tipo-badge">Ponto de Coleta Oficial</span>
        </div>

        <div class="info-card">
            <div class="info-row">
                <div class="info-icon"><i class="ph ph-map-pin"></i></div>
                <div class="info-text">
                    <div class="label">Endereço</div>
                    <div class="value">${ponto.endereco}</div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="info-row">
                <div class="info-icon"><i class="ph ph-clock"></i></div>
                <div class="info-text">
                    <div class="label">Horário de funcionamento</div>
                    <div class="value">${ponto.horarioFuncionamento}</div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="info-row">
                <div class="info-icon"><i class="ph ph-envelope"></i></div>
                <div class="info-text">
                    <div class="label">CEP</div>
                    <div class="value">${ponto.cep}</div>
                </div>
            </div>
        </div>

        <div class="residuos-card">
            <div class="card-title">Resíduos aceitos</div>
            <div class="badges">${gerarBadges(ponto.tiposAceitos)}</div>
        </div>

        <button class="btn-maps" onclick="abrirMaps('${ponto.endereco}')">
            <i class="ph ph-map-trifold"></i> Abrir no Maps
        </button>
    `;
}

// Roda ao abrir a página
if (ponto) {
    renderizarDetalhes(ponto);
} else {
    document.getElementById("conteudo").innerHTML = `
        <div class="error-state">
            <i class="ph ph-warning-circle" style="font-size:24px; display:block; margin-bottom:8px;"></i>
            Nenhum ponto selecionado. <br>
            <a href="pontos.html" style="color:#16a34a; font-weight:600;">Voltar para a lista</a>
        </div>
    `;
}