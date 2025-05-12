import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import useFetchCustomerData from "@/hooks/fetchCustomerData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams, useRouter } from "next/navigation";
import { NLSegment } from "@/components/nl-segment/NLSegment";

// Define customer type
type CustomerDetails = {
  custName: string;
  custEmail: string;
  spends: number;
  visits: number;
  lastVisits: string;
  shopName: string;
  [key: string]: string | number; // Add index signature for dynamic access
};

interface Item {
  id: string;
  label: string;
  state: number;
  filterFn: (customer: any) => boolean;
}

type Rule = {
  field: string;
  operator: string;
  value: number | string;
  humanReadable: string;
};

const CustomerTable = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [cost, setCost] = useState(0);
  const [visits, setVisits] = useState(0);
  const [months, setMonths] = useState(0);
  const [filteredData, setFilteredData] = useState<CustomerDetails[]>([]);
  const [appliedRules, setAppliedRules] = useState<Rule[]>([]);
  const { data, error, loading } = useFetchCustomerData();
  const router = useRouter();
  const params = useParams<{ shopname: string }>();
  const decodedItem = decodeURIComponent(params.shopname || "");

  const items: Item[] = [
    {
      id: "10000",
      label: `spends > INR `,
      state: cost,
      filterFn: (customer) => customer.spends > cost,
    },
    {
      id: "3visits",
      label: `visits <= `,
      state: visits,
      filterFn: (customer) => customer.visits <= visits,
    },
    {
      id: "3months",
      label: `last visit >  months`,
      state: months,
      filterFn: (customer) => {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - months);
        return new Date(customer.lastVisits) < threeMonthsAgo;
      },
    },
  ];

  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading shop data.</div>;
  }

  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let filtered = data;
    selectedItems.forEach((itemId) => {
      const filterItem = items.find((item) => item.id === itemId);
      if (filterItem) {
        filtered = filtered!.filter(filterItem.filterFn);
      }
    });

    setFilteredData(filtered!);
  };
  
  const handleApplyRules = (rules: Rule[]) => {
    setAppliedRules(rules);
    
    if (!data) return;
    
    let filtered = [...data] as CustomerDetails[];
    
    // Apply each rule as a filter
    rules.forEach((rule) => {
      filtered = filtered.filter((customer) => {
        // Use type assertion for field access to avoid TypeScript errors
        const fieldValue = customer[rule.field as keyof CustomerDetails];
        // Convert both values to strings or numbers for comparison
        const customerValue = typeof fieldValue === 'number' ? fieldValue : Number(fieldValue);
        const ruleValue = typeof rule.value === 'number' ? rule.value : Number(rule.value);
        
        // Handle date fields specially
        if (rule.field === 'lastVisits') {
          const customerDate = new Date(String(fieldValue)).getTime();
          const ruleDate = new Date(String(rule.value)).getTime();
          
          switch (rule.operator) {
            case '>': return customerDate > ruleDate;
            case '<': return customerDate < ruleDate;
            case '>=': return customerDate >= ruleDate;
            case '<=': return customerDate <= ruleDate;
            default: return true;
          }
        }
        
        // Handle numeric comparisons
        switch (rule.operator) {
          case '>': return customerValue > ruleValue;
          case '<': return customerValue < ruleValue;
          case '>=': return customerValue >= ruleValue;
          case '<=': return customerValue <= ruleValue;
          case '==':
          case '===':
            // String comparison for equality
            return String(fieldValue) === String(rule.value);
          default:
            return true;
        }
      });
    });
    
    setFilteredData(filtered);
    
    // Clear any manually selected filters
    setSelectedItems([]);
  };

  return (
    <>
      <div className="text-xl mt-4">Customer Table</div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center md:gap-4 gap-2 mt-2 pb-2"
      >
        <div className="">
          <label className="text-sm">Filters: </label>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-row text-sm items-center space-x-3 space-y-0"
          >
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange(item.id, checked)
              }
              className="bg-gray-800"
            />
            <label className="font-normal">
              <div className="flex gap-2 items-center">
                <div>{item.label}</div>
                <input
                  className="w-[80px] h-[40px] text-black"
                  type="number"
                  value={item.state}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    switch (item.id) {
                      case "10000":
                        setCost(value);
                        break;
                      case "3visits":
                        setVisits(value);
                        break;
                      case "3months":
                        setMonths(value);
                        break;
                      default:
                        break;
                    }
                  }}
                />
              </div>
            </label>
          </div>
        ))}
        <Button
          type="submit"
          className="p-3 h-8 border-[0.5px] border-gray-700 hover:opacity-75"
        >
          Show
        </Button>
      </form>
      <div className="text-sm pb-2">
        No. of customers: {filteredData?.length}
      </div>
      <div className="pb-4 flex space-x-2">
        <Button 
          onClick={() => {
            try {
              const username = localStorage.getItem("email");
              // Make sure to provide a default value if campaignName is undefined
              const campaignName = params.shopname || decodedItem || "default";
              
              if (!username) {
                alert("Please log in to view analytics");
                return;
              }
              
              // Email address needs proper encoding to be used in URLs
              const encodedUsername = encodeURIComponent(username);
              
              // Ensure campaignName exists and isn't "undefined"
              const formattedCampaignName = campaignName === "undefined" ? "default" : campaignName;
              
              // Construct URL path properly
              const path = `/${formattedCampaignName}/${encodedUsername}/campaign`;
              console.log("Navigating to:", path);
              
              router.push(path);
            } catch (error) {
              console.error("Navigation error:", error);
              alert("There was an error navigating to the campaign page");
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Analytics
        </Button>
        
        <NLSegment onApplyRules={handleApplyRules} />
      </div>
      
      {appliedRules.length > 0 && (
        <div className="mb-4 p-3 rounded bg-gray-800 bg-opacity-30 border-gray-700 border text-sm">
          <div className="font-medium mb-2">Applied Segment Rules:</div>
          <ul className="space-y-1">
            {appliedRules.map((rule, index) => (
              <li key={index} className="text-gray-300">
                {rule.humanReadable}
              </li>
            ))}
          </ul>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 bg-white text-black hover:bg-white hover:text-black hover:opacity-100"
            onClick={() => {
              setAppliedRules([]);
              setFilteredData(data || []);
            }}
          >
            Clear Rules
          </Button>
        </div>
      )}
      <Table>
        <TableCaption>A list of your recent Customers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Spends</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead className="text-right">Last Visit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((customer, id) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{customer.custName}</TableCell>
              <TableCell>{customer.spends}</TableCell>
              <TableCell>{customer.visits}</TableCell>
              <TableCell className="text-right">
                {customer.lastVisits}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CustomerTable;
