import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Search from "./pages/Search";
import ParcelDetail from "./pages/ParcelDetail";
import TransferRequest from "./pages/TransferRequest";
import MapView from "./pages/MapView";
import Admin from "./pages/Admin";
import Transfers from "./pages/Transfers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/parcel/:id" element={<ParcelDetail />} />
            <Route path="/transfer/:id" element={<TransferRequest />} />
            <Route path="/transfers" element={<Transfers />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
