// components/PropertyDetails.jsx
"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Router } from "next/router";

export default function PropertyDetails({ property, onClose }) {
  if (!property) return null;

  const handleDelete = async (propertyId) => {
    const confirmed = confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    try {
      // Get token from Supabase client (or your auth provider)
      const token = await supabase.auth
        .getSession()
        .then((res) => res.data.session?.access_token);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties/${propertyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert(
          "Failed to delete property: " + (errorData.error || res.statusText)
        );
        return;
      }

      alert("Property deleted successfully");
      onClose(); // close details panel or refresh parent list as needed
    } catch (err) {
      alert("Failed to delete property: " + err.message);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 bg-gray-800 shadow-lg rounded-lg w-80 p-4 text-white ">
      <div className="flex justify-between items-center mb-2 ">
        <h2 className="text-lg font-bold">{property.title}</h2>
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={onClose}
          className="text-gray-500 hover:text-black font-semibold"
        >
          <XIcon />
        </Button>
      </div>
      {property.image_url && (
        <div className="mb-2">
          <Image
            src={property.image_url}
            alt="Property"
            width={300}
            height={200}
            className="rounded"
          />
        </div>
      )}
      <p className="text-sm mb-1">Price: ${property.price}</p>
      <p className="text-sm">
        {property.lat}, {property.lng}
      </p>
      <div className="flex justify-between mt-4">
        <Link href={`/dashboard/properties/${property.id}`}>
          <Button className="cursor-pointer" variant={"secondary"}>
            Edit Property
          </Button>
        </Link>
        <Button
          className={"cursor-pointer"}
          variant={"destructive"}
          onClick={() => handleDelete(property.id)}
        >
          Delete Property
        </Button>
      </div>
    </div>
  );
}
