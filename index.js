const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { processarMensagem } = require('./src/handlers');
const qrcode = require('qrcode'); // Dependência para gerar o QR Code como imagem

const app = express();
const PORT = 3000;

// Criando o cliente do WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Rota para verificar se o bot está rodando
app.get('/', (req, res) => {
    res.send('🤖 Bot do WhatsApp está rodando!');
});

// Rota para exibir o QR Code
app.get('/qr', (req, res) => {
    // Gerar o QR Code como imagem e enviá-la para o navegador
    client.on('qr', (qr) => {
        qrcode.toDataURL(qr, (err, url) => {
            if (err) {
                console.error('Erro ao gerar o QR Code', err);
                return res.status(500).send('Erro ao gerar o QR Code');
            }
            res.send(`<img src="${url}" alt="QR Code"/>`);
        });
    });
});

// Inicializa o servidor Express
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Evento quando o QR Code for gerado
client.on('qr', (qr) => {
    console.log('QR Code gerado! Escaneie no seu WhatsApp.');
});

// Quando o bot estiver pronto para uso
client.on('ready', () => {
    console.log('🤖 Bot está pronto e operando!');
});

// Lidando com mensagens recebidas
client.on('message', async (message) => {
    try {
        await processarMensagem(client, message);
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
});

// Iniciando o bot
client.initialize().catch(error => {
    console.error('Erro ao iniciar o bot:', error);
});
