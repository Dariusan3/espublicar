"use client";
import React from "react";

export function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel skel-img" />
      <div className="skel-body">
        <div className="skel skel-line skel-line-title" />
        <div className="skel skel-line skel-line-price" />
        <div className="skel skel-line skel-line-meta" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="tf-grid-product">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

interface EmptyStateProps {
  illustration?: "search" | "heart" | "package" | "chat" | "tag" | "bell";
  title: string;
  description?: string;
  /** Either navigate somewhere or run an action in place. */
  action?: { label: string; href?: string; onClick?: () => void };
}

function getIllustration(kind: EmptyStateProps["illustration"]) {
  const common = {
    width: 120,
    height: 120,
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "heart":
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="50" fill="var(--brand-50)" stroke="none" />
          <path
            d="M60 78 L42 60 a10 10 0 0 1 14-14 l4 4 4-4 a10 10 0 0 1 14 14 z"
            stroke="var(--brand)"
          />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="50" fill="var(--brand-50)" stroke="none" />
          <path
            d="M35 50 v30 a4 4 0 0 0 2 3.5 L58 95 a4 4 0 0 0 4 0 L83 83.5 a4 4 0 0 0 2 -3.5 V50 L60 35 Z"
            stroke="var(--brand)"
          />
          <path d="M35 50 L60 65 L85 50" stroke="var(--brand)" />
          <path d="M60 65 V95" stroke="var(--brand)" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="50" fill="var(--brand-50)" stroke="none" />
          <path
            d="M40 55 a8 8 0 0 1 8-8 h24 a8 8 0 0 1 8 8 v16 a8 8 0 0 1 -8 8 H58 l-10 8 V79 a8 8 0 0 1 -8 -8 z"
            stroke="var(--brand)"
          />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="50" fill="var(--brand-50)" stroke="none" />
          <path
            d="M70 35 H50 L35 50 v20 L55 90 l30 -30 z"
            stroke="var(--brand)"
          />
          <circle cx="55" cy="55" r="4" stroke="var(--brand)" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="50" fill="var(--brand-50)" stroke="none" />
          <path
            d="M45 70 V60 a15 15 0 0 1 30 0 v10 l5 5 H40 z"
            stroke="var(--brand)"
          />
          <path d="M55 80 a5 5 0 0 0 10 0" stroke="var(--brand)" />
        </svg>
      );
    case "search":
    default:
      return (
        <svg {...common}>
          <circle cx="60" cy="60" r="50" fill="var(--brand-50)" stroke="none" />
          <circle cx="54" cy="54" r="14" stroke="var(--brand)" />
          <path d="M65 65 L78 78" stroke="var(--brand)" />
        </svg>
      );
  }
}

export function EmptyState({
  illustration = "search",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-illustration">
        {getIllustration(illustration)}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action &&
        (action.href ? (
          <a href={action.href} className="btn-brand">
            {action.label}
          </a>
        ) : (
          <button type="button" className="btn-brand" onClick={action.onClick}>
            {action.label}
          </button>
        ))}
    </div>
  );
}
