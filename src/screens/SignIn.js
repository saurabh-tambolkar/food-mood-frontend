import React, { useContext, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2,Eye,EyeOff } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from '../components/ui/use-toast';
import { AuthContext } from '../context/Auth';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../context/apiClient';


const SignUpFormSchema = z.object({
  email: z.string().email({ message: "Email is invalid" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});


function SignIn() {

  const [showPass,setSowPass] = useState(false)

  const {toast} = useToast()
  const navigate = useNavigate();

  const {login,isSubmitting,setCurrentUser} = useContext(AuthContext)

  const form = useForm({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      location: ""
    }
  });

  
  const onSubmit=(data)=>{
    login(data)
  }

  const handleGoogleLogin = async (credentialResponse) => {
  const googleToken = credentialResponse.credential;
  console.log(googleToken);

  // // Send Google ID token to your backend
  const res = await apiClient.post('/api/auth/google', {
    idToken: googleToken,
  });
  console.log(res.data)
  if (res.data && res.data.success) {
        setCurrentUser(res.data.user);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        document.cookie = `fmCookie=${res.data.accessToken}; max-age=86400; path=/; Secure; SameSite=Strict`; 
        toast({
          title: res.data.message || 'Signed up successfully!',
          description: 'Welcome to Food Mood!',
          variant: 'success',
        });
        navigate('/');
      }
};

  return (
<div className="min-h-screen w-full pt-24 flex justify-center items-center bg-white dark:bg-slate-950">
<div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-gray-100 dark:bg-slate-900">
  <div className="text-center">
    <h1 className="text-2xl md:text-4xl font-extrabold lg:text-2xl mb-6">
      Sign In
    </h1>
  </div>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="Email" {...field} />
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
                <Input placeholder="Password" {...field}  type={showPass ? "text" : "password"}/>
              </FormControl>
              {
                showPass ?
                <EyeOff className="size-5 relative left-[250px] md:left-80 -top-10" onClick={()=>setSowPass(!showPass)}/>
                :
                <Eye className="size-5 relative left-[250px] md:left-80 -top-10" onClick={()=>setSowPass(!showPass)} />
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
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
    <div className='flex items-center gap-2'>
      <div className='h-0 w-full border-gray-200 border '></div>
          <p className='text-xs text-gray-500 '>OR</p>
      <div className='h-0 w-full border-gray-200 border '></div>
    </div>
    <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log("Login Failed")} />
  <div className='space-y-2'>
      <p className="text-left"><Link className="text-sky-600 hover:text-sky-800 text-sm" to={'/forgot-password'}>Forgot Password ?</Link></p>
      <p className="text-center">Create an account? <Link className="text-sky-600 hover:text-sky-800" to={'/sign-up'}>Sign Up</Link></p>
  </div>
</div>
</div>
  );
}

export default SignIn;
