const selectors = require('../config/selectors');

class LoginPage {
  elements = {
    emailInput: () => cy.getByQa('login-email'),
    passwordInput: () => cy.getByQa('login-password'),
    loginButton: () => cy.getByQa('login-button'),
    loginError: () => cy.getByAttribute('action', '/login')
      .find(selectors.login.errorMessage),
    usuarioAutenticado: () => cy.getByTag('i')
      .filter(selectors.login.loggedInUserIcon)
      .parent(),
    nomeUsuarioAutenticado: () => cy.getByTag('i')
      .filter(selectors.login.loggedInUserIcon)
      .parent()
      .find('b'),
    logoutLink: () => cy.getByHref('/logout'),
  };

  preencherEmail(email) {
    this.elements.emailInput().clear().type(email);
  }

  preencherSenha(senha) {
    this.elements.passwordInput().clear().type(senha, { log: false });
  }

  solicitarLogin() {
    this.elements.loginButton().click();
  }
}

module.exports = new LoginPage();
