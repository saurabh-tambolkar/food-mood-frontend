import React, { useContext, useEffect, useState } from "react";
import photo from "../assets/photo1.svg";
import appPhoto from "../assets/hm.png"
import axios from "axios";
import Card from "../components/Card";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { AuthContext } from "../context/Auth";
import apiClient from "../context/apiClient";
import { Button } from "../components/ui/button";
import Burger from "../assets/burger.png"
import Nood from "../assets/nood.png"
import piz from "../assets/piz.png"
import sweet from "../assets/sweet.png"
import tacos from "../assets/tacos.png"
import ios from "../assets/apple.png"
import android from "../assets/android.png"

let menu_url = "https://food-mood-backend.onrender.com/menu_card.jpg"

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  const {currentUser} = useContext(AuthContext)
  // console.log("this is user",currentUser)


  const loadData = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/fooddata`);
      // console.log(response.data[0]);
      setFoodCat(response.data[1]);
      setFoodItems(response.data[0]);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getMenuDownload=(url)=>{
    let aTag = document.createElement('a');
    aTag.href = url;
    aTag.setAttribute("download","food_mood_menu")
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }



  return (
    <div className="min-h-screen   pt-24 md:pt-24 w-12/12 mx-auto ">
      <div className="mainContent w-9/12  mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="flex flex-col md:flex-col justify-center items-center md:h-[35rem]">
          <h1 className="font-extrabold md:font-bold text-6xl md:text-9xl">
            Fastest <span className="text-amber-600">Delivery</span> & Easy{" "}
            <span className="text-amber-600">Pickup</span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-col justify-center items-end md:h-[35rem]">
          <img src={photo} alt="image" className="h-[25rem]" />
          <h1 className="text-2xl font-bold">
            Too lazy to cook , just take a look !
          </h1>
        </div>
      </div>
      <div className="fixed bottom-2 right-1"><button className="bg-amber-600 font-bold text-xl space-x-3 rounded-full text-black p-2 flex items-center" onClick={()=>getMenuDownload(menu_url)}><ArrowDownToLine className="m-1 font-extrabold size-5"/> </button></div>
      {/* <hr className="border border-neutral-300 mt-8" /> */}
      <div className="ad w-11/12 m-2 md:w-7/12 mx-auto rounded-xl p-8 bg-amber-600 dark:bg-amber-600 bg-opacity-40 overflow-hidden ">
        <h1 className="text-center text-xl md:text-3xl font-bold">We're changing the way people order food. Always there for you !</h1>
      </div>
      <div className="w-full md:w-7/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 m-8 p-4 bg-slate-200 dark:bg-slate-900 rounded-xl">
      <div className="flex justify-center">
        <img src={appPhoto} height={"200px"} width={"200px"}/>
      </div>
        <div className="flex gap-10 flex-col justify-around items-center">
          <h1 className="text-3xl md:text-6xl font-bold text-center">You can also download our App.</h1>
          <div className="flex w-1/2  justify-evenly">
            <img src={android} width={"40px"}/>
            <img src={ios} width={"40px"}/>
          </div>
          <Button>Get App  <ArrowRight className="ml-2" /></Button>
        </div>
      </div>
        {/* <div className="flex items-center justify-start bg-slate-100 dark:bg-slate-900 mt-4 mb-4 gap-0 md:gap-20 w-full overflow-hidden">
        
        </div> */}
        <div className="mar m-4 p-4 w-full md:w-4/5  mx-auto  flex justify-center items-center overflow-hidden">
        <div className="mar-grp w-1/2 flex justify-around items-center space-x-8 ">
          <img src={Burger} height={"100px"} width={"100px"} />
        <img src={Nood} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={piz} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={tacos} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={sweet} height={"100px"} width={"100px"} className="object-contain"/>
          <img src={Burger} height={"100px"} width={"100px"} />
        <img src={Nood} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={piz} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={tacos} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={sweet} height={"100px"} width={"100px"} className="object-contain"/>
          <img src={Burger} height={"100px"} width={"100px"} />
        <img src={Nood} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={piz} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={tacos} height={"100px"} width={"100px"} className="object-contain"/>
        <img src={sweet} height={"100px"} width={"100px"} className="object-contain"/>
          <div className="img-grp  grid gap-4 items-center">
          </div>
        </div>
        </div>
    </div>
  );
}

export default Home;
