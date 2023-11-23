const Product = require('../models/Product');
const Cart = require('../models/Cart');


// module.exports.addToCart = async (data) => {
//     const productDetail = await Product.findById(data.order.productId);

//     if (!productDetail.isActive) {
//         return false;
//     }

//     let isCartExist = await Cart.findOne({ userId: data.userId }) || new Cart({
//         products: [],
//         userId: data.userId,
//         totalPrice: 0
//     });

//     const productIndex = isCartExist.products.findIndex(product => product.productId === data.order.productId);

//     if (productIndex > -1) {
//         const product = isCartExist.products[productIndex];
//         product.quantity = data.order.quantity;
//     } else {
//         isCartExist.products.push({
//             productId: data.order.productId,
//             quantity: data.order.quantity,
//             name: productDetail.name,
//             totalPerProduct: productDetail.price * data.order.quantity
//         });
//     }

//     isCartExist.totalPrice = isCartExist.products.reduce((total, product) => total + product.totalPerProduct, 0);

//     const result = await isCartExist.save();
    
//     return !!result;
// };


module.exports = {
  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user.id; // Assuming you have user information in req.user after authentication

      // Find the user's cart
      const userCart = await Cart.findOne({ userId });

      // Check if the user has a cart
      if (!userCart) {
        return res.status(404).json({ error: 'User cart not found' });
      }

      // Find the index of the product in the user's cart
      const productIndex = userCart.products.findIndex((product) => product.productId === productId);

      // Check if the product is in the cart
      if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found in the cart' });
      }

      // Remove the product from the user's cart
      const removedProduct = userCart.products.splice(productIndex, 1)[0];

      // Update the total price by subtracting the removed product's totalPerProduct
      userCart.totalPrice -= removedProduct.totalPerProduct;

      // Save the updated cart
      await userCart.save();

      res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
      console.error('Error removing product from cart:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};



module.exports.removeProduct = async (data) => {
    return Cart.findOne({ userId: data.userId })
        .then((insideCart) => {
            if (!insideCart) return false;

            const productIndex = insideCart.products.findIndex(product => product.productId === data.product.productId);

            if (productIndex > -1) {
                insideCart.products.splice(productIndex, 1);
                insideCart.totalPrice = insideCart.products.reduce((total, product) => total + product.totalPerProduct, 0);

                return insideCart.save().then(() => true);
            } else {
                return false;
            }
        })
        .catch(() => false);
};


module.exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Fetch the actual product details from the database based on productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const totalPerProduct = product.price * quantity;
    const productToAdd = {
      productId,
      name: product.name,
      description: product.description, 
      price: product.price, 
      quantity,
      totalPerProduct,
      addedOn: new Date(),
    };

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        products: [productToAdd],
        totalPrice: totalPerProduct,
      });
    } else {
      cart.products.push(productToAdd);
      cart.totalPrice += totalPerProduct;
    }

    await cart.save();

    res.status(200).json({ success: true, message: 'Product added to cart successfully.' });
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


module.exports.getCartProducts = async (req, res) => {
  try {
    const userId = req.user.id; 
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    res.status(200).json(cart.products);
  } catch (error) {
    console.error('Error retrieving cart products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }};

  
