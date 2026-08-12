const apiClient = require('./ApiClient');
const endpoints = require('../config/endpoints');

class TrelloApi {
  consultarAcao(idAcao) {
    return apiClient.get(`${endpoints.trelloActions}/${idAcao}`);
  }
}

module.exports = new TrelloApi();
