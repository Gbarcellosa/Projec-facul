// URL da API - detecta ambiente automaticamente
// Em producao usa Railway, em desenvolvimento usa localhost
const API_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
        return 'http://localhost:8080';
    }
    return 'https://projec-facul-production.up.railway.app';
})();

// Escapa texto vindo do usuario antes de colocar em innerHTML (evita XSS)
// Escapa: & < > " ' / (barra evita quebra de atributo sem aspas)
function escapar(texto) {
    return String(texto ?? "").replace(/[&<>"'\/]/g, c => ({
        "&": "&", "<": "<", ">": ">", '"': """, "'": "'", "/": "&#x2F;"
    }[c]));
}

// Sanitiza URL para uso seguro em href/src — permite apenas http/https, bloqueia javascript: data: etc.
function sanitizarUrl(url) {
    try {
        const u = new URL(url, window.location.origin);
        if (u.protocol !== "http:" && u.protocol !== "https:") return "";
        return u.toString();
    } catch {
        return "";
    }
}

// Utilitario para fazer fetch com tratamento de erros padronizado
async function apiFetch(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Accept': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        let errorMsg = `Erro ${response.status}`;
        try {
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorJson.error || errorMsg;
        } catch {
            errorMsg = errorText || errorMsg;
        }
        throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.blob();
}