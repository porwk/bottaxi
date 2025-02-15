const { Client, LocalAuth } = require('whatsapp-web.js');
const { processarMensagem } = require('./src/handlers');

// Criando o cliente do WhatsApp com autenticação persistente
const client = new Client({
    authStrategy: new LocalAuth(), // Mantém a sessão salva no servidor
    puppeteer: { headless: true }
});

// Evento quando o QR Code for gerado (apenas para referência)
client.on('qr', (qr) => {
    console.log('QR Code gerado! Escaneie no seu WhatsApp.');
});

// Quando o bot estiver pronto para uso
client.on('ready', () => {
    console.log('🤖 Bot está pronto e operando!');
});

// Lidando com mensagens recebidas
client.on('message', async (message) => {
    await processarMensagem(client, message);
});

// Iniciando o bot
client.initialize();
