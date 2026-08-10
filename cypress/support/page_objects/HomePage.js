class HomePage {
  elements = {
    body: () => cy.get('body'),
    logo: () => cy.getByHref('/').find('img[alt="Website for automation practice"]'),
  };
}

module.exports = new HomePage();
