import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetchOrderData from "@/hooks/fetchOrderData";
import { Loader, ErrorMessage } from "@/components/ui/loader";

const OrderTable = () => {
  const { data, error, loading } = useFetchOrderData();
  if (loading) {
    return <Loader text="Loading order data..." />;
  }

  if (error) {
    return <ErrorMessage message="Error loading order data. Please try again later." />;
  }
  return (
    <div className="mb-10">
      <div className="text-xl mt-8 mb-4">Order Table</div>
      <div className="rounded-lg overflow-hidden border border-gray-700 shadow-md bg-gray-800 bg-opacity-20 mb-8">
        <Table>
          <TableCaption className="text-gray-400 pb-4">A list of your recent orders</TableCaption>
          <TableHeader className="bg-gray-800 bg-opacity-40">
            <TableRow>
              <TableHead className="py-4 text-base font-medium text-white">Customer Name</TableHead>
              <TableHead className="py-4 text-base font-medium text-white">Amount</TableHead>
              <TableHead className="py-4 text-base font-medium text-white">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data!.map((items, id) => (
              <TableRow 
                key={id}
                className="hover:bg-gray-700 hover:bg-opacity-20 transition-colors"
              >
                <TableCell className="py-3 font-medium">{items.orderName}</TableCell>
                <TableCell className="py-3">₹{typeof items.amount === 'number' ? 
                  items.amount.toLocaleString() : items.amount}</TableCell>
                <TableCell className="py-3">
                  {new Date(items.orderDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrderTable;
