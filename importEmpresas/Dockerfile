# Use a imagem oficial do Node.js 20 Alpine
FROM node:20-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instale todas as dependências (incluindo devDependencies)
RUN npm ci

# Copie o código fonte
COPY src/ ./src/

# Compile o projeto TypeScript
RUN npm run build

# Remova dependências de desenvolvimento (mantenha apenas production)
RUN npm prune --production

# Crie um usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Altere a propriedade dos arquivos para o usuário nodejs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponha a porta
EXPOSE 3000

# Configure variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando para executar a aplicação
CMD ["npm", "start"]