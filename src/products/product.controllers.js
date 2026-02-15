import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.js";
import { AddproductSchema } from "../validator/product.js"
import { findProductsbyName } from "./product.services.js";


export const AddProductController = async (req, res) => {
    try {
        let { error, value } = AddproductSchema.validate(req.body);

        if ( error ) return res.status(404).json({error: error.message});

        let { Name, Description, Price, ImgUrl,Category,Quantity, inStock,isActive} = value;

        const productExist =  await findProductsbyName({Name});
        
        if ( productExist ) return res.status(400).json({error: `Error, Product already exists. Kindly edit it`});

        if (!req.file ) {
          return res.status(400).json({error: `Image is required`})
        };
        
       if (inStock !== true)  return res.status(400).json({message: `Let the instock be true`})

       if ( isActive !== true ) return res.status(400).json({message: `Let the isActive be true`})
        
        

    const result = await cloudinary.uploader.upload( req.file.path, {
            folder: "freshbread/products",
        } );

    
      ImgUrl = result.secure_url

      

          const product = await Product.create({
            Name,
            Description,
            Price,
            Category,
            ImgUrl:result.secure_url,
            // pubicId:result.public_id,
            Quantity,
            inStock,
            isActive,
        });

      return res.status(201).json({message: `Product added successfully`, product})
        
    } catch (error) {
        console.log(error);
        return  res.status(500).json({ message: "server error" });
        
    }
};


export const UpdateProductController = async ( req, res ) => {

}


