import { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Header } from "./Header";
import { api } from "../services/api";
import { Issue } from "../lib/types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";

interface MapPageProps {
    userRole: "citizen" | "staff";
    onLogout: () => void;
    onNavigate: (page: string, issueId?: string) => void;
}

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
    width: '100%',
    height: 'calc(100vh - 64px)' // Full height minus header
};

// Red Deer, Alberta coordinates
const center = {
    lat: 52.2681,
    lng: -113.8112
};

export function MapPage({ userRole, onLogout, onNavigate }: MapPageProps) {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries
    });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                // Fetch latest 100 issues
                const response = await api.getIssues(0, 100);
                setIssues(response.content);
            } catch (error) {
                console.error("Failed to fetch issues for map:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-blue-100 text-blue-800";
            case "in-progress":
                return "bg-amber-100 text-amber-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (!isLoaded) {
        return <div className="h-screen flex items-center justify-center">Loading Map...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                userRole={userRole}
                onLogout={onLogout}
                onNavigate={onNavigate}
                currentPage="map"
            />

            <div className="flex-1 relative">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={13}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {issues.map((issue) => {
                        // Parse coordinates from address string "lat, lng"
                        const [latStr, lngStr] = issue.address.split(',').map(s => s.trim());
                        const lat = parseFloat(latStr);
                        const lng = parseFloat(lngStr);

                        if (isNaN(lat) || isNaN(lng)) return null;

                        return (
                            <Marker
                                key={issue.id}
                                position={{ lat, lng }}
                                onClick={() => setSelectedIssue(issue)}
                            />
                        );
                    })}

                    {selectedIssue && (
                        <InfoWindow
                            position={{
                                lat: parseFloat(selectedIssue.address.split(',')[0]),
                                lng: parseFloat(selectedIssue.address.split(',')[1])
                            }}
                            onCloseClick={() => setSelectedIssue(null)}
                        >
                            <div className="p-3 max-w-xs bg-slate-950 text-white rounded-md">
                                <h3 className="font-semibold text-lg mb-1 text-white">{selectedIssue.title}</h3>
                                <div className="flex gap-2 mb-2">
                                    <Badge className={getStatusColor(selectedIssue.status)}>
                                        {selectedIssue.status.toUpperCase()}
                                    </Badge>
                                    <Badge variant="outline" className="text-white border-white">{selectedIssue.category}</Badge>
                                </div>
                                <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                                    {selectedIssue.description}
                                </p>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => onNavigate("issue-detail", selectedIssue.id.toString())}
                                >
                                    View Details
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>

                {/* Legend/Overlay */}
                <div className="absolute top-4 left-4 bg-slate-950 p-4 rounded-lg shadow-lg z-10 max-w-xs border border-slate-800">
                    <h2 className="font-bold text-lg mb-1 text-white">Issue Map</h2>
                    <p className="text-sm text-gray-300">
                        Showing {issues.length} recent issues in Red Deer
                    </p>
                </div>
            </div>
        </div>
    );
}
