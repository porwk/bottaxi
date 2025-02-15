const clientes = {};

const iniciarCliente = (chatId) => {
    if (!clientes[chatId]) {
        clientes[chatId] = {
            etapa: 0,
            dados: {
                partida: '',
                chegada: '',
                pagamento: '',
                nome: '',
                telefone: ''
            }
        };
    }
};

const avancarEtapa = (chatId, campo, valor) => {
    if (clientes[chatId]) {
        clientes[chatId].dados[campo] = valor;
        clientes[chatId].etapa += 1;
    }
};

const obterCliente = (chatId) => {
    return clientes[chatId] || { etapa: 0, dados: {} };
};

const removerCliente = (chatId) => {
    delete clientes[chatId];
};

module.exports = { iniciarCliente, avancarEtapa, obterCliente, removerCliente };
