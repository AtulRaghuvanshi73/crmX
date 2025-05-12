"use client";

import { useEffect, useState } from "react";
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { BACKEND_SERVER_URL } from "@/utils/env";

interface ShopDetail {
  _id: string;
  name: string;
  email: string;
  description: string;
}

interface ShopData {
  shopDetails: ShopDetail[];
}

interface FetchDataResponse {
  data: ShopData | null;
  error: string | null;
  loading: boolean;
}

const useFetchShopData = (): FetchDataResponse => {
  const [data, setData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotificationCenter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if we're in the browser before accessing localStorage
        if (typeof window === 'undefined') {
          return; // Exit early if we're on the server
        }
        
        const email = localStorage.getItem("email");
        if (!email) {
          setError("Not logged in");
          setLoading(false);
          return;
        }

        const response = await fetch(`${BACKEND_SERVER_URL}/getshopdata`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log("Shop data fetched successfully:", responseData);
        setData(responseData);
      } catch (error: unknown) {
        console.error("Fetch error:", error);
        if (error instanceof Error) {
          setError(`Error loading campaigns: ${error.message}`);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, error, loading };
};

export default useFetchShopData;
