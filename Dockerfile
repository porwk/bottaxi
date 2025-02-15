# Usando a imagem oficial do Node.js
FROM node:16

# Definindo o diretório de trabalho
WORKDIR /app

# Copiar o package.json e o package-lock.json para instalar as dependências
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Expor a porta se necessário (não é obrigatório para este caso específico)
EXPOSE 3000

# Comando para rodar o bot
CMD ["node", "index.js"]