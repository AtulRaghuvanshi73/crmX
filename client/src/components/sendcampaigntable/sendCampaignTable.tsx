"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetchCustomerData from "@/hooks/fetchCustomerData";
import { BACKEND_SERVER_URL } from "@/utils/env";
import { CampaignPerformanceSummary } from "@/components/campaign-insights/CampaignPerformanceSummary";
import { toast } from "sonner";

export type Customer = {
  custName: string;
  custEmail: string;
  spends?: number;
  visits?: number;
  lastVisits?: string;
  shopName?: string;
  [key: string]: string | number | undefined;
};

const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="bg-gray-800"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="bg-gray-800"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "custName",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("custName")}</div>,
  },
  {
    accessorKey: "custEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("custEmail")}</div>
    ),
  },
];

const SendCampaignTable = () => {
  const { data, loading, error } = useFetchCustomerData();
  const [filteredData, setFilteredData] = React.useState<Customer[]>([]);
  
  React.useEffect(() => {
    if (data) {
      setFilteredData(data as Customer[]);
    }
  }, [data]);
  
  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Import Rule type from NLSegment component
  type Rule = {
    field: string;
    operator: string;
    value: number | string;
    humanReadable: string;
  };

  const handleApplySegmentRules = (rules: Rule[]) => {
    if (!data || !rules.length) {
      // Reset to original data if no rules
      setFilteredData(data || []);
      return;
    }

    const filtered = data.filter(customer => {
      return rules.every(rule => {
        const { field, operator, value } = rule;
        const customerValue = customer[field as keyof typeof customer];
        
        if (customerValue === undefined) return false;

        // Handle date values (which might be timestamps in milliseconds)
        if (field === 'lastVisits') {
          const customerDate = new Date(customerValue).getTime();
          const ruleValueDate = typeof value === 'string' ? new Date(value).getTime() : value;
          
          if (!isNaN(customerDate) && !isNaN(ruleValueDate)) {
            switch (operator) {
              case '>':
                return customerDate > ruleValueDate;
              case '<':
                return customerDate < ruleValueDate;
              case '=':
              case '==':
                return customerDate == ruleValueDate;
              case '>=':
                return customerDate >= ruleValueDate;
              case '<=':
                return customerDate <= ruleValueDate;
              case '!=':
                return customerDate != ruleValueDate;
              default:
                return false;
            }
          }
        }
        
        // Convert values to same type before comparison
        const customerValueNum = typeof customerValue === 'string' && !isNaN(parseFloat(customerValue)) 
          ? parseFloat(customerValue) 
          : (typeof customerValue === 'number' ? customerValue : NaN);
          
        const ruleValueNum = typeof value === 'string' && !isNaN(parseFloat(value)) 
          ? parseFloat(value) 
          : (typeof value === 'number' ? value : NaN);
        
        // If both values are numbers, compare numerically
        if (!isNaN(customerValueNum) && !isNaN(ruleValueNum)) {
          switch (operator) {
            case '>':
              return customerValueNum > ruleValueNum;
            case '<':
              return customerValueNum < ruleValueNum;
            case '=':
            case '==':
              return customerValueNum == ruleValueNum;
            case '>=':
              return customerValueNum >= ruleValueNum;
            case '<=':
              return customerValueNum <= ruleValueNum;
            case '!=':
              return customerValueNum != ruleValueNum;
            default:
              return false;
          }
        } else {
          // For string comparisons
          const customerStr = String(customerValue);
          const valueStr = String(value);
          
          switch (operator) {
            case '=':
            case '==':
              return customerStr === valueStr;
            case '!=':
              return customerStr !== valueStr;
            case 'contains':
              return customerStr.includes(valueStr);
            case 'startsWith':
              return customerStr.startsWith(valueStr);
            case 'endsWith':
              return customerStr.endsWith(valueStr);
            default:
              return false;
          }
        }
      });
    });

    setFilteredData(filtered);
  };

  const handleSendCampaign = async () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
      
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one recipient");
      return;
    }
    
    try {
      const response = await fetch(`${BACKEND_SERVER_URL}/sendCampaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          customers: selectedRows,
          messageSubject: "Campaign " + new Date().toLocaleDateString(),
          messageBody: "This is an automated campaign message.",
        }),
      });
      if (response.ok) {
        toast.success("Campaign sent successfully");
        window.location.reload();
      } else {
        toast.error("Failed to send campaign");
      }
    } catch (error) {
      console.error("Error sending campaign", error);
      toast.error("Error sending campaign. Please try again.");
    }
  };

  return (
    <div className="w-full pb-8">

      {/* Audience Table */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div className="mb-2 flex justify-between items-center">
            <h3 className="font-medium text-lg">Target Audience ({filteredData.length} customers)</h3>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={
                        row.getIsSelected()
                          ? "bg-gray-800 text-black bg-opacity-55"
                          : ""
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No customers match your current segment filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-sm text-gray-400">
              {table.getSelectedRowModel().rows.length} of {filteredData.length} customers selected
            </div>
            <button
              onClick={handleSendCampaign}
              disabled={table.getSelectedRowModel().rows.length === 0}
              className="p-2 bg-white hover:bg-opacity-70 text-black rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Campaign
            </button>
          </div>
          
          {/* Campaign Performance Summary - Moved below the audience table */}
          <div className="mt-8">
            <h3 className="text-xl font-medium mb-4">Campaign Insights</h3>
            <CampaignPerformanceSummary />
          </div>
        </>
      )}
    </div>
  );
};

export default SendCampaignTable;
