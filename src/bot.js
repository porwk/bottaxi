// Função para enviar a corrida para o grupo de motoristas/admins
async function enviarParaGrupo(client, mensagem) {
    try {
        const grupoId = 'ID_DO_GRUPO';  // Substitua pelo ID real do grupo
        const grupo = await client.getChatById(grupoId);
        await grupo.sendMessage(mensagem);
        console.log('📨 Mensagem enviada ao grupo de motoristas.');
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem para o grupo:', error);
    }
}

module.exports = { enviarParaGrupo };
