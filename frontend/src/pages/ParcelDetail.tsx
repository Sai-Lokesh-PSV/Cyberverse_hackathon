import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, User, Calendar, Shield, TrendingUp, AlertTriangle, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Mock detailed parcel data as fallback
const getMockParcelDetails = (id: string) => ({
  id,
  address: "123 Oak Street, Springfield, County, State 12345",
  coordinates: { lat: 40.7128, lng: -74.0060 },
  owner: {
    name: "John Smith",
    idNumber: "SSN: XXX-XX-1234",
    contact: "john.smith@email.com",
    since: "2019-03-15"
  },
  area: "0.25 acres (10,890 sq ft)",
  zoning: "Residential R-1",
  status: "verified",
  blockchainHash: "0x1a2b3c4d5e6f7890abcdef123456789012345678",
  transactionHistory: [
    {
      date: "2024-01-15",
      type: "Verification Update",
      from: "System",
      to: "Verified Status",
      hash: "0x1a2b3c4d..."
    },
    {
      date: "2019-03-15", 
      type: "Ownership Transfer",
      from: "Jane Doe",
      to: "John Smith",
      hash: "0x9876543a..."
    }
  ],
  aiAnalysis: {
    fraudRisk: "low",
    riskScore: 0.15,
    marketValue: "$485,000",
    confidence: 0.92,
    lastValuation: "2024-01-10",
    priceHistory: [
      { date: "2024-01", value: 485000 },
      { date: "2023-07", value: 472000 },
      { date: "2023-01", value: 445000 }
    ]
  },
  encumbrances: [],
  documents: [
    { name: "Title Deed", type: "PDF", size: "2.1 MB", hash: "0xabc123..." },
    { name: "Survey Report", type: "PDF", size: "5.3 MB", hash: "0xdef456..." },
    { name: "Tax Assessment", type: "PDF", size: "1.8 MB", hash: "0x789ghi..." }
  ]
});

const ParcelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [parcel, setParcel] = useState(getMockParcelDetails(id || ""));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadParcel = async () => {
      if (!id) return;
      
      try {
        const res = await fetch(`${API_BASE}/parcel/${id}`);
        if (!res.ok) throw new Error("Failed to load parcel");
        const data = await res.json();
        
        // Transform backend data to frontend format
        const transformedParcel = {
          id: data.id,
          address: data.address,
          coordinates: { lat: data.coordinates_lat, lng: data.coordinates_lng },
          owner: {
            name: data.owner.name,
            idNumber: data.owner.id_number || "N/A",
            contact: data.owner.email,
            since: data.owner.created_at?.split('T')[0] || "N/A"
          },
          area: data.area_display || `${data.area_sqft.toLocaleString()} sq ft`,
          zoning: data.zoning || "N/A",
          status: data.status,
          blockchainHash: data.blockchain_hash,
          transactionHistory: data.transactions?.map((tx: any) => ({
            date: tx.transaction_date?.split('T')[0] || "N/A",
            type: tx.type,
            from: tx.from_entity || "N/A",
            to: tx.to_entity || "N/A",
            hash: tx.blockchain_hash || "N/A"
          })) || [],
          aiAnalysis: data.ai_analysis ? {
            fraudRisk: data.ai_analysis.fraud_risk,
            riskScore: data.ai_analysis.risk_score,
            marketValue: `$${data.ai_analysis.market_value.toLocaleString()}`,
            confidence: data.ai_analysis.confidence,
            lastValuation: data.ai_analysis.last_valuation?.split('T')[0] || "N/A",
            priceHistory: data.ai_analysis.price_history || []
          } : {
            fraudRisk: "low",
            riskScore: 0.0,
            marketValue: "$—",
            confidence: 0.0,
            lastValuation: "N/A",
            priceHistory: []
          },
          encumbrances: data.encumbrances?.map((enc: any) => ({
            type: enc.type,
            description: enc.description,
            amount: enc.amount,
            isActive: enc.is_active
          })) || [],
          documents: data.documents?.map((doc: any) => ({
            name: doc.name,
            type: doc.type.replace('_', ' ').toUpperCase(),
            size: doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : "N/A",
            hash: doc.file_hash || "N/A"
          })) || []
        };
        
        setParcel(transformedParcel);
      } catch (error) {
        console.error("Failed to load parcel:", error);
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };
    
    loadParcel();
  }, [id]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-success";
      case "medium": return "text-warning";
      case "high": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{parcel.address}</h1>
            <p className="text-muted-foreground">Parcel ID: {parcel.id}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Property Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Owner</p>
                      <p className="text-lg font-semibold text-foreground">{parcel.owner.name}</p>
                      <p className="text-sm text-muted-foreground">Owner since {parcel.owner.since}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Property Area</p>
                      <p className="text-foreground">{parcel.area}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Zoning</p>
                      <p className="text-foreground">{parcel.zoning}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge className="status-verified">
                        <Shield className="h-3 w-3 mr-1" />
                        BLOCKCHAIN VERIFIED
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                      <p className="text-foreground">{parcel.coordinates.lat}, {parcel.coordinates.lng}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Blockchain Hash</p>
                      <div className="blockchain-hash">
                        {parcel.blockchainHash}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  AI Valuation & Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">{parcel.aiAnalysis.marketValue}</div>
                    <p className="text-sm text-muted-foreground">Estimated Market Value</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(parcel.aiAnalysis.confidence * 100).toFixed(0)}% confidence
                    </p>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${getRiskColor(parcel.aiAnalysis.fraudRisk)}`}>
                      {parcel.aiAnalysis.fraudRisk.toUpperCase()}
                    </div>
                    <p className="text-sm text-muted-foreground">Fraud Risk Level</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Score: {(parcel.aiAnalysis.riskScore * 100).toFixed(1)}/100
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {parcel.encumbrances.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Encumbrances</p>
                    <p className="text-xs text-muted-foreground mt-1">Clear for transfer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcel.transactionHistory.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.from} → {transaction.to}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="blockchain-hash">{transaction.hash}</div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Shield className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link to={`/transfer/${parcel.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Request Transfer
                  </Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Title Extract
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Property Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {parcel.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-foreground">{parcel.owner.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{parcel.owner.contact}</p>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDetail;