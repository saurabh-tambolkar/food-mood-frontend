// import React, { createContext, useEffect, useState } from 'react'
// import { useToast } from '../components/ui/use-toast';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AuthContext = createContext();

// export default function AuthProvider({children}) {

//     const [currentUser,setCurrentUser] = useState(null)
//     const [isSubmitting,setIsSubmitting] = useState(false)
//     const [loading, setLoading] = useState(true);

//     const {toast} = useToast();
//     const navigate = useNavigate();

//     const cookie = document.cookie;
    
//     const refreshTokentToSend = localStorage.getItem('refreshToken')
//     // console.table(refreshTokentToSend);
    
//     const tokenToSend = cookie.split("=")[1] || refreshTokentToSend;

//     const refreshToken = async()=>{
//       try {
//         if(tokenToSend){
//           const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/verify-token/${tokenToSend}`)
//           // console.log(response)
//           setCurrentUser(response.data.data)
//             document.cookie=`fmCookie=${response.data.accessToken}; max-age=${60*60}; Secure; SameSite=Strict;`
//         }
//       } catch (error) {
//         console.log(error)
//         setCurrentUser(null)
//       }
//     }

//     useEffect(()=>{
//       refreshToken();
//     },[])

//     const logout=()=>{
//         setCurrentUser(null)
//         // localStorage.removeItem("token");
//         // localStorage.removeItem("userEmail");
//         // localStorage.removeItem("userName");
//         document.cookie = "fmCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//         localStorage.removeItem("refreshToken")
//         toast({
//           title: "Logging Out",
//           variant: 'destructive',
//         }); 
//         // window.location.reload();
//     }

    
//   const login = async (data) => {
//     setIsSubmitting(true)
//     try{
//      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/sign-in`, data)
//     //  console.log("user is ",response)
//      if(response.data && response.data.success){
//        setCurrentUser(response.data.user)
//        localStorage.setItem("refreshToken", response.data.refreshToken)
//        document.cookie=`fmCookie=${response.data.accessToken}; max-age=${86400}; Secure; SameSite=Strict;`
//        toast({
//          title: response.data.message || "Signed up successfully!",
//          description: "Welcome to Food Mood!",
//          variant: 'success',
//        });
//        navigate('/')
//      }
//     }
//     catch(error){
//      console.log(error)
//      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
//      toast({
//        title: errorMessage || "Can't sign in now!",
//        description: "Try again later",
//        variant: 'destructive',
//      });
//     }
//     finally{
//      setIsSubmitting(false)
//     }
//    }

//   return (
//     <AuthContext.Provider value={{currentUser,login,logout,isSubmitting}}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export {AuthContext}

import React, { createContext, useEffect, useState } from 'react';
import { useToast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Helper to extract cookie value
  const getCookieValue = (name) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : null;
  };

  const refreshTokenToSend = localStorage.getItem('refreshToken');
  const tokenToSend = getCookieValue('fmCookie') || refreshTokenToSend;

  const refreshToken = async () => {
    try {
      if (tokenToSend) {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/verify-token/${tokenToSend}`
        );
        setCurrentUser(response.data.data);
        document.cookie = `fmCookie=${response.data.accessToken}; max-age=${
          60 * 60
        }; Secure; SameSite=Strict;`;
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      setCurrentUser(null);
    } finally {
      setLoading(false); // Ensure loading is set to false after attempt
    }
  };

  useEffect(() => {
    if(!tokenToSend){
      refreshToken();
    }
  }, []);

  const logout = () => {
    setCurrentUser(null);
    document.cookie = 'fmCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('refreshToken');
    toast({
      title: 'Logging Out',
      variant: 'destructive',
    });
  };

  const login = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/sign-in`,
        data
      );
      if (response.data && response.data.success) {
        setCurrentUser(response.data.user);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        document.cookie = `fmCookie=${response.data.accessToken}; max-age=86400; Secure; SameSite=Strict;`;
        toast({
          title: response.data.message || 'Signed up successfully!',
          description: 'Welcome to Food Mood!',
          variant: 'success',
        });
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || 'An unexpected error occurred.';
      toast({
        title: errorMessage || "Can't sign in now!",
        description: 'Try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, isSubmitting, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
