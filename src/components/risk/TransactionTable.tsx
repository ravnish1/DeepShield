import { useState } from "react";
import { useRiskStore } from "../../store/riskStore";
import type { Transaction } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Clock, ExternalLink, ArrowUpDown, ArrowDown, ArrowUp, Flag, ShieldCheck, Download } from "lucide-react";
import { format } from "date-fns";

export default function TransactionTable() {
  const { filteredTransactions, openDrawer, sortConfig, setSort, setFilter, bulkUpdateStatus } = useRiskStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "clear":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5 gap-1"><CheckCircle2 className="w-3 h-3"/> CLEARED</Badge>;
      case "flagged":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5 gap-1"><AlertTriangle className="w-3 h-3"/> INVESTIGATE</Badge>;
      case "review":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 uppercase tracking-widest text-[9px] font-bold px-2 py-0.5 gap-1"><Clock className="w-3 h-3"/> REVIEW</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score < 30) return "text-green-600 bg-green-50 border-green-100";
    if (score <= 70) return "text-yellow-600 bg-yellow-50 border-yellow-100";
    return "text-red-600 bg-red-50 border-red-100";
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData.map((t: Transaction) => t.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rId => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleBulkAction = (status: "clear" | "flagged" | "review") => {
    bulkUpdateStatus(selectedRows, status);
    setSelectedRows([]);
  };

  return (
    <div className="space-y-4 relative">
      
      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-10 -mt-14 mx-4 bg-black rounded-lg px-4 py-3 flex items-center justify-between text-white animate-slide-in-row shadow-lg">
          <div className="text-[13px] font-medium">
            <span className="bg-white text-black px-2 py-0.5 rounded-full mr-3 text-[11px] font-bold">{selectedRows.length}</span>
            risk events selected
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleBulkAction("flagged")} className="text-white hover:bg-gray-800 hover:text-white h-8 text-[12px] active:scale-[0.97]">
              <Flag className="w-3.5 h-3.5 mr-2" /> Investigate All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleBulkAction("clear")} className="text-white hover:bg-gray-800 hover:text-white h-8 text-[12px] active:scale-[0.97]">
              <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Clear All
            </Button>
            <div className="w-px h-4 bg-gray-700 my-auto mx-2" />
            <Button size="sm" variant="ghost" className="text-white hover:bg-gray-800 hover:text-white h-8 text-[12px] active:scale-[0.97]">
              <Download className="w-3.5 h-3.5 mr-2" /> Export Logs
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
              <TableHead className="w-12 text-center px-4">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                  checked={currentData.length > 0 && selectedRows.length === currentData.length}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Risk Event & Owner</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-secondary font-semibold">At-Risk Deposit</TableHead>
              <TableHead 
                className="text-[10px] uppercase tracking-widest text-secondary font-semibold cursor-pointer hover:text-black transition-colors"
                onClick={() => setSort("riskScore")}
              >
                <div className="flex items-center gap-1">
                  Risk Score
                  {sortConfig?.key === "riskScore" ? (
                    sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-secondary font-semibold">Event Time & Location</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-widest text-secondary font-semibold w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 animate-fade-in">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-gray-300">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="9" y1="9" x2="13" y2="13"></line>
                      <line x1="13" y1="9" x2="9" y2="13"></line>
                    </svg>
                    <p className="text-[14px] font-medium text-black">No risk events found</p>
                    <p className="text-[13px] text-gray-400 mt-1 mb-6">Try adjusting your filters or search terms</p>
                    <Button variant="outline" size="sm" onClick={() => setFilter("status", "All")} className="active:scale-[0.97]">
                      Reset Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((transaction: Transaction, i: number) => (
                <TableRow 
                  key={transaction.id} 
                  className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 hover:shadow-[-4px_0_0_0_#dc2626] group animate-slide-in-row opacity-0"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <TableCell className="w-12 text-center px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                      checked={selectedRows.includes(transaction.id)}
                      onChange={() => toggleSelectRow(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-[13px] text-red-600 font-mono mb-0.5 truncate max-w-[280px]" title={transaction.eventType}>
                      {transaction.eventType}
                    </div>
                    <div className="font-medium text-[13px] text-black">
                      {transaction.name} 
                    </div>
                    <div className="text-[12px] text-gray-500">{transaction.email}</div>
                  </TableCell>
                  <TableCell className="font-mono text-[13px] font-medium">
                    ₹{transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${getRiskScoreColor(
                        transaction.riskScore
                      )} font-mono text-[12px] font-bold`}
                    >
                      {transaction.riskScore}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    <div className="text-[12px] text-black font-medium">
                      {format(new Date(transaction.timestamp), "MMM dd, HH:mm")}
                    </div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wider">{transaction.country}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDrawer(transaction)}
                      className="w-8 h-8 rounded-full hover:bg-gray-200 text-gray-500 active:scale-[0.97]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-[12px] text-gray-500 font-medium">
            Showing <span className="text-black font-semibold">{startIndex + 1}</span> to{" "}
            <span className="text-black font-semibold">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> of{" "}
            <span className="text-black font-semibold">{filteredTransactions.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 border-gray-200 text-gray-600 active:scale-[0.97]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-[12px] font-medium text-black px-2">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 border-gray-200 text-gray-600 active:scale-[0.97]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
