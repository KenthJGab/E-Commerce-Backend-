const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  
  		name: {
  			type: String,
  			required: [true, 'is Required']
  		},
  		description: {
  			type: String,
  			required: [true, 'is Required']
  		},
  		price: {
  			type: Number,
  			required: [true, 'Product Price is Required']
  		},
            
            imageLink: {
            type: String, 
            },

  		isActive: {
  			type: Boolean,
  			default: true
  		}, 
  		createdOn: {
  			type: Date,
  			default: new Date()
  		},  
  		userOrders: [
  			{
  				userId: {
  					type: String,
  					required: [true, 'User ID is Required']
  				},
  				orderedOn: {
  					type: Date,
  					default: new Date()
  				}
  			}
  		]
  });

module.exports = mongoose.model('Product', productSchema);