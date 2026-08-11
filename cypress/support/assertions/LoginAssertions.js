const loginPage = require('../page_objects/LoginPage');
const uiMessages = require('../config/uiMessages');

class LoginAssertions {
  validarPaginaCarregada() {
    loginPage.elements.emailInput().should('be.visible');
    loginPage.elements.passwordInput().should('be.visible');
    loginPage.elements.loginButton().should('be.visible');
  }

  validarUsuarioAutenticado() {
    loginPage.elements.logoutLink().should('be.visible');
    loginPage.elements.usuarioAutenticado()
      .should('be.visible')
      .and('contain.text', uiMessages.login.usuarioAutenticado);
    loginPage.elements.nomeUsuarioAutenticado()
      .should('be.visible')
      .invoke('text')
      .then((nomeUsuario) => {
        expect(nomeUsuario.trim(), 'nome do usuário autenticado').not.to.be.empty;
      });
  }

  validarCredenciaisInvalidas() {
    loginPage.elements.loginError()
      .should('be.visible')
      .and('contain.text', uiMessages.login.credenciaisInvalidas);
    loginPage.elements.logoutLink().should('not.exist');
  }
}

module.exports = new LoginAssertions();
