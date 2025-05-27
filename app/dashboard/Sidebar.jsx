"use client";
import PropertyList from "../components/PropertyList";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Sidebar({
  properties,
  activeProperty,
  setActiveProperty,
  setCenter,
  setZoom,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const onCardClick = (property) => {
    setCenter({ lat: property.lat, lng: property.lng });
    setZoom(18);
    setActiveProperty(property);
  };

  const filteredProperties = properties?.filter((p) => {
    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <aside className="w-64 bg-white border-r p-4 w-64 flex flex-col overflow-hidden ">
      <h2 className="text-lg font-semibold mb-4">My Properties</h2>
      <Input
        placeholder="Search properties..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />

      {/* Scrollable list area */}
      <div className="mt-4 space-y-2 pr-2 overflow-y-auto flex-grow">
        {filteredProperties.map((p) => (
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
              <Image src={p.image_url} width={500} height={500} alt={p.id} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fixed footer button */}
      <div className="mt-4 flex justify-end w-full">
        <Link href="/dashboard/properties/add">
          <Button variant={"secondary"} className={"cursor-pointer"}>
            Add Property
          </Button>
        </Link>
      </div>
    </aside>
  );
}
