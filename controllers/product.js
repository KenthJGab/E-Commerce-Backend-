const Product = require("../models/Product");
const User = require("../models/User");


module.exports.addProduct = (req, res) => {
	let newProduct = new Product({
			name : req.body.name,
			description : req.body.description,
			price : req.body.price
		});

	return newProduct.save().then((product, error) => {
		if (error) {
			return res.send(false);

		} else {
			return res.send(true);
		}
	})
	.catch(err => res.send(err))
}


module.exports.getAllProducts = (req, res) => {
	return Product.find({}).then(result => {
		return res.send(result);
	})
	.catch(err => res.send(err))
};


module.exports.getAllActive = (req, res) => {
	return Product.find({ isActive : true }).then(result => {
		return res.send(result);
	})
	.catch(err => res.send(err))
};


module.exports.getProduct = (req, res) => {
	return Product.findById(req.params.productId).then(result => {
		return res.send(result);
	})
	.catch(err => res.send(err))
};


module.exports.updateProduct = (req, res) => {
		let updatedProduct = {
			name : req.body.name,
			description	: req.body.description,
			price : req.body.price,
			imageLink: req.body.imageLink,
		};

		return Product.findByIdAndUpdate(req.params.productId, updatedProduct).then((product, error) => {

			if (error) {
				return res.send(false);

			} else {				
				return res.send(true);
			}
		})
		.catch(err => res.send(err))
	};


module.exports.archiveProduct = (req, res) => {

	let updateActiveField = {
		isActive: false
	}

	return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
	.then((product, error) => {

		if(error){
			return res.send(false)

		} else {
			return res.send(true)
		}
	})
	.catch(err => res.send(err))

};


module.exports.activateProduct = (req, res) => {

	let updateActiveField = {
		isActive: true
	}

	return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
		.then((product, error) => {

		if(error){
			return res.send(false)

		// failed
		} else {
			return res.send(true)
			}
	})
	.catch(err => res.send(err))

};


module.exports.searchProductsByName = async (req, res) => {
	try {
	  const { productName } = req.body;
  
	  const products = await Product.find({
		name: { $regex: productName, $options: 'i' }
	  });
  
	  res.json(products);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
};


module.exports.getEmailsOfUsers = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userIds = product.enrollees.map(enrollee => enrollee.userId);

    const enrolledUsers = await User.find({ _id: { $in: userIds } });

    const emails = enrolledUsers.map(user => user.email);

    res.status(200).json({ emails });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while retrieving enrolled users' });
  }
};


exports.searchProductsByPriceRange = async (req, res) => {
	try {
	  const { minPrice, maxPrice } = req.body;
  
	  const products = await Product.find({
		price: { $gte: minPrice, $lte: maxPrice }
	  });
  
	  res.status(200).json({ products });
	} catch (error) {
	  res.status(500).json({ error: 'An error occurred while searching for products' });
	}
  };


module.exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (deletedProduct) {
      res.send(true);
    } else {
      res.send(false); 
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Internal Server Error');
  }
};

