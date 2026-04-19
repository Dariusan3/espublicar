"use client";
import React, { useEffect, useState } from "react";
import useAdmin from "@/hooks/useAdmin";
import { User } from "@/types/Types";
import Link from "next/link";

export default function AdminCustomersPage() {
  const { getAllUsers, loading } = useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 25;

  useEffect(() => {
    const load = async () => {
      const res = await getAllUsers(limit, page * limit);
      if (res.success) {
        setUsers(res.data.users);
        setTotal(res.data.total);
      }
    };
    load();
  }, [page, getAllUsers]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h3 className="fw-bold mb-4">Usuarios ({total})</h3>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary spinner-border-sm"></div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Ciudad</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="avatar rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "36px",
                        height: "36px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="fw-semibold">
                      {user.name || "Sin nombre"}
                    </span>
                  </div>
                </td>
                <td className="text-muted small">{user.email}</td>
                <td className="text-muted small">
                  {user.city || "—"}
                  {user.country ? `, ${user.country}` : ""}
                </td>
                <td className="text-muted small">
                  {new Date(user.createdAt).toLocaleDateString("es-ES")}
                </td>
                <td>
                  <Link
                    href={`/seller/${user.id}`}
                    className="btn btn-sm btn-outline-primary rounded-pill"
                  >
                    <i className="icon-eye me-1"></i>
                    Ver perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
