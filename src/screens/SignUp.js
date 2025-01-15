import React, { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2,Eye,EyeOff } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { useToast } from "../components/ui/use-toast"
import { useNavigate } from 'react-router-dom';


const SignUpFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Email is invalid" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  mobileNumber: z.string().min(10, { message: "Mobile Number must be of 10 characters" })
});


function SignUp() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass,setSowPass] = useState(false)
  const {toast} = useToast();

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobileNumber: ""
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/sign-up`, data);
      console.log("Response:", response);
  
      if (response.data && response.data.success) {
        toast({
          title: response.data.message || "Verify yourself firstly!",
          description: "Welcome to Food Mood!",
          variant: 'success',
        });
        localStorage.setItem("userEmailFoodMood",data.email)
        navigate('/verify-user');
      } else {
        toast({
          title: response.data.message || "Sign up failed!",
          description: "Can't sign up now, try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
  
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast({
        title: errorMessage,
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
<div className="min-h-screen pt-24 flex justify-center items-center bg-white dark:bg-slate-950">
<div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-gray-100 dark:bg-slate-900">
  <div className="text-center">
    <h1 className="text-2xl md:text-4xl font-extrabold lg:text-2xl mb-6">
      Join Food Mood
    </h1>
  </div>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Name</FormLabel> */}
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage className="text-gray-500 text-xs ml-5 ">
                You will get an OTP on this mail.
              </FormMessage>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Location</FormLabel> */}
              <FormControl>
                <Input placeholder="Mobile Number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-x-1">
              {/* <FormLabel>Password</FormLabel> */}
              <FormControl>
                <Input placeholder="Password" {...field} type={showPass ? "text" : "password"} />
              </FormControl>
              {
                showPass ?
                <EyeOff className="size-5 relative left-80 -top-10" onClick={()=>setSowPass(!showPass)}/>
                :
                <Eye className="size-5 relative left-80 -top-10" onClick={()=>setSowPass(!showPass)} />
              }
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  <div>
      <p className="text-center">Already a member? <Link className="text-sky-600 hover:text-sky-800" to={'/sign-in'}>Sign In</Link></p>
  </div>
</div>
</div>
  );
}

export default SignUp;
