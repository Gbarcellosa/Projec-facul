# EcoDenúncia

PWA para denunciar descarte irregular de lixo + API Spring Boot.

## Estrutura

- **Raiz**: front-end (`*.html`, `css/`, `script/`, `icons/`, `manifest.json`, `service-worker.js`)
- **`src/`**: back-end Spring Boot (Java 17, JPA + PostgreSQL)

## Variáveis de ambiente do back-end (Railway → Variables)

| Variável | Exemplo | Descrição |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://HOST:5432/postgres` | URL de conexão JDBC |
| `DB_USER` | `postgres` | Usuário do banco |
| `DB_PASSWORD` | `sua_senha` | Senha do banco |
| `CORS_ORIGINS` | `https://seuapp.com` | Origens CORS permitidas (separadas por vírgula, padrão `*`) |
| `PORT` | `8080` | Porta do servidor |

## Execução Local

### Opção 1: Docker Compose (recomendado)
```bash
docker-compose up --build
```
A API estará em `http://localhost:8080` e o PostgreSQL na porta 5432.

### Opção 2: Maven direto (requer PostgreSQL rodando)
```bash
cp .env.example .env
# Edite .env com suas credenciais
DB_URL=jdbc:postgresql://localhost:5432/ecodenuncia DB_USER=postgres DB_PASSWORD=postgres ./mvnw spring-boot:run
```

### Opção 3: H2 em memória (apenas testes)
```bash
./mvnw test
```

## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/denuncia` | Cria nova denúncia (multipart: descricao, tipoResiduo, localizacao, contato?, foto?) |
| `GET` | `/denuncia` | Lista últimas 50 denúncias (mais recentes primeiro) |
| `GET` | `/denuncia/{id}` | Busca denúncia por ID |
| `GET` | `/denuncia/{id}/foto` | Busca foto da denúncia |
| `GET` | `/actuator/health` | Health check |

## Front-end

A URL da API é detectada automaticamente:
- `localhost` / `127.0.0.1` → `http://localhost:8080`
- Qualquer outro host → `https://projec-facul-production.up.railway.app`

Para testar localmente, abra os arquivos HTML diretamente no navegador ou use um servidor estático:
```bash
npx serve .
# ou
python -m http.server 8000
```

## PWA / Service Worker

O service worker usa estratégia:
- **Cache-first** para arquivos estáticos (HTML, CSS, JS, imagens) - funciona offline
- **Network-first** para chamadas de API - sempre busca dados atualizados

Para forçar atualização, incremente a versão em `service-worker.js`:
```js
const CACHE_STATIC = "ecodenuncia-static-v4"; // mude v3 para v4
```

## Testes

```bash
# Todos os testes
./mvnw test

# Apenas testes de serviço
./mvnw test -Dtest=DenunciaServiceTest

# Apenas testes de controller
./mvnw test -Dtest=DenunciaControllerTest
```

## Tecnologias

### Backend
- Spring Boot 3.3.x
- Java 17
- Spring Data JPA + Hibernate
- PostgreSQL (produção) / H2 (testes)
- Bean Validation (Jakarta)
- Lombok
- Spring Boot Actuator

### Frontend
- Vanilla JS (ES6+)
- CSS moderno (Grid, Flexbox, Custom Properties)
- Service Worker (Workbox-style manual)
- Phosphor Icons
- PWA ready (manifest, service worker, meta tags)

## Melhorias Implementadas

### Correções de Bugs
- ✅ Conflito de merge resolvido em `css/geral.css`
- ✅ Spring Boot 4.x → 3.3.x (compatível com Java 17)
- ✅ Relacionamento `@OneToOne` bidirecional correto entre `Denuncia` e `FotoDenuncia`
- ✅ Validação Bean Validation nas entidades
- ✅ Tratamento global de exceções com respostas JSON padronizadas
- ✅ Variável global `window.fotoArquivo` → estado encapsulado

### Segurança
- ✅ Validação de entrada no backend (tamanho, tipo, conteúdo)
- ✅ Sanitização XSS no frontend (`escapar()`)
- ✅ CORS configurado com credenciais apenas quando não é `*`
- ✅ Limite de upload de 5MB aplicado no backend e frontend
- ✅ Validação de Content-Type de imagem

### Arquitetura
- ✅ GlobalExceptionHandler centralizado
- ✅ apiFetch utilitário com tratamento de erros padronizado
- ✅ Detecção automática de ambiente (local vs produção)
- ✅ Service Worker com estratégias de cache apropriadas
- ✅ Testes de integração (Service + Controller)

### UX/UI
- ✅ CSS totalmente responsivo (mobile-first, breakpoints 480px/768px)
- ✅ Suporte a dark mode via `prefers-color-scheme`
- ✅ Feedback visual em botões (hover, active, disabled)
- ✅ Estados de loading/error/empty padronizados
- ✅ Scroll suave com `-webkit-overflow-scrolling: touch`

### DevOps
- ✅ Dockerfile multi-stage
- ✅ docker-compose para desenvolvimento local
- ✅ .env.example para documentação de variáveis
- ✅ Health checks no Actuator e Docker
- ✅ Maven wrapper incluído

## Próximos Passos Sugeridos

1. **Autenticação/Autorização**: JWT ou OAuth2 para proteger endpoints
2. **Paginação**: Cursor-based pagination no `/denuncia`
3. **Geolocalização**: Captura de lat/lng no frontend + PostGIS no backend
4. **Notificações**: Web Push para atualizações de status
5. **Admin Panel**: Interface para gerenciar denúncias (aprovar, rejeitar, resolver)
6. **Métricas**: Prometheus + Grafana via Micrometer
7. **CI/CD**: GitHub Actions para build, test, deploy
8. **Rate Limiting**: Bucket4j ou Spring Cloud Gateway
9. **Logs Estruturados**: Logstash/ELK ou Loki
10. **Testes E2E**: Playwright ou Cypress

## Licença

MIT