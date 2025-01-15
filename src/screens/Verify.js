import React, { useEffect, useState } from 'react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../components/ui/input-otp"
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "../components/ui/form";
import { Button } from '../components/ui/button';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { useToast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const VerifyOTPSchema = z.object({
    otp:  z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
      }),
  });
  

function Verify() {


   const [resend,setResend] = useState(false)
   const [time,setTime] = useState(45)

   
  useEffect(() => {
    // Create the interval
    const intervalId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);  // Clear the interval when time reaches 0 or less
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function to clear interval when component unmounts or on re-render
    return () => clearInterval(intervalId);
  }, []);

    const form = useForm({
        resolver: zodResolver(VerifyOTPSchema),
        defaultValues: {
          otp: ""
        }
      });

    const {toast} = useToast();  
    const navigate = useNavigate()


    const resendOtp=async()=>{
      try{
        setResend(true)
        const email = localStorage.getItem("userEmailFoodMood")
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/resend-mail/${email}`)
        console.log(response)
        toast({
          title: "OTP has been sent successfully",
        })
      }
      catch(err){
        console.log(err)
        toast({
          title: "Error",
          description: "Failed to resend OTP",
          variant:"destructive"
        })
      }
    }

    const onSubmit=async(data)=>{
      try{
        const email = localStorage.getItem("userEmailFoodMood")
        const dataToSend = {...data,email}
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/verify-otp`, dataToSend);
        console.log(response)
        if(response.data.success){
          toast({
            title: response.data.message || "User verified successfully!",
            variant: 'success',
          });
          localStorage.removeItem("userEmailFoodMood")
          navigate('/sign-in')
        }
      }
      catch(err){
        toast({
          title: err.response.data.message || "User verified successfully!",
          variant: 'destructive',
        });
        console.log(err)
      }
    }

  return (
    <div className="min-h-screen w-full pt-24 flex justify-center items-center bg-white dark:bg-slate-950">
      <div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-gray-100 dark:bg-slate-900">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator/>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <Button type="submit w-full">Submit</Button>
      </form>
      <div>
      {/* <p className="text-center">Didn't got the OTP? <span className="text-sky-600 hover:text-sky-800">{!resend ? "Resend OTP" :"OTP has been sent."}</span></p> */}
      <p className="text-center space-x-3">Didn't got the OTP? 
        {
          time !== 0 ?
        <span className="text-sky-600 hover:text-sky-800 cursor-not-allowed">
          Resend OTP in {time} sec
        </span>
        : 
        !resend ?
        <span className="text-sky-600 hover:text-sky-800 cursor-pointer" onClick={resendOtp}>
          Resend OTP
          </span>
        :
        <span className="text-sky-600 hover:text-sky-800 cursor-not-allowed">
          OTP has been sent.
        </span>
        }
      </p>
  </div>
    </Form>
      </div>
    </div>
  )
}

export default Verify
