const enviarParaGrupo = async (client, mensagem) => {
    try {
        const chats = await client.getChats();
        const grupo = chats.find(chat => chat.isGroup && chat.name === 'Nome do Grupo');

        if (grupo) {
            await grupo.sendMessage(mensagem);
        } else {
            console.error('Erro: Grupo não encontrado!');
        }
    } catch (error) {
        console.error('Erro ao enviar mensagem para o grupo:', error);
    }
};

module.exports = { enviarParaGrupo };
