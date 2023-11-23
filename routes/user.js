const express = require('express');
const userController = require("../controllers/user");
const auth = require("../auth") 

const {verify, verifyAdmin} = auth;

const router = express.Router();


router.post("/checkEmail", (req, res) => {
	userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
})

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

router.get('/allUsers', verify, verifyAdmin, userController.getAllUsers);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

 router.post('/addToCart', verify, userController.addToCart);

//router.get('/getProduct', verify, userController.getProducts)

router.get('/order-history',  verify, userController.getOrderHistory);

router.put('/reset-password', verify, userController.resetPassword);

router.put('/profile', verify, userController.updateProfile);

router.put('/orederStatusUpdate', userController.updateOrderStatus);	

router.put('/updateAdmin', verify, verifyAdmin, userController.updateUserAsAdmin);

router.delete('/updateAdmin', verify, verifyAdmin, userController.updateUserAsAdmin);

router.get('/users-with-orders', verify, verifyAdmin, userController.getUsersWithOrders);

router.delete('/order-history/delete/:orderId', verify, userController.deleteOrder);

 
module.exports = router; 
