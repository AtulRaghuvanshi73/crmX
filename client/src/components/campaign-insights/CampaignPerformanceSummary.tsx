"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import useFetchCampaignData from "@/hooks/fetchCampaignData";
import useFetchCustomerData from "@/hooks/fetchCustomerData";
import { queryGemini } from "@/utils/gemini";

export function CampaignPerformanceSummary() {
  const { data: campaignData, loading: campaignLoading } = useFetchCampaignData();
  const { data: customerData, loading: customerLoading } = useFetchCustomerData();
  const [insightSummary, setInsightSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (campaignData && customerData && !campaignLoading && !customerLoading) {
      generateCampaignSummary();
    }
  }, [campaignData, customerData, campaignLoading, customerLoading]);

  const generateCampaignSummary = async () => {
    if (!campaignData || !customerData) return;
    
    try {
      setIsGenerating(true);
      
      // Prepare campaign statistics
      const totalCustomers = customerData.length;
      const sentCount = campaignData.filter(item => item.status === "SENT").length;
      const failedCount = campaignData.filter(item => item.status === "FAILED").length;
      
      // Group data for insights
      const highSpendCustomers = customerData.filter(cust => cust.spends > 10000);
      const highSpendEmails = new Set(highSpendCustomers.map(cust => cust.custEmail));
      
      // Calculate high-spender delivery rate
      const highSpendDelivered = campaignData
        .filter(item => highSpendEmails.has(item.custEmail) && item.status === "SENT")
        .length;
      
      const highSpendDeliveryRate = highSpendCustomers.length > 0 
        ? Math.round((highSpendDelivered / highSpendCustomers.length) * 100) 
        : 0;

      // Prepare segments stats for insight generation
      let recentPurchasers = 0;
      const lastWeekTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
      
      customerData.forEach(customer => {
        if (customer.lastVisits && customer.lastVisits > lastWeekTimestamp) {
          recentPurchasers++;
        }
      });
      
      // Generate insights using AI
      const prompt = `
        Generate a human-readable insight summary for a marketing campaign with the following stats:
        - Total audience size: ${totalCustomers}
        - Messages sent successfully: ${sentCount}
        - Messages failed to deliver: ${failedCount}
        - High-value customers (spent over ₹10K): ${highSpendCustomers.length}
        - Delivery rate for high-value customers: ${highSpendDeliveryRate}%
        - Customers who purchased in the last week: ${recentPurchasers}

        Format the insights in clear, concise language that a marketing manager would find helpful.
        The summary should highlight key delivery statistics and any interesting segments performance.
        Keep it to 2-3 sentences, making it easily scannable.
        Include the specific numbers mentioned above like delivery rates, audience size, etc.
        Make it sound natural and focus on the marketing implications.
      `;

      if (campaignData.length === 0) {
        setInsightSummary("No campaign data available yet. Send your campaign to see performance insights.");
        setIsGenerating(false);
        return;
      }
      
      const result = await queryGemini(prompt);
      setInsightSummary(result);
    } catch (error) {
      console.error("Error generating campaign summary:", error);
      setInsightSummary("Unable to generate campaign insights at this time.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (campaignLoading || customerLoading) {
    return <div className="text-center py-4">Loading campaign data...</div>;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-gray-700">
      <h3 className="font-semibold text-lg mb-2">Campaign Performance Summary</h3>
      
      {isGenerating ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
          <p>Generating insights...</p>
        </div>
      ) : insightSummary ? (
        <p className="text-sm leading-relaxed">{insightSummary}</p>
      ) : (
        <p className="text-sm text-gray-400">No campaign data available.</p>
      )}
    </Card>
  );
}
