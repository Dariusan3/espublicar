"use client";
import React, { useEffect, useState } from "react";
import useAdmin from "@/hooks/useAdmin";
import { Product } from "@/types/Types";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function AdminProductsPage() {
  const { getAllProducts, deleteProduct, loading } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 20;

  const loadProducts = async () => {
    const res = await getAllProducts(
      { search: search || undefined },
      limit,
      page * limit,
    );
    if (res.success) {
      setProducts(res.data.products);
      setTotal(res.data.total);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Producto eliminado");
      loadProducts();
    } else {
      toast.error(res.message);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fw-bold mb-0">Productos ({total})</h3>
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm rounded-pill"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "200px" }}
          />
          <button type="submit" className="btn btn-sm btn-primary rounded-pill">
            Buscar
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm"></div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={String(p.id)}>
                <td>
                  <Image
                    src={p.imgSrc}
                    alt={p.title}
                    width={50}
                    height={50}
                    className="rounded object-fit-cover"
                  />
                </td>
                <td>
                  <Link
                    href={`/product/${p.id}`}
                    className="text-decoration-none fw-semibold"
                  >
                    {p.title}
                  </Link>
                </td>
                <td>€{p.price.toFixed(2)}</td>
                <td>
                  <span className="badge bg-light text-dark">
                    {p.category}
                  </span>
                </td>
                <td>
                  {p.condition && (
                    <span className="badge bg-primary-subtle text-primary rounded-pill">
                      {p.condition}
                    </span>
                  )}
                </td>
                <td className="text-muted small">{p.location || "—"}</td>
                <td className="text-muted small">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("es-ES")
                    : "—"}
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <Link
                      href={`/seller/${p.userId}`}
                      className="btn btn-sm btn-outline-secondary rounded-pill"
                      title="Ver vendedor"
                    >
                      <i className="icon-user"></i>
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={() => handleDelete(String(p.id))}
                      title="Eliminar"
                    >
                      <i className="icon-trash-2"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </button>
            </li>
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${page >= totalPages - 1 ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
