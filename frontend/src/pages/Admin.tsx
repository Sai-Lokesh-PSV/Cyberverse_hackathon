import { useState, useEffect } from "react";
import { Users, FileText, AlertTriangle, CheckCircle, Clock, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Mock admin dashboard data as fallback
const mockStats = {
  totalProperties: 1247,
  pendingTransfers: 23,
  fraudAlerts: 4,
  activeUsers: 89,
  monthlyTransfers: 156,
  totalTransferValue: 127400000
};

const mockPendingTransfers = [
  {
    id: "TXN-001",
    property: "123 Oak Street",
    from: "John Smith", 
    to: "Alice Johnson",
    amount: "$485,000",
    date: "2024-01-20",
    status: "pending_approval"
  },
  {
    id: "TXN-002",
    property: "456 Pine Avenue",
    from: "Sarah Davis",
    to: "Bob Wilson", 
    amount: "$392,000",
    date: "2024-01-19",
    status: "document_review"
  }
];

const mockFraudAlerts = [
  {
    id: "FRA-001",
    property: "789 Elm Street",
    owner: "Mike Johnson",
    risk: "high",
    reason: "Multiple ownership claims detected",
    date: "2024-01-18"
  },
  {
    id: "FRA-002", 
    property: "321 Birch Road",
    owner: "Lisa Brown",
    risk: "medium",
    reason: "Unusual transfer pattern",
    date: "2024-01-17"
  }
];

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [stats, setStats] = useState(mockStats);
  const [transfers, setTransfers] = useState(mockPendingTransfers);
  const [fraudAlerts, setFraudAlerts] = useState(mockFraudAlerts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load dashboard stats
        const statsRes = await fetch(`${API_BASE}/dashboard/stats`);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Load pending transfers
        const transfersRes = await fetch(`${API_BASE}/transfers?status=pending`);
        if (transfersRes.ok) {
          const transfersData = await transfersRes.json();
          const formattedTransfers = transfersData.map((t: any) => ({
            id: t.id,
            property: t.parcel.address,
            from: t.from_user.name,
            to: t.to_user.name,
            amount: `$${t.amount.toLocaleString()}`,
            date: t.created_at.split('T')[0],
            status: t.status
          }));
          setTransfers(formattedTransfers);
        }

        // Load fraud alerts
        const alertsRes = await fetch(`${API_BASE}/fraud-alerts?resolved=false`);
        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          const formattedAlerts = alertsData.map((a: any) => ({
            id: a.id,
            property: a.parcel.address,
            owner: a.parcel.owner.name,
            risk: a.risk_level,
            reason: a.reason,
            date: a.created_at.split('T')[0]
          }));
          setFraudAlerts(formattedAlerts);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleApproveTransfer = (transferId: string) => {
    console.log(`Approving transfer: ${transferId}`);
    // Add actual approval logic here
  };

  const handleRejectTransfer = (transferId: string) => {
    console.log(`Rejecting transfer: ${transferId}`);
    // Add actual rejection logic here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 px-4 bg-card border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Manage land registry operations and approvals</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Alerts</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Properties</p>
                      <p className="text-2xl font-bold text-foreground">{mockStats.totalProperties}</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Transfers</p>
                      <p className="text-2xl font-bold text-warning">{mockStats.pendingTransfers}</p>
                    </div>
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Fraud Alerts</p>
                      <p className="text-2xl font-bold text-destructive">{mockStats.fraudAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-accent">{mockStats.activeUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly Transfers</p>
                      <p className="text-2xl font-bold text-success">{mockStats.monthlyTransfers}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transfer Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPendingTransfers.slice(0, 3).map((transfer) => (
                      <div key={transfer.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{transfer.property}</p>
                          <p className="text-sm text-muted-foreground">{transfer.from} → {transfer.to}</p>
                          <p className="text-xs text-muted-foreground">{transfer.date}</p>
                        </div>
                        <Badge variant="outline" className="status-pending">
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Fraud Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFraudAlerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{alert.property}</p>
                          <p className="text-sm text-muted-foreground">{alert.reason}</p>
                          <p className="text-xs text-muted-foreground">{alert.date}</p>
                        </div>
                        <Badge variant={alert.risk === "high" ? "destructive" : "default"}>
                          {alert.risk.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transfers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Transfer Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPendingTransfers.map((transfer) => (
                    <div key={transfer.id} className="border border-border rounded-lg p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="font-medium text-foreground">{transfer.property}</p>
                          <p className="text-sm text-muted-foreground">ID: {transfer.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transfer</p>
                          <p className="text-foreground">{transfer.from} → {transfer.to}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-semibold text-foreground">{transfer.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveTransfer(transfer.id)}
                            className="bg-success hover:bg-success/90"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectTransfer(transfer.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fraud" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockFraudAlerts.map((alert) => (
                    <div key={alert.id} className="border border-border rounded-lg p-4">
                      <div className="grid md:grid-cols-4 gap-4 items-center">
                        <div>
                          <p className="font-medium text-foreground">{alert.property}</p>
                          <p className="text-sm text-muted-foreground">Owner: {alert.owner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Risk Level</p>
                          <Badge variant={alert.risk === "high" ? "destructive" : "default"}>
                            {alert.risk.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reason</p>
                          <p className="text-foreground">{alert.reason}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                          <Button size="sm" variant="outline">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Audit Logs</h3>
                  <p className="text-muted-foreground">Comprehensive audit trail functionality coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;