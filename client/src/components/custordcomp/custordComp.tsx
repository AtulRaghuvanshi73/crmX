import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { BACKEND_SERVER_URL } from "@/utils/env";
import { toast } from "sonner";

const CustOrdComponent = () => {
  const router = useRouter();

  const params = useParams<{ shopname: string }>();
  const shopName = decodeURIComponent(params.shopname);

  // -------------customerState--------------//
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [spends, setSpends] = useState("");
  const [visits, setVisit] = useState("");
  const [lastVisits, setLastVisit] = useState("");

  // -------------orderState--------------//
  const [orderName, setOrderName] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [orderDate, setOrderDate] = useState("");

  const handleCustomerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const customerData = {
      custName,
      custEmail,
      spends,
      visits,
      lastVisits,
      shopName,
    };
    try {
      const response = await fetch(`${BACKEND_SERVER_URL}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });
      if (response.ok) {
        toast.success("Customer submitted successfully");
        const username = localStorage.getItem("email");
        if (username) {
          const encodedUsername = encodeURIComponent(username);
          router.push(`/${shopName}/${encodedUsername}/campaign`);
        }
      }
    } catch (error) {
      console.error("Error submitting customer", error);
      toast.error("Failed to submit customer data");
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const orderData = { orderName, orderEmail, amount, orderDate, shopName };
    try {
      const response = await fetch(`${BACKEND_SERVER_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        toast.success("Order submitted successfully");
        window.location.reload();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting order", error);
      toast.error("Failed to submit order");
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 m-auto cursor-pointer">
            <Button variant="outline" className="text-black hover:opacity-75">
              Add Order
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleOrderSubmit}>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Add details of the order.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="items-center gap-4">
                <Label htmlFor="orderName" className="text-right">
                  Name
                </Label>
                <Input
                  id="orderName"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="Order Name"
                  className="col-span-3 text-black"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="orderEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="orderEmail"
                  value={orderEmail}
                  onChange={(e) => setOrderEmail(e.target.value)}
                  className="text-black"
                  type="email"
                  placeholder="Order Email"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-black"
                  placeholder="0"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="orderDate" className="text-right">
                  Date
                </Label>
                <Input
                  id="orderDate"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="text-black"
                  placeholder="yyyy/mm/dd"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-white text-black flex gap-2 m-auto font-normal hover:bg-white hover:bg-opacity-70"
                type="submit"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2 m-auto cursor-pointer">
            <Button variant="outline" className="text-black hover:opacity-75">
              Add Customer
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCustomerSubmit}>
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>
                Add details of the customer.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="items-center gap-4">
                <Label htmlFor="custName" className="text-right">
                  Name
                </Label>
                <Input
                  id="custName"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="Customer Name"
                  className="col-span-3 text-black"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="custEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="custEmail"
                  value={custEmail}
                  onChange={(e) => setCustEmail(e.target.value)}
                  className="text-black"
                  type="email"
                  placeholder="Customer Email"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="spends" className="text-right">
                  Total Amount Spends
                </Label>
                <Input
                  id="spends"
                  value={spends}
                  onChange={(e) => setSpends(e.target.value)}
                  className="text-black"
                  placeholder="0"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="visits" className="text-right">
                  Visits
                </Label>
                <Input
                  id="visits"
                  value={visits}
                  onChange={(e) => setVisit(e.target.value)}
                  className="text-black"
                  placeholder="0"
                />
              </div>
              <div className="items-center gap-4">
                <Label htmlFor="lastVisits" className="text-right">
                  Last Visit
                </Label>
                <Input
                  id="lastVisits"
                  value={lastVisits}
                  onChange={(e) => setLastVisit(e.target.value)}
                  className="text-black"
                  placeholder="yyyy/mm/dd"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                className="bg-white text-black flex gap-2 m-auto font-normal hover:bg-white hover:bg-opacity-70"
                type="submit"
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustOrdComponent;
