# Usa a imagem oficial do Node.js versão 16 como base
FROM node:16

# Define o ambiente como produção para otimizar a instalação de dependências
ENV NODE_ENV=production 

# Instala as dependências do sistema necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libatk1.0-0 libcups2 \
    libx11-xcb1 libxcomposite1 libxrandr2 libgbm1 \
    libasound2 lsb-release xdg-utils wget ca-certificates \
    libxkbcommon0 libnspr4 libgdk-pixbuf2.0-0 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*  # Limpa o cache do apt para reduzir o tamanho da imagem

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para instalar as dependências
COPY package*.json ./

# Instala apenas dependências de produção para reduzir o tamanho da imagem
RUN npm install --omit=dev

# Copia o restante do código para o container
COPY . .

# Define o comando de execução padrão
CMD ["npm", "start"]
