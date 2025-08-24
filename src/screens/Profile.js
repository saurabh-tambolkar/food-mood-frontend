import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context/Auth'
import { Camera, Loader2, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import apiClient from '../context/apiClient';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from '../components/ui/form';
import { Input } from '../components/ui/input';

function Profile() {
  const { currentUser ,setCurrentUser} = useContext(AuthContext);
  const inputFileRef = useRef();
  const [selectedImage, setSelectedImage] = useState();
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState();
   const { toast } = useToast();

  const handleCameraClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ file, url: imageUrl });
    }
  };

  const handleCrossClick=()=>{
    setSelectedImage(null);
  }

  const editProfileImage = async()=>{
    try {
        setProfileUpdating(true);
        const formData = new FormData();
        formData.append('profileImage', selectedImage.file);
        const response = await apiClient.post("api/upload-profile",formData);
        console.log(response)
        if(response.data.success){
            toast({
              title: response.data.message || 'Profile Image Updated',
              description: 'You have successfully edited the profile image.',
              variant: 'success',
            });
            setCurrentUser((prev)=>({...prev,profileImage:response.data.user.profileImage}))
            setSelectedImage(null);
        }
        
    } catch (error) {
        console.log("this is error in editing profile image",error)
        toast({
          title: error.message || 'Error in editing profile image',
          description: 'Try again later',
          variant: 'destructive',
        });
    }
    finally{
        setProfileUpdating(false);
    }
  }

  const getUserDetails = async()=>{
    try {
        setLoading(true)
        const response = await apiClient.get("api/user-details",{withCredentials:true});
        console.log(response)
        if(response.data.success){
            console.log(response.data.user)
            setUserDetails(response.data.user)
        }
    } catch (error) {
        console.log("this is error in editing profile image",error)
        
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    getUserDetails();
  },[]);

  useEffect(() => {
  if (userDetails) {
    form.reset({
      name: userDetails.name || "",
      email: userDetails.email || "",
      mobileNumber: userDetails.phone || ""
    });
  }
}, [userDetails]);


  const updateProfileSchma = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    mobileNumber: z.string().min(10, { message: "Mobile Number must be of 10 characters" }),
  });

  const form = useForm({
  resolver: zodResolver(updateProfileSchma),
  defaultValues: {
    name: "",
    mobileNumber: ""
  }
});


    const onSubmit=async(data)=>{
        console.log(data)
        try {
            setIsSubmitting(true);
            const response = await apiClient.put("/api/update-profile",data,{withCredentials:true});
            console.log(response)
            if(response.data.success){
                console.log(response.data.user)
                toast({
                    title: "Profile Updated Successfully",
                    status: "success",
                    variant:"success"
                })
                getUserDetails();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong while updating profile!",
                variant: "destructive",
            })
        }
        finally{
            setIsSubmitting(false);
        }
    }

  return (
    <div className="min-h-screen pt-40 md:pt-24 w-11/12 mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold m-4 md:m-8">My Profile</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 p-4">
        <div className="flex flex-col items-center justify-start relative gap-6 bg-white shadow-lg border rounded-md py-8">
          <div className="relative">
            <img
              src={selectedImage ? selectedImage.url : currentUser?.profileImage?.url ? currentUser?.profileImage?.url : currentUser?.profileImage}
              className="w-40 h-40 rounded-full object-cover border-4 border-slate-900"
              alt="Profile"
            />
            <div
              className={`p-3  absolute bottom-0 right-4  rounded-full cursor-pointer ${
                selectedImage ? 'bg-red-600' : 'bg-slate-900'
              }`}
              onClick={selectedImage ? handleCrossClick : handleCameraClick}
              title={selectedImage ? "Change image" : "Upload image"}
            >
              {selectedImage ? <X className="text-white size-5" /> : <Camera className="text-white size-5" />}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputFileRef}
            onChange={handleFileChange}
          />

            {
                selectedImage &&
          <Button className="mt-4" disabled={profileUpdating} onClick={editProfileImage} >{profileUpdating ? 
            <>
            Updating
            <Loader2 className='animate animate-spin size-4 ml-2'/>
            </>
            :"Edit Image"}</Button>
            }
        </div>

        <div className="bg-gray-50 border rounded-md shadow-md md:col-span-2 p-4">
            {
                loading ?
                <div className="flex justify-center items-center pt-16">
                    <Loader2 className='animate animate-spin size-4'/>
                    </div>
                    :
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          disabled={true}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="Email" {...field} className="bg-gray-400"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Email</FormLabel> */}
              <FormControl>
                <Input placeholder="Mobile Number" {...field} />
              </FormControl>
              <FormMessage/>
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
    'Update Profile'
  )}
</Button>

      </form>
    </Form>
            }
        </div>
      </div>
    </div>
  );
}

export default Profile;
