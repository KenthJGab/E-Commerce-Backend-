const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order')
const auth = require('../auth');


//const { verify } = auth;


//Non-admin user checkout (Create order)
router.post('/users/checkout', auth.verify, orderController.createOrder);


//Retreive user details
router.get("/:userId/userDetails", auth.verify, orderController.getUserDetails);


//Retrieve all orders
router.get('/allOrders', auth.verify, (req,res) =>  {
	const data =  {
		isAdmin: auth.decode(req.headers.authorization).isAdmin
	}
	if (data.isAdmin) {
		orderController.getAllOrders().then(result => res.send(result))
	}else {
		res.send(false);
	}
})



module.exports = router;