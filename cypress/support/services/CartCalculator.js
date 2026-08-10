class CartCalculator {
  converterValorMonetario(valor) {
    const valorEncontrado = valor.match(/-?\d[\d.,]*/);

    if (!valorEncontrado) {
      throw new Error(`Valor monetario nao encontrado em "${valor}"`);
    }

    return Number(valorEncontrado[0].replace(',', '.'));
  }

  calcularTotal(preco, quantidade) {
    return preco * quantidade;
  }
}

module.exports = new CartCalculator();
