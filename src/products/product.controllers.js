import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.js";
import { AddproductSchema } from "../validator/product.js"
import { findProductsbyName } from "./product.services.js";


export const AddProductController = async (req, res) => {
    try {
        let { error, value } = AddproductSchema.validate(req.body);

        if ( error ) return res.status(404).json({error: error.message});

        let { Name, Description, Price, ImgUrl,Category,Quantity, inStock,isActive, publicID} = value;

        const productExist =  await findProductsbyName({Name});
        
        if ( productExist ) return res.status(404).json({error: `Error, Product already exists. Kindly edit it`});

        if (!req.file ) {
          return res.status(400).json({error: `Image is required`})
        };
        
       if (inStock !== true)  return res.status(404).json({message: `Let the instock be true`})

       if ( isActive !== true ) return res.status(400).json({message: `Let the isActive be true`})
        
        

    const result = await cloudinary.uploader.upload( req.file.path, {
            folder: "freshbread/products",
        } );

    
     ImgUrl = result.secure_url
     publicID = result.public_id


      

          const product = await Product.create({
            Name,
            Description,
            Price,
            Category,
            ImgUrl,
            // pubicId:result.public_id,
            Quantity,
            publicID,
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
try {
    const { id } = req.params;

      const product = await findProductsbyName({id}) ;
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let ImgUrl = product.ImgUrl;
    let publicID = product.pubicId

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path);
      ImgUrl = uploaded.secure_url;
      publicID = uploaded.public_id;
    }

    await product.update({
        Name: req.body.name ?? product.Name,
      Price: req.body.price ?? product.Price,
      Description: req.body.description ?? product.Description,
      Category: req.body.Category ?? product.Category,
      isActive: req.body.isActive ?? product.isActive,
      inStock: req.body.inStock ?? product.inStock,
      Quantity: req.body.Quantity ?? product.Quantity,
     publicID: publicID,
      ImgUrl: ImgUrl
    });

   return res.status(201).json({ message: "Product updated successfully", product});
} catch (error) {
  console.log( `Error editting product, Kindly try again`, error  );
  return res.status(500).json({error: `Error edditing user `});
}  };


export const deletProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await findProductsbyName({id}) ;

    if ( !product ) return res.status(404).json({error: `Product doesnt exist`});

    await cloudinary.uploader.destroy(product.publicID);

    await product.destroy();

    return res.status(200).json({message: `Product deleted successfully `, product})
    
  } catch (error) {
     console.log(`Error deleting Product`, error);
     return res.status(500).json({error:`Internal server error`})
  }
}




