class ApiContext {
  validarEndpointConfigurado(endpoint, nome) {
    expect(endpoint, `endpoint ${nome}`)
      .to.be.a('string')
      .and.match(/^https:\/\//);
  }
}

module.exports = new ApiContext();
