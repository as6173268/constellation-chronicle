import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Podcast from "./pages/Podcast";
import Episode from "./pages/Episode";
import LagrangeMap from "./pages/LagrangeMap";
import Chapters from "./pages/Chapters";
import ChapterDetail from "./pages/ChapterDetail";
import Laboratory from "./pages/Laboratory";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/podcast/:slug" element={<Episode />} />
            <Route path="/mapa-lagrange" element={<LagrangeMap />} />
            <Route path="/capitulos" element={<Chapters />} />
            <Route path="/capitulos/:slug" element={<ChapterDetail />} />
            <Route path="/laboratorio" element={<Laboratory />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
