const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema ({
	totalPrice: {
		type: Number
	},
	userId:{
		type: String,
		required: [true, "UserId is required"]
	},
	products: [
		{
			productId : {
				type: String,
				required: [true, "ProductId is required"]
			},
			name : {
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
			},
			addedOn: {
				type: Date,
				default: new Date()
			}
		}
	]
})

module.exports = mongoose.model("Cart", cartSchema);