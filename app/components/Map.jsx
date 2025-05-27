"use client";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  OverlayView,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";

const containerStyle = {
  width: "100%",
  height: "950px",
};

export default function PropertyMap({ center, zoom, setActiveProperty }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [hoveredId, setHoveredId] = useState(null);

  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase.from("properties").select("*");
      if (!error) {
        setProperties(data);
      }
      setLoading(false);
    }

    fetchProperties();
  }, []);

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.panTo(center);
      if (zoom) mapRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  if (!isLoaded || loading) return <p className="p-4">Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {properties.map((p) => {
        const lat = parseFloat(p.lat);
        const lng = parseFloat(p.lng);
        // if (!lat || !lng) return null;

        return (
          <OverlayView
            position={{ lat, lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            key={p.id}
          >
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActiveProperty(p)}
            >
              {/* Image on hover (ABOVE bubble) */}
              {hoveredId === p.id && p.image_url && (
                <div className="absolute bottom-[-10] mb-5 ml-6 left-1/2 -translate-x-1/2 z-0">
                  <img
                    src={p.image_url}
                    alt="Property"
                    className="w-40 h-24 object-cover rounded shadow-lg"
                  />
                </div>
              )}
              {/* Price bubble */}
              <Badge className="hover:bg-white rounded-2xl font-semibold hover:text-black z-10 relative">
                $ {p.price}
              </Badge>
            </div>
          </OverlayView>
        );
      })}
    </GoogleMap>
  );
}
