const apiClient = require('./ApiClient');
const endpoints = require('../config/endpoints');

class AutomationExerciseApi {
  criarConta(dadosConta) {
    return apiClient.postForm(endpoints.createAccount, dadosConta);
  }

  removerConta({ email, password }) {
    return apiClient.deleteForm(endpoints.deleteAccount, {
      email,
      password,
    });
  }
}

module.exports = new AutomationExerciseApi();
