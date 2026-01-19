"use client";
import React, { useState } from "react";
import { useDatabase } from "@/hooks";
import { allProducts } from "@/data/products";

// Mapping helper to match our schema keys to data keys
const REQUIRED_ATTRIBUTES = [
  "title",
  "price",
  "oldprice",
  "category",
  "imgSrc",
  "imgHover",
  "thumbImages",
  "description",
  "rating",
  "inStock",
  "isNew",
  "isTodaysDeals",
  "hotSale",
  "salePercentage",
  "filterBrands",
  "sold",
  "available",
];

// Mapping helper to match our schema keys to data keys
const mapProduct = (p: any) => ({
  title: p.title || "Untitled Product",
  price: Number(p.price) || 0,
  oldprice: Number(p.oldprice) || 0,
  category: p.category || "General",
  imgSrc: p.imgSrc || "",
  imgHover: p.imgHover || "",
  thumbImages: Array.isArray(p.thumbImages) ? p.thumbImages : [],
  description: p.description || "",
  rating: Number(p.rating) || 0,
  inStock: p.inStock ?? true,
  isNew: !!p.isNew,
  isTodaysDeals: !!p.isTodaysDeals,
  hotSale: !!p.hotSale,
  salePercentage: String(p.salePercentage || ""),
  filterBrands: Array.isArray(p.filterBrands) ? p.filterBrands : [],
  sold: Number(p.sold) || 0,
  available: Number(p.available) || 0,
});

export default function MigratePage() {
  const { createDocument } = useDatabase();
  const [logs, setLogs] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  const log = (msg: any) =>
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const migrateProducts = async () => {
    log("🚀 Starting Smart Migration...");
    log(
      `📦 Total unique products to migrate: ${new Set(allProducts.map((p) => p.id)).size}`,
    );

    let successCount = 0;
    const list = allProducts;
    const processedIds = new Set();

    for (const p of list) {
      if (processedIds.has(p.id)) continue;
      processedIds.add(p.id);

      let data = mapProduct(p);
      let attemptSucceeded = false;
      let retryCount = 0;

      while (!attemptSucceeded && retryCount < 10) {
        try {
          const res = await createDocument("products", data, String(p.id));

          if (res.success) {
            log(`✅ Imported [${p.id}]: ${p.title}`);
            successCount++;
            attemptSucceeded = true;
          } else {
            // Check for unknown attribute error
            const match = res.message.match(/Unknown attribute: "([^"]+)"/);
            if (match && match[1]) {
              const unknownAttr = match[1];
              log(
                `⚠️ Attribute "${unknownAttr}" missing in Appwrite. Removing and retrying...`,
              );

              // Strip the problematic attribute and retry
              const newData = { ...data };
              delete (newData as any)[unknownAttr];
              data = newData;
              retryCount++;
            } else {
              log(`❌ Failed [${p.id}]: ${res.message}`);
              break; // Stop retrying for other types of errors
            }
          }
        } catch (e: any) {
          log(`❌ Fatal Error [${p.id}]: ${e?.message || "Unknown error"}`);
          break;
        }
      }

      // Delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 100));
    }
    log(`🏁 Migration Complete. Success: ${successCount}/${processedIds.size}`);
  };

  const runAll = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    await migrateProducts();
    setIsMigrating(false);
  };

  return (
    <div className="container" style={{ padding: "100px 20px" }}>
      <h1>Data Migration Tool</h1>
      <p className="mb-4">
        Use this tool to upload your static data to Appwrite.
      </p>

      <div className="card p-4 mb-4">
        <h3>Actions</h3>
        <div className="d-flex gap-3">
          <button
            onClick={runAll}
            disabled={isMigrating}
            className="btn btn-primary"
          >
            {isMigrating ? "Migrating..." : "Start Migration"}
          </button>
          <button onClick={() => setLogs([])} className="btn btn-secondary">
            Clear Logs
          </button>
        </div>
      </div>

      <div className="card p-4 bg-light">
        <h3>Logs</h3>
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            fontFamily: "monospace",
          }}
        >
          {logs.length === 0 && <p className="text-muted">No logs yet.</p>}
          {logs.map((l, i) => (
            <div key={i} className="border-bottom py-1">
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
