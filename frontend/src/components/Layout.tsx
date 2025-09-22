import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Map, FileText, Users, Search as SearchIcon } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg hero-gradient">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">National Land Registry</h1>
                <p className="text-sm text-muted-foreground">Blockchain-Secured Property Records</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                asChild
              >
                <Link to="/" className="flex items-center space-x-2">
                  <SearchIcon className="h-4 w-4" />
                  <span>Search</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/map") ? "default" : "ghost"}
                asChild
              >
                <Link to="/map" className="flex items-center space-x-2">
                  <Map className="h-4 w-4" />
                  <span>Map View</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/transfers") ? "default" : "ghost"}
                asChild
              >
                <Link to="/transfers" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Transfers</span>
                </Link>
              </Button>

              <Button
                variant={isActive("/admin") ? "default" : "ghost"}
                asChild
              >
                <Link to="/admin" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </Button>
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Register Property
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Land Registry</h3>
              <p className="text-sm text-muted-foreground">
                Secure, transparent, blockchain-powered property records for the digital age.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/search" className="hover:text-foreground transition-colors">Property Search</Link></li>
                <li><Link to="/verification" className="hover:text-foreground transition-colors">Title Verification</Link></li>
                <li><Link to="/transfers" className="hover:text-foreground transition-colors">Transfer Requests</Link></li>
                <li><Link to="/certificates" className="hover:text-foreground transition-colors">Digital Certificates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/api" className="hover:text-foreground transition-colors">API Documentation</Link></li>
                <li><Link to="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@landregistry.gov</li>
                <li>+1 (555) 123-4567</li>
                <li>Mon-Fri 9AM-5PM EST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 National Land Registry. All rights reserved. Powered by blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;