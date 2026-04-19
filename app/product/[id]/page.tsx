"use client";
import RecentProducts from "@/components/common/RecentProducts";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Link from "next/link";
import Description2 from "@/components/product-detail/Description2";
import Details1 from "@/components/product-detail/Details1";
import Relatedproducts from "@/components/product-detail/Relatedproducts";
import SimilerProducts from "@/components/product-detail/SimilerProducts";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useProducts from "@/hooks/useProducts";
import { Product } from "@/types/Types";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : "";
  const { getProductById } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await getProductById(id);
      if (res.success) setProduct(res.data);
      setLoading(false);
    };
    load();
  }, [id, getProductById]);

  return (
    <>
      <Header4 />
      <div className="tf-sp-1">
        <div className="container">
          <ul className="breakcrumbs">
            <li>
              <Link href="/" className="body-small link">
                Inicio
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <Link href="/shop-default" className="body-small link">
                Tienda
              </Link>
            </li>
            <li className="d-flex align-items-center">
              <i className="icon icon-arrow-right" />
            </li>
            <li>
              <span className="body-small">
                {product?.title || "Producto"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {!loading && !product && (
        <div className="text-center py-5">
          <h5>Producto no encontrado</h5>
          <Link href="/shop-default" className="btn btn-primary rounded-pill mt-3">
            Volver a la tienda
          </Link>
        </div>
      )}

      {product && (
        <>
          <Details1 product={product} />
          <Description2 productId={id} />
        </>
      )}

      <SimilerProducts />
      <Relatedproducts />
      <RecentProducts />
      <Footer1 />
    </>
  );
}
