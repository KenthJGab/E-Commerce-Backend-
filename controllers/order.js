const Order = require('../models/Order');


//Create order 
module.exports.createOrder = async (req, res) => {
    try {
      const { products, userId, totalPrice } = req.body;
  
      const newOrder = new Order({
        products,
        userId,
        totalPrice,
      });
  
      const savedOrder = await newOrder.save();
  
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the order.' });
    }
  };


//Retreive user details
module.exports.getUserDetails = (req, res) => {
  return Order.findById(req.params.userId).then(result => {
      return res.send(result);
  });
};


//Retrieve All Orders
module.exports.getAllOrders = () => {
	return Order.find({}).then(result => {
		return result
	})
}
  