import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User2Icon, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { AuthContext } from "../context/Auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import Cart from "./Cart";
import { useDispatch, useSelector } from "react-redux";
import { dropCart } from "../context/slice";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import apiClient from "../context/apiClient";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const location = useLocation();
  const { toast } = useToast();
  const { logout, currentUser } = useContext(AuthContext);

  const [isDarkMode, setIsDarkMode] = useState();

  const { name, cartLength } = useContext(CartContext);

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [profileIsOpen, setProfileIsOpen] = useState(false);

  // const dispatch = useDispatch();
  // const cart = useSelector((state) => state.cart);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  const handleProfileToggle = () => {
    setProfileIsOpen((prev) => !prev);
  };

  const handleOverlayClick = () => {
    setProfileIsOpen(false);
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    }
  };

  return (
    <div className="nav flex justify-center relative">
      <div className="bg-slate-900 px-4 shadow-lg dark:bg-slate-900 z-12 w-full md:w-9/12 text-white text-xl md:text-xl font-semibold py-4 md:py-0 h-20 md:h-20 flex flex-row justify-between items-center space-y-2 md:rounded-b-2xl fixed">
        <Link to="/" className=" text-white text-2xl md:text-3xl font-bold">
          Food_Mood
        </Link>
        <div className="flex justify-center items-center md:hidden">
       
        <Button
              onClick={toggleDarkMode}
              className=" dark:bg-slate-900 dark:hover:bg-slate-900"
            >
              {!isDarkMode ? (
                <Moon strokeWidth={2.75} className="ml-1 text-white size-5 " />
              ) : (
                <Sun
                  strokeWidth={2.75}
                  className="ml-1 text-yellow-400 size-5 "
                />
              )}
            </Button>
            {menuIsOpen ? (
          <X
            className="size-6 "
            onClick={() => setMenuIsOpen(false)}
          />
        ) : (
          <Menu
            className="size-6"
            onClick={() => setMenuIsOpen(true)}
          />
        )}
        </div>

        <div className="hidden md:block space-x-4 mx-4">
          <Link
            to="/"
            id="home"
            className={`nav-link   ${
              location.pathname === "/" ? "text-amber-600" : " dark:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`nav-link   ${
              location.pathname === "/menu"
                ? "text-amber-600"
                : " dark:text-white"
            }`}
          >
            Menu
          </Link>
          {currentUser && (
            <Link
              to="/my-orders"
              id="home"
              className={`nav-link dark:text-white ${
                location.pathname === "/my-orders" ? "text-amber-600" : ""
              }`}
            >
              My Orders
            </Link>
          )}
        </div>
        {currentUser ? (
          <div className="hidden md:block flex mr-4 relative">
            <Button
              onClick={toggleDarkMode}
              className=" dark:bg-slate-900 dark:hover:bg-slate-900"
            >
              {!isDarkMode ? (
                <Moon strokeWidth={2.75} className="ml-1 text-white size-5 " />
              ) : (
                <Sun
                  strokeWidth={2.75}
                  className="ml-1 text-yellow-400 size-5 "
                />
              )}
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-500 text-black font-bold mr-1">
              <Link to="/my-cart" className="flex">
                Cart
                <ShoppingCart
                  strokeWidth={2}
                  className="ml-1 text-black size-5 "
                />
                {cartLength !== 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-3 bg-red-600 right-24"
                  >
                    {cartLength}
                  </Badge>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="bg-amber-600 hover:bg-amber-500 text-black font-bold">
                  Profile
                  <User2Icon
                    strokeWidth={2}
                    className="ml-1 text-black size-5"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />

                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-red-600 font-extrabold text-white hover:bg-red-500">
                      Sign Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign Out!</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to sign out.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          className="bg-red-600 hover:bg-red-500"
                          onClick={logout}
                        >
                          Sign Out
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden md:block">
            <Button
              onClick={toggleDarkMode}
              className=" dark:bg-slate-900 dark:hover:bg-slate-900"
            >
              {!isDarkMode ? (
                <Moon strokeWidth={2.75} className="ml-1 text-white size-5 " />
              ) : (
                <Sun
                  strokeWidth={2.75}
                  className="ml-1 text-yellow-400 size-5 "
                />
              )}
            </Button>
            <Button className="bg-amber-600 text-black hover:bg-amber-500 mx-4 font-bold">
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        )}
      </div>
      <div
        className={`fixed top-20 right-0 bg-slate-900 transition-transform duration-300 transform ${
          menuIsOpen ? "translate-x-0" : "translate-x-full"
        } h-auto w-full md:hidden`}
      >
        <div className="flex flex-col items-center space-y-4 py-6">
          <Link
            to="/"
            className="text-white text-xl"
            onClick={() => setMenuIsOpen(false)}
          >
            Home
          </Link>
          
          <Link
            to="/menu"
            className="text-white text-xl"
            onClick={() => setMenuIsOpen(false)}
          >
            Menu
          </Link>
          {currentUser ? (
            <>
            <Link
              to="/my-orders"
              className="text-white text-xl"
              onClick={() => setMenuIsOpen(false)}
            >
              My Orders
            </Link>
            <Button className="bg-amber-600 hover:bg-amber-500 text-black font-bold mr-1" onClick={()=>setMenuIsOpen(false)}>
              <Link to="/my-cart" className="flex items-center justify-around">
                Cart
                <ShoppingCart
                  strokeWidth={2}
                  className="ml-1 text-black size-5 "
                />
                {cartLength !== 0 && (
                  <p className="ml-4 text-lg ">({cartLength})</p>
                )}
              </Link>
            </Button>
            {/* <hr className="border-[0.5px] w-10/12 border-red-100"/> */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className="bg-amber-600 hover:bg-amber-500 text-black font-bold">
                  Profile
                  <User2Icon
                    strokeWidth={2}
                    className="ml-1 text-black size-5"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />

                <Dialog>
                  <DialogTrigger>
                    <Button className="bg-red-600 font-extrabold text-white hover:bg-red-500">
                      Sign Out
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sign Out!</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to sign out.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          type="button"
                          className="bg-red-600 hover:bg-red-500"
                          onClick={logout}
                        >
                          Sign Out
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          )
        :
        <Button className="bg-amber-600 text-black hover:bg-amber-500 mx-4 font-bold" onClick={()=>setMenuIsOpen(false)}>
              <Link to="/sign-in">Sign In</Link>
            </Button>
        }
        </div>
      </div>
    </div>
  );
}

export default Navbar;
