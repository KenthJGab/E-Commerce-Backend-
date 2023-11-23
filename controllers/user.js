const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require('bcrypt');
const auth = require("../auth");



module.exports.checkEmailExists = (reqBody) => {

	return User.find({email : reqBody.email}).then(result => {

		if (result.length > 0) {
			return true;

		} else {
			return false;
		}
	})
	.catch(err => res.send(err))
};


module.exports.registerUser = async (reqBody) => {
  try {
    const existingUser = await User.findOne({ email: reqBody.email });
    if (existingUser) {
      return false; 
    }

    const newUser = new User({
      firstName: reqBody.firstName,
      lastName: reqBody.lastName,
      email: reqBody.email,
      mobileNo: reqBody.mobileNo,
      password: bcrypt.hashSync(reqBody.password, 10),
    });

    const savedUser = await newUser.save();
    
    return savedUser ? true : false;
  } catch (error) {
    return false;
  }
};


module.exports.loginUser = (req, res) => {
	User.findOne({ email : req.body.email} ).then(result => {

		console.log(result);

		if(result == null){

			return res.send(false);

		} else {
			
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
			if (isPasswordCorrect) {

				return res.send({ access : auth.createAccessToken(result) })

			} else {

				return res.send(false);
			}
		}
	})
	.catch(err => res.send(err))
};


module.exports.getProfile = (req, res) => {

	return User.findById(req.user.id)
	.then(result => {
		result.password = "";
		return res.send(result);
	})
	.catch(err => res.send(err))
};


module.exports.addToCart = async (req, res) => {

  	console.log(req.user.id)
  	console.log(req.body.productId) 
 	if(req.user.isAdmin){
    	return res.send("Action Forbidden")
  	}

  	let isUserUpdated = await User.findById(req.user.id).then(user => {
    let newOrder = {
        productId: req.body.productId,
        productName: req.body.productName,
        productDescription: req.body.productDescription,
        productPrice: req.body.productPrice
    }
	    user.orders.push(newOrder);  
	    return user.save().then(user => true).catch(err => err.message)
  	})
  	if(isUserUpdated !== true) {
      	return res.send({message: isUserUpdated})
  	}

	let isProductUpdated = await Product.findById(req.body.productId).then(product => {
	    let userOrder = {
	        userId: req.user.id
	    }
	    product.userOrders.push(userOrder);
    	return product.save().then(product => true).catch(err => err.message)
 	})
 	if(isProductUpdated !== true) {
      	return res.send({ message: isProductUpdated})
  	}
  	if(isUserUpdated && isProductUpdated) {
      	return res.send({ message: "Thank You for Purchasing."})
  	}
}


module.exports.getOrderHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const ordersWithDetails = user.orders.map(order => ({
      id: order.productId,
      orderedOn: order.orderedOn.toISOString(), 
      status: order.status
    }));

    res.json(ordersWithDetails);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.resetPassword = async (req, res) => {
	try {

	  const { newPassword } = req.body;
	  const { id } = req.user;
	  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
	  await User.findByIdAndUpdate(id, { password: hashedPassword });
  
	  res.status(200).send({ message: 'Password reset successfully' });
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Internal server error' });
	}
};


module.exports.updateProfile = async (req, res) => {
	try {

		console.log(req.user);
		console.log(req.body);
		
	  const userId = req.user.id;
  
	  const { firstName, lastName, mobileNo } = req.body;
  
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ firstName, lastName, mobileNo },
		{ new: true }
	  );
  
	  res.send(updatedUser);
	} catch (error) {
	  console.error(error);
	  res.status(500).send({ message: 'Failed to update profile' });
	}
  }


module.exports.updateOrderStatus = async (req, res) => {
  try {
    const { userId, productId, status } = req.body;

    console.log('Updating order status:', userId, productId, status);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.orders.find((order) => order.productId === productId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log('Current order status:', order.status);

    order.status = status;

    await user.save();

    console.log('Order status updated successfully');

    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.status(500).json({ error: 'An error occurred while updating the order status' });
  }
};


module.exports.updateUserAsAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isAdmin = !user.isAdmin;

    await user.save();

    res.status(200).json({ message: `User ${user.isAdmin ? 'made' : 'removed from'} admin successfully` });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the user as admin' });
  }
};


module.exports.getUsersWithOrders = async (req, res) => {
  try {
    const usersWithOrders = await User.find().populate('orders.productId');

    res.json(usersWithOrders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

module.exports.deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send('Internal Server Error');
  }
};