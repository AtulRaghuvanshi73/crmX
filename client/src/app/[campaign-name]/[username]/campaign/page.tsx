"use client";
import LatestCampaigns from "@/components/latestcampaign/latestCampaign";
import SendCampaignTable from "@/components/sendcampaigntable/sendCampaignTable";
import { useParams } from "next/navigation";

const Campaign = () => {
  const params = useParams<{ "campaign-name": string, username: string }>();
  const campaignName = decodeURIComponent(params["campaign-name"] || "");
  const username = decodeURIComponent(params.username || "");
  
  return (
    <div className="container mt-4">
      <div className="mb-4 mt-8 md:text-3xl text-xl">
        Campaign: {campaignName !== "undefined" ? campaignName : "My Campaign"}
      </div>
      <LatestCampaigns />
      <div className="mb-4 md:text-3xl text-xl">Send Campaign</div>
      <SendCampaignTable />
    </div>
  );
};

export default Campaign;
