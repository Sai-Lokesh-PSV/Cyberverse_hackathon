import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Mock transfer data as fallback
const mockTransfers = [
  {
    id: "TXN-2024-001",
    property: "123 Oak Street, Springfield",
    parcelId: "PLT-2024-001",
    from: "John Smith",
    to: "Alice Johnson",
    amount: "$485,000",
    date: "2024-01-20",
    status: "completed",
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef"
  },
  {
    id: "TXN-2024-002", 
    property: "456 Pine Avenue, Springfield",
    parcelId: "PLT-2024-002",
    from: "Sarah Davis",
    to: "Bob Wilson",
    amount: "$392,000",
    date: "2024-01-19",
    status: "pending",
    blockchainHash: null
  },
  {
    id: "TXN-2024-003",
    property: "789 Maple Drive, Springfield", 
    parcelId: "PLT-2024-003",
    from: "Mike Johnson",
    to: "Carol Brown",
    amount: "$527,000",
    date: "2024-01-18",
    status: "rejected",
    blockchainHash: null
  }
];

const Transfers = () => {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransfers = async () => {
      try {
        const res = await fetch(`${API_BASE}/transfers`);
        if (!res.ok) throw new Error("Failed to load transfers");
        const data = await res.json();
        
        const formattedTransfers = data.map((t: any) => ({
          id: t.id,
          property: t.parcel.address,
          parcelId: t.parcel.id,
          from: t.from_user.name,
          to: t.to_user.name,
          amount: `$${t.amount.toLocaleString()}`,
          date: t.created_at.split('T')[0],
          status: t.status,
          blockchainHash: t.blockchain_hash
        }));
        
        setTransfers(formattedTransfers);
      } catch (error) {
        console.error("Failed to load transfers:", error);
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    loadTransfers();
  }, []);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "status-verified";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-disputed";
      default:
        return "status-indicator";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 px-4 bg-card border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                Property Transfers
              </h1>
              <p className="text-muted-foreground">Track and manage property ownership transfers</p>
            </div>
            <Button asChild>
              <Link to="/">
                Start New Transfer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">156</div>
                <p className="text-sm text-muted-foreground">Completed This Month</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">23</div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">$127.4M</div>
                <p className="text-sm text-muted-foreground">Total Transfer Value</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">4.2</div>
                <p className="text-sm text-muted-foreground">Avg Processing Days</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transfer List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transfer Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransfers.map((transfer) => (
                <div key={transfer.id} className="border border-border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{transfer.property}</h3>
                      <p className="text-sm text-muted-foreground">Transfer ID: {transfer.id}</p>
                    </div>
                    <div className={`status-indicator ${getStatusClass(transfer.status)} flex items-center gap-1`}>
                      {getStatusIcon(transfer.status)}
                      <span className="capitalize">{transfer.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">From</p>
                      <p className="text-foreground">{transfer.from}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">To</p>
                      <p className="text-foreground">{transfer.to}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-foreground font-semibold">{transfer.amount}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date</p>
                      <p className="text-foreground">{transfer.date}</p>
                    </div>
                  </div>

                  {transfer.blockchainHash && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Blockchain Hash</p>
                      <div className="blockchain-hash">
                        {transfer.blockchainHash}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/parcel/${transfer.parcelId}`}>
                        View Property
                      </Link>
                    </Button>
                    {transfer.status === "completed" && (
                      <Button size="sm">
                        Download Certificate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transfers;