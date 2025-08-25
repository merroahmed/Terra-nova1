import { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  MapPin, 
  Plus,
  Telescope,
  Stars
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import sampleGalaxy from '@/assets/sample-galaxy.jpg';

interface Annotation {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
  timestamp: number;
}

const SpaceExplorer = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({ title: '', description: '' });

  // Load annotations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('space-annotations');
    if (saved) {
      setAnnotations(JSON.parse(saved));
    }
  }, []);

  // Save annotations to localStorage
  useEffect(() => {
    localStorage.setItem('space-annotations', JSON.stringify(annotations));
  }, [annotations]);

  // Initialize OpenSeadragon viewer
  useEffect(() => {
    if (!viewerRef.current) return;

    const osdViewer = OpenSeadragon({
      element: viewerRef.current,
      tileSources: {
        type: 'image',
        url: sampleGalaxy,
      },
      prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
      showNavigationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      gestureSettingsMouse: {
        scrollToZoom: true,
        clickToZoom: false,
        dblClickToZoom: true,
        pinchToZoom: true,
        flickEnabled: true,
      },
      animationTime: 0.5,
      springStiffness: 10.0,
      maxZoomPixelRatio: 5,
      minZoomLevel: 0.5,
      visibilityRatio: 0.1,
    });

    // Add click handler for annotations
    osdViewer.addHandler('canvas-click', (event) => {
      if (isAddingAnnotation) {
        const viewportPoint = osdViewer.viewport.pointFromPixel(event.position);
        const webPoint = osdViewer.viewport.viewportToViewerElementCoordinates(viewportPoint);
        
        // Create new annotation at click position
        const annotation: Annotation = {
          id: Date.now().toString(),
          x: webPoint.x,
          y: webPoint.y,
          title: newAnnotation.title || 'Untitled Observation',
          description: newAnnotation.description || 'No description provided',
          timestamp: Date.now(),
        };

        setAnnotations(prev => [...prev, annotation]);
        setIsAddingAnnotation(false);
        setNewAnnotation({ title: '', description: '' });
        toast.success('Annotation added successfully!');
      }
    });

    setViewer(osdViewer);

    return () => {
      osdViewer.destroy();
    };
  }, []);

  // Render annotation markers
  useEffect(() => {
    if (!viewer) return;

    // Clear existing overlays
    viewer.clearOverlays();

    // Add annotation markers
    annotations.forEach((annotation) => {
      const element = document.createElement('div');
      element.className = 'annotation-marker w-4 h-4 rounded-full cursor-pointer';
      element.title = annotation.title;
      
      // Add click handler for annotation details
      element.onclick = () => {
        toast(`📍 ${annotation.title}`, {
          description: annotation.description,
          duration: 4000,
        });
      };

      const point = new OpenSeadragon.Point(
        annotation.x / viewer.container.clientWidth,
        annotation.y / viewer.container.clientHeight
      );

      viewer.addOverlay({
        element: element,
        location: viewer.viewport.viewerElementToViewportCoordinates(
          new OpenSeadragon.Point(annotation.x, annotation.y)
        ),
      });
    });
  }, [annotations, viewer]);

  const handleZoomIn = () => {
    viewer?.viewport.zoomBy(2);
  };

  const handleZoomOut = () => {
    viewer?.viewport.zoomBy(0.5);
  };

  const handleHome = () => {
    viewer?.viewport.goHome();
  };

  const handleSearch = (query: string) => {
    const found = annotations.find(ann => 
      ann.title.toLowerCase().includes(query.toLowerCase()) ||
      ann.description.toLowerCase().includes(query.toLowerCase())
    );
    
    if (found && viewer) {
      const point = viewer.viewport.viewerElementToViewportCoordinates(
        new OpenSeadragon.Point(found.x, found.y)
      );
      viewer.viewport.panTo(point);
      viewer.viewport.zoomTo(3);
      toast.success(`Found: ${found.title}`);
    } else if (query) {
      toast.error('No matching annotations found');
    }
  };

  const filteredAnnotations = annotations.filter(ann =>
    ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ann.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gradient-starfield relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 space-panel border-b border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Telescope className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-aurora bg-clip-text text-transparent">
                Deep Space Explorer
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search annotations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-input/80 backdrop-blur-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => handleSearch(searchQuery)}
                className="btn-cosmic"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-nebula">
              {annotations.length} Observations
            </Badge>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="sm"
                  className={cn(
                    "btn-cosmic",
                    isAddingAnnotation && "shadow-glow-accent"
                  )}
                  onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Observation
                </Button>
              </PopoverTrigger>
              <PopoverContent className="space-panel w-80">
                <div className="space-y-4">
                  <h4 className="font-semibold">New Observation</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Title (e.g., Spiral Arm)"
                      value={newAnnotation.title}
                      onChange={(e) => setNewAnnotation(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-input/80"
                    />
                    <Input
                      placeholder="Description"
                      value={newAnnotation.description}
                      onChange={(e) => setNewAnnotation(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-input/80"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isAddingAnnotation ? 'Click anywhere on the image to place your observation' : 'Fill in details and click "Add Observation" to start placing'}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Main viewer */}
      <div className="relative h-full pt-20">
        <div ref={viewerRef} className="w-full h-full" />
        
        {/* Controls */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomIn}
            className="space-panel w-10 h-10 p-0"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomOut}
            className="space-panel w-10 h-10 p-0"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleHome}
            className="space-panel w-10 h-10 p-0"
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>

        {/* Annotations sidebar */}
        {filteredAnnotations.length > 0 && (
          <div className="absolute top-6 right-6 w-80">
            <Card className="space-panel">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Stars className="w-4 h-4" />
                  Observations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                {filteredAnnotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="p-3 rounded-md bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors"
                    onClick={() => handleSearch(annotation.title)}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">{annotation.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {annotation.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions overlay */}
        {isAddingAnnotation && (
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center z-40">
            <Card className="space-panel animate-float">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-aurora flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Place Your Observation</h3>
                <p className="text-muted-foreground">
                  Click anywhere on the space image to mark a point of interest
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingAnnotation(false)}
                  className="mt-4"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceExplorer;