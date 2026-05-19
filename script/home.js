// Cores por tipo de resíduo
const CORES_TIPO = {
    "Reciclável": { classe: "green",  icone: "ph-recycle" },
    "Comum":      { classe: "red",    icone: "ph-trash" },
    "Entulho":    { classe: "orange", icone: "ph-building" },
};

// Calcula tempo relativo (ex: "há 2h", "ontem")
function tempoRelativo(dataStr) {
    const agora = new Date();
    const data  = new Date(dataStr);
    const diff  = Math.floor((agora - data) / 1000 / 60); // em minutos

    if (diff < 1)   return "agora";
    if (diff < 60)  return `há ${diff}min`;
    if (diff < 1440) return `há ${Math.floor(diff / 60)}h`;
    return "ontem";
}

// Renderiza o feed
function renderizarFeed(denuncias) {
    const feed = document.getElementById("feed");

    if (denuncias.length === 0) {
        feed.innerHTML = `
            <div class="empty-state">
                <i class="ph ph-smiley" style="font-size:28px; display:block; margin-bottom:8px;"></i>
                Nenhuma denúncia ainda.<br>Seja o primeiro a reportar!
            </div>
        `;
        return;
    }

    // Mostra as 5 mais recentes (última enviada aparece primeiro)
    const recentes = [...denuncias].reverse().slice(0, 5);

    feed.innerHTML = recentes.map(d => {
        const cor    = CORES_TIPO[d.tipoResiduo] || CORES_TIPO["Comum"];
        const status = d.status || "PENDENTE";
        const badgeClass = status === "RESOLVIDA" ? "badge-resolvida"
                         : status === "EM_ANALISE" ? "badge-analise"
                         : "badge-pendente";
        const badgeLabel = status === "RESOLVIDA" ? "Resolvida"
                         : status === "EM_ANALISE" ? "Em análise"
                         : "Pendente";

        return `
            <div class="card">
                <div class="icon-circle ${cor.classe}">
                    <i class="ph ${cor.icone}"></i>
                </div>
                <div class="card-info">
                    <strong>${d.localizacao}</strong>
                    <span>${d.descricao?.substring(0, 40)}${d.descricao?.length > 40 ? "..." : ""}</span>
                    <span class="badge-status ${badgeClass}">${badgeLabel}</span>
                </div>
                <div class="card-tempo">${tempoRelativo(d.dataHora)}</div>
            </div>
        `;
    }).join("");
}

// Atualiza os números de estatística
function atualizarStats(denuncias) {
    document.getElementById("total-denuncias").textContent = denuncias.length;
    const resolvidas = denuncias.filter(d => d.status === "RESOLVIDA").length;
    document.getElementById("total-resolvidas").textContent = resolvidas;
}

async function init() {
    try {
       const response = await fetch("https://projec-facul-production.up.railway.app/denuncia");
        const denuncias = await response.json();
        renderizarFeed(denuncias);
        atualizarStats(denuncias);
    } catch (error) {
        // Se o backend não tiver rodando, usa o localStorage
        const denuncias = JSON.parse(localStorage.getItem("denuncias") || "[]");
        renderizarFeed(denuncias);
        atualizarStats(denuncias);
    }
}

init();