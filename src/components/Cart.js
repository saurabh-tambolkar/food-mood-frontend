import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { CircleMinus, CirclePlus, Trash2 } from 'lucide-react' 
import { dropCart, removeProduct } from '../context/slice'
import axios from 'axios'
import { AuthContext } from '../context/Auth'
import apiClient from '../context/apiClient'
import { useToast } from './ui/use-toast'
import { CartContext } from '../context/CartContext'

function Cart() {

  const {currentUser} = useContext(AuthContext)
  const {cartItems,total,handleEmptyCart,getCartLength,getCartItems} = useContext(CartContext)

  const {toast} = useToast()

    

    const handleRemoveItem=(item)=>{
      console.log("item removed",item)
    }

    const handleIncItem=async(item)=>{
      try{
        let dataToSend = {
          productId:item.productId._id,
          quantity:1,
          size:item.size
          }
        let response = await apiClient.post('/api/updateQuantity/inc',dataToSend)
        console.log(response.data)
        if(response.data.success){
          toast({
            title: 'Item quantity updated',
            description: response.data.message,
          })
          getCartLength();
          getCartItems();
        }
        console.log(dataToSend)
      }
      catch(err){
        console.log(err)
        toast({
          title: err.response.data.message,
          variant:"destructive"
        })

      }
    }

    const handleDecItem=async(item)=>{
      try{
        let dataToSend = {
          productId:item.productId._id,
          quantity:1,
          size:item.size
          }
        let response = await apiClient.post('/api/updateQuantity/dec',dataToSend)
        console.log(response.data)
        if(response.data.success){
          toast({
            title: 'Item quantity updated',
            description: response.data.message,
          })
          getCartLength();
          getCartItems();
        }
        console.log(dataToSend)
      }
      catch(err){
        console.log(err)
        toast({
          title: err.response.data.message,
          variant:"destructive"
        })

      }
    }

    const handleCheckOutCart=async(amt)=>{
      console.log("this is amount",amt)
      try{
        const {data:{key}} = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/get-key`)
        const {data:order} = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/create-order`,{amount:amt})
        console.log(order,order.order.id,order.order.amount)
        const options = {
          key: key, // Enter the Key ID generated from the Dashboard
          amount: order.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "Food Mood",
          description: "This is an order checkout page",
          image: "https://media-cdn.tripadvisor.com/media/photo-s/0a/0b/af/01/food-mood-logo.jpg",
          order_id: order.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          callback_url: `${process.env.REACT_APP_BASE_URL}/api/verify-payment`,
          prefill: {
              name: currentUser.name,
              email: currentUser.email,
              contact: currentUser.mobileNumber
          },
          notes: {
            // "cartItems": JSON.stringify(cart),
              "address": "Razorpay Corporate Office"
          },
          theme: {
              "color": "#0F172A"
          }

        };
        const paymentObject = new window.Razorpay(options); 
        paymentObject.open();
      }
      catch(err){
        console.log(err)
      }
    }

   

  return (
    <div className='cart flex flex-col gap-5 pt-24 w-full min-h-screen flex justify-center items-center'>
      <div className="mycart w-11/12 md:w-4/12 bg-gray-300 dark:bg-slate-900 rounded mx-auto flex justify-center flex-col items-center p-8">
      <h1 className='text-3xl font-bold mb-4'>Your Cart</h1>
      <p className='mb-4'>Total items: {cartItems.length} </p>
      {
        cartItems.length == 0 ?
        (
            <div>
                <h3>Your cart is empty</h3>
            </div>
        )
        :
        cartItems.map((item)=>{
            return(
                <div key={item.id} className='item m-2 md:m-2 grid grid-cols-4 gap-2 md:gap-5'>
                    <img src={item.productId.img} className='rounded w-full h-full object-cover'/>
                    <div className="details w-full col-span-2">
                    <h3 className='font-bold'>{item.productId.name}</h3>
                    <div className="size flex justify-between w-full">
                    <h4 className='font-bold'>Size: {item.size}</h4>
                    <h4 className='font-bold w-4/12 flex justify-evenly items-center'>
                    <CirclePlus className='size-5' onClick={()=>handleIncItem(item)}/>
                    {item.quantity} 
                    <CircleMinus className='size-5' onClick={()=>handleDecItem(item)}/></h4>
                    </div>
                    <h4 className='font-bold'>Price: {item.price}</h4>
                    </div>
                    <div className="delete flex justify-center items-center">
                    <Trash2 onClick={()=>handleRemoveItem(item)} />
                    </div>
                    {/* <h2>Total Price: ${totalPrice.toFixed(2)}</h2> */}
                </div>
            )
        })
      }
      {
        cartItems.length > 0 && (
          <div className="bottom mt-8 space-x-4">
        <Button onClick={handleEmptyCart}>Empty Cart</Button>
        <Button onClick={()=>handleCheckOutCart(total)}>Checkout : {total} ₹</Button>
      </div>
        )
      }
      </div>
    </div>
  )
}

export default Cart
