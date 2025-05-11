import Link from "next/link";
import { BACKEND_SERVER_URL } from "@/utils/env";

type Tcampaign = {
  id: string; // MongoDB _id
  name: string;
  details: string;
  onDelete: (id: string) => void;
};

const ShopCard = (props: Tcampaign) => {
  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${props.name}" campaign?`)) {
      try {
        props.onDelete(props.id);
      } catch (error) {
        console.error("Error deleting campaign:", error);
        alert("Failed to delete campaign");
      }
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
        >
          Show details
        </Link>
        <div 
          className="text-sm hover:underline cursor-pointer text-red-400"
          onClick={handleDelete}
        >
          Delete
        </div>
      </div>
    </div>
  );
};
export default ShopCard;
