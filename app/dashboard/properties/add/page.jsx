"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddPropertyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    title: "",
    price: "",
    lat: "",
    lng: "",
  });
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
      else router.push("/auth/login"); // redirect if not logged in
    }
    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     if (!user) {
  //       setMessage("You must be logged in to add a property.");
  //       return;
  //     }

  //     let imageUrl = "";

  //     if (imageFile) {
  //       const fileExt = imageFile.name.split(".").pop();
  //       const fileName = `${Date.now()}.${fileExt}`;
  //       const filePath = `public/${fileName}`;

  //       const { error: uploadError } = await supabase.storage
  //         .from("property-images")
  //         .upload(filePath, imageFile);

  //       if (uploadError) {
  //         setMessage("Failed to upload image: " + uploadError.message);
  //         return;
  //       }

  //       const { data: publicUrlData } = supabase.storage
  //         .from("property-images")
  //         .getPublicUrl(filePath);

  //       imageUrl = publicUrlData?.publicUrl || "";
  //     }

  //     const newProperty = {
  //       user_id: user.id,
  //       title: form.title,
  //       price: form.price ? parseInt(form.price) : null,
  //       image_url: imageUrl,
  //       lat: form.lat ? parseFloat(form.lat) : null,
  //       lng: form.lng ? parseFloat(form.lng) : null,
  //     };

  //     const { error } = await supabase.from("properties").insert([newProperty]);

  //     if (error) {
  //       setMessage("Error inserting property: " + error.message);
  //     } else {
  //       setMessage("Property added successfully!");
  //       setForm({ title: "", price: "", lat: "", lng: "" });
  //       router.push("/dashboard"); // Redirect to properties list
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("You must be logged in to add a property.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("lat", form.lat);
    formData.append("lng", form.lng);
    if (imageFile) formData.append("image", imageFile);

    // Send JWT token in Authorization header
    const token = await supabase.auth
      .getSession()
      .then((res) => res.data.session?.access_token);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/properties`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();

    console.log("data", data);

    if (!res.ok) {
      setMessage(data.error || "Failed to add property");
    } else {
      setMessage("Property added successfully!");
      setForm({ title: "", price: "", lat: "", lng: "" });
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          type="text"
          placeholder="Title"
          required
          className="w-full border rounded p-2"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          placeholder="Price"
          className="w-full border rounded p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full border rounded p-2"
        />

        <input
          name="lat"
          value={form.lat}
          onChange={handleChange}
          type="number"
          step="any"
          placeholder="Latitude"
          className="w-full border rounded p-2"
        />
        <input
          name="lng"
          value={form.lng}
          onChange={handleChange}
          type="number"
          step="any"
          placeholder="Longitude"
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Add Property
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
