const checkoutPage = require('../page_objects/CheckoutPage');
const cartCalculator = require('../services/CartCalculator');
const routes = require('../config/routes');
const uiMessages = require('../config/uiMessages');
const networkContext = require('../tasks/NetworkContext');

class CheckoutAssertions {
  validarPaginaCheckout() {
    cy.location('pathname').should('eq', routes.checkout);
    checkoutPage.elements.enderecoEntrega().should('be.visible');
    checkoutPage.elements.enderecoCobranca().should('be.visible');
    checkoutPage.elements.resumoPedido().should('be.visible');
  }

  validarEnderecoEResumo(produtoEsperado, quantidadeEsperada) {
    this.validarPaginaCheckout();

    checkoutPage.elements.detalhesEnderecoEntrega()
      .invoke('text')
      .then((enderecoEntrega) => {
        checkoutPage.elements.detalhesEnderecoCobranca()
          .invoke('text')
          .then((enderecoCobranca) => {
            const normalizar = (endereco) => endereco.replace(/\s+/g, ' ').trim();
            const entregaNormalizada = normalizar(enderecoEntrega);
            const cobrancaNormalizada = normalizar(enderecoCobranca);

            expect(entregaNormalizada, 'endereço de entrega').not.to.be.empty;
            expect(cobrancaNormalizada, 'endereço de cobrança')
              .to.equal(entregaNormalizada);
          });
      });

    checkoutPage.elements.produtosResumo().should('have.length', 1);
    checkoutPage.elements.nomeProdutoResumo()
      .should('have.attr', 'href', routes.productDetails(produtoEsperado.id))
      .invoke('text')
      .then((nomeProduto) => {
        expect(nomeProduto.trim()).to.equal(produtoEsperado.nome);
      });
    checkoutPage.elements.quantidadeProdutoResumo()
      .should('have.text', String(quantidadeEsperada));
    checkoutPage.elements.precoProdutoResumo().invoke('text').then((precoTexto) => {
      const preco = cartCalculator.converterValorMonetario(precoTexto);
      checkoutPage.elements.totalProdutoResumo().invoke('text').then((totalTexto) => {
        const total = cartCalculator.converterValorMonetario(totalTexto);
        expect(total).to.equal(
          cartCalculator.calcularTotal(preco, quantidadeEsperada),
        );
      });
    });
  }

  validarPaginaPagamento() {
    cy.location('pathname').should('eq', routes.payment);
    checkoutPage.elements.botaoConfirmarPagamento().should('be.visible');
  }

  validarPedidoRealizado() {
    cy.location('pathname').should((pathname) => {
      const padraoPedidoConcluido = new RegExp(
        `^${routes.paymentDone}/(\\d+)$`,
      );
      const resultado = pathname.match(padraoPedidoConcluido);

      expect(pathname, 'rota com número do pedido')
        .to.match(padraoPedidoConcluido);
      expect(Number(resultado[1]), 'número do pedido').to.be.greaterThan(0);
    });
    checkoutPage.elements.pedidoRealizado()
      .should('be.visible')
      .and('contain.text', uiMessages.checkout.tituloPedidoRealizado);
    checkoutPage.elements.body().should(
      'contain.text',
      uiMessages.checkout.pedidoConfirmado,
    );
  }

  validarPedidoNaoFinalizado() {
    this.validarPermanenciaNaPaginaPagamento();
    checkoutPage.elements.camposPagamentoInvalidos()
      .should('have.length.greaterThan', 0);
    [
      checkoutPage.elements.numeroCartao,
      checkoutPage.elements.cvc,
      checkoutPage.elements.mesExpiracao,
      checkoutPage.elements.anoExpiracao,
    ].forEach((obterCampo) => {
      obterCampo()
        .should('have.value', '')
        .then(($campo) => {
          expect($campo[0].checkValidity(), 'campo obrigatório inválido')
            .to.be.false;
        });
    });
  }

  validarPermanenciaNaPaginaPagamento() {
    cy.location('pathname').should('eq', routes.payment);
    checkoutPage.elements.pedidoRealizado().should('not.exist');
  }

  validarPedidoNaoConfirmadoPorIndisponibilidade() {
    cy.wait(`@${networkContext.aliasConfirmacaoIndisponivel}`)
      .then(({ request, response }) => {
        expect(request.method, 'método da confirmação').to.equal('POST');
        expect(response.statusCode, 'status de indisponibilidade').to.equal(503);
        expect(response.headers, 'orientação de nova tentativa')
          .to.have.property('retry-after', '60');
      });

    this.validarPermanenciaNaPaginaPagamento();
    checkoutPage.elements.body().should(
      'not.contain.text',
      uiMessages.checkout.pedidoConfirmado,
    );
  }
}

module.exports = new CheckoutAssertions();
