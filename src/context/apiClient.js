import axios from "axios";

const apiClient = axios.create({
    // baseURL: "http://localhost:5000",
    baseURL: "https://food-mood-backend.onrender.com",
    withCredentials:true,
})

apiClient.interceptors.request.use(
    (config) => {
        const accessToken = document.cookie.split("=")[1];
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// apiClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 // Call the refresh endpoint to get a new access token
//                 const refreshToken=localStorage.getItem('refreshToken');
//                 const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh/${refreshToken}`);
//                 console.log(data)
//                 document.cookie=`fmCookie=${data.accessToken}; max-age=${60*60}; Secure; SameSite=Strict;`

//                 // Retry the original request with the new token
//                 originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
//                 return apiClient(originalRequest);
//             } catch (refreshError) {
//                 console.error('Token refresh failed:', refreshError);

//                 // Handle logout or redirect to login page
//                 localStorage.removeItem('accessToken');
//                 return Promise.reject(refreshError);
//             }
//         }

//         // For other errors, reject the promise
//         return Promise.reject(error);
//     }
// );  

apiClient.interceptors.response.use(function(response){
    console.log("this is from api client",response)
    return response
},function (error){
    console.log("this is from api client",error)

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        return (async()=>{
            try{
                const refreshToken=localStorage.getItem('refreshToken')
                const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/refresh/${refreshToken}`);
                console.log(data)
                document.cookie=`fmCookie=${data.accessToken}; max-age=${60*60}; Secure; SameSite=Strict;`
                
                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            }
            catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                
                //Handle logout or redirect to login page
                            
                return Promise.reject(refreshError);
            }
        })();
    }

    return Promise.reject(error);
})

export default apiClient;