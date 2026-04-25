const CACHE = "ecodenuncia-v1";

const ARQUIVOS = [
    "/denun.html",
    "/denuncia.html",
    "/pontos.html",
    "/detalhes.html",
    "/sucesso.html",
    "/css/geral.css",
    "/css/home.css",
    "/css/ponto.css",
    "/css/denuncia.css",
    "/css/detalhes.css",
    "/script/home.js",
    "/script/ponto.js",
    "/script/foto.js",
    "/script/denuncia.js",
    "/script/detalhes.js"
];

// Instala e faz cache dos arquivos
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ARQUIVOS))
    );
});

// Serve do cache quando offline
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(resposta => {
            return resposta || fetch(e.request);
        })
    );
});