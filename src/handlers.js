const { enviarParaGrupo } = require('./bot');

// Variáveis para armazenar as informações da corrida
let dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '' };
let aguardandoConfirmacao = false;  // Variável para controlar a espera pela confirmação

// Função para validar a cidade
const validarCidade = (cidade) => {
    return cidade.toLowerCase() === 'cuiabá' || cidade.toLowerCase() === 'várzea grande';
};

// Função para validar o endereço
const validarEndereco = (endereco) => {
    const locaisPublicos = ['hospital', 'farmácia', 'escola', 'shopping', 'terminal', 'supermercado'];
    for (let local of locaisPublicos) {
        if (endereco.toLowerCase().includes(local)) {
            return true;
        }
    }
    return endereco.split(',').length === 4; // Checa se possui 4 partes: rua, número, bairro, cidade
};

// Função para iniciar o atendimento
async function iniciarAtendimento(message) {
    message.reply('🌞 Bom dia! Sou o assistente virtual da [Nome da Empresa de Táxi].');
    message.reply('Por favor, me diga como você gostaria de ser chamado para te atendermos melhor.');
}

// Processa cada mensagem recebida
async function processarMensagem(client, message) {
    const texto = message.body.toLowerCase().trim();

    // Se ainda não foi iniciado o atendimento, pedimos o nome do cliente
    if (!dadosCliente.nome) {
        if (dadosCliente.partida === '') {
            await iniciarAtendimento(message);
        } else {
            dadosCliente.nome = texto;
            message.reply('Agora, por favor, envie o endereço de partida (Rua, Número, Bairro, Cidade - Cuiabá ou Várzea Grande).');
        }
        return;
    }

    // Coleta os dados do cliente
    if (!dadosCliente.partida) {
        if (validarEndereco(texto)) {
            dadosCliente.partida = texto;
            message.reply('Qual é o endereço de chegada? (Rua, Número, Bairro, Cidade - Cuiabá ou Várzea Grande)');
        } else {
            message.reply('Endereço inválido! Por favor, envie o endereço completo (Rua, Número, Bairro, Cidade - Cuiabá ou Várzea Grande).');
        }
    } else if (!dadosCliente.chegada) {
        if (validarEndereco(texto)) {
            dadosCliente.chegada = texto;
            message.reply('Qual será a forma de pagamento? (Ex: dinheiro, cartão, PIX)');
        } else {
            message.reply('Endereço de chegada inválido! Por favor, envie um endereço válido (Rua, Número, Bairro, Cidade - Cuiabá ou Várzea Grande).');
        }
    } else if (!dadosCliente.pagamento) {
        dadosCliente.pagamento = texto;
        message.reply('Agora, por favor, informe seu número de telefone (com DDD).');
    } else if (!dadosCliente.telefone) {
        dadosCliente.telefone = texto;

        // Mostrar os dados coletados para confirmação
        const mensagemDeConfirmacao = `
            **🚖 Confirmação de Dados da Corrida: 🚖**
            
            🧑‍✈️ *Nome:* ${dadosCliente.nome}
            📍 *Partida:* ${dadosCliente.partida}
            🎯 *Chegada:* ${dadosCliente.chegada}
            💰 *Pagamento:* ${dadosCliente.pagamento}
            📞 *Contato:* ${dadosCliente.telefone}
            
            Por favor, confirme se os dados estão corretos. Responda com "Sim" para confirmar ou "Não" para corrigir.
        `;
        message.reply(mensagemDeConfirmacao);
        aguardandoConfirmacao = true;  // Indica que estamos aguardando a confirmação
    } else if (aguardandoConfirmacao) {
        // Se o cliente confirmar os dados
        if (texto === 'sim') {
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

            message.reply('✅ Sua solicitação foi enviada! Um motorista entrará em contato em breve.');
        } else if (texto === 'não') {
            message.reply('Ok, por favor, corrija os dados e envie novamente.');
        } else {
            message.reply('Responda com "Sim" para confirmar ou "Não" para corrigir.');
        }

        // Resetar os dados para uma nova corrida, ou aguardar o próximo cliente
        dadosCliente = { partida: '', chegada: '', pagamento: '', nome: '', telefone: '' };
        aguardandoConfirmacao = false;
    }
}

module.exports = { processarMensagem };
