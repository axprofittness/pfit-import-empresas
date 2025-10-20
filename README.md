# PFit Import Empresas - Fargate Scheduled Job

Job agendado que roda no Fargate para importar dados de empresas de diferentes fontes.

## 🚀 Tecnologias

- Node.js 20+
- TypeScript
- Docker
- AWS Fargate (Scheduled Tasks)
- ECR (Elastic Container Registry)
- EventBridge / CloudWatch Events (Agendamento)
- GitHub Actions (CI/CD)

## 📦 Estrutura do Projeto

```
pfit-import-empresas/
├── importEmpresas/
│   ├── src/
│   │   ├── job.ts               # Job principal (executa e termina)
│   │   ├── application/         # Lógica de negócio
│   │   ├── adapters/            # Adaptadores externos
│   │   ├── domain/              # Tipos e entidades
│   │   └── infra/               # Infraestrutura (DB, etc)
│   ├── Dockerfile               # Container do job
│   ├── package.json             # Dependencies
│   └── tsconfig.json            # Config TypeScript
├── .github/workflows/
│   └── deploy.yml               # CI/CD Pipeline
└── docker-compose.yml           # Desenvolvimento local
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

4. Execute o job em modo desenvolvimento:
```bash
npm run dev
```

### Usando Docker

1. Execute o job com Docker Compose:
```bash
docker-compose up pfit-import-empresas
```

O job executará uma vez e terminará.

## 🚀 Deploy e Agendamento

### Pipeline CI/CD

O workflow do GitHub Actions:
1. **Build da imagem Docker**
2. **Push para ECR**
3. A imagem fica disponível para uso no Fargate

### Agendamento no AWS

A execução é feita via **EventBridge** ou **CloudWatch Events**:

```yaml
# Exemplo de agendamento (configurar via Terraform/CloudFormation)
ScheduleExpression: "cron(0 2 * * ? *)"  # Diariamente às 2h
TaskDefinition: "pfit-import-empresas:latest"
LaunchType: "FARGATE"
```

### Configuração Fargate

```json
{
  "family": "pfit-import-empresas",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "import-job",
      "image": "726542684607.dkr.ecr.us-east-1.amazonaws.com/proffitness-repo:latest",
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/pfit-import-empresas"
        }
      }
    }
  ]
}
```

## 📊 Execução e Logs

### ✅ Execução Bem-sucedida
```
🚀 Iniciando job de importação de empresas...
⏰ Timestamp: 2024-10-18T02:00:00.000Z
� Executando importação...
✅ Importação concluída com sucesso!
📈 Resumo: 3 sucessos, 0 erros
```

### ❌ Execução com Erro
```
🚀 Iniciando job de importação de empresas...
❌ Erro durante a importação: Connection timeout
```

### 🔍 Monitoramento

- **CloudWatch Logs**: Logs estruturados
- **Exit Codes**: 0 = sucesso, 1 = erro
- **CloudWatch Metrics**: Execuções e falhas

## 🎯 Vantagens da Arquitetura

### **Job Agendado vs Servidor Contínuo:**

| Aspecto | Job Agendado ✅ | Servidor HTTP ❌ |
|---------|----------------|------------------|
| **Recursos** | Usa apenas quando executa | Sempre consumindo CPU/Memória |
| **Custo** | Paga apenas pela execução | Paga 24/7 |
| **Escalabilidade** | Auto-scaling por job | Precisa dimensionar para pico |
| **Simplicidade** | Executa e termina | Gerencia conexões, health checks |

## � Scripts Disponíveis

- `npm run build`: Compila TypeScript para JavaScript
- `npm start`: Executa o job compilado
- `npm run dev`: Executa em modo desenvolvimento
- `npm test`: Executa os testes

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma feature branch
3. Commit suas mudanças
4. Push para a branch
5. Crie um Pull Request