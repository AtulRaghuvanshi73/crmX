"use client";
import CustomerTable from "@/components/customertable/customerTable";
import CustOrdComponent from "@/components/custordcomp/custordComp";
import OrderTable from "@/components/ordertable/orderTable";
import { Button } from "@/components/ui/button";
import useFetchShopData from "@/hooks/fetchData";
import { useParams } from "next/navigation";
import { Loader, ErrorMessage } from "@/components/ui/loader";
import { useEffect, useState } from "react";

const IndividualShop = () => {
  const params = useParams<{ "campaign-name": string }>();
  const decodedItem = params ? decodeURIComponent(params["campaign-name"] as string) : "";
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    console.log("Campaign params:", params);
  }, [params]);
  
  const { data, loading, error } = useFetchShopData();
  
  // Handle loading state
  if (loading) {
    return <Loader text="Loading campaign data..." />;
  }
  
  // Handle error state
  if (error) {
    return <ErrorMessage message={`Error loading campaign: ${error}`} />;
  }
  
  // Handle no data
  if (!data || !data.shopDetails || data.shopDetails.length === 0) {
    return <Loader text="No campaign data available..." />;
  }
  
  const email = data?.shopDetails[0].email;
  
  // Only check authorization on the client-side
  if (isClient) {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      return <ErrorMessage message="You need to be logged in to view this page" />;
    }
    
    if (email && email !== userEmail) {
      return <ErrorMessage message="You don't have access to this campaign" />;
    }
  }
  
  return (
    <div className="container md:pt-10 pt-5">
      <div className="flex justify-between">
        <div className="md:text-3xl text-xl">{decodedItem}</div>
        <CustOrdComponent />
      </div>
      <CustomerTable />
      <OrderTable />
    </div>
  );
};

export default IndividualShop;
