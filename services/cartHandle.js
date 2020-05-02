export const getCartProducts = async () => {
  return global.cart;
}

export const emptyCart = async () => {
  global.cart = [];
  return true;
}

export const getCountFromCart = async (product) => {
  let cart = global.cart || [];
  let res = 0;
  cart.forEach((item) => {
    console.log(item._id, product._id, item._id === product._id);
    if (item._id === product._id) {
      res = item.count;
    }
  });
  return res;
};

export const addProductToCart = async (product) => {
  let cart = global.cart || [];
  let changed = false;
  let res = 0;
  for (let i = 0; i < cart.length; ++i) {
    console.log(cart[i]._id, product._id, cart[i]._id === product._id);
    if (cart[i]._id === product._id) {
      cart[i].count += 1;
      changed = true;
      res = cart[i].count;
    }
  }
  if (!changed) {
    product.count = 1;
    cart.push(product);
    res = 1;
  }
  global.cart = cart;
  console.log(global.cart);
  return res;
};

export const removeProductFromCart = async (product) => {
  let cart = global.cart;
  let res = 0;
  if (await getCountFromCart(product) === 0) {
    return res;
  }
  let newCart = [];
  for (let i = 0; i < cart.length; ++i) {
    if (cart[i]._id === product._id) {
      if (cart[i].count > 1) {
        cart[i].count--;
        newCart.push(cart[i]);
        res = cart[i].count;
      }
    } else {
      newCart.push(cart[i]);
    }
  }
  global.cart = newCart;
  console.log(global.cart);
  return res;
};
