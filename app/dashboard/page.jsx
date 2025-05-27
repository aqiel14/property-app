"use client";

import { useEffect, useState } from "react";

import PropertyMap from "../components/Map";
import PropertyDetails from "../components/PropertyDetails";
import Sidebar from "./Sidebar";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [activeProperty, setActiveProperty] = useState(null);
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [center, setCenter] = useState({
    lat: -6.220714,
    lng: 106.662789, // Jakarta default
  });

  const [zoom, setZoom] = useState(20);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error("Unable to get access token");
        }

        const token = session.access_token;

        console.log("token", token);

        // Fetch properties with the token
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch properties");
        }

        const data = await res.json();
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      }
      setIsLoading(false);
    }

    fetchProperties();
  }, []);

  return (
    <div className="flex flex-grow overflow-y-auto">
      <Sidebar
        properties={properties}
        activeProperty={activeProperty}
        setActiveProperty={setActiveProperty}
        setCenter={setCenter}
        setZoom={setZoom}
      />
      <main className="flex-grow relative overflow-y-auto">
        <PropertyMap
          properties={properties}
          center={center}
          zoom={zoom}
          setActiveProperty={setActiveProperty}
        />
        <PropertyDetails
          property={activeProperty}
          onClose={() => setActiveProperty(null)}
        />
      </main>
    </div>
  );
}
