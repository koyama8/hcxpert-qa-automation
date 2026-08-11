class UserFactory {
  gerarEmailUnico(prefixo, dominio) {
    return `${prefixo}.${Date.now()}@${dominio}`;
  }

  gerarSenhaTemporaria() {
    const sufixoAleatorio = Math.random().toString(36).slice(2, 10);

    return `Qa@${Date.now()}${sufixoAleatorio}`;
  }
}

module.exports = new UserFactory();
