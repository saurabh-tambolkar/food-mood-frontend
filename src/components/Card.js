import React, { useContext, useState } from 'react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct,removeProduct,updateProduct,dropCart } from '../context/slice';
import { useToast } from './ui/use-toast';
import apiClient from '../context/apiClient';
import { CartContext } from '../context/CartContext';


function Card({options,foodItems}) {


  const {toast} = useToast()

  let data = options[0]
  let sizeOptions = Object.keys(data)
  // console.log(sizeOptions[0])

  const [quantity,setQuantity] = useState(1)
  const [size,setSize] = useState(sizeOptions[0])

  let finalPrice=quantity*parseInt(data[size],10)

  const {getCartLength,getCartItems} = useContext(CartContext)

  const handleAddToCartModel=async(item)=>{
    try {
      let dataToSend = {
        productId:item._id,
        size:size,
        quantity,
        price:finalPrice,
      }
      console.log(dataToSend)
      const response = await apiClient.post('/api/addToCart',dataToSend)
      console.log(response)
      if(response.data.success){
        getCartLength();
        getCartItems();
        toast({
          title: 'Item Added',
          description: 'Product has been added to your cart',
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Item cant be added',
        description: 'Product has not been added to your cart',
        variant:"destructive"
      })
    }
  }

  return (
    <div className='card m-4 shadow-lg dark:bg-gray-800 text-black  dark:text-white min-w-72 max-h-fit rounded-md'>
      <img src={foodItems.img} className='h-48 w-full rounded object-cover' alt="" srcset="" />
      <div className="body p-1">
        <h1 className='text-2xl'>{foodItems.name}</h1>
        <p className='text-sm p-1'>{foodItems.description}</p>
      </div>
      <div className="options w-full p-1 flex justify-around">
        <select className='rounded w-2/12 h-100 bg-white dark:bg-gray-800 border border-gray-500 border-1' onChange={(e)=>setQuantity(e.target.value)}>
          {
            Array.from(Array(6),(e,i)=>{
              return(
                <option keys={i+1} value={i+1}>{i+1}</option>
              )
            })
          }
        </select>
        <select className='rounded w-4/12 h-100 bg-white dark:bg-gray-800 border border-gray-500 border-1' onChange={(e)=>setSize(e.target.value)}>
          {
            sizeOptions.map((size)=>{
              return(
                <option value={size}>{size}</option>
              )
            })
          }
        </select>
        <div>
          <p>Total: {finalPrice}</p>
        </div>
      </div>
      <div className="flex justify-center p-1">
        {/* <Button className=" text-white dark:text-black font-bold" onClick={()=>handleAddToCart(foodItems)}>Add to Cart</Button> */}
        <Button className=" text-white dark:text-black font-bold" onClick={()=>handleAddToCartModel(foodItems)}>Add to Cart</Button>
      </div>
    </div>
  )
}

export default Card
