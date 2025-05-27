"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PropertyList from "../components/PropertyList";
import PropertyMap from "../components/Map";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import PropertyDetails from "../components/PropertyDetails";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [center, setCenter] = useState({
    lat: -6.220714,
    lng: 106.662789, // Jakarta default
  });

  const [zoom, setZoom] = useState(20);
  const [activeProperty, setActiveProperty] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        setError("User not logged in");
        setIsLoading(false);
        return;
      }
      setUser(currentUser);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", currentUser.id);

      if (error) {
        setError(error.message);
      } else {
        setProperties(data);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const onCardClick = (property) => {
    setCenter({ lat: property.lat, lng: property.lng });
    setZoom(18);
    setActiveProperty(property);
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex">
        {/* Sidebar goes here */}
        <aside className="w-64 bg-white border-r p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">My Properties</h2>
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // setPage(0);
            }}
            className="w-full"
          />
          <div className="mt-4 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
            {!isLoading && (
              <>
                {filteredProperties.map((p, i) => (
                  <Card
                    key={p.id}
                    className={`cursor-pointer transition-colors ${
                      activeProperty?.id === p.id
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      onCardClick(p);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className={"text-center"}>{p.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                      <p>${p.price}</p>
                      <Image
                        src={p.image_url}
                        width={500}
                        height={500}
                        alt={p.id}
                      />
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
          <div className="mt-4 flex justify-end mt-auto w-full">
            <Link href="/dashboard/properties/add">
              <Button variant={"secondary"} className={"cursor-pointer"}>
                Add Property
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main content (e.g. map) */}
        <div className="flex-grow relative">
          <PropertyMap
            center={center}
            zoom={zoom}
            setActiveProperty={setActiveProperty}
          />
          <PropertyDetails
            property={activeProperty}
            onClose={() => setActiveProperty(null)}
          />
        </div>
      </main>
    </div>
  );
}
