"use client";
import { Button } from "@/components/ui/button";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import { Chrome } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/authprovider";
const Login = () => {
  const router = useRouter();
  const [value, setValue] = useState<string | null>(null);
  const { setUser } = useAuth();

  const handleClick = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      const email = data.user.email;
      if (email) {
        setUser(email);
        localStorage.setItem("email", email);
        router.push("/");
      } else {
        console.error("Email is null");
      }
    } catch (error: unknown) {
      console.error("Error during sign in", error);
      // Display error to user for better debugging
      if (error instanceof Error) {
        alert(`Authentication error: ${error.message}\n\nPossible fix: Make sure your domain is authorized in Firebase console.`);
      }
    }
  };

  useEffect(() => {
    // Safely check for localStorage availability
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem("email");
      if (email) {  // Fixed typo: was email!
        setValue(email);
        router.push("/");
      }
    }
  }, [router]);

  return (
    <div className="container">
      <p className="text-center pt-20 text-4xl">Welcome to crmX</p>
      <p className="text-center pt-2  text-base text-gray-400">
        Login/Signup to continue with our services.
      </p>
      <Button
        className="bg-white text-black flex gap-2 m-auto mt-8 hover:bg-white hover:bg-opacity-70"
        onClick={handleClick}
      >
         Continue with Google
      </Button>
    </div>
  );
};

export default Login;
