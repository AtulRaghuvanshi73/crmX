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
        : 0;      // Prepare segments stats for insight generation
      let recentPurchasers = 0;
      const lastWeekTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
      
      customerData.forEach(customer => {
        if (customer.lastVisits && Number(customer.lastVisits) > lastWeekTimestamp) {
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
        
        IMPORTANT: Return ONLY the plain text summary without any JSON formatting, code blocks, or markdown.
      `;    

      if (campaignData.length === 0) {
        setInsightSummary("No campaign data available yet. Send your campaign to see performance insights.");
        setIsGenerating(false);
        return;
      }        const result = await queryGemini(prompt);
        // Try to parse the result if it's in JSON format
      try {
        // Check if result appears to be JSON
        if (result.includes('{') && result.includes('}')) {
          // Extract JSON string using basic string manipulation instead of regex
          const startIndex = result.indexOf('{');
          const endIndex = result.lastIndexOf('}') + 1;
          
          if (startIndex !== -1 && endIndex !== -1) {
            const jsonString = result.substring(startIndex, endIndex);
            const parsedData = JSON.parse(jsonString);
            
            // Check if the JSON contains humanReadable fields
            if (parsedData.description) {
              setInsightSummary(parsedData.description);
              return;
            } else if (parsedData.rules && Array.isArray(parsedData.rules)) {
              // Extract humanReadable values from rules
              const insights = parsedData.rules
                .filter((rule: { humanReadable?: string }) => rule.humanReadable)
                .map((rule: { humanReadable: string }) => rule.humanReadable)
                .join(" ");
              
              if (insights) {
                setInsightSummary(insights);
                return;
              }
            }
          }
        }
        
        // If not JSON or parsing failed, use the plain text
        setInsightSummary(result);
      } catch (error) {
        console.error("Error parsing insight result:", error);
        // Fallback to using the raw result
        setInsightSummary(result);
      }
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
    <Card className="p-6 bg-gradient-to-br from-violet-900/40 via-blue-900/30 to-indigo-900/40 border border-indigo-700/50 shadow-xl rounded-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-600/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="flex items-center space-x-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
        </svg>
        <h3 className="font-semibold text-lg text-white">Campaign Performance Summary</h3>
      </div>
      
      {isGenerating ? (
        <div className="flex items-center space-x-3 bg-blue-900/20 p-3 rounded-lg border border-blue-500/30">
          <div className="animate-spin h-5 w-5 border-3 border-t-transparent border-blue-400 rounded-full"></div>
          <p className="text-blue-300">Generating AI insights...</p>
        </div>
      ) : insightSummary ? (
        <div className="bg-indigo-900/20 backdrop-blur-sm p-4 rounded-lg border border-indigo-500/30">
          {/* Format the insight summary to make it more readable */}
          {insightSummary.split('\n').map((line, index) => (
            <p key={index} className={line.includes(':') 
              ? 'font-medium text-indigo-200 mb-1' 
              : 'text-gray-300 mb-2'}>
              {line.trim()}
            </p>
          ))}
        </div>
      ) : (
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-500">
            <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path>
            <rect width="18" height="12" x="3" y="4" rx="2"></rect>
            <line x1="12" x2="12" y1="9" y2="9"></line>
          </svg>
          <p className="text-sm text-gray-400">No campaign data available yet.</p>
          <p className="text-xs text-gray-500 mt-1">Send your first campaign to see insights</p>
        </div>
      )}
    </Card>
  );
}
