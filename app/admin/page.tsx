"use client";
import React, { useEffect, useState } from "react";
import useAdmin from "@/hooks/useAdmin";
import Link from "next/link";

export default function AdminDashboard() {
  const { getAdminStats } = useAdmin();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await getAdminStats();
      if (res.success) setStats(res.data);
      setLoaded(true);
    };
    load();
  }, [getAdminStats]);

  const statCards = [
    {
      label: "Productos",
      value: stats.totalProducts,
      icon: "icon-box",
      color: "#0d6efd",
      link: "/admin/products",
    },
    {
      label: "Usuarios",
      value: stats.totalUsers,
      icon: "icon-users",
      color: "#198754",
      link: "/admin/customers",
    },
    {
      label: "Pedidos",
      value: stats.totalOrders,
      icon: "icon-shopping-bag",
      color: "#fd7e14",
      link: "/admin/orders",
    },
    {
      label: "Ingresos",
      value: `€${stats.totalRevenue.toFixed(2)}`,
      icon: "icon-dollar-sign",
      color: "#6f42c1",
      link: "/admin/orders",
    },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-4">Panel de Administración</h3>

      <div className="row mb-5 g-3">
        {statCards.map((card) => (
          <div key={card.label} className="col-md-3 col-6">
            <Link href={card.link} className="text-decoration-none">
              <div
                className="p-4 rounded-4 text-white h-100"
                style={{ background: card.color }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <i className={`${card.icon} fs-3`}></i>
                </div>
                <div className="h4 mb-1 fw-bold">
                  {loaded ? card.value : "..."}
                </div>
                <div className="small opacity-75">{card.label}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="p-4 border rounded-4">
            <h5 className="fw-bold mb-3">Acciones rápidas</h5>
            <div className="d-flex flex-column gap-2">
              <Link
                href="/admin/products"
                className="btn btn-outline-primary rounded-pill text-start"
              >
                <i className="icon-box me-2"></i>
                Gestionar productos
              </Link>
              <Link
                href="/admin/orders"
                className="btn btn-outline-primary rounded-pill text-start"
              >
                <i className="icon-shopping-bag me-2"></i>
                Ver pedidos
              </Link>
              <Link
                href="/admin/customers"
                className="btn btn-outline-primary rounded-pill text-start"
              >
                <i className="icon-users me-2"></i>
                Gestionar usuarios
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-4 border rounded-4">
            <h5 className="fw-bold mb-3">Resumen</h5>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Total anuncios activos</span>
                <strong>{stats.totalProducts}</strong>
              </li>
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Usuarios registrados</span>
                <strong>{stats.totalUsers}</strong>
              </li>
              <li className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Pedidos totales</span>
                <strong>{stats.totalOrders}</strong>
              </li>
              <li className="d-flex justify-content-between py-2">
                <span className="text-muted">Ingresos totales</span>
                <strong className="text-success">
                  €{stats.totalRevenue.toFixed(2)}
                </strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
