import React, { createContext, useContext, useEffect, useState } from 'react'
import apiClient from './apiClient';
import { useToast } from '../components/ui/use-toast';
import { AuthContext } from './Auth';

const CartContext = createContext();

export default function CartProvider({children}) {
    // let name = "saurabh";
    let {currentUser} = useContext(AuthContext);
    console.log("this is current  user form cart",currentUser)

    const [cartLength, setCartLength] = useState("0");

    const {toast} = useToast();

      let getCartLength = async () => {
        try {
          const response = await apiClient.get("/api/getCartLength");
          if (response.data.success) {
            console.log(response.data);
            setCartLength(response.data.numberOfItemsInCart);
          }
        } catch (error) {
          console.error(error);
          setCartLength("0")
        }
      };

      const [cartItems,setCartItems] = useState([])
      const [total,setTotal] = useState("0")
      const getCartItems =async()=>{
        try{
          const response = await apiClient.get('/api/getCart')
          setCartItems(response.data.cart.products)
          console.log("this is items",response.data.cart.products)
          setTotal(response.data.cart.totalAmount)
        }
        catch(err){
          console.log(err)
        }
      }

      const handleEmptyCart=async()=>{
        try {
          const response = await apiClient.delete("/api/empty-cart");
          if(response.data.success){
            toast({
              title: 'Cart is emptied successfully',
            })
            setCartItems([])
            getCartLength();
          }
        } catch (error) {
          toast({
            title: 'Cart cannot be emptied right now',
          })
        }
      }
  
      useEffect(()=>{
        if(currentUser!==null){
          getCartItems()
          getCartLength();
        }
      },[])
    

  return (
    <CartContext.Provider value={{cartLength,cartItems,total,handleEmptyCart,getCartLength,getCartItems}}>
        {children}
    </CartContext.Provider>
  )
}

export {CartContext}