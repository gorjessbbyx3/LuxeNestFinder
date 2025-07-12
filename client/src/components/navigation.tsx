import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import { Menu, Sun, Moon, Search, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Properties", href: "/properties" },
    { name: "Virtual Tours", href: "/virtual-tours" },
    { name: "Neighborhoods", href: "/neighborhoods" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="font-serif font-bold text-2xl">Prestige Hawaii</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span 
                  className={`font-medium transition-colors cursor-pointer ${
                    isActive(item.href) 
                      ? "text-primary border-b-2 border-primary pb-1" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button size="icon" variant="ghost" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Theme Toggle */}
            <Button size="icon" variant="ghost" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Calendar Button */}
            <Button className="hidden md:flex" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Book Tour
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <span 
                        className={`text-lg font-medium transition-colors cursor-pointer block ${
                          isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                  
                  <div className="border-t pt-6">
                    <Button className="w-full mb-4">
                      <Search className="h-4 w-4 mr-2" />
                      Search Properties
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Tour
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
