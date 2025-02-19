const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { processarMensagem } = require('./src/handlers');
const qrcode = require('qrcode'); // Biblioteca para gerar QR Code

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

// Evento quando o QR Code for gerado
client.on('qr', (qr) => {
    console.log('QR Code gerado! Escaneie no seu WhatsApp.');
    
    // Exibe o QR Code no terminal (de forma legível)
    qrcode.toString(qr, { type: 'terminal' }, function (err, url) {
        if (err) {
            console.error('Erro ao gerar QR Code no terminal:', err);
        } else {
            console.log(url);  // Exibe o QR Code no terminal
        }
    });
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

// Inicializa o servidor Express
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Iniciando o bot
client.initialize().catch(error => {
    console.error('Erro ao iniciar o bot:', error);
});
