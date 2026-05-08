import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"
import Card from '../components/Card';
import { ArrowDownToLine, Loader2 } from "lucide-react";
import AOS from 'aos';
import 'aos/dist/aos.css';

let menu_url = "http://localhost:3000/menu_card.jpg";

function Menu() {
  const [isLoading, setIsLoading] = useState(false);
  const [foodCat, setFoodCat] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory,setSelectedCategory] = useState("")

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  <style>
{`
  .catScroll::-webkit-scrollbar {
    display: none;
  }
  .catScroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}
</style>


  const getMenuDownload = (url) => {
    let aTag = document.createElement('a');
    aTag.href = url;
    aTag.setAttribute("download", "food_mood_menu");
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      let response = await axios.get(`${BASE_URL}/api/getFood/${selectedCategory}`);
      setFoodItems(response.data.food);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      setIsLoading(true);
      let response = await axios.get(`${BASE_URL}/api/categories`);
      console.log(response)
      if(response.data.success){
        setCategories(response.data.categories)
        setSelectedCategory(response.data.categories[0].catId)
        console.log(response.data.categories[0].catId)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
   
  }, []);

  useEffect(()=>{
    console.log("this is jew ",selectedCategory)
    if(selectedCategory){
      loadData();
    }
  },[selectedCategory])

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen pt-40 md:pt-24 menu w-11/12 mx-auto">
      <div className="fixed bottom-2 right-1">
        <button
          className="bg-amber-600 font-bold text-xl space-x-3 rounded-full text-black p-2 flex items-center"
          onClick={() => getMenuDownload(menu_url)}
        >
          <ArrowDownToLine className="m-1 font-extrabold size-5" />
        </button>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold m-4 md:m-8">
        Our best deliverables!
      </h1>

      {/* <div className="mb-6 w-full flex justify-center">
        <input
          type="text"
          placeholder="Search food..."
          className="p-3 w-full md:w-1/2 border rounded-md shadow-sm text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}
      <div data-aos="fade-down" className='flex catScroll gap-24 overflow-x-scroll p-4 w-full justify-center items-baseline  scrollbar-hide'>
         {
        categories.length > 0
        &&
        categories.map((cat)=>{
          return (
            <div key={cat.catId} className=" flex flex-col justify-center items-center " onClick={()=>setSelectedCategory(cat.catId)}>
              <img src={cat.imageUrl} className={`w-20 h-20 rounded-full object-cover shadow-md ${selectedCategory == cat.catId && "border border-4 sha shadow-[0_0_15px_#facc15]  border-amber-500"}`}/>
              <h2 className={`text-sm font-bold m-4 md:m-4 ${selectedCategory == cat.catId && "text-amber-500"}`}>{
                cat.catName
                }</h2>
                </div>
                )
        })
      }
      </div>

     

      {
        isLoading ?
        <div className="flex gap-4 justify-center mt-12"> Loading <Loader2 className='animate animate-spin '/></div>
        :
        foodItems.length > 0
        ?
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {foodItems.map((item) => (
                  <div className="flex justify-center" key={item._id}>
                    <Card options={item.options} foodItems={item} />
                  </div>
                ))}
              </div>
              :
              <p className='text-center mt-32'>Ooops, No dishes found for selected category!</p>
      }
    </div>
  );
}

export default Menu;
