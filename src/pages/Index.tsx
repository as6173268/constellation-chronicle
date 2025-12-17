import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Map, BookOpen } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import { EpisodeCard } from "@/components/EpisodeCard";
import { Button } from "@/components/ui/button";
import { getLatestEpisodes } from "@/data/episodes";

const latestEpisodes = getLatestEpisodes(3);

export default function Index() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-secondary border border-border rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">52 espinas narrativas</span>
            </div>
            
            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              El <span className="text-gradient">Sistema Lagrange</span>
            </h1>
            
            {/* Manifesto */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "200ms" }}>
              Un viaje a través de 52 puntos de equilibrio entre el miedo y la conciencia. 
              Diálogos socráticos para una era que ha olvidado cómo preguntar.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Link to="/podcast">
                <Button variant="node" size="xl" className="group">
                  <Headphones className="h-5 w-5" />
                  Escuchar Podcast
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/sistema-lagrange">
                <Button variant="constellation" size="xl">
                  <Map className="h-5 w-5" />
                  Explorar el Mapa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Player */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Headphones className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-semibold">Última emisión</h2>
            </div>
            <AudioPlayer 
              title="El Eco del Silencio"
              duration="33:40"
              episodeNumber={6}
            />
          </div>
        </div>
      </section>

      {/* Latest Episodes */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-semibold">Episodios Recientes</h2>
            </div>
            <Link to="/podcast">
              <Button variant="ghost" className="group">
                Ver todos
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Una constelación de <span className="text-gradient">pensamiento</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              El Sistema Lagrange no es un podcast convencional. Es una red de 52 puntos narrativos 
              interconectados, donde cada episodio es un nodo que ilumina conexiones ocultas entre 
              el miedo, el control, la conciencia y la rebelión silenciosa del ser humano.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl font-display font-bold text-primary mb-2">52</div>
                <div className="text-sm text-muted-foreground">Espinas narrativas</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-display font-bold text-primary mb-2">5</div>
                <div className="text-sm text-muted-foreground">Ejes conceptuales</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-display font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Conexiones posibles</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-display font-bold text-primary mb-2">1</div>
                <div className="text-sm text-muted-foreground">Verdad buscada</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-display text-lg font-semibold text-gradient">
              Sistema Lagrange
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/podcast" className="hover:text-foreground transition-colors">Podcast</Link>
              <Link to="/sistema-lagrange" className="hover:text-foreground transition-colors">Mapa</Link>
              <Link to="/capitulos" className="hover:text-foreground transition-colors">Capítulos</Link>
              <Link to="/laboratorio" className="hover:text-foreground transition-colors">Laboratorio</Link>
            </nav>
            <div className="text-sm text-muted-foreground">
              © 2024 Sistema Lagrange
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
