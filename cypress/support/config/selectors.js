module.exports = {
  common: {
    body: 'body',
    scripts: 'script',
  },
  home: {
    logo: 'img[alt="Website for automation practice"]',
  },
  login: {
    form: 'form[action="/login"]',
    errorMessage: 'p',
    loggedInUserIcon: '.fa-user',
  },
  products: {
    control: 'a[data-product-id]',
    nameRelativeToControl: 'p',
  },
  cart: {
    viewCartLink: '[href="/view_cart"]',
    rows: 'tbody tr[id^="product-"]',
    productName: 'a[href^="/product_details/"]',
    price: '.cart_price p',
    quantity: '.cart_quantity button',
    total: '.cart_total_price',
    removeButton: '[data-product-id].cart_quantity_delete',
  },
  checkout: {
    proceedButton: 'a.check_out',
    addressDetails: 'li:not(.address_title)',
  },
};
