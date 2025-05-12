import { useEffect, useState } from "react";
import { BACKEND_SERVER_URL } from "@/utils/env";

interface CampaignDetails {
  custName: string;
  custEmail: string;
  status: string;
  messageSubject?: string;
  messageBody?: string;
  suggestedImageType?: string;
  timestamp?: number;
}

type FetchDataResponse = {
  data: CampaignDetails[] | null;
  error: string | null;
  loading: boolean;
};

const useFetchCampaignData = (): FetchDataResponse => {
  const [data, setData] = useState<CampaignDetails[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_SERVER_URL}/getAllCampaignData`,
          {
            method: "GET",
          },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const responseData = await response.json();
        setData(responseData);
        setLoading(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetchCampaignData;
