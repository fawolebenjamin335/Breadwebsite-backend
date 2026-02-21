import {Product} from "../models/product.js"

  export const findProductsbyName = async (Name) => {
      return await Product.findOne({where: Name});
};

 