const { Client, LocalAuth } = require('whatsapp-web.js');
const { processarMensagem } = require('./src/handlers');

// Criando o cliente do WhatsApp com autenticação persistente
const client = new Client({
    authStrategy: new LocalAuth(), // Mantém a sessão salva no servidor
    puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Evita problemas de sandbox no Puppeteer
    }
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
