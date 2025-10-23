import { useState } from "react";
import { Header } from "./Header";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MapPin, Upload, Camera, Navigation } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ReportIssuePageProps {
  userRole: "citizen" | "staff";
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function ReportIssuePage({ userRole, onLogout, onNavigate }: ReportIssuePageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [severity, setSeverity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [mapPosition, setMapPosition] = useState({ lat: 40.7128, lng: -74.0060 });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);
      toast.success(`${newPhotos.length} photo(s) added`);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          setLatitude(lat);
          setLongitude(lng);
          setMapPosition({ lat: parseFloat(lat), lng: parseFloat(lng) });
          toast.success("Current location set");
        },
        (error) => {
          toast.error("Could not get your location. Please enter manually.");
          console.error(error);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert click position to approximate lat/lng
    // This is a simplified simulation
    const lng = -74.0060 + (x / rect.width - 0.5) * 0.1;
    const lat = 40.7128 + (0.5 - y / rect.height) * 0.1;
    
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setMapPosition({ lat, lng });
    toast.success("Location set on map");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !category || !severity || !latitude || !longitude) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Mock submission
    toast.success("Issue reported successfully!");
    
    // Reset form
    setTitle("");
    setDescription("");
    setCategory("");
    setSeverity("");
    setLatitude("");
    setLongitude("");
    setPhotos([]);
    
    // Navigate back to issues page
    setTimeout(() => {
      onNavigate("issues");
    }, 1500);
  };

  const handleCancel = () => {
    onNavigate("issues");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} onLogout={onLogout} onNavigate={onNavigate} currentPage="report" />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Report an Issue</CardTitle>
            <CardDescription>
              Help improve your community by reporting issues that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              {/* Category, Severity, and Photos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="roads">Roads</SelectItem>
                      <SelectItem value="lighting">Lighting</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="parks">Parks</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="severity">
                    Severity <span className="text-destructive">*</span>
                  </Label>
                  <Select value={severity} onValueChange={setSeverity} required>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photos">Attach Photos</Label>
                  <label htmlFor="photos">
                    <div className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80 transition-colors">
                      <Camera className="h-4 w-4" />
                      <span>Choose Files</span>
                    </div>
                    <input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Photo previews */}
              {photos.length > 0 && (
                <div className="space-y-2">
                  <Label>Attached Photos ({photos.length})</Label>
                  <div className="flex flex-wrap gap-2">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative group bg-muted rounded-md p-2 flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span className="max-w-[150px] truncate">
                          {photo.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="ml-2 text-destructive hover:text-destructive/80"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Section */}
              <div className="space-y-4">
                <Label>
                  Location <span className="text-destructive">*</span>
                </Label>
                
                {/* Interactive Map */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Click on the map to set location</span>
                  </div>
                  <div
                    onClick={handleMapClick}
                    className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-border overflow-hidden cursor-crosshair group"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  >
                    {/* Map overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-green-200/30" />
                    
                    {/* Pin marker */}
                    {latitude && longitude && (
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-full"
                        style={{
                          left: `${((parseFloat(longitude) - (-74.0060 - 0.05)) / 0.1) * 100}%`,
                          top: `${(1 - (parseFloat(latitude) - (40.7128 - 0.05)) / 0.1) * 100}%`
                        }}
                      >
                        <MapPin className="h-8 w-8 text-destructive fill-destructive" />
                      </div>
                    )}
                    
                    {/* Hover instruction */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
                      <div className="bg-white/90 px-4 py-2 rounded-md shadow-lg">
                        <p className="text-muted-foreground">Click to set location</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coordinates Input */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="40.7128"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="-74.0060"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>&nbsp;</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUseCurrentLocation}
                      className="w-full"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Use Current
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Submit Issue
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">
            © 2025 City Issue Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
