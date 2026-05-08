import React, { useContext, useEffect, useRef, useState } from "react";
import photo from "../assets/photo1.svg";
import appPhoto from "../assets/hm.png";
import axios from "axios";
import Card from "../components/Card";
import {
  ArrowDownToLine,
  ArrowRight,
  CheckCheck,
  Loader2,
  MessagesSquare,
  SendHorizontal,
  X,
  Bot
} from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthContext } from "../context/Auth";
import apiClient from "../context/apiClient";
import { Button } from "../components/ui/button";
import Burger from "../assets/burger.png";
import Nood from "../assets/nood.png";
import piz from "../assets/piz.png";
import sweet from "../assets/sweet.png";
import tacos from "../assets/tacos.png";
import ios from "../assets/apple.png";
import android from "../assets/android.png";
import plate from "../assets/msg.webp";
import plate2 from "../assets/startfood.png";
import socket from "../context/socket";
import { Link } from "react-router-dom";
import { showNotification } from "../components/ShowNotification";

let menu_url = "https://food-mood-frontend.vercel.app/menu_card.jpg";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [isLoadingMsg, setIsLoadingMsg] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([{content: "Hello! How can I help you today?", role: "Bot"}]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [chatsSending, setChatSending] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showChatbotBox, setShowChatbotBox] = useState(false);
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  // const [isSendingQuery, setIsSendingQuery] = useState(false);
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  const { currentUser } = useContext(AuthContext);
  // console.log("this is user",currentUser)

  useEffect(() => {
    // Join room with user ID
    if (currentUser?._id) {
      socket.emit("join", { userId: currentUser._id });
    }

    // // Receive messages in real-time
    // socket.on("receiveMessage", (msg) => {
    //   setMessages((prev) => [...prev, msg]);
    // });

    // return () => {
    //   socket.off("receiveMessage");
    // };
  }, [currentUser]);

    useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  //   useEffect(() => {
  //   socket.emit("sendMessage", { message: "Hello from frontend!" });
  // }, []);

  const getMessagesSupport = async () => {
    try {
      console.log("getting msgs");
      setIsLoadingMsg(true);
      let adminId = "688756ac5b139453c002ade3";
      const response = await apiClient.get(`/api/messages/${adminId}`, {
        withCredentials: true,
      });
      console.log("this is response of msgs", response);
      if(response.data.success){
        console.log(currentUser);
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMsg(false);
    }
  };

  const sendMessage = async () => {
    try {
      setIsSendingMsg(true);
      let adminId = "69072429433be3e53cf9d392";
      let dataToSend = {
        receiver: adminId,
        message: msg,
      };
      const response = await apiClient.post(`/api/send-message`, dataToSend, {
        withCredentials: true,
      });
      console.log("this is response of msgs", response);
      if (response.data.success) {
        const newMsg = {
        sender: currentUser._id,
        message: msg,
        receiver: "69072429433be3e53cf9d392", // adminId
        time: new Date().toISOString(),
      };
        // socket.emit("sendMessage",newMsg);
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSendingMsg(false);
      setMsg("");
    }
  };

  const sendChatToBot = async () => {
    try {
      setChatSending(true);
      setChatsLoading(true);
      let dataToSend = {
        userQuery: query
      }
      let newChat = {
        content: query,
        role: "User"
      }
      setChats((prev) => [...prev, newChat]);
      const response = await apiClient.post(`/api/chatbot`, dataToSend, {
        withCredentials: true,
      });
      if (response.data.success) {
        const newChat = {content: response.data.content, role: "Bot"};
        // socket.emit("sendMessage",newMsg);
        setChats((prev) => [...prev, newChat]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setChatSending(false);
      setChatsLoading(false);
      setQuery("");
    }
  };

 useEffect(() => {
  const handleReceiveMessage = (data) => {
    console.log("📨 Message received", data);
    console.log("📨 showing messages", data);
    showNotification("📩 New Message", "Admin sent you a message!");
    setMessages((prevMessages) => [...prevMessages, data]); // Append new message
  };

  socket.on("receiveMessage", handleReceiveMessage);

  return () => {
    socket.off("receiveMessage", handleReceiveMessage); // Clean up
  };
}, []);

  useEffect(() => {
    if (showMessageBox) {
      console.log("box open", currentUser);
      getMessagesSupport();
    }
  }, [showMessageBox]);

  const bottomRef = useRef(null);

useEffect(() => {
  if (bottomRef.current) {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  useEffect(() => {
    // Listen for order status change
    socket.on("orderStatusChange", (data) => {
      console.log("📢 Order update received:", data);
      showNotification("Order Updated",`Status updated to ${data.status}`)
    });

    // Cleanup listener when component unmounts
    return () => {
      socket.off("orderStatusChange");
    };
  }, []);



  const getMenuDownload = (url) => {
    let aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", "food_mood_menu");
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

useEffect(() => {
  if (!socket) return;

  socket.on("messagesRead", ({ by }) => {
    console.log("📩 Messages read by:", by);
    setMessages((prevMsgs) =>
      prevMsgs.map((msg) =>
        msg.receiver === by ? { ...msg, read: true } : msg
      )
    );
  });

  return () => socket.off("messagesRead");
}, [socket]);

const readMessages=async()=>{
  try {
    const dataToSend = {
    "senderId":"688756ac5b139453c002ade3"
    }
    const response = await apiClient.put("api/messages/mark-read",dataToSend,{withCredentials:true});
    console.log("this is response for read msg",response)
  } catch (error) {
    console.log("error in reading messages",messages)
  }
}

useEffect(()=>{
  if(showMessageBox){
    readMessages();
  }
},[showMessageBox])

// console.log('this is currentuser',currentUser)



  return (
    <div className="min-h-screen   pt-24 md:pt-24 w-12/12 mx-auto ">
      <div className="mainContent w-9/12  mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
        <div data-aos="fade-right" className="flex flex-col md:flex-col justify-center items-center md:h-[35rem]">
          <h1 className="font-extrabold md:font-bold text-6xl md:text-9xl">
            Fastest <span className="text-amber-600">Delivery</span> & Easy{" "}
            <span className="text-amber-600">Pickup</span>
          </h1>
        </div>
        <div data-aos="fade-left" className="flex flex-col md:flex-col justify-center items-end md:h-[35rem]">
          <img src={photo} alt="image" className="h-[25rem]" />
          <h1 className="text-2xl font-bold">
            Too lazy to cook , just take a look !
          </h1>
        </div>
      </div>
      <div className="fixed bottom-2 right-1 gap-2 flex flex-col">
        <button
          className="bg-amber-600 font-bold text-xl space-x-3 rounded-full text-black p-2 flex items-center"
          onClick={() => getMenuDownload(menu_url)}
        >
          <ArrowDownToLine className="m-1 font-extrabold size-5" />{" "}
        </button>
        <button
          className="bg-amber-600 font-bold text-xl space-x-3 rounded-full text-black p-2 flex items-center"
          onClick={() => setShowMessageBox(true)}
        >
          <MessagesSquare className="m-1 font-extrabold size-5" />{" "}
        </button>
        <button
          className="bg-amber-600 font-bold text-xl space-x-3 rounded-full text-black p-2 flex items-center"
          onClick={() => setShowChatbotBox(true)}
        >
          <Bot className="m-1 font-extrabold size-5" />{" "}
        </button>
      </div>
      <div
        className={`w-full md:w-[25%] h-[85%]  bg-white shadow-2xl fixed right-0 bottom-0 z-50 rounded-tl-xl transform transition-transform duration-300 ${
          showMessageBox ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b-2 p-4">
          <h1 className="font-bold">Messages</h1>
          <X className="size-5 cursor-pointer" onClick={() => setShowMessageBox(false)} />
        </div>
        {
          !currentUser ?
          <div className="flex justify-center items-center flex-col gap-5 p-8">
            <img src={plate} className="w-50 h-30"/>
            <p>You should SignIn to start the Conversation.</p>
            <Button className={"w-full"}>
              <Link to={"/sign-in"}>Sign in</Link>
            </Button>
          </div>
          :
       <>
        {isLoadingMsg && (
          <div className="flex justify-center items-center mt-5 gap-3">
            <p>Loading messages</p>
            <Loader2 className="animate animate-spin size-4" />
          </div>
        )}
         {!isLoadingMsg && messages.length == 0  && (
          <div className="flex justify-center items-center flex-col p-4">
             <img src={plate} className="w-50 h-30"/>
           <p>Start a new conversation !</p>
          </div>
        )}
        {messages.length > 0 && (
          <div className="p-4 space-y-2 overflow-y-scroll h-[calc(90%-56px)]">
            {messages.map((msg) => (
              <>
              <div
                key={msg._id}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender?.toString() === currentUser?._id?.toString()
                    ? "bg-slate-800 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{msg.message}</p>
                <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-xs ml-auto  ${
                    msg.sender === currentUser._id
                    ? " text-white"
                    : " text-black"
                  }`}
                  >
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {
                   msg.sender === currentUser?._id &&
                <CheckCheck className={`${msg.read ? "text-green-400" :"text-gray-400"} size-4`}/>
                }
                  </div>
              </div>

              </>
            ))}
            {messages[messages.length - 1]?.sender == currentUser?._id && (
 <img src={currentUser?.profileImage?.url} className="h-4 w-4  rounded-full ml-auto object-cover" alt="User" />
)}
            <div ref={bottomRef} />
          </div>
        )}
       

        <div className="w-full gap-2 p-2 flex justify-between items-center fixed bottom-0">
          <input
            className="border w-[80%] border-gray-400 p-2 rounded"
            placeholder="Enter Your Message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button
            type="submit"
            className="w-[20%]"
            onClick={sendMessage}
            // onClick={()=>showNotification("📩 New Message", "Someone read your message!")}
            disabled={isSendingMsg || msg.length == 0}
          >
            {isSendingMsg ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <SendHorizontal className="text-white size-5" />
            )}
          </Button>
        </div>
       </>
        }
      </div>

      <div
        className={`w-full md:w-[25%] h-[85%]  bg-white shadow-2xl fixed right-0 bottom-0 z-50 rounded-tl-xl transform transition-transform duration-300 ${
          showChatbotBox ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center border-b-2 p-4">
          <h1 className="font-bold">Foodie Bot</h1>
          <X className="size-5 cursor-pointer" onClick={() => setShowChatbotBox(false)} />
        </div>
        {
          !currentUser ?
          <div className="flex justify-center items-center flex-col gap-5 p-8">
            <img src={plate} className="w-50 h-30"/>
            <p>You should SignIn to chat with Foodie Bot.</p>
            <Button className={"w-full"}>
              <Link to={"/sign-in"}>Sign in</Link>
            </Button>
          </div>
          :
       <>
         {!isLoadingMsg && chats.length == 0  && (
          <div className="flex justify-center items-center flex-col p-4">
             <img src={plate} className="w-50 h-30"/>
           <p className="text-md text-gray-500 text-center">Share your mood and preferences and Foodie Bot will recommend you a dish to try! !</p>
          </div>
        )}
        {chats.length > 0 && (
          <div className="p-4 space-y-2 overflow-y-scroll h-[calc(90%-56px)]">
            {chats.map((chat,index) => (
              <>
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  chat.role == "User"
                    ? "bg-slate-800 text-white ml-auto"
                    : "bg-gray-200 text-black"
                }`}
                style={{whiteSpace:"pre-wrap"}}
              >
                <p>{chat.content}</p>
               
              </div>

              </>
            ))}
            {/* {messages[messages.length - 1]?.sender == currentUser?._id && (
 <img src={currentUser?.profileImage?.url} className="h-4 w-4  rounded-full ml-auto object-cover" alt="User" />
)} */}
            <div ref={bottomRef} />
            {
              chatsLoading &&
             <div className="flex justify-left items-left text-sm text-gray-400 mt-5 gap-1">
              <p>Bot is responding</p>
              <Loader2 className="animate animate-spin size-4" />
              </div>
            }
          </div>
        )}
       

        <div className="w-full gap-2 p-2 flex justify-between items-center fixed bottom-0">
          <input
            className="border w-[80%] border-gray-400 p-2 rounded"
            placeholder="Ask your question...."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="w-[20%]"
            onClick={sendChatToBot}
            // onClick={()=>showNotification("📩 New Message", "Someone read your message!")}
            disabled={chatsSending || chatsLoading || query.length == 0}
          >
            {chatsSending ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <SendHorizontal className="text-white size-5" />
            )}
          </Button>
        </div>
       </>
        }
      </div>
     

      {/* <hr className="border border-neutral-300 mt-8" /> */}
      <div data-aos="fade-up" className="ad w-11/12 m-2 md:w-7/12 mx-auto rounded-xl p-8 bg-amber-600 dark:bg-amber-600 bg-opacity-40 overflow-hidden ">
        <h1 className="text-center text-xl md:text-3xl font-bold">
          We're changing the way people order food. Always there for you !
        </h1>
      </div>
      <div data-aos="zoom-in" className="w-full md:w-7/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 m-8 p-4 bg-slate-200 dark:bg-slate-900 rounded-xl">
        <div className="flex justify-center">
          <img src={appPhoto} height={"200px"} width={"200px"} />
        </div>
        <div className="flex gap-10 flex-col justify-around items-center">
          <h1 className="text-3xl md:text-2xl font-bold text-center">
            You can also download our App.
          </h1>
          <div className=" hidden md:flex flex-col items-center gap-4">
            <img src="/qrUrl.png" width={"100px"} />
            <p className="text-lg font-bold">
              Scan this qr to get to our website.
            </p>
          </div>
          <div className="flex w-1/2  justify-evenly">
            <img src={android} width={"40px"} />
            <img src={ios} width={"40px"} />
          </div>
          <Button>
            Get App <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
      {/* <div className="flex items-center justify-start bg-slate-100 dark:bg-slate-900 mt-4 mb-4 gap-0 md:gap-20 w-full overflow-hidden">
        
        </div> */}
      <div  data-aos="fade-up" className="mar m-4 p-4 w-full md:w-4/5  mx-auto  flex justify-center items-center overflow-hidden">
        <div className="mar-grp w-1/2 flex justify-around items-center space-x-8 ">
          <img src={Burger} height={"100px"} width={"100px"} />
          <img
            src={Nood}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={piz}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={tacos}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={sweet}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img src={Burger} height={"100px"} width={"100px"} />
          <img
            src={Nood}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={piz}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={tacos}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={sweet}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img src={Burger} height={"100px"} width={"100px"} />
          <img
            src={Nood}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={piz}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={tacos}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <img
            src={sweet}
            height={"100px"}
            width={"100px"}
            className="object-contain"
          />
          <div className="img-grp  grid gap-4 items-center"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
