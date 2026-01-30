"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useProducts from "@/hooks/useProducts";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    imgSrc: "", // For now simple string input or we can add file upload later
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to sell items");
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        imgSrc: formData.imgSrc || "/images/products/1.jpg", // Default image
        userId: user.$id,
        rating: 0,
        sold: 0,
        available: 1,
        inStock: true,
      };

      const result = await addProduct(productData);
      if (result.success) {
        toast.success("Product listed successfully!");
        router.push("/my-account-listings");
      } else {
        toast.error(result.message || "Failed to list product");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-account-content">
      <h3 className="mb-4">Sell an Item</h3>
      <form onSubmit={handleSubmit} className="form-add-product">
        <div className="mb-3">
          <label className="form-label">Product Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g., iPhone 13 Pro Max"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Sports">Sports</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="imgSrc"
            value={formData.imgSrc}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          <div className="form-text">
            For now, please provide an external image URL. Upload feature coming
            soon.
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="tf-btn btn-fill" disabled={isLoading}>
          {isLoading ? "Listing..." : "List Item Now"}
        </button>
      </form>
    </div>
  );
}
