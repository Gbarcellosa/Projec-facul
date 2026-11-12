# EcoDenúncia

## Visão geral

O EcoDenúncia é uma aplicação desenvolvida para registrar denúncias relacionadas a resíduos urbanos e problemas ambientais em pontos específicos da cidade. A proposta principal é facilitar a coleta de informações sobre descarte inadequado, entulho, resíduos recicláveis e locais que demandam atenção por parte da administração pública ou de serviços de coleta.

## Problema resolvido

A ideia do projeto é transformar uma ocorrência simples em uma denúncia estruturada, com localização, descrição e tipo do resíduo. Isso ajuda a organizar a informação e permitir que o dado seja encaminhado, consultado e revisado com mais clareza.

## Objetivo da aplicação

- registrar denúncias com foto, localização e descrição;
- diferenciar tipos de resíduos;
- permitir envio do formulário para o backend;
- manter um histórico de ocorrências no banco de dados;
- oferecer uma experiência mobile com uso de PWA.

## Funcionalidades verificadas

A partir dos arquivos do projeto, foi possível confirmar que a aplicação possui:

- formulário de denúncia com campos de localização, descrição, tipo de resíduo e contato;
- upload de foto via câmera ou galeria;
- seleção de tipo de material (Reciclável, Comum e Entulho);
- envio de dados para a API via `fetch` em JavaScript;
- navegação entre páginas e fluxo de sucesso/erro;
- suporte a PWA com `manifest.json` e `service-worker.js`;
- backend em Spring Boot responsável por receber e persistir denúncias.

## Tecnologias utilizadas

### Front-end
- HTML
- CSS
- JavaScript
- PWA (manifest + service worker)

### Back-end
- Java
- Spring Boot
- Spring MVC
- PostgreSQL

### Build e execução
- Maven
- Maven Wrapper

## Arquitetura

O projeto possui uma separação simples entre frontend e backend:

- `denuncia.html` e `script/*.js` fazem a interface de coleta de dados;
- `script/denuncia.js` envia os dados para o endpoint `/denuncia`;
- `src/main/java/.../controller` recebe as requisições HTTP;
- `service` realiza a lógica de negócio;
- `repository` e a camada de persistência acoplam a base de dados;
- `application.properties` configura a conexão com o banco de dados.

Essa estrutura é adequada para um MVP funcional, com arquitetura em camadas e boa clareza didática.

## Estrutura de pastas

```text
Projec-facul/
├── denuncia.html
├── denun.html
├── detalhes.html
├── sucesso.html
├── index.html (se presente no app)
├── css/
├── js/
├── script/
├── src/
│   └── main/
│       ├── java/
│       └── resources/
├── docs/
│   ├── ARCHITECTURE.md
│   └── SETUP.md
├── pom.xml
├── mvnw
├── .gitignore
├── manifest.json
├── service-worker.js
└── README.md
```

## Configuração do ambiente

Antes de executar a aplicação, é necessário:

- Java 17+
- Maven ou Maven Wrapper
- PostgreSQL configurado e acessível
- variável de ambiente ou configuração local do banco de dados

Importante: credenciais reais não devem ser adicionadas ao repositório público. O projeto já expõe valores reais em `application.properties`, o que deve ser corrigido antes de qualquer publicação definitiva.

## Instalação e execução

### Backend

```bash
./mvnw clean install
./mvnw spring-boot:run
```

A aplicação geralmente será disponibilizada em `http://localhost:8080` ou na porta definida pelo ambiente.

### Front-end

Abra os arquivos HTML no navegador ou sirva o projeto em um servidor web estático para testar a experiência do usuário.

## Demonstração

O repositório contém um fluxo funcional de denúncia com formulário e área de interação visual, mas não há capturas reais documentadas na pasta de imagens. Para um portfólio, recomenda-se adicionar imagens reais do app em uma pasta `docs/images` ou em uma seção de demonstração.

## Aprendizados técnicos

- integração entre frontend e backend em aplicações web;
- uso de formulários e envio de arquivos em JavaScript;
- persistência de dados com Spring Boot e PostgreSQL;
- uso de PWA para melhorar a experiência mobile;
- importância de documentação e segurança em projetos reais.

## Melhorias futuras

- separar melhor configurações de ambiente;
- remover credenciais hardcoded; usar variáveis de ambiente;
- criar endpoints para listagem e filtro por data/tipo;
- adicionar autenticação para operações administrativas;
- melhorar documentação com capturas reais e fluxo de uso;
- revisar limpeza do código e organização de arquivos duplicados.

## Status do projeto

É um projeto funcional como MVP, com boa base para demonstrar conceitos de desenvolvimento web e backend. Ainda precisa de organização, segurança e documentação mais profissional para ser apresentado em portfólio.
