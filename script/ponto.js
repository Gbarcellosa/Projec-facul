// script/ponto.js

const PONTOS_FIXOS = [
    {
        id: 1,
        nome: "Eco Ponto Central",
        endereco: "Rua das Flores, 100",
        cep: "01310-000",
        tiposAceitos: "Reciclável, Eletrônico, Óleo",
        horarioFuncionamento: "Seg-Sex 8h-17h"
    },
    {
        id: 2,
        nome: "Eco Ponto Norte",
        endereco: "Av. Principal, 500",
        cep: "02001-000",
        tiposAceitos: "Reciclável, Entulho",
        horarioFuncionamento: "Seg-Sab 7h-16h"
    },
    {
        id: 3,
        nome: "Ponto Verde Sul",
        endereco: "Rua do Parque, 200",
        cep: "04001-000",
        tiposAceitos: "Reciclável, Vidro, Papel",
        horarioFuncionamento: "Todos os dias 6h-20h"
    }
];

const COR_PINS = ["verde", "azul", "laranja"];

const POSICOES_PINS = [
    { top: "35%", left: "30%" },
    { top: "50%", left: "65%" },
    { top: "20%", left: "70%" }
];

// --------------------------
// INICIALIZA
// --------------------------
function carregarPontos() {
    renderizarPontos(PONTOS_FIXOS, "Pontos disponíveis");
    renderizarPins(PONTOS_FIXOS);
}

// --------------------------
// BUSCA POR CEP
// --------------------------
function buscarPorCep() {
    const cep = document.getElementById("cepInput").value.trim();

    if (!cep || cep.length < 5) {
        alert("Digite um CEP válido (mínimo 5 dígitos)");
        return;
    }

    const prefixo = cep.replace("-", "").substring(0, 5);
    const resultado = PONTOS_FIXOS.filter(p =>
        p.cep.replace("-", "").startsWith(prefixo)
    );

    if (resultado.length === 0) {
        mostrarErro("Nenhum ponto encontrado para esse CEP.");
        setTimeout(() => carregarPontos(), 2000);
        return;
    }

    renderizarPontos(resultado, `Resultado para CEP ${cep}`);
    renderizarPins(resultado);
}

// --------------------------
// RENDERIZA LISTA
// --------------------------
function renderizarPontos(pontos, titulo) {
    const lista = document.getElementById("pointsList");

    const itens = pontos.map((ponto, index) => {
        const cor = COR_PINS[index % COR_PINS.length];
        const icone = escolherIcone(ponto.tiposAceitos);
        const cssIcone = cor === "verde" ? "green" : cor === "azul" ? "blue" : "orange";
        const badgeClass = cor === "verde" ? "badge-green" : cor === "azul" ? "badge-blue" : "badge-orange";

        return `
            <div class="point-item card" onclick="irParaDetalhes(${ponto.id})">
                <div class="point-icon ${cssIcone}">
                    <i class="ph ${icone}"></i>
                </div>
                <div class="point-info">
                    <strong>${ponto.nome}</strong>
                    <span>${ponto.endereco} · ${ponto.horarioFuncionamento}</span>
                    <span class="point-badge ${badgeClass}">${ponto.tiposAceitos}</span>
                </div>
                <i class="ph ph-caret-right" style="color:#d1d5db; font-size:18px;"></i>
            </div>
        `;
    }).join("");

    lista.innerHTML = `<div class="section-title">${titulo}</div>${itens}`;
}

// --------------------------
// RENDERIZA PINS NO MAPA
// --------------------------
function renderizarPins(pontos) {
    const mapPins = document.getElementById("map-pins");

    const pins = pontos.slice(0, 3).map((ponto, index) => {
        const pos = POSICOES_PINS[index];
        const cor = COR_PINS[index % COR_PINS.length];

        return `
            <div class="map-pin ${cor}"
                 style="top:${pos.top}; left:${pos.left};"
                 title="${ponto.nome}"
                 onclick="irParaDetalhes(${ponto.id})">
                <i class="ph ph-map-pin-fill"></i>
            </div>
        `;
    }).join("");

    mapPins.innerHTML = pins;
}

// --------------------------
// NAVEGA PARA DETALHES
// --------------------------
function irParaDetalhes(id) {
    const ponto = PONTOS_FIXOS.find(p => p.id === id);
    localStorage.setItem("pontoSelecionado", JSON.stringify(ponto));
    window.location.href = "detalhes.html";
}

// --------------------------
// AUXILIARES
// --------------------------
function escolherIcone(tipos) {
    if (!tipos) return "ph-recycle";
    const t = tipos.toLowerCase();
    if (t.includes("eletr")) return "ph-cpu";
    if (t.includes("entulho")) return "ph-building";
    if (t.includes("leo")) return "ph-drop";
    return "ph-recycle";
}

function mostrarErro(mensagem) {
    document.getElementById("pointsList").innerHTML = `
        <div class="error-state">
            <i class="ph ph-warning-circle" style="font-size:24px;display:block;margin-bottom:8px;"></i>
            ${mensagem}
        </div>
    `;
}

// --------------------------
// RODA AO ABRIR A PÁGINA
// --------------------------
carregarPontos();