"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import useFetchCampaignData from "@/hooks/fetchCampaignData";
import { Badge } from "../ui/badge";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { Bar, Doughnut, Pie, Line, PolarArea } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const LatestCampaigns = () => {
  const { data, loading, error } = useFetchCampaignData();
  const router = useRouter();
  const params = useParams<{ "campaign-name": string, username: string }>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading shop data.</div>;
  }

  const sentCount = data!.filter((item) => item.status === "SENT").length;
  const failedCount = data!.filter((item) => item.status === "FAILED").length;
  console.log("Sent Count:", sentCount); // Log sent count
  console.log("Failed Count:", failedCount); // Log failed count

  // Chart.js data format
  const labels = ['Sent', 'Failed'];
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Audience Size',
        data: [sentCount, failedCount],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Line chart requires different format
  const lineData = {
    labels,
    datasets: [
      {
        label: 'Audience Size',
        data: [sentCount, failedCount],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Campaign Delivery Status',
      },
    },
  };

  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  console.log(data);

  return (
    <div className="mb-8">
      <Table>
        <TableCaption>A list of your recent Orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data!.length > 0 ? (
            data!.toReversed().map((item, id) => (
              <TableRow key={id}>
                <TableCell className="font-medium">{item.custName}</TableCell>
                <TableCell>{item.custEmail}</TableCell>
                <TableCell>
                  <Badge
                    className={`${item.status == "FAILED" ? "bg-red-400 bg-opacity-40" : "bg-green-400 bg-opacity-40"}`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No campaign data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mb-4 mt-8 md:text-3xl text-xl">Delivery Stats</div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart */}
        <div className="bg-gray-800 bg-opacity-20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-center">Bar Chart</h3>
          <div className="h-64">
            <Bar options={options} data={chartData} />
          </div>
        </div>
        
        {/* Doughnut Chart */}
        <div className="bg-gray-800 bg-opacity-20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-center">Doughnut Chart</h3>
          <div className="h-64 flex justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-gray-800 bg-opacity-20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-center">Pie Chart</h3>
          <div className="h-64 flex justify-center">
            <Pie data={chartData} options={options} />
          </div>
        </div>
        
        {/* Line Chart */}
        <div className="bg-gray-800 bg-opacity-20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-center">Line Chart</h3>
          <div className="h-64">
            <Line options={options} data={lineData} />
          </div>
        </div>
        
        {/* Polar Area Chart */}
        <div className="bg-gray-800 bg-opacity-20 p-4 rounded-lg md:col-span-2">
          <h3 className="text-lg font-medium mb-2 text-center">Polar Area Chart</h3>
          <div className="h-64 flex justify-center">
            <PolarArea data={chartData} options={{
              ...options,
              scales: {
                r: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.3)', // More visible grid lines
                    lineWidth: 1.5 // Thicker lines
                  },
                  angleLines: {
                    color: 'rgba(255, 255, 255, 0.3)', // More visible angle lines
                    lineWidth: 1.5 // Thicker lines
                  },
                  ticks: {
                    backdropColor: 'transparent', // Transparent background for ticks
                    color: 'rgba(255, 255, 255, 0.8)', // More visible tick labels
                    z: 100 // Ensure ticks are above the chart
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestCampaigns;
