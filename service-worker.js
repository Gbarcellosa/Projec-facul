// Mude a versao a cada deploy para forcar atualizacao do cache
const CACHE_STATIC = "ecodenuncia-static-v4";
const CACHE_DYNAMIC = "ecodenuncia-dynamic-v4";

const ARQUIVOS_ESTATICOS = [
    "./denun.html",
    "./denuncia.html",
    "./pontos.html",
    "./sucesso.html",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./css/geral.css",
    "./css/home.css",
    "./css/ponto.css",
    "./css/denuncia.css",
    "./script/config.js",
    "./script/home.js",
    "./script/ponto.js",
    "./script/foto.js",
    "./script/denuncia.js"
];

// Instala: cacheia arquivos estaticos
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_STATIC).then(cache => cache.addAll(ARQUIVOS_ESTATICOS))
    );
    self.skipWaiting();
});

// Ativa: remove caches antigos
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys()
            .then(chaves => Promise.all(
                chaves.filter(c => c !== CACHE_STATIC && c !== CACHE_DYNAMIC)
                      .map(c => caches.delete(c))
            ))
            .then(() => self.clients.claim())
    );
});

// Fetch: estrategia cache-first para estaticos, network-first para API
self.addEventListener("fetch", e => {
    const url = new URL(e.request.url);

    // So processa GET do mesmo origem
    if (e.request.method !== "GET" || url.origin !== self.location.origin) return;

    // API - network-first (sempre tenta buscar versao nova)
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/denuncia")) {
        e.respondWith(networkFirstThenCache(e.request, CACHE_DYNAMIC));
        return;
    }

    // Arquivos estaticos - cache-first (rapido, funciona offline)
    e.respondWith(cacheFirstThenNetwork(e.request, CACHE_STATIC));
});

// Cache-first: tenta cache, se falha vai na rede e atualiza cache
async function cacheFirstThenNetwork(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
        // Atualiza em background (stale-while-revalidate)
        fetch(request).then(resp => {
            if (resp.ok) cache.put(request, resp.clone());
        }).catch(() => {});
        return cached;
    }

    try {
        const resp = await fetch(request);
        if (resp.ok) cache.put(request, resp.clone());
        return resp;
    } catch {
        // Fallback para pagina offline se for navegacao
        if (request.mode === "navigate") {
            return cache.match("./denun.html");
        }
        throw new Error("Offline e sem cache");
    }
}

// Network-first: tenta rede, se falha usa cache (inclui HTTP errors como 5xx, 404)
async function networkFirstThenCache(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const resp = await fetch(request);
        // Cacheia apenas respostas de sucesso (2xx)
        if (resp.ok) {
            cache.put(request, resp.clone());
        }
        // Se resposta não-ok (4xx, 5xx), tenta servir cache stale
        if (!resp.ok) {
            const cached = await cache.match(request);
            if (cached) return cached;
        }
        return resp;
    } catch {
        // Falha de rede: tenta cache
        const cached = await cache.match(request);
        if (cached) return cached;
        throw new Error("Offline e sem cache");
    }
}