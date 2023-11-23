const express = require('express');
const productController = require("../controllers/product");
const auth = require("../auth") 

const {verify, verifyAdmin} = auth;

const router = express.Router();

router.post("/", verify, verifyAdmin, productController.addProduct);

router.get("/all", productController.getAllProducts);

router.get("/", productController.getAllActive);

router.post('/searchByName', productController.searchProductsByName);	

router.post('/searchByPrice', productController.searchProductsByPriceRange);

router.get("/:productId", productController.getProduct);

router.put("/:productId", verify, verifyAdmin, productController.updateProduct);

router.get('/:productId/order-users', productController.getEmailsOfUsers);

router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

router.delete('/:productId', verify, verifyAdmin, productController.deleteProduct);

module.exports = router;

