"use client";
import LatestCampaigns from "@/components/latestcampaign/latestCampaign";
import SendCampaignTable from "@/components/sendcampaigntable/sendCampaignTable";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/ui/loader";

const Campaign = () => {
  const params = useParams<{ "campaign-name": string, username: string }>();
  const campaignName = params && params["campaign-name"] ? decodeURIComponent(String(params["campaign-name"])) : "";
  const username = params && params.username ? decodeURIComponent(String(params.username)) : "";
  
  // Log parameters for debugging
  useEffect(() => {
    console.log("Campaign page params:", { campaignName, username });
  }, [campaignName, username]);
  
  // Make sure we have the necessary params
  if (!campaignName || !username) {
    return <Loader text="Loading campaign data..." />;
  }
  
  return (
    <div className="container mt-4">
      <div className="mb-4 mt-8 md:text-3xl text-xl">
        Campaign: {campaignName}
      </div>
      <div className="mb-4 mt-2 md:text-xl text-sm text-gray-400">
        Owner: {username}
      </div>
      <div className="mb-4 mt-8 md:text-3xl text-xl">
        Campaign Analytics
      </div>
      <LatestCampaigns />
      <div className="mb-4 md:text-3xl text-xl">Send Campaign</div>
      <SendCampaignTable />
    </div>
  );
};

export default Campaign;
