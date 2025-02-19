const { Client } = require('whatsapp-web.js');
const { enviarParaGrupo } = require('./bot');

// Variáveis para armazenar as informações da corrida
let dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '', confirmado: false };

// Cria um cliente para o WhatsApp
const client = new Client();

let grupoId = null;

// Evento de QR Code para escanear
client.on('qr', (qr) => {
    console.log('QR Code recebido:', qr);
    // Você pode usar um serviço como o [https://api.qrserver.com/v1/create-qr-code/](https://api.qrserver.com/v1/create-qr-code/) para exibir o QR code
});

// Evento de cliente pronto
client.on('ready', () => {
    console.log('Cliente WhatsApp pronto!');
    
    // Listar todos os grupos e seus respectivos IDs
    client.getChats().then(chats => {
        chats.forEach(chat => {
            if (chat.isGroup) {
                console.log(`Nome do grupo: ${chat.name} | ID do grupo: ${chat.id._serialized}`);
                
                // Aqui você escolhe qual grupo utilizar, por exemplo, o primeiro grupo da lista
                grupoId = chat.id._serialized;  // Defina o grupo ID conforme necessário
            }
        });
    });
});

// Função para enviar a corrida para o grupo de motoristas/admins
async function enviarParaGrupo(client, mensagem) {
    try {
        if (grupoId) {
            // Verificar se o ID do grupo é válido
            const grupo = await client.getChatById(grupoId);
            if (grupo) {
                await grupo.sendMessage(mensagem);
                console.log('📨 Mensagem enviada ao grupo de motoristas.');
            } else {
                console.log('❌ Grupo não encontrado, ID inválido.');
            }
        } else {
            console.log('❌ ID do grupo não encontrado.');
        }
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem para o grupo:', error);
    }
}

// Processa cada mensagem recebida
async function processarMensagem(client, message) {
    const texto = message.body.trim();

    // Mensagem inicial
    if (texto.toLowerCase() === 'olá' || texto.toLowerCase() === 'bom dia' || texto.toLowerCase() === 'boa tarde') {
        message.reply('Olá! Sou o assistente virtual da [Nome da Empresa de Táxi]. Como posso ajudar?');
        message.reply('Por favor, informe o nome com o qual deseja ser atendido.');
        return;
    }

    // Se o nome ainda não foi coletado
    if (!dadosCliente.nome) {
        dadosCliente.nome = texto;
        message.reply('Perfeito, agora por favor, informe o endereço de partida (ou nome de um local, como "Shopping X").');
    } else if (!dadosCliente.partida) {
        dadosCliente.partida = texto;
        message.reply('Qual é o endereço de chegada (ou nome de um local)?');
    } else if (!dadosCliente.chegada) {
        dadosCliente.chegada = texto;
        message.reply('Qual será a forma de pagamento? (Ex: dinheiro, cartão, PIX)');
    } else if (!dadosCliente.pagamento) {
        dadosCliente.pagamento = texto;
        message.reply('Agora, por favor, informe seu número de telefone (com DDD).');
    } else if (!dadosCliente.telefone) {
        dadosCliente.telefone = texto;

        // Criando a mensagem para o cliente confirmar os dados
        const mensagemConfirmacao = `
            **Resumo dos seus dados:**

            🧑‍✈️ *Nome:* ${dadosCliente.nome}
            📍 *Partida:* ${dadosCliente.partida}
            🎯 *Chegada:* ${dadosCliente.chegada}
            💰 *Pagamento:* ${dadosCliente.pagamento}
            📞 *Contato:* ${dadosCliente.telefone}

            **Por favor, confirme se os dados estão corretos.** Responda com "sim" ou "não".
        `;

        message.reply(mensagemConfirmacao);
    } else if (!dadosCliente.confirmado) {
        // Se o cliente respondeu para confirmar os dados
        if (texto.toLowerCase() === 'sim') {
            dadosCliente.confirmado = true;

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
            dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '', confirmado: false };
        } else if (texto.toLowerCase() === 'não') {
            // Caso o cliente não confirme, resetar os dados e reiniciar a coleta
            dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '', confirmado: false };
            message.reply('❌ Dados não confirmados. Vamos recomeçar a coleta das informações.');

            message.reply('Por favor, informe o nome com o qual deseja ser atendido.');
        } else {
            // Caso a resposta não seja sim ou não
            message.reply('❌ Resposta inválida. Por favor, responda com "sim" ou "não" para confirmar seus dados.');
        }
    }
}

client.initialize();

module.exports = { processarMensagem };
