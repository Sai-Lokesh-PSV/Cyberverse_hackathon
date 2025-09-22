import { useState } from "react";
import { MapPin, Layers, Info, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock parcel data for map display
const mockMapParcels = [
  { id: "PLT-2024-001", name: "123 Oak Street", lat: 40.7128, lng: -74.0060, status: "verified", owner: "John Smith" },
  { id: "PLT-2024-002", name: "456 Pine Avenue", lat: 40.7580, lng: -73.9855, status: "pending", owner: "Sarah Johnson" },
  { id: "PLT-2024-003", name: "789 Maple Drive", lat: 40.7505, lng: -73.9934, status: "disputed", owner: "Mike Wilson" }
];

const MapView = () => {
  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-success";
      case "pending": return "bg-warning";
      case "disputed": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-8 px-4 bg-card border-b border-border">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-8 w-8 text-primary" />
                Interactive Property Map
              </h1>
              <p className="text-muted-foreground">Explore land parcels and property boundaries</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Input placeholder="Search by address..." className="w-64" />
              <Button>
                <SearchIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                {showTokenInput && !mapboxToken ? (
                  <div className="h-96 flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-border rounded-lg">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Mapbox Integration Required</h3>
                    <p className="text-muted-foreground mb-4 text-center max-w-md">
                      To display the interactive map, please provide your Mapbox public token.
                      You can get one from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
                    </p>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter Mapbox public token..."
                        value={mapboxToken}
                        onChange={(e) => setMapboxToken(e.target.value)}
                        className="w-80"
                      />
                      <Button onClick={() => setShowTokenInput(false)}>
                        Load Map
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-96 bg-map-water/10 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    {/* Placeholder for actual Mapbox integration */}
                    <div className="text-center">
                      <Layers className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Map Loading...</h3>
                      <p className="text-muted-foreground">Interactive map with property boundaries will appear here</p>
                      
                      {/* Mock parcel markers */}
                      <div className="mt-6 flex justify-center gap-4">
                        {mockMapParcels.map((parcel) => (
                          <button
                            key={parcel.id}
                            onClick={() => setSelectedParcel(parcel)}
                            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(parcel.status)} hover:scale-110 transition-transform`}
                            title={parcel.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-success"></div>
                  <span className="text-sm text-foreground">Verified Properties</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-warning"></div>
                  <span className="text-sm text-foreground">Pending Verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-destructive"></div>
                  <span className="text-sm text-foreground">Disputed Properties</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded border border-parcel-border bg-transparent"></div>
                  <span className="text-sm text-foreground">Property Boundaries</span>
                </div>
              </CardContent>
            </Card>

            {/* Selected Parcel Info */}
            {selectedParcel && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Selected Property
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-foreground">{selectedParcel.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Owner</p>
                    <p className="text-foreground">{selectedParcel.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedParcel.status)}`}>
                      {selectedParcel.status.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                    <p className="text-xs text-muted-foreground">{selectedParcel.lat}, {selectedParcel.lng}</p>
                  </div>
                  <Button className="w-full mt-4" asChild>
                    <a href={`/parcel/${selectedParcel.id}`}>
                      View Full Details
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Map Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Map Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Properties</span>
                  <span className="font-semibold text-foreground">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <span className="font-semibold text-success">1,089</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-semibold text-warning">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Disputed</span>
                  <span className="font-semibold text-destructive">16</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;