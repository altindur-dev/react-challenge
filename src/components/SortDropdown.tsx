import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

export type SortField = "name" | "email" | "company";

interface SortDropdownProps {
  onSort: (field: SortField) => void;
}

const SortDropdown = ({ onSort }: SortDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowUpDown className="h-4 w-4" />
          Sort By
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSort("name")}>
          Name
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("email")}>
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort("company")}>
          Company
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortDropdown;
