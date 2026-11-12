# Arquitetura do EcoDenúncia

## Visão geral

A arquitetura do projeto é simples e didática, com separação clara em camadas:

- camada de apresentação: páginas HTML, CSS e JavaScript;
- camada de integração: scripts JS que enviam requisições para a API;
- camada de aplicação: controladores e serviços Spring Boot;
- camada de dados: entidades JPA e banco PostgreSQL.

## Fluxo principal

1. Usuário acessa a página de denúncia.
2. Preenche campos de localização, descrição, tipo e contato.
3. Adiciona foto por câmera ou galeria.
4. O JavaScript monta um `FormData` e envia para o backend.
5. O controller recebe a requisição em `/denuncia`.
6. O service processa a informação e a entidade é persistida.
7. O sistema retorna sucesso ou erro para a interface.

## Camadas

### Front-end

Arquivos principais:
- `denuncia.html`
- `script/denuncia.js`
- `script/foto.js`
- `css/*.css`

Responsabilidade:
- capturar dados do usuário;
- validar inputs básicos;
- chamar a API;
- apresentar mensagens de sucesso/erro;
- facilitar uso em dispositivos móveis.

### Back-end

Arquivos principais:
- `src/main/java/com/lixozero/backend/controller/DenunciaController.java`
- `src/main/java/com/lixozero/backend/service/DenunciaService.java`
- `src/main/java/com/lixozero/backend/model/Denuncia.java`
- `src/main/java/com/lixozero/backend/repository/DenunciaRepository.java`

Responsabilidade:
- receber requisições HTTP;
- validar dados da denúncia;
- organizar a lógica de criação e consulta;
- persistir registros no banco.

## Persistência

O projeto está configurado para usar PostgreSQL. A configuração de conexão está em `src/main/resources/application.properties`.

## Observações da arquitetura

- A estrutura é bastante direta e adequada para aprender Spring Boot.
- O projeto ainda pode ser melhorado com:
  - separação por módulos;
  - DTOs para entrada e saída;
  - testes automatizados;
  - autenticação e autorização;
  - limpeza de arquivos duplicados e estrutura redundante.

## Pontos fortes

- fácil entendimento;
- boa leitura para estudo;
- integração entre frontend e backend funcionando como MVP;
- uso de tecnologias relevantes para portfólio.

## Pontos de atenção

- há duplicação de arquivos na estrutura `lixozero/`;
- credenciais de banco devem ser removidas do repositório;
- a documentação precisa reforçar que este é um MVP funcional e não um produto finalizado.
