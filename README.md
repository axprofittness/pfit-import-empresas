# PFit Import Empresas - Fargate Application

Aplicação migrada de Lambda para Fargate para importar dados de empresas.

## 🚀 Tecnologias

- Node.js 20+
- TypeScript
- Express.js
- Docker
- AWS Fargate
- ECR (Elastic Container Registry)
- GitHub Actions (CI/CD)

## 📦 Estrutura do Projeto

```
pfit-import-empresas/
├── importEmpresas/
│   ├── src/
│   │   ├── server.ts          # Servidor Express (substitui handler Lambda)
│   │   ├── application/       # Lógica de negócio
│   │   ├── adapters/          # Adaptadores externos
│   │   ├── domain/            # Tipos e entidades
│   │   └── infra/             # Infraestrutura (DB, etc)
│   ├── Dockerfile             # Container da aplicação
│   ├── package.json
│   └── tsconfig.json
├── .github/workflows/
│   └── deploy.yml             # CI/CD Pipeline
└── docker-compose.yml         # Desenvolvimento local
```

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 20+
- Docker e Docker Compose
- Git

### Configuração

1. Clone o repositório:
```bash
git clone <repository-url>
cd pfit-import-empresas
```

2. Configure as variáveis de ambiente:
```bash
cd importEmpresas
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Instale as dependências:
```bash
npm install
```

4. Execute em modo desenvolvimento:
```bash
npm run dev
```

### Usando Docker

1. Build e execute com Docker Compose:
```bash
docker-compose up --build
```

2. Acesse a aplicação:
- Health Check: http://localhost:3000/health
- Import Empresas: http://localhost:3000/import-empresas

## 🚀 Deploy

### Configuração AWS

1. **ECR Repository**: Crie um repositório no ECR:
```bash
aws ecr create-repository --repository-name pfit-import-empresas
```

2. **Task Definition**: Crie uma task definition no ECS para Fargate com:
   - Container name: `pfit-import-empresas-container`
   - Port mapping: 3000
   - Health check: `/health`

3. **ECS Service**: Crie um serviço no ECS apontando para a task definition

### GitHub Secrets

Configure os seguintes secrets no GitHub:
- `AWS_ACCESS_KEY_ID`: Access Key da AWS
- `AWS_SECRET_ACCESS_KEY`: Secret Key da AWS

### Pipeline CI/CD

O workflow do GitHub Actions é executado automaticamente quando:
- Push para `main` ou `develop`
- Pull Request para `main`

Processo:
1. Build da imagem Docker
2. Push para ECR
3. Update da task definition do ECS
4. Deploy no Fargate

## 📡 Endpoints

### GET/POST `/import-empresas`
Executa o processo de importação de todas as empresas.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "empresa": "AFitness",
      "resultado": { ... }
    }
  ],
  "timestamp": "2024-10-16T10:30:00.000Z"
}
```

### GET `/health`
Health check para o load balancer do Fargate.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-10-16T10:30:00.000Z"
}
```

## 🔨 Scripts Disponíveis

- `npm run build`: Compila TypeScript para JavaScript
- `npm start`: Executa a aplicação compilada
- `npm run dev`: Executa em modo desenvolvimento com hot reload
- `npm test`: Executa os testes

## 📝 Migração de Lambda para Fargate

### Principais Mudanças

1. **Handler → Express Server**: Substituiu o handler Lambda por um servidor Express
2. **Event-driven → HTTP**: Mudou de processamento por eventos para endpoints HTTP
3. **Container**: Adicionou Dockerfile para containerização
4. **Health Check**: Implementou endpoint `/health` para o Fargate
5. **Graceful Shutdown**: Adicionou handlers para SIGTERM e SIGINT

### Benefícios da Migração

- **Controle de recursos**: Melhor controle sobre CPU e memória
- **Execução contínua**: Não há cold start como nas Lambdas
- **Debugging**: Mais fácil para debug e troubleshooting
- **Escalabilidade**: Melhor para cargas de trabalho contínuas

## 🔍 Monitoramento

- **Health Check**: Endpoint `/health` para verificação de saúde
- **Logs**: Logs estruturados para CloudWatch
- **Graceful Shutdown**: Shutdown limpo em caso de redeploy

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma feature branch
3. Commit suas mudanças
4. Push para a branch
5. Crie um Pull Request