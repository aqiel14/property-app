"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";

export default function PropertyList() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        setError("User not logged in");
        setLoading(false);
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
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (properties.length === 0) return <p>No properties found.</p>;

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Properties</h2>
      <Input
        placeholder="Search moves..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          // setPage(0);
        }}
        className="w-full sm:w-128"
      />
      <ul className="space-y-4">
        {filteredProperties.map(({ id, title, price, image_url }) => (
          <li
            key={id}
            className="border rounded p-4 flex items-center space-x-4"
          >
            {image_url && (
              <img
                src={image_url}
                alt={title}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p>Price: ${price}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
