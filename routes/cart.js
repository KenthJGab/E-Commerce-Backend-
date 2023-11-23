const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart')
const auth = require('../auth');


//Add to Cart

router.post('/', auth.verify, cartController.addToCart);


router.post('/addToCart', auth.verify, (req,res) => {
	const data = {
		order: req.body,
		isAdmin: auth.decode(req.headers.authorization).isAdmin,
		userId: auth.decode(req.headers.authorization).id
	}

	if(!data.isAdmin){
		cartController.addToCart(data).then(result => res.send(result))
	}else {
		res.send(false)
	}
})

router.delete('/myCart/:productId',  auth.verify, cartController.deleteProduct);


router.get('/myCart', auth.verify, cartController.getCartProducts);



module.exports = router;