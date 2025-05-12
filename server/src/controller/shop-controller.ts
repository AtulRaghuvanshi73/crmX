import mongoose from "mongoose";
import Shop from "../model/shop-schema";
import Customer from "../model/customer-schema";
import Order from "../model/order-schema";
import CommunicationLog from "../model/campaign-shema";

export const deleteShop = async (request: any, response: any) => {
  try {
    const { id } = request.params;
    console.log("Attempting to delete shop with ID:", id);
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ message: "Invalid campaign ID format" });
    }
    
    const deletedShop = await Shop.findByIdAndDelete(id);
    console.log("Delete result:", deletedShop);
    
    if (deletedShop) {
      response.status(200).json({ message: "Campaign deleted successfully", deletedShop });
    } else {
      response.status(404).json({ message: "Campaign not found" });
    }
  } catch (error: any) {
    console.error("Error deleting campaign:", error);
    response.status(500).json({ message: error.message });
  }
};

export const addShop = async (request: any, response: any) => {
  try {
    const { email, name, description } = request.body;
    
    // Validate input
    if (!email || !name) {
      return response.status(400).json({ 
        message: "Email and name are required fields",
        success: false
      });
    }
    
    const newCampaign = new Shop({ email, name, description });
    const savedCampaign = await newCampaign.save();
    
    // Return more complete data including ID and success flag
    response.status(200).json({
      id: savedCampaign._id,
      email: savedCampaign.email,
      name: savedCampaign.name,
      description: savedCampaign.description,
      success: true,
      redirectPath: `/${savedCampaign.name.toLowerCase().replace(/\s+/g, '-')}/${email}`
    });
  } catch (error: unknown) {
    console.error("Error in addShop:", error);
    response.status(500).json({ 
      message: "Failed to create campaign",
      success: false
    });
  }
};

export const getCampaignData = async (request: any, response: any) => {
  try {
    const campaignData = await CommunicationLog.find();

    if (campaignData) {
      response.status(200).json(campaignData);
    } else {
      response.status(401).json({ message: "Nothing to log" });
    }
  } catch (error: any) {
    response.status(500).json({ message: error.message });
  }
};

export const getShopData = async (request: any, response: any) => {
  try {
    const { email, campaignName } = request.body;
    
    // First try to find by campaign name if provided
    if (campaignName) {
      console.log(`Looking up campaign by name: ${campaignName}`);
      // Convert URL-friendly campaign name (slug) back to possible formats
      const searchName = decodeURIComponent(campaignName).replace(/-/g, ' ');
      const campaignRegex = new RegExp(searchName, 'i'); // Case-insensitive search
      
      // Find shops by name that are close to the requested name
      const shopsByName = await Shop.find({ 
        name: campaignRegex,
        email // Still filter by the user's email for security
      });
      
      if (shopsByName && shopsByName.length > 0) {
        console.log(`Found campaign by name: ${campaignName}`);
        return response.status(200).json({ shopDetails: shopsByName });
      }
    }
    
    // Fall back to finding all shops for this user
    console.log(`Looking up all campaigns for email: ${email}`);
    const shopDetails = await Shop.find({ email });
    
    if (shopDetails && shopDetails.length > 0) {
      response.status(200).json({ shopDetails });
    } else {
      response.status(401).json({ message: "No shops found" });
    }
  } catch (error: any) {
    console.error("Error in getShopData:", error);
    response.status(500).json({ message: error.message });
  }
};

export const getCustData = async (req: any, res: any) => {
  try {
    const { shopName } = req.body;

    const customers = await Customer.find({ shopName });
    if (customers) {
      res.status(200).json(customers);
    } else {
      res.status(401).json({ message: "No Customers" });
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrderData = async (req: any, res: any) => {
  try {
    const { shopName } = req.body;
    const order = await Order.find({ shopName });
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(401).json({ message: "No Customers" });
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
