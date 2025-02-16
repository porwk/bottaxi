const { Client, LocalAuth } = require('whatsapp-web.js');
const { processarMensagem } = require('./src/handlers');

// Criando o cliente do WhatsApp com autenticação persistente
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './auth' }), // Garante que a sessão seja armazenada corretamente
    puppeteer: { 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Evento quando o QR Code for gerado (apenas para referência)
client.on('qr', (qr) => {
    console.clear(); // Limpa o terminal para evitar poluição visual
    console.log('📲 QR Code gerado! Escaneie no seu WhatsApp.');
});

// Quando o bot estiver pronto para uso
client.on('ready', () => {
    console.log('✅ 🤖 Bot está pronto e operando!');
});

// Lidando com mensagens recebidas
client.on('message', async (message) => {
    try {
        console.log(`📩 Mensagem recebida de ${message.from}: ${message.body}`);
        await processarMensagem(client, message);
    } catch (error) {
        console.error('❌ Erro ao processar mensagem:', error);
    }
});

// Captura erros globais para evitar falhas inesperadas
client.on('disconnected', (reason) => {
    console.log(`⚠️ Bot desconectado: ${reason}`);
    console.log('Tentando reconectar...');
    client.initialize();
});

// Iniciando o bot
client.initialize().catch(error => {
    console.error('❌ Erro ao iniciar o bot:', error);
});
