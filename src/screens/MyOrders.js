import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import apiClient from '../context/apiClient';
import { ChevronDown,ChevronUp } from 'lucide-react';

function MyOrders() {

  const [orders,setOrders] = useState([]);
 

  const navigate=useNavigate()


  const secret=async()=>{
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/secret`,{ withCredentials: true })
    console.log(response)
  }

  const getMyOrders = async()=>{
    try{
      const response = await apiClient.get(`/api/get-Orders`,{withCredentials:true})
      console.log("this is response of orders",response)
      setOrders(response.data.orders)
    }
    catch(err){
      console.log("thisis err",err)
      setOrders([])
    }
  }

  useEffect(()=>{
    getMyOrders()
  },[])

  return (
    <div className='min-h-screen pt-40 md:pt-24 menu w-11/12 mx-auto'>
      {/* <button onClick={secret}>Hit secret here</button> */}
      {
        orders.length !==0 ?
        <div>
          <h1 className="text-5xl font-bold m-8">My Orders</h1>
          {
            orders.map((order,index)=>{
              return(
                <OrderComp order={order}/>
              )
            })
          }
        </div>
        :
        <div className='flex justify-center items-center h-[80vh] flex-col space-y-10'>
          
          <h1 style={{fontFamily:"Protest Revolution"}} className='text-3xl font-semibold text-amber-600'>Ooops , No Orders Found!</h1>
          <Button onClick={()=>navigate('/menu')}>See Menu</Button>
        </div>
      }
    </div>
  )
}

export default MyOrders


export function OrderComp({order}) {

  const [showProd,setShowProd] = useState(false)

  return (
    <div className='bg-slate-200 dark:bg-slate-900 rounded-md p-4 m-4 w-full md:w-3/4 mx-auto'>
    <div className='flex justify-between'>
    <p className='font-semibold'>{order.orderDate.split("T")[0]}</p>
    <div className='flex space-x-10'>
      {
        !showProd ?
        <ChevronDown strokeWidth={2.75} className="ml-1 dark:text-white size-5 " onClick={()=>setShowProd(!showProd)}/>
        :
        <ChevronUp strokeWidth={2.75} className="ml-1 dark:text-white size-e-5 " onClick={()=>setShowProd(!showProd)}/>

      }
    <p className={` p-1 rounded-md text-xs font-semibold ${order.status=='Pending' ? "bg-amber-500 " : order.status == "Completed" ? 'bg-green-500' : order.status == "Cancelled" ? 'bg-red-600 text-white' : 'bg-amber-300'}`}>{order.status}</p>
    </div>
    </div>
    {
      showProd && <div className='grid grid-cols-1 md:grid-cols-2 gap-4 m-5'>
      {
        order.products.map((ord,index)=>{
          return(
            <div className='flex justify-between mx-auto bg-slate-300 dark:bg-slate-950 w-3/5 rounded'>
              <img src={ord.productId.img} className='w-2/5 rounded object-cover'/>
              <div className='text-left p-2'>
                <p className='font-bold'>{ord.productId.name}</p>
                <p className='font-semibold'>Size : {ord.size}</p>
                <p className='font-semibold'>Quantity : {ord.quantity}</p>
                <p className='font-semibold'>Price : {ord.price} ₹</p>
              </div>
            </div>
          )
        })
      }
      </div>
    }
    <div className='flex justify-between m-4'>
    <p className='font-semibold'>Total Itmes : {order.products.length}</p>
    <p className={'font-semibold'}>Total : {order.totalAmount} ₹</p>
    </div>
  </div>
  )
}
