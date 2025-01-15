import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem } from '../components/ui/form'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Loader2 } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../components/ui/use-toast'
import axios from 'axios'
import {CircleCheckBig} from "lucide-react"

const resetPassSchema = z.object({
    password:z.string().min(8,{message:'Password must be atleast of 8 characters.'})
})

function ResetPass() {

    const [isReseting,setIsReseting] = useState(false)
    const [reseted,setReseted] = useState(false)

    const navigate = useNavigate();


    const params = useParams();
    const {toast} = useToast()

    const form = useForm({
        resolver: zodResolver(resetPassSchema),
        defaultValues:{
            password:""
        }
    })


    const onSubmit=async(data)=>{
        setIsReseting(true)
        try{
            const dataToSend = {token:params.token,password:data.password}
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/reset-password`,dataToSend)
            if(response && response.data.success){
                toast({
                    title:response.data.message
                })
                setReseted(true)
                setTimeout(()=>{
                  navigate('/sign-in')
                },5000)
                // startTimer();
            }

        }
        catch(err){
            console.log(err)
            toast({
                title:err.response.data.message || "Cant reset password.",
                variant:"destructive"
            })
            form.reset();
        }
        finally{
            setIsReseting(false)
        }
    }

  return (
    <div className="min-h-screen w-full pt-24 flex justify-center items-center bg-white dark:bg-slate-950">
      {
        reseted ?
        <div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-green-500 dark:bg-slate-900">
            <div className='flex justify-center items-center'>
            <CircleCheckBig className='size-12'/>
            </div>
            <h1 className='text-center text-lg font-bold'>Your password has been reset successfully</h1>
            <p>You will be redirected to Sign In page in 5 seconds.</p>
            <Button className="w-full" onClick={()=>navigate('/sign-in')}>Sign In</Button>
      </div>
        :
        <div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-gray-100 dark:bg-slate-900">
      <Form {...form}>
        <h1 className="text-2xl text-center md:text-4xl font-extrabold lg:text-2xl mb-6">Reset Your Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="Password" {...field}/>
              </FormControl>
              {/* <FormDescription>You will get an email to reset your password</FormDescription> */}
            </FormItem>
          )}
        />
 
 <Button type="submit" className="w-full" disabled={isReseting}>
          {isReseting ? (
            <>
              Please wait
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            'Reset Password'
          )}
        </Button>

      </form>
      
    </Form>
      </div>
      }
    </div>
  )
}

export default ResetPass
