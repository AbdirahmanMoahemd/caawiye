import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'



export const searchByQueryType = asyncHandler( async (req, res) => {
	const { type, query } = req.body;

	try {
		let products;

		switch (type) {
			case 'category':
				products = await Product.find({ category: query }).populate('category');;
				break;
		} 

		if (!products.length > 0) {
			products = await Product.find({});
		}
 
		res.json({ products });
	} catch (err) {
		console.log(err, 'filter Controller.searchByQueryType error');
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
});
