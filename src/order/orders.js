import { Cart } from "../models/cart.js";
import { CartItem } from "../models/cartitem.js";
import { Order } from "../models/order.js";
import { Orderitem } from "../models/orderitem.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { updateOrderStatusSchema } from "../validator/order.validator.js";



export const CreateOrderController = async ( req, res ) => {
    try {

        const userId = req.user.id;
        const cart = await Cart.findOne({ where: {userId} });
        if (!cart) return res.status(404).json({ message: `Cart not found` });

        const cartItems = await CartItem.findAll({
            where: { cartId : cart.id },
            include: [ Product ]
        });

        if ( cartItems.length === 0 ) return res.status(400).json({ message: `Cart is empty. Kindly check for your fav bread` });

        let totalAmount = 0

        cartItems.forEach((item) => {
            totalAmount += Number(item.Product.Price) * item.quantity ;
        });

        const order = await Order.create({
            userId,
            totalAmount,
            orderAddress: req.body.orderAddress,
            status: "pending",
            paymentStatus: "pending"
        });

        const orderItemsData = cartItems.map((item) => ({
            orderId : order.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.Product.Price,
        }));

        await Orderitem.bulkCreate(orderItemsData);

        await CartItem.destroy({ where: { cartId: cart.id } });

        return res.status(201).json({ message: `Order created successfully`, order });


        
    } catch (error) {
        console.log(`Error creating order `, error);
        return res.status(500).json({ error: `Internal server Error` });

        
    };
};


    export const UsergetOrderController = async (req,res) => {
        try {
            const orders = await Order.findAll({
                where: { userId : req.user.id },
                include: [
                    {
                        model: Orderitem,
                        include: [Product],
                    },
                ],
            });

            return res.status(200).json({ message: `Your orders`,orders });
            
        } catch (error) {

        console.log(`Error getting users`, error);
        return res.status(500).json({ error: `Internal Server Error` });
        
            
        };
    };


    export const UsergetOneOrder = async (req, res) => {
      try {

        const order = await Order.findOne({
            where: { id: req.params.id, userId: req.user.id },
            include: [ { model: Orderitem, include: [Product] }  ],
        });

      if (!order) {return res.status(404).json({message: `Error, Order not found `})}

     return res.status(200).json({ message: `Your Order`, order });



        
      } catch (error) {
          console.log(`Error getting your order`, error);
           return res.status(500).json({ error: `Internal Server Error` });
      }        
    };


    // ADMIN WORKS NOW 
    export const AdminGetAllOrders = async (req, res) => {
        try {
            
            const orders = await Order.findAll({
               include: [
                User, 
                {
                    model: Orderitem,
                    include: [ Product ],
                },
               ] ,
            });

            if (!orders) return res.status(404).json({ error: `No order available sir/ma` });

            return res.status(200).json({ message: `Order`, orders });

        } catch (error) {
            console.log(`Error getting the orders`, error);
           return res.status(500).json({ error: `Internal Server Error` });
        }
        
    };


    export const updateOrderStatus = async (req, res) => {
        try {
            
            const { error, value  } = updateOrderStatusSchema.validate(req.body);
            if ( error ) return res.status(403).json({ error: error.message });

            const { status } = value;

            const order = await Order.findByPk(req.params.id);
            if ( !order ) return res.status(404).json({ error: `Order not found` });

            order.status = status;

            await order.save();

            return res.status(201).json({ message: `Order status updated`, order });


        } catch (error) {
            console.log("Error updating order status", error);
            return res.status(500).json({ error: "Internal Server Error" });
            
        }
        
    };




    export const DeleteOrderController = async ( req, res ) => {
        try {
            
            const order = await Order.findByPk(req.params.id);

            if ( !order ) return res.status(404).json({ message: `Order not found` });

            await Orderitem.destroy({ where: { orderId: order.id } });
            await order.destroy();

            return res.status(200).json({ message: "Order deleted successfully" , order});

        } catch (error) {
            console.log("Error deleting order", error);
            return res.status(500).json({ error: "Oops Internal Server Error" });
        }
    }


