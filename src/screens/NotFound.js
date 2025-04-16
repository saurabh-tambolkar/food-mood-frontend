import React from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFound() {

    const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl mt-4">Oops! Page Not Found</p>
      <Button onClick={()=>navigate('/')}>
      Go Home
      </Button>
    </div>
  );
}
