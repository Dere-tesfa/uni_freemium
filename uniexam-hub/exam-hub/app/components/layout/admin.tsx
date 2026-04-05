import { Link, Outlet, useLocation } from "react-router";
import { 
  Layout, 
  CreditCard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  User 
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin",     icon: Layout },
  { label: "Payments",  href: "/admin/payments", icon: CreditCard, badge: "3" },
  { label: "Sheets",    href: "/admin/sheets",   icon: FileText },
  { label: "Users",     href: "/admin/users",    icon: Users },
  { label: "Settings",  href: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-muted/40 font-sans selection:bg-primary/10">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-xl italic">U</span>
              </div>
              <span className="font-black text-xl tracking-tight">Admin<span className="text-primary">Hub</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link 
                  key={item.href} 
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all group ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {Icon && (
                    <Icon className={`size-5 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                  )}
                  {item.label}
                  {item.badge && (
                    <Badge variant={isActive ? "secondary" : "default"} className="ml-auto px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary hover:bg-primary/20">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border bg-muted/20">
            <div className="flex items-center gap-3 p-2">
              <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Dereje Tesfa</p>
                <p className="text-[10px] text-muted-foreground truncate">Super Admin</p>
              </div>
            </div>
            <Link to="/admin/login">
              <Button variant="ghost" className="w-full justify-start gap-3 mt-2 text-muted-foreground hover:text-destructive group rounded-xl">
                <LogOut className="size-5 group-hover:translate-x-0.5 transition-transform" />
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : ''}`}>
        {/* Top Header */}
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 bg-card/60 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <Menu className="size-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input 
                 type="text" 
                 placeholder="Search platform..." 
                 className="pl-9 pr-4 py-2 rounded-xl border border-border bg-muted/50 text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative group rounded-full">
              <Bell className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-card" />
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />
            <Link to="/admin/settings" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20">
                DT
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 animate-in fade-in duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
