FROM node:16

# Instala as dependências do sistema necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    lsb-release \
    xdg-utils \
    wget \
    ca-certificates

# Configura o diretório de trabalho
WORKDIR /app

# Copia o package.json e instala as dependências do Node.js
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Inicia o bot
CMD ["npm", "start"]