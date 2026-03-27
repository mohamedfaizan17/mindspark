import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, BookOpen, Target, Menu, User2, LogOut, Briefcase } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Brain },
    { id: 'careers', label: 'Career Paths', icon: Target },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'learning', label: 'Learning Paths', icon: BookOpen },
    { id: 'market', label: 'Market Intelligence', icon: TrendingUp },
  ];

  return (
    <nav className="bg-white shadow-soft border-b sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CareerAI</h1>
              <p className="text-xs text-muted-foreground">Powered by Gemini</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={(currentPage === item.id || (item.id === 'dashboard' && currentPage === 'assessment')) ? "default" : "ghost"}
                  onClick={() => onNavigate(item.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            
            {/* User Profile Section */}
            <div className="flex items-center gap-4 ml-6 pl-6 border-l">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User2 className="h-4 w-4" />
                <span className="hidden lg:inline">{user?.email}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={(currentPage === item.id || (item.id === 'dashboard' && currentPage === 'assessment')) ? "default" : "ghost"}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
            
            {/* Mobile User Section */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User2 className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSignOut}
                className="w-full justify-start text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};