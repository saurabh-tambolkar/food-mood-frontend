import React, { useState,useEffect } from 'react'
import axios from 'axios';
import Card from '../components/Card';

import { ArrowDownToLine } from "lucide-react";

let menu_url = "http://localhost:3000/menu_card.jpg"

function Menu() {

  const [isLoading, setIsLoading] = useState(false);
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL

  const getMenuDownload=(url)=>{
    let aTag = document.createElement('a');
    aTag.href = url;
    aTag.setAttribute("download","food_mood_menu")
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  const loadData = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${BASE_URL}/api/fooddata`);
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

  return (
    <div className="min-h-screen pt-40 md:pt-24 menu w-11/12 mx-auto">
        <div className="fixed bottom-2 right-1"><button className="bg-amber-600 font-bold text-xl space-x-3 rounded-full text-black p-2 flex items-center" onClick={()=>getMenuDownload(menu_url)}><ArrowDownToLine className="m-1 font-extrabold size-5"/> </button></div>
        <h1 className="text-3xl md:text-5xl font-bold m-4 md:m-8">Our best deliverables!</h1>
       {
        isLoading ?
        <div>Loading...</div>
        :
        (
          foodCat.map((category,index)=>{
            return(
              <div className="mb-8" key={index}>
                <h1 className="text-3xl font-semibold">{category.CategoryName}</h1>
                <hr />
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {
                  foodItems.filter((item)=>{
                    return item.CategoryName === category.CategoryName
                  }).map((filteredItems)=>{
                    return(
                      <div className="flex justify-center">
                        <div key={filteredItems._id} >
                        <Card options={filteredItems.options} foodItems={filteredItems}/>
                      </div>
                      </div>
                    )
                  })
                }
              </div>
              </div>

            )
          })
        )
       }
      </div>
  )
}

export default Menu
