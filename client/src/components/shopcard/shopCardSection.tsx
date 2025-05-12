"use client";
import React, { useState, useEffect } from "react";
import useFetchShopData from "@/hooks/fetchData";
import ShopCard from "./shopCard";
import useFetchCustomerData from "@/hooks/fetchCustomerData";
import { BACKEND_SERVER_URL } from "@/utils/env";
import { toast } from "sonner";

const ShopCardSection = () => {
  const { data, error, loading } = useFetchShopData();
  const [shopDetails, setShopDetails] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (data && Array.isArray(data.shopDetails)) {
      console.log("Shop data from server:", data.shopDetails);
      setShopDetails(data.shopDetails);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Nothing to show now...</div>;
  }

  if (!data || !Array.isArray(data.shopDetails)) {
    return <div>No shop data available.</div>;
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`${BACKEND_SERVER_URL}/deleteshop/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted shop from local state
        setShopDetails(shopDetails.filter(shop => shop._id !== id));
        toast.success('Campaign deleted successfully');
      } else {
        const errorText = await response.text();
        console.error('Delete campaign error:', errorText);
        toast.error(`Failed to delete campaign: ${errorText}`);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('An error occurred while deleting the campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {shopDetails.map((item) => (
        <ShopCard 
          key={item._id} 
          id={item._id}
          name={item.name} 
          details={item.description}
          onDelete={handleDelete}
        />
      ))}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-5 rounded-md animate-pulse">
            Deleting campaign...
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCardSection;
