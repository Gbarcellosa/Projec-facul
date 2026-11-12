# Setup do EcoDenúncia

## Requisitos

- Java 17 ou superior
- Maven 3.8+
- PostgreSQL configurado e acessível
- Git

## 1. Clonar o projeto

```bash
git clone https://github.com/Gbarcellosa/Projec-facul.git
cd Projec-facul
```

## 2. Configurar banco de dados

O backend usa Spring Boot com PostgreSQL. Ajuste a conexão em `src/main/resources/application.properties` para o seu ambiente local.

Exemplo de configuração:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecodenuncia
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

Importante:
- nunca publique credenciais reais em repositório público;
- prefira variáveis de ambiente em produção;
- mantenha os valores locais fora do controle de versão.

## 3. Executar o backend

```bash
./mvnw clean install
./mvnw spring-boot:run
```

A API estará disponível em:

```text
http://localhost:8080
```

## 4. Testar a aplicação no navegador

- abra a página principal do frontend;
- preencha o formulário de denúncia;
- verifique se o envio funciona corretamente;
- confirme o retorno do backend e a redirecionamento para a tela de sucesso.

## 5. Fluxo de uso

- formulário de denúncia
- seleção do tipo de resíduo
- preenchimento da localização e descrição
- inclusão de foto
- envio da requisição para `/denuncia`
- confirmação de registro

## 6. Boas práticas antes de publicar

- remover dados reais e segredos do código;
- criar `application-example.properties` ou variáveis de ambiente para configuração;
- validar se os endpoints respondem corretamente;
- ajustar o CORS e a origem da aplicação em produção;
- revisar o uso de arquivos duplicados e pastas redundantes.

## 7. Troubleshooting

### Erro de banco

Verifique:
- se o PostgreSQL está em execução;
- se o usuário e senha estão corretos;
- se o nome do banco existe;
- se a porta está acessível.

### Erro de CORS ou falha de requisição

Revise:
- a URL do frontend;
- o endpoint `/denuncia`;
- a configuração de CORS do backend;
- se o backend está no ar no mesmo ambiente esperado.

## 8. Recomendação para portfólio

Mesmo sendo um projeto funcional, o EcoDenúncia deve ser apresentado como um MVP com foco em aprendizado e aplicação de conceitos de desenvolvimento web e backend. A documentação profissional deve destacar a parte funcional sem exagerar em promessas de produto final.
