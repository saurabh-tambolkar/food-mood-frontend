import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { CircleCheckBig,Loader2, Vault } from 'lucide-react';
import apiClient from '../context/apiClient';
import { useSelector } from 'react-redux';
import { useToast } from '../components/ui/use-toast';
import { CartContext } from '../context/CartContext';
import Invoice from "../components/Invoice"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function PaymentSuccess() {

    const searchQuery= useSearchParams()[0];
    // console.log(searchQuery.get("refrence"))
    let paymentId = searchQuery.get("refrence")

    const [orderSuccess,setOrderSuccess] = useState(false)

    const [isErrorInPlacingOrder,setIsErrorInPlacingOrder] = useState(false);
    const [errMsg,setErrMsg] = useState('');

    const {cartItems,total,handleEmptyCart,getCartLength,getCartItems} = useContext(CartContext)

    let {toast} = useToast();

    const placeOrder = async()=>{
      try{
       const res = await apiClient.post(`/api/place-order/${paymentId}`)
       console.log(res.data)
       if(res.data.success){
        setOrderSuccess(true)
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed successfully",
        })
        getCartItems();
        getCartLength();
      }
    }
    catch(err){
      console.log(err)
      setIsErrorInPlacingOrder(true)
      setErrMsg(err.response.data.message)
      toast({
        title: err.response.data.message,
        variant:"destructive"
      })
      }
    }

    useEffect(()=>{
      placeOrder()
    },[])


     const invoiceRef = useRef();


     const invoiceData = {
  invoiceNumber: "INV-1001",
  customerName: "Saurabh Tambolkar",
  email: "saurabh@example.com",
  date: "2025-07-29",
  paymentMethod: "Credit Card",
  items: [
    {
      name: "Veggie Delight Pizza",
      quantity: 2,
      price: 299,
    },
    {
      name: "Choco Lava Cake",
      quantity: 1,
      price: 129,
    },
    {
      name: "Coca-Cola (500ml)",
      quantity: 3,
      price: 50,
    },
  ],
  total: 299 * 2 + 129 + 50 * 3, // 597 + 129 + 150 = 876
};


  // const invoiceDetails = {
  //   invoiceNumber: `INV-${Date.now()}`,
  //   customerName: orderData.user.name,
  //   email: orderData.user.email,
  //   items: orderData.items,
  //   total: orderData.total,
  //   date: new Date().toLocaleDateString(),
  //   paymentMethod: orderData.paymentMethod,
  // };

  const generatePDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save(`${invoiceData.invoiceNumber}.pdf`);
  };

  return (
    <div className='min-h-screen pt-40 w-full flex justify-center items-center md:pt-24'>
      {
        orderSuccess ?
        <div className='bg-green-500 w-1/3 mx-auto h-[50vh] rounded-xl'>
        <h1 className='text-center text-5xl font-bold p-4'>Thank You!</h1>
        <h1 className='text-center text-2xl flex items-center justify-center font-bold p-10 gap-4'>Order Successfull <CircleCheckBig strokeWidth={2.75} className="ml-1 text-white size-8" /></h1>
        <p className='text-center text-xl font-semibold p-5'>Refrence No. : {searchQuery.get("refrence")}</p>
        <p className='text-center text-md font-semibold'>{new Date().toLocaleTimeString()}</p>
        <p className='text-center text-md font-semibold'>You will get your order soon.</p>
      </div>
      :
      isErrorInPlacingOrder ?
      <div className='bg-red-500 w-1/3 mx-auto h-auto p-4 rounded-xl'>
        <h1 className='text-center text-5xl font-bold p-4'>ERROR !</h1>
        <h1 className='text-center text-2xl flex items-center justify-center font-bold p-10 gap-4'>{errMsg}</h1>
        <p className='text-center text-xl font-semibold p-5'>Refrence No. : {searchQuery.get("refrence")}</p>
        <p className='text-center text-md font-semibold'>{new Date().toLocaleTimeString()}</p>
        <p className='text-center text-md font-semibold pt-4'>You can see your orders in My Orders page.</p>
      </div>
      :
      <div className='bg-slate-200 dark:bg-slate-900 w-1/3 flex flex-col justify-center mx-auto h-[50vh] rounded-xl'>
        <h1 className='text-center text-4xl font-bold p-4 flex items-center justify-center gap-4 '>Placing Your Order <Loader2 strokeWidth={2.75} className="ml-1 text-white size-8 animate-spin" /></h1>
        <h1 className='text-center text-green-600 text-2xl font-bold p-4 flex items-center justify-center gap-4'>Your payment was successful<CircleCheckBig strokeWidth={2.75} className="ml-1 text-green-600 size-8" /></h1>
        <p className='text-center text-md font-semibold'>Kindly wait till we do it for you.</p>
        <p className='text-center text-xl font-semibold p-5'>Refrence No. : {searchQuery.get("refrence")}</p>
        <p className='text-center text-md font-semibold'>{new Date().toLocaleTimeString()}</p>
        
      </div>
      }

       <div ref={invoiceRef} style={{ backgroundColor:'red' }}>
        <Invoice invoiceData={invoiceData} />
      </div>
       <button onClick={generatePDF}>Download Invoice</button>
    </div>
  )
}

export default PaymentSuccess
