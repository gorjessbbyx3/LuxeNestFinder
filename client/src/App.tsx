import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import Home from "@/pages/home";
import Properties from "@/pages/properties";
import PropertyDetail from "@/pages/property-detail";
import VirtualTours from "@/pages/virtual-tours";
import Neighborhoods from "@/pages/neighborhoods";
import SellYourHome from "@/pages/sell-your-home";
import AgentPortal from "@/pages/agent-portal";
import Calendar from "@/pages/calendar";
import Inbox from "@/pages/inbox";
import MLSListings from "@/pages/mls-listings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/virtual-tours" component={VirtualTours} />
      <Route path="/neighborhoods" component={Neighborhoods} />
      <Route path="/sell-your-home" component={SellYourHome} />
      <Route path="/agent-portal" component={AgentPortal} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/mls-listings" component={MLSListings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
