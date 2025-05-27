"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PropertiesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUser(data.user);

      const { data: propsData, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", data.user.id);

      if (error) {
        setError(error.message);
      } else {
        setProperties(propsData);
      }
      setLoading(false);
    }
    fetchProperties();
  }, [router]);

  if (loading) return <p>Loading your properties...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!properties.length) return <p>No properties found.</p>;

  const handleDelete = async (propertyId) => {
    const confirmed = confirm("Are you sure you want to delete this property?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (error) {
      alert("Failed to delete property: " + error.message);
    } else {
      router.push("/dashboard/properties");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Properties</h1>

      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => router.push("/dashboard/properties/add")}
      >
        + Add New Property
      </button>

      <ul className="space-y-4">
        {properties.map(({ id, title, price, image_url }) => (
          <li
            key={id}
            className="border rounded p-4 flex items-center space-x-4 hover:shadow cursor-pointer"
            onClick={() => router.push(`/dashboard/properties/${id}`)}
          >
            {image_url && (
              <img
                src={image_url}
                alt={title}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p>Price: ${price}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
