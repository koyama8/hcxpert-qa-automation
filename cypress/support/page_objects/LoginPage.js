class LoginPage {
  elements = {
    emailInput: () => cy.get('[data-qa="login-email"]'),
    passwordInput: () => cy.get('[data-qa="login-password"]'),
    loginButton: () => cy.get('[data-qa="login-button"]'),
    loginError: () => cy.contains('p', 'Your email or password is incorrect!'),
    loggedUser: () => cy.contains('a', 'Logged in as'),
  };

  validarPaginaCarregada() {
    this.elements.emailInput().should('be.visible');
    this.elements.passwordInput().should('be.visible');
    this.elements.loginButton().should('be.visible');
  }

  preencherEmail(email) {
    this.elements.emailInput()
      .should('be.visible')
      .clear()
      .type(email);
  }

  preencherSenha(senha) {
    this.elements.passwordInput()
      .should('be.visible')
      .clear()
      .type(senha, { log: false });
  }

  solicitarLogin() {
    this.elements.loginButton()
      .should('be.visible')
      .click();
  }

  validarUsuarioAutenticado() {
    this.elements.loggedUser()
      .should('be.visible');
  }

  validarMensagemCredenciaisInvalidas() {
    this.elements.loginError()
      .should('be.visible');
  }

  validarUsuarioNaoAutenticado() {
  this.elements.loggedUser()
    .should('not.exist');
  }
}

module.exports = new LoginPage();
