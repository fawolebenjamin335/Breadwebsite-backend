import { Cart } from "../models/cart.js";
import { CartItem } from "../models/cartitem.js";
import { Product } from "../models/product.js";
import { AddtoCartSchema, UpdateCartSchema } from "../validator/cart.js";



export const addToCart = async (req, res) => {
    try {
        
        const userId = req.user.id;
        const {error, value} = AddtoCartSchema.validate(req.body);

        if (error) return res.status(400).json({ error: error.message });

        let { productId , quantity } = value;

       const productExist = await Product.findByPk(productId);

        if (!productExist) return res.status(404).json({ error: `Product to add doesnt exist ` });

        let cart = await Cart.findOne({where: {userId: userId}});

        if (!cart) {
            cart = await Cart.create({userId: userId});
        };

        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId: productId }
        });

        if ( cartItem ) {
            cartItem.quantity += quantity || 1;
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId : productId,
                quantity: quantity || 1
            });
        }

        return res.status(201).json({ message: `Product added to cart successfully ` })

    } catch (error) {
        console.log(`Error adding product to cart`, error);
        return res.status(500).json({ error: `Internal Server Error` });
        
    };
};



export const Getcart = async ( req, res ) => {
    try {

        const cart = await Cart.findOne({
            where: { userId : req.user.id },
            include: [
        { 
            model: CartItem,
        include: [ Product ]
    }
            ]
        });

        if ( !cart ) return res.status(404).json({ items : [] })
        
        return res.status(200).json({ message: `Your cart`, cart });
        
    } catch (error) {
        console.log(`Error showing cart`);
        return res.status(500).json({ error: `Internal Server error` })
        
        
    };
};


export const UpdateCartItem = async (req, res) => {
    try {

        const { error,  value} = UpdateCartSchema.validate(req.body);
        if ( error ) return res.status(400).json({error: error.message});
        const { cartItemId, quantity } = value;
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) return res.status(404).json({ error: `Item not found` });

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(201).json({  message: `Cart Item updated successfully ` , cartItem});

        
    } catch (error) {
        console.log(`Error updating cartItem`, error);
        return res.status(500).json({ error: `Internal Server Error` });
        
        
    }
    
};


export const removeCartItem = async (req, res) => {
  try {
    const { cartItemId } = req.params;

    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    await cartItem.destroy();
   return  res.json({ message: "Item removed" });
  } catch (error) {
    console.log(`Error deleting cartItem`, error);
    
    return res.status(500).json({ message: "Internal Server error" });
  }
};