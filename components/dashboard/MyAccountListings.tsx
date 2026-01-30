"use client";
import React, { useEffect } from "react";
import useProducts from "@/hooks/useProducts";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/helpers/common";

export default function MyAccountListings() {
  const { user } = useAuth();
  const { products, getMyProducts, isLoading, deleteProduct } = useProducts();

  useEffect(() => {
    if (user) {
      getMyProducts(user.$id);
    }
  }, [user, getMyProducts]);

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await deleteProduct(id.toString());
    }
  };

  if (!user) return <div>Please log in to view your listings.</div>;

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-semibold">My Listings</h4>
          <Link href="/add-product" className="tf-btn btn-fill">
            Sell Item
          </Link>
        </div>

        {isLoading ? (
          <div>Loading listings...</div>
        ) : products.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="fw-600">Product</th>
                  <th className="fw-600">Price</th>
                  <th className="fw-600">Status</th>
                  <th className="fw-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id} className="tf-order-item">
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <Image
                          src={item.imgSrc || "/images/products/1.jpg"}
                          alt={item.title}
                          width={60}
                          height={60}
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>
                      <span
                        className={`badge ${item.inStock ? "bg-success" : "bg-danger"}`}
                      >
                        {item.inStock ? "Active" : "Sold/Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-link text-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-5 border rounded">
            <p className="mb-3">You haven't listed any items yet.</p>
            <Link href="/add-product" className="tf-btn btn-line">
              Start Selling
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
