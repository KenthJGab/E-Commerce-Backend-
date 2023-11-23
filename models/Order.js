const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

	totalPrice: {
		type: Number
	},
	purchasedOn: {
		type: Date,
		default: new Date()
	},
	products : [
		{	
			name : {
				type: String,
				required: [true, "ProductId is required"]
			},
			productId : {
				type: String,
				required: [true, "ProductId is required"]
			},
			quantity: {
				type: Number,
				required: [true, "Quantity is required"],
				default: 1
			},
			totalPerProduct: {
				type: Number
                
			}
		}
	],
	userId:{
		type: String,
		required: [true, "UserId is required"]
	}
	
	
})

module.exports = mongoose.model("Order", orderSchema)