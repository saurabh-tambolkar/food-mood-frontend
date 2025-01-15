import React from "react";
import { Link } from "react-router-dom";


function Footer() {

  

  return (
    <footer class="bg-slate-900 shadow-2xl rounded-t-2xl shadow  w-full md:w-9/12 mx-auto">
      <div class="w-full bg-slate max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
          <Link
            to={"/"}
            class="flex items-center mx-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span class="text-white self-center text-2xl font-semibold whitespace-nowrap ">
              Food_Mood
            </span>
          </Link>
          

          <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="https://flowbite.com/" class="hover:underline">
              Foode_Mood
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
