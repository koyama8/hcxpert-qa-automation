module.exports = {
  login: '/login',
  products: '/products',
  cart: '/view_cart',
  checkout: '/checkout',
  payment: '/payment',
  paymentDone: '/payment_done',
  productDetails: (productId) => `/product_details/${productId}`,
};
