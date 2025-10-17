# Use a imagem oficial do Node.js 20 Alpine
FROM node:20-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./

# Instale as dependências
RUN npm ci --only=production

# Copie o código fonte
COPY src/ ./src/

# Instale TypeScript globalmente e compile o projeto
RUN npm install -g typescript && npm run build

# Remova dependências de desenvolvimento e TypeScript
RUN npm prune --production && npm uninstall -g typescript

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