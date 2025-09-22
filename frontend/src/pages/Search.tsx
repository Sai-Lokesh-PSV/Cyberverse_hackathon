import { useEffect, useState } from "react";
import { Search as SearchIcon, MapPin, Shield, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-land-registry.jpg";

// Mock data for demonstration and fallback
const mockParcels = [
  {
    id: "PLT-2024-001",
    address: "123 Oak Street, Springfield",
    owner: "John Smith",
    area: "0.25 acres",
    status: "verified",
    blockchainHash: "0x1a2b3c4d5e6f7890abcdef123456789",
    lastUpdated: "2024-01-15",
    fraudRisk: "low",
    estimatedValue: "$485,000"
  },
  {
    id: "PLT-2024-002", 
    address: "456 Pine Avenue, Springfield",
    owner: "Sarah Johnson",
    area: "0.18 acres",
    status: "pending",
    blockchainHash: "0x9876543210fedcba0987654321",
    lastUpdated: "2024-01-20",
    fraudRisk: "low",
    estimatedValue: "$392,000"
  },
  {
    id: "PLT-2024-003",
    address: "789 Maple Drive, Springfield", 
    owner: "Mike Wilson",
    area: "0.33 acres",
    status: "disputed",
    blockchainHash: "0xabcdef123456789012345678",
    lastUpdated: "2024-01-10",
    fraudRisk: "medium",
    estimatedValue: "$527,000"
  }
];

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

type Parcel = typeof mockParcels[number];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allParcels, setAllParcels] = useState<Parcel[]>(mockParcels);
  const [searchResults, setSearchResults] = useState<Parcel[]>(mockParcels);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/parcels`);
        if (!res.ok) throw new Error("Failed to load parcels");
        const data = await res.json();
        // Backend now provides: id, address, owner_name, area_display, status, blockchain_hash, last_updated, fraud_risk, estimated_value
        const formattedParcels: Parcel[] = data.map((p: any) => ({
          id: p.id,
          address: p.address,
          owner: p.owner_name,
          area: p.area_display,
          status: p.status,
          blockchainHash: p.blockchain_hash,
          lastUpdated: p.last_updated,
          fraudRisk: p.fraud_risk,
          estimatedValue: p.estimated_value,
        }));
        setAllParcels(formattedParcels);
        setSearchResults(formattedParcels);
      } catch (_) {
        setAllParcels(mockParcels);
        setSearchResults(mockParcels);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = allParcels.filter(parcel => 
          parcel.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parcel.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          parcel.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults(allParcels);
      }
      setIsSearching(false);
    }, 300);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "disputed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "verified":
        return "status-verified";
      case "pending":
        return "status-pending";
      case "disputed":
        return "status-disputed";
      default:
        return "status-indicator";
    }
  };

  const getRiskBadgeVariant = (risk: string): "default" | "secondary" | "destructive" => {
    switch (risk) {
      case "low":
        return "secondary";
      case "medium":
        return "default";
      case "high":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Land Registry System"
            className="w-full h-full object-cover mix-blend-overlay opacity-20"
          />
        </div>
        <div className="relative container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Secure Land Registry
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Search, verify, and manage property records with blockchain-powered security and transparency.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Input
                placeholder="Search by address, owner name, or parcel ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-white text-foreground border-0 focus:ring-2 focus:ring-white/50"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || loading}
                className="bg-white text-primary hover:bg-white/90"
              >
                <SearchIcon className="h-4 w-4 mr-2" />
                {loading ? "Loading..." : isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Property Records</h2>
            <div className="text-muted-foreground">
              {searchResults.length} results found
            </div>
          </div>

          <div className="grid gap-6">
            {searchResults.map((parcel) => (
              <Card key={parcel.id} className="parcel-card">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-foreground flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {parcel.address}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1">Parcel ID: {parcel.id}</p>
                    </div>
                    <div className={`status-indicator ${getStatusClass(parcel.status)} flex items-center gap-1`}>
                      {getStatusIcon(parcel.status)}
                      <span className="capitalize">{parcel.status}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Owner</p>
                      <p className="text-foreground">{parcel.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Area</p>
                      <p className="text-foreground">{parcel.area}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
                      <p className="text-foreground font-semibold">{parcel.estimatedValue}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-foreground">{parcel.lastUpdated}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Blockchain Hash</p>
                        <div className="blockchain-hash">
                          {parcel.blockchainHash.slice(0, 20)}...
                        </div>
                      </div>
                      <Badge variant={getRiskBadgeVariant(parcel.fraudRisk)}>
                        {parcel.fraudRisk.toUpperCase()} RISK
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/parcel/${parcel.id}`}>
                          View Details
                        </Link>
                      </Button>
                      {parcel.status === "verified" && (
                        <Button size="sm" asChild>
                          <Link to={`/transfer/${parcel.id}`}>
                            Request Transfer
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchResults.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or browse all properties.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;