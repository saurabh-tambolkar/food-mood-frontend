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
import { Input } from '../components/ui/input';

const forgotPassSchema = z.object({
    email:  z.string().email({ message: "Email is invalid" }),
  });
  

function ForgotPassWord() {

    const [linkSent,setLinkSent] = useState(false)


    const form = useForm({
        resolver: zodResolver(forgotPassSchema),
        defaultValues: {
          email: ""
        }
      });

    const {toast} = useToast();


    const onSubmit=async(data)=>{
      try{
        console.log(data)
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/send-pass-link/${data.email}`);
        if(response && response.data.success){
            setLinkSent(true)
            toast({
                title: "Link sent successfully",
                description:"Check your mail to get the link",
                status: "success",
            })
            form.reset();
        }
      }
      catch(err){
        toast({
          title: err.response.data.message,
          variant: 'destructive',
        });
        console.log(err)
        form.reset();
      }
    }

  return (
    <div className="min-h-screen w-full pt-24 flex justify-center items-center bg-white dark:bg-slate-950">
      <div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-gray-100 dark:bg-slate-900">
      <Form {...form}>
        <h1 className="text-2xl text-center md:text-4xl font-extrabold lg:text-2xl mb-6">Forgot Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormDescription>You will get link in an email to reset your password.</FormDescription>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage>The shared link will be valid for 10 minutes.</FormMessage>
            </FormItem>
          )}
        />
 
        {
            linkSent ?
            <Button className="w-full cursor-not-allowed bg-green-600">Link sent successfully !</Button>
            :
            <Button type="submit" className="w-full ">Send Link</Button>
        }
      </form>
      
    </Form>
      </div>
    </div>
  )
}

export default ForgotPassWord;

