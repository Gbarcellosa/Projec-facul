# Política de Segurança - EcoDenúncia

## Versões Suportadas

| Versão | Suportada |
|--------|-----------|
| 0.0.x  | ✅ Sim    |

> **Nota**: Este projeto está em desenvolvimento ativo (versão 0.x). Breaking changes podem ocorrer.

## Reportando Vulnerabilidades

**NÃO abra issues públicas para vulnerabilidades de segurança.**

Envie um relatório privado para: **security@ecodenuncia.example** (ou use [GitHub Security Advisories](https://github.com/usuario/EcoDenuncia/security/advisories/new))

### O que incluir no relatório:

1. **Descrição clara** da vulnerabilidade
2. **Passos para reproduzir** (PoC se possível)
3. **Impacto potencial** (ex: RCE, XSS, SQLi, vazamento de dados)
4. **Versão/commit** afetado
5. **Sugestão de correção** (se tiver)

### Tempo de resposta esperado:

| Severidade | Resposta Inicial | Correção |
|------------|------------------|----------|
| Crítica (RCE, auth bypass) | 24h | 72h |
| Alta (SQLi, XSS stored) | 48h | 1 semana |
| Média (XSS reflected, info disclosure) | 1 semana | 2 semanas |
| Baixa (headers, config) | 2 semanas | Próximo release |

## Boas Práticas de Segurança no Projeto

### Backend (Spring Boot)
- ✅ Validação de entrada (Bean Validation + custom no Service)
- ✅ GlobalExceptionHandler sem vazamento de stack traces
- ✅ CORS restritivo (não permite `*` com credenciais)
- ✅ Upload: validação magic bytes + content-type + tamanho (5MB)
- ✅ Senhas/segredos via variáveis de ambiente (não no código)
- ✅ `ddl-auto=validate` em produção
- ✅ Actuator health check sem detalhes sensíveis

### Frontend (PWA)
- ✅ Sanitização XSS (`escapar()` + `sanitizarUrl()`)
- ✅ CSP via meta tags (adicionar em produção)
- ✅ Service Worker com cache seguro
- ✅ HTTPS obrigatório em produção

### Infraestrutura
- ✅ Docker multi-stage build (imagem final mínima)
- ✅ Non-root user no container (adicionar no Dockerfile)
- ✅ Resource limits no docker-compose
- ✅ Health checks (Spring Actuator + PostgreSQL)
- ⚠️ **Pendente**: Rate limiting, WAF, logs estruturados

## Checklist para Contributors

Antes de abrir PR, verifique:

- [ ] Testes passam (`./mvnw test`)
- [ ] Sem secrets no código (use `.env` local, secrets no CI)
- [ ] Dependências atualizadas (Dependabot PRs)
- [ ] Docker build funciona (`docker build .`)
- [ ] Variáveis de ambiente documentadas no `.env.example`

## Divulgação Responsável

Seguimos [Coordinated Vulnerability Disclosure](https://en.wikipedia.org/wiki/Coordinated_vulnerability_disclosure):

1. Reportamos privadamente
2. Confirmamos e corrigimos
3. Lançamos patch (nova versão/tag)
4. Divulgamos publicamente após tempo razoável para usuários atualizarem

## Contato

- **Security email**: security@ecodenuncia.example
- **GitHub Security**: [Advisories](https://github.com/usuario/EcoDenuncia/security/advisories)
- **Maintainer**: @Gabriel

---

*Obrigado por ajudar a manter o EcoDenúncia seguro! 🔒*