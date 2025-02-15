const { enviarParaGrupo } = require('./bot');

// Variáveis para armazenar as informações da corrida
let dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '' };

// Processa cada mensagem recebida
async function processarMensagem(client, message) {
    const texto = message.body.toLowerCase().trim();

    if (texto === 'olá') {
        message.reply('Olá! Sou o assistente virtual da [Nome da Empresa de Táxi]. Como posso ajudar?');
        message.reply('Por favor, envie o endereço de partida.');
        return;
    }

    if (!dadosCliente.partida) {
        dadosCliente.partida = message.body;
        message.reply('Qual é o endereço de chegada?');
    } else if (!dadosCliente.chegada) {
        dadosCliente.chegada = message.body;
        message.reply('Qual será a forma de pagamento? (Ex: dinheiro, cartão, PIX)');
    } else if (!dadosCliente.pagamento) {
        dadosCliente.pagamento = message.body;
        message.reply('Agora, por favor, informe seu nome completo.');
    } else if (!dadosCliente.nome) {
        dadosCliente.nome = message.body;
        message.reply('Por favor, informe seu número de telefone (com DDD).');
    } else if (!dadosCliente.telefone) {
        dadosCliente.telefone = message.body;

        // Criando a mensagem para o grupo de motoristas/admins
        const mensagemDeCorrida = `
            **🚖 Nova Corrida Solicitada! 🚖**
            
            🧑‍✈️ *Nome:* ${dadosCliente.nome}
            📍 *Partida:* ${dadosCliente.partida}
            🎯 *Chegada:* ${dadosCliente.chegada}
            💰 *Pagamento:* ${dadosCliente.pagamento}
            📞 *Contato:* ${dadosCliente.telefone}
        `;

        // Enviar mensagem para o grupo
        await enviarParaGrupo(client, mensagemDeCorrida);

        // Confirmar com o cliente
        message.reply('✅ Sua solicitação foi enviada! Um motorista entrará em contato em breve.');

        // Resetar os dados para uma nova corrida
        dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '' };
    }
}

module.exports = { processarMensagem };
