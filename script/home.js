// Cores por tipo de residuo
const CORES_TIPO = {
    "Reciclavel": { classe: "green",  icone: "ph-recycle" },
    "Comum":      { classe: "red",    icone: "ph-trash" },
    "Entulho":    { classe: "orange", icone: "ph-building" },
};

// Calcula tempo relativo (ex: "ha 2h", "ontem")
function tempoRelativo(dataStr) {
    const agora = new Date();
    const data  = new Date(dataStr);
    const diff  = Math.floor((agora - data) / 1000 / 60); // em minutos

    if (diff < 1)    return "agora";
    if (diff < 60)   return `ha ${diff}min`;
    if (diff < 1440) return `ha ${Math.floor(diff / 60)}h`;
    const dias = Math.floor(diff / 1440);
    return dias === 1 ? "ontem" : `ha ${dias} dias`;
}

// Renderiza o feed
function renderizarFeed(denuncias) {
    const feed = document.getElementById("feed");

    if (denuncias.length === 0) {
        feed.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-smiley" style="font-size:28px; display:block; margin-bottom:8px;"></i>
                Nenhuma denuncia ainda.<br>Seja o primeiro a reportar!
            </div>
        `;
        return;
    }

    // A API ja devolve da mais recente para a mais antiga
    const recentes = denuncias.slice(0, 5);

    feed.innerHTML = recentes.map(d => {
        const cor    = CORES_TIPO[d.tipoResiduo] || CORES_TIPO["Comum"];
        const status = d.status || "PENDENTE";
        const badgeClass = status === "RESOLVIDA" ? "badge-resolvida"
                         : status === "EM_ANALISE" ? "badge-analise"
                         : "badge-pendente";
        const badgeLabel = status === "RESOLVIDA" ? "Resolvida"
                         : status === "EM_ANALISE" ? "Em analise"
                         : "Pendente";

        return `
            <div class="card">
                <div class="icon-circle ${cor.classe}">
                    <i class="ph ${cor.icone}"></i>
                </div>
                <div class="card-info">
                    <strong>${escapar(d.localizacao)}</strong>
                    <span>${escapar((d.descricao || "").substring(0, 40))}${(d.descricao || "").length > 40 ? "..." : ""}</span>
                    <span class="badge-status ${badgeClass}">${badgeLabel}</span>
                </div>
                <div class="card-tempo">${tempoRelativo(d.dataHora)}</div>
            </div>
        `;
    }).join("");
}

// Atualiza os numeros de estatistica
function atualizarStats(denuncias) {
    document.getElementById("total-denuncias").textContent = denuncias.length;
    const resolvidas = denuncias.filter(d => d.status === "RESOLVIDA").length;
    document.getElementById("total-resolvidas").textContent = resolvidas;
}

async function init() {
    try {
        const denuncias = await apiFetch('/denuncia');
        renderizarFeed(denuncias);
        atualizarStats(denuncias);
    } catch (error) {
        document.getElementById("feed").innerHTML = `
            <div class="empty-state">
                Nao foi possivel carregar as denuncias.<br>Verifique sua conexao.
            </div>
        `;
        console.error("Erro ao carregar denuncias:", error);
    }
}

init();