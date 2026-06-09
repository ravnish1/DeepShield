import { useRiskStore } from "../../store/riskStore";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Search, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function FilterBar() {
  const { filters, setFilter } = useRiskStore();

  const isFiltered =
    filters.status !== "All" ||
    filters.minRisk !== "" ||
    filters.maxRisk !== "" ||
    filters.search !== "";

  const handleReset = () => {
    setFilter("status", "All");
    setFilter("minRisk", "");
    setFilter("maxRisk", "");
    setFilter("search", "");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
      <div className="w-full md:w-1/3 space-y-1.5">
        <Label htmlFor="search" className="text-xs text-gray-500 uppercase tracking-wider">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            placeholder="Search name or email..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-1/4 space-y-1.5">
        <Label htmlFor="status" className="text-xs text-gray-500 uppercase tracking-wider">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value: "All" | "clear" | "flagged" | "review") => 
            setFilter("status", value)
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="clear">Cleared</SelectItem>
            <SelectItem value="review">Under Review</SelectItem>
            <SelectItem value="flagged">Investigate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-1/4 flex gap-2">
        <div className="w-1/2 space-y-1.5">
          <Label htmlFor="minRisk" className="text-xs text-gray-500 uppercase tracking-wider">Min Risk</Label>
          <Input
            id="minRisk"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={filters.minRisk}
            onChange={(e) => setFilter("minRisk", e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div className="w-1/2 space-y-1.5">
          <Label htmlFor="maxRisk" className="text-xs text-gray-500 uppercase tracking-wider">Max Risk</Label>
          <Input
            id="maxRisk"
            type="number"
            min="0"
            max="100"
            placeholder="100"
            value={filters.maxRisk}
            onChange={(e) => setFilter("maxRisk", e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
      </div>

      {isFiltered && (
        <Button
          variant="ghost"
          onClick={handleReset}
          className="text-gray-500 hover:text-black w-full md:w-auto"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}
