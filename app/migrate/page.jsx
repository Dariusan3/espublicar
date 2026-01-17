"use client";
import React, { useState } from 'react';
import { useDatabase } from '@/hooks';
import { products1 } from '@/data/products';
import { blogs } from '@/data/blogs';
import { collections } from '@/data/collections';
import { testimonials } from '@/data/testimonials';

// Mapping helper to match our schema keys to data keys
const mapProduct = (p) => ({
    productId: p.id,
    title: p.title,
    price: p.price,
    oldPrice: p.oldPrice || 0,
    category: p.category || 'General', // Default category if missing
    imgSrc: p.imgSrc,
    imgHover: p.imgHover || '',
    thumbImages: p.thumbImages || [],
    description: p.description || '',
    rating: p.rating || 0,
    inStock: true, // defaulting to true
    salePercentage: p.salePercentage || '',
    sold: p.sold || 0,
    available: p.available || 0
});

const mapBlog = (b) => ({
    title: b.title,
    imgSrc: b.imgSrc,
    date: new Date().toISOString(), // Use current date or parse b.date if possible
    author: b.author || 'Admin',
    description: b.desc || '', // check if 'desc' exists in blogs data
    tag: b.tag || 'News'
});

const mapCollection = (c) => ({
    title: c.title,
    imgSrc: c.imgSrc,
    // Add other fields if collections.js has them
});

const mapTestimonial = (t) => ({
    name: t.name,
    imgSrc: t.imgSrc,
    text: t.text || t.quote || "Great service!",
    rating: t.rating || 5
});

export default function MigratePage() {
    const { createDocument } = useDatabase();
    const [logs, setLogs] = useState([]);
    const [isMigrating, setIsMigrating] = useState(false);

    const log = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

    const migrateProducts = async () => {
        log('Starting Products Migration...');
        let successCount = 0;
        
        // Only doing first 50 for safety in this demo, remove slice for full
        const list = products1; 
        
        for (const p of list) {
            try {
                const data = mapProduct(p);
                // We let Appwrite generate the ID
                const res = await createDocument('products', data);
                if (res.success) {
                    log(`✅ Imported: ${p.title}`);
                    successCount++;
                } else {
                    log(`❌ Failed ${p.title}: ${res.message}`);
                }
                // Small delay to prevent rate limiting
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                log(`❌ Error ${p.title}: ${e.message}`);
            }
        }
        log(`Products Migration Complete. Success: ${successCount}/${list.length}`);
    };

    const runAll = async () => {
        if (isMigrating) return;
        setIsMigrating(true);
        await migrateProducts();
        // Add calls for blogs etc here later
        setIsMigrating(false);
    };

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <h1>Data Migration Tool</h1>
            <p className="mb-4">Use this tool to upload your static data to Appwrite.</p>
            
            <div className="card p-4 mb-4">
                <h3>Actions</h3>
                <div className="d-flex gap-3">
                    <button 
                        onClick={runAll} 
                        disabled={isMigrating}
                        className="btn btn-primary"
                    >
                        {isMigrating ? 'Migrating...' : 'Start Migration'}
                    </button>
                    <button 
                         onClick={() => setLogs([])}
                         className="btn btn-secondary"
                    >
                        Clear Logs
                    </button>
                </div>
            </div>

            <div className="card p-4 bg-light">
                <h3>Logs</h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto', fontFamily: 'monospace' }}>
                    {logs.length === 0 && <p className="text-muted">No logs yet.</p>}
                    {logs.map((l, i) => (
                        <div key={i} className="border-bottom py-1">{l}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
