class ApiClient {
  request(options) {
    const headers = {
      accept: 'application/json',
      ...options.headers,
    };

    return cy.api({
      failOnStatusCode: false,
      log: false,
      ...options,
      headers,
    }).then((response) => ({
      ...response,
      body: this.parseBody(response.body),
    }));
  }

  get(url) {
    return this.request({ method: 'GET', url });
  }

  postForm(url, body) {
    return this.request({
      method: 'POST',
      url,
      form: true,
      body,
    });
  }

  deleteForm(url, body) {
    return this.request({
      method: 'DELETE',
      url,
      form: true,
      body,
    });
  }

  parseBody(body) {
    if (typeof body !== 'string') return body;

    try {
      return JSON.parse(body);
    } catch (_error) {
      return body;
    }
  }
}

module.exports = new ApiClient();
