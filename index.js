const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');

//AWS server
const port = 4001;

//Test
//const port = 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

//Connect to database (MongoDB Atlas)
mongoose.connect("mongodb+srv://admin:admin@zuitt-bootcamp.ijcrtcy.mongodb.net/bookingAPI-capstone2?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});


//http://ec2-18-216-90-85.us-east-2.compute.amazonaws.com/b1


mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

//AWS Server
app.use('/E-Commerce-Backend-/users', userRoutes);
app.use('/E-Commerce-Backend-/products', productRoutes);
app.use('/E-Commerce-Backend-/orders', orderRoutes);
app.use('/E-Commerce-Backend-/cart', cartRoutes);

//Test LocalHost
// app.use('/users', userRoutes);
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
// app.use('/cart', cartRoutes);


if (require.main === module) {
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${ process.env.PORT || port}`)
	})
}

module.exports = {
	app,
	mongoose
};
