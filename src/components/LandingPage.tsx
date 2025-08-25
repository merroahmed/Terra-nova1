import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  MapPin, 
  Plus,
  Telescope,
  Stars,
  Zap, 
  Satellite, 
  Sparkles,
  ExternalLink,
  Github,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NASAImage {
  title: string;
  url: string;
  hdurl?: string;
  explanation: string;
  date: string;
  media_type: string;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [nasaImages, setNasaImages] = useState<NASAImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch NASA APOD images
  useEffect(() => {
    const fetchNASAImages = async () => {
      try {
        // Generate random dates for the last year to get variety
        const images: NASAImage[] = [];
        const today = new Date();
        
        for (let i = 0; i < 12; i++) {
          const randomDate = new Date(today.getFullYear() - 1, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
          const dateString = randomDate.toISOString().split('T')[0];
          
          try {
            const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${dateString}`);
            const data = await response.json();
            
            if (data.media_type === 'image') {
              images.push(data);
            }
          } catch (error) {
            console.error('Failed to fetch image for date:', dateString);
          }
        }
        
        setNasaImages(images);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching NASA images:', error);
        setLoading(false);
        // Fallback to placeholder images if API fails
        toast.error('Failed to load NASA images. Using sample data.');
      }
    };

    fetchNASAImages();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-starfield">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image/Video */}
        <div className="absolute inset-0">
          <img 
            src="/space-hero-fallback.jpg" 
            alt="Deep Space Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />
        </div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-aurora bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore The Universe
            <br />
            in Gigapixel Detail
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Zoom into NASA's ultra-high-resolution space images and discover new patterns across the cosmos
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button
              size="lg"
              className="btn-cosmic text-lg px-8 py-4 h-auto"
              onClick={() => navigate('/explore')}
            >
              <Telescope className="mr-2 w-5 h-5" />
              Start Exploring
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 h-auto space-panel border-primary/50 hover:bg-primary/10"
              onClick={() => scrollToSection('gallery')}
            >
              <Sparkles className="mr-2 w-5 h-5" />
              View Gallery
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Image Gallery Section */}
      <section id="gallery" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-cosmic bg-clip-text text-transparent"
              variants={itemVariants}
            >
              NASA's Cosmic Collection
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Explore stunning high-resolution images from NASA's archives, each containing billions of pixels of cosmic detail
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-panel aspect-square animate-pulse bg-muted/20 rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {nasaImages.map((image, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    navigate('/explore');
                    toast.success(`Loading: ${image.title}`);
                  }}
                >
                  <Card className="space-panel overflow-hidden h-full">
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-primary/80 text-xs">
                          {new Date(image.date).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-2">{image.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">{image.explanation}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-nebula">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-4"
              variants={itemVariants}
            >
              Discover the Universe
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              variants={itemVariants}
            >
              Advanced tools for exploring space imagery like never before
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="space-panel h-full text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-aurora flex items-center justify-center">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Zoom into Trillions of Pixels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore images with incredible detail using our smooth gigapixel zoom technology. Discover features invisible to the naked eye.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="space-panel h-full text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-aurora flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Label and Annotate Discoveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mark points of interest, add descriptions, and create your own catalog of cosmic discoveries and observations.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="space-panel h-full text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-aurora flex items-center justify-center">
                  <Satellite className="w-8 h-8 text-white" />
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Search and Explore Landmarks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find specific features, navigate between annotations, and explore known cosmic landmarks with our intelligent search system.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-cosmic bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Powered by NASA's Open Data
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed mb-8"
              variants={itemVariants}
            >
              Our platform leverages NASA's incredible archive of space imagery, made freely available through their open data initiative. 
              Every image you explore contains real scientific data captured by satellites, telescopes, and space missions, 
              offering unprecedented views of our universe in stunning ultra-high resolution.
            </motion.p>

            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed mb-12"
              variants={itemVariants}
            >
              From the Hubble Space Telescope's deep field observations to satellite captures of Earth from orbit, 
              these images represent humanity's quest to understand the cosmos. Each gigapixel contains stories waiting to be discovered.
            </motion.p>

            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={itemVariants}
            >
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Real NASA Data
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Gigapixel Resolution
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Telescope className="w-4 h-4 mr-2" />
                Scientific Quality
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-nebula border-t border-border/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Telescope className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl bg-gradient-aurora bg-clip-text text-transparent">
                  Cosmos Explorer
                </span>
              </div>
              <p className="text-muted-foreground">
                Explore the universe in unprecedented detail with NASA's gigapixel space imagery.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/explore')} 
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Start Exploring
                </button>
                <button 
                  onClick={() => scrollToSection('gallery')} 
                  className="block text-muted-foreground hover:text-primary transition-colors"
                >
                  Image Gallery
                </button>
                <a 
                  href="https://api.nasa.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  NASA API
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <a 
                  href="#" 
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-muted-foreground">
              © 2025 Cosmos Explorer. Built with NASA's open data initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;