const {
  Given,
  When,
  Then,
} = require('@badeball/cypress-cucumber-preprocessor');

let alertaXssExecutado = false;

const loginPage = require('../../support/page_objects/LoginPage');

Given('que o usuário está na página de autenticação', () => {
  loginPage.acessarPagina();
})

When('o usuário informar um e-mail e uma senha válidos',() => {
    cy.env(['email', 'senha']).then(({ email, senha }) => {
      loginPage.preencherEmail(email)
      loginPage.preencherSenha(senha)
    })
})

When('solicitar a autenticação',() =>{
    loginPage.solicitarLogin()
})

Then('o usuário deverá ser autenticado e seu nome deverá ser exibido',() => {
    loginPage.validarUsuarioAutenticado()
})

When('o usuário informar um e-mail cadastrado e uma senha incorreta',() => {
    const senha = 'senhaIncorreta123' 

    cy.env(['email']).then(({ email }) => {
      loginPage.preencherEmail(email)
      loginPage.preencherSenha(senha)
    })
})

Then('uma mensagem de credenciais inválidas deverá ser exibida sem autenticar o usuário',() =>{
    loginPage.validarMensagemCredenciaisInvalidas()
    loginPage.validarUsuarioNaoAutenticado()
})

When('o usuário informar um e-mail não cadastrado e uma senha',() => {
    const emailInexistente  = `usuario.inexistente.${Date.now()}@example.com`
    const senha  = 'senhaInexistente123'

    loginPage.preencherEmail(emailInexistente)
    loginPage.preencherSenha(senha)
})

When('o usuário inserir uma expressão de SQL Injection no campo de senha', () => {
    const sqlInjection  = "' OR '1'='1";

    cy.env(['email']).then(({ email }) => {
      loginPage.preencherEmail(email)
      loginPage.preencherSenha(sqlInjection)
    })
})

Then('o sistema deverá rejeitar a tentativa sem autenticar o usuário',() => {
    loginPage.validarMensagemCredenciaisInvalidas()
    loginPage.validarUsuarioNaoAutenticado()
})

When('o usuário inserir um script malicioso no campo de senha',() =>{
    const payloadXss = '<script>alert("xss")</script>';

    alertaXssExecutado = false;

    cy.on('window:alert', () => {
    alertaXssExecutado = true;
    })
     
    cy.env(['email']).then(({ email }) => {
      loginPage.preencherEmail(email)
      loginPage.preencherSenha(payloadXss)
    })
})

Then('o sistema deverá impedir a execução do script sem autenticar o usuário', () => {
  cy.then(() => {
    expect(
      alertaXssExecutado,
      'o payload XSS não deve executar um alerta',
    ).to.be.false;
  });

  loginPage.validarMensagemCredenciaisInvalidas();
  loginPage.validarUsuarioNaoAutenticado();
});
