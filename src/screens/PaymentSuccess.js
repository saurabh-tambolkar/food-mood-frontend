import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, replace, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowDownToLine,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Loader2,
  Vault,
} from "lucide-react";
import apiClient from "../context/apiClient";
import { useSelector } from "react-redux";
import { useToast } from "../components/ui/use-toast";
import { CartContext } from "../context/CartContext";
import Invoice from "../components/Invoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { AuthContext } from "../context/Auth";
import { Button } from "../components/ui/button";

function PaymentSuccess() {
  const searchQuery = useSearchParams()[0];
  // console.log(searchQuery.get("refrence"))
  let paymentId = searchQuery.get("refrence");

  const [orderSuccess, setOrderSuccess] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [prodsInvoice, setProdsInvoice] = useState([]);
  const [prodsInvoicePrice, setProdsInvoicePrice] = useState("");
  const [prodsInvoiceDate, setProdsInvoiceDate] = useState("");

  const [isErrorInPlacingOrder, setIsErrorInPlacingOrder] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const { cartItems, total, handleEmptyCart, getCartLength, getCartItems } =
    useContext(CartContext);

  let { toast } = useToast();

  const placeOrder = async () => {
    try {
      const res = await apiClient.post(`/api/place-order/${paymentId}`);
      console.log(res.data);
      if (res.data.success) {
        setOrderSuccess(true);
        let invoiceData = res.data.data.products.map((prod) => ({
          name: prod.productId.name,
          price: prod.price,
          quantity: prod.quantity,
        }));
        setProdsInvoice(invoiceData);
        setProdsInvoicePrice(res.data.data.totalAmount);
        setProdsInvoiceDate(res.data.data.orderDate);
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been placed successfully",
        });
        getCartItems();
        getCartLength();
      }
    } catch (err) {
      console.log(err);
      setIsErrorInPlacingOrder(true);
      setErrMsg(err.response.data.message);
      toast({
        title: err.response.data.message,
        variant: "destructive",
      });
    }
  };

  const navigate = useNavigate()

  const gotoOrdersPage=()=>{
    navigate("/my-orders",{replace:true})
  }

  // useEffect(() => {
  //   placeOrder();
  // }, []);

  const invoiceRef = useRef();

  const invoiceData = {
    invoiceNumber: "INV-1001",
    date: prodsInvoiceDate?.split("T")[0],
    // paymentMethod: "Credit Card",
    items: prodsInvoice,
    total: prodsInvoicePrice,
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
    <div className="min-h-screen pt-40 w-full flex justify-center items-center md:pt-24 md: pb-24">
      {orderSuccess ? (
        <div className="bg-green-500 w-1/3 mx-auto  rounded-xl">
          <h1 className="text-center text-5xl font-bold p-4">Thank You!</h1>
          <h1 className="text-center text-2xl flex items-center justify-center font-bold p-10 gap-4">
            Order Successfull{" "}
            <CircleCheckBig
              strokeWidth={2.75}
              className="ml-1 text-white size-8"
            />
          </h1>
          <p className="text-center text-xl font-semibold p-5">
            Refrence No. : {searchQuery.get("refrence")}
          </p>
          <p className="text-center text-md font-semibold">
            {new Date().toLocaleTimeString()}
          </p>
          <p className="text-center text-md font-semibold">
            You will get your order soon.
          </p>
          {showInvoice ? (
            <div className="justify-center items-center flex m-8 flex-col relative">
              <div ref={invoiceRef} style={{ width: "300px" }}>
                <Invoice invoiceData={invoiceData} />
              </div>

              <button
                onClick={generatePDF}
                className="bg-slate-900 p-4 rounded-full absolute top-2 right-0"
              >
                {" "}
                <ArrowDownToLine className="text-white" />{" "}
              </button>
              <ChevronUp onClick={() => setShowInvoice(false)} />
            </div>
          ) : (
            <div
              className="flex justify-center m-8 cursor-pointer"
              onClick={() => setShowInvoice(true)}
            >
              <p>Invoice</p>
              <ChevronDown />
            </div>
          )}
          <div className="flex justify-center mb-4 items-center">
          <Button className="text-center" onClick={gotoOrdersPage}>Go to Orders</Button>
          </div>
        </div>
      ) : isErrorInPlacingOrder ? (
        <div className="bg-red-500 w-1/3 mx-auto h-auto p-4 rounded-xl">
          <h1 className="text-center text-5xl font-bold p-4">ERROR !</h1>
          <h1 className="text-center text-2xl flex items-center justify-center font-bold p-10 gap-4">
            {errMsg}
          </h1>
          <p className="text-center text-xl font-semibold p-5">
            Refrence No. : {searchQuery.get("refrence")}
          </p>
          <p className="text-center text-md font-semibold">
            {new Date().toLocaleTimeString()}
          </p>
          <p className="text-center text-md font-semibold pt-4">
            You can see your orders in My Orders page.
          </p>
        </div>
      ) : (
        <div className="bg-slate-200 dark:bg-slate-900 w-1/3 flex flex-col justify-center mx-auto h-[50vh] rounded-xl">
          <h1 className="text-center text-4xl font-bold p-4 flex items-center justify-center gap-4 ">
            Placing Your Order{" "}
            <Loader2
              strokeWidth={2.75}
              className="ml-1 text-white size-8 animate-spin"
            />
          </h1>
          <h1 className="text-center text-green-600 text-2xl font-bold p-4 flex items-center justify-center gap-4">
            Your payment was successful
            <CircleCheckBig
              strokeWidth={2.75}
              className="ml-1 text-green-600 size-8"
            />
          </h1>
          <p className="text-center text-md font-semibold">
            Kindly wait till we do it for you.
          </p>
          <p className="text-center text-xl font-semibold p-5">
            Refrence No. : {searchQuery.get("refrence")}
          </p>
          <p className="text-center text-md font-semibold">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccess;
