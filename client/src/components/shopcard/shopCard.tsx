import Link from "next/link";
import { BACKEND_SERVER_URL } from "@/utils/env";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Tcampaign = {
  id: string; // MongoDB _id
  name: string;
  details: string;
  onDelete: (id: string) => void;
};

const ShopCard = (props: Tcampaign) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      props.onDelete(props.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <div className="mt-4 bg-zinc-800 p-4 border-gray-600 rounded-md border-[0.5px] bg-opacity-40">
      <div className="text-xl">{props.name}</div>
      <div className="text-xs text-gray-500">{props.details}</div>
      <div className="flex gap-2 mt-1">
        <Link
          href={`/${encodeURIComponent(props.name)}`}
          className="text-sm hover:underline ml-auto text-blue-400"
          prefetch={false} // Disable prefetch to avoid server-side localStorage errors
        >
          Show details
        </Link>
        <div 
          className="text-sm hover:underline cursor-pointer text-red-400"
          onClick={handleDeleteClick}
        >
          Delete
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete "{props.name}" campaign?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="mr-2 bg-white text-black hover:bg-white hover:text-black"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ShopCard;
