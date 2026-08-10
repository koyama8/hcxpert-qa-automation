class UserFactory {
  gerarEmailUnico(prefixo, dominio) {
    return `${prefixo}.${Date.now()}@${dominio}`;
  }
}

module.exports = new UserFactory();
