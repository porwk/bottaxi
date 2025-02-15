const { iniciarCliente, avancarEtapa, obterCliente, removerCliente } = require('./clientes');
const { enviarParaGrupo } = require('./utils');

const processarMensagem = async (client, message) => {
    const chatId = message.from;
    const texto = message.body.trim();

    iniciarCliente(chatId);
    const cliente = obterCliente(chatId);

    switch (cliente.etapa) {
        case 0:
            message.reply('Olá! Sou o assistente virtual da [Nome da Empresa de Táxi]. Como posso ajudar? 🚖');
            message.reply('Por favor, envie o endereço de partida.');
            avancarEtapa(chatId, 'partida', '');
            break;

        case 1:
            avancarEtapa(chatId, 'partida', texto);
            message.reply('Qual é o endereço de chegada?');
            break;

        case 2:
            avancarEtapa(chatId, 'chegada', texto);
            message.reply('Qual será a forma de pagamento? (Ex: dinheiro, cartão, PIX)');
            break;

        case 3:
            avancarEtapa(chatId, 'pagamento', texto);
            message.reply('Agora, por favor, informe seu nome completo.');
            break;

        case 4:
            avancarEtapa(chatId, 'nome', texto);
            message.reply('Por favor, informe seu número de telefone (com DDD) para que possamos entrar em contato, caso necessário.');
            break;

        case 5:
            avancarEtapa(chatId, 'telefone', texto);

            const { partida, chegada, pagamento, nome, telefone } = cliente.dados;

            const mensagemDeCorrida = `
                **Nova Corrida Solicitada!**
                
                **Nome do Passageiro**: ${nome}
                **Endereço de Partida**: ${partida}
                **Endereço de Chegada**: ${chegada}
                **Forma de Pagamento**: ${pagamento}
                **Telefone**: ${telefone}
            `;

            await enviarParaGrupo(client, mensagemDeCorrida);
            message.reply('A sua solicitação foi enviada para o grupo de administradores. Eles irão distribuir a corrida!');

            removerCliente(chatId);
            break;
    }
};

module.exports = { processarMensagem };
