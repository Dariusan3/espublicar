"use client";
import React from "react";
import Context from "@/context/Context";
import { AuthProvider } from "@/context/AuthContext";
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Cart from "@/components/modals/Cart";
import Login from "@/components/modals/Login";
import Register from "@/components/modals/Register";
import ScrollTop from "@/components/common/ScrollTop";
import Quickview from "@/components/modals/Quickview";
import MobileMenu from "@/components/modals/MobileMenu";
import Toolbar from "@/components/modals/Toolbar";
import Search from "@/components/modals/Search";
import AddParallax from "@/utlis/AddParallax";
import MobileTabBar from "@/components/common/MobileTabBar";
import ReduxProvider from "@/store/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Import the script only on the client side
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Module is imported, you can access any exported functionality if
      });
    }
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const delta = 5;
    let navbarHeight = 0;
    let didScroll = false;
    const header = document.querySelector("header");

    const handleScroll = () => {
      didScroll = true;
    };

    const checkScroll = () => {
      if (didScroll && header) {
        const st = window.scrollY || document.documentElement.scrollTop;
        navbarHeight = header.offsetHeight;

        if (st > navbarHeight) {
          if (st > lastScrollTop + delta) {
            // Scroll down
            header.style.top = `-${navbarHeight}px`;
          } else if (st < lastScrollTop - delta) {
            // Scroll up
            header.style.top = "0";
            header.classList.add("header-bg");
          }
        } else {
          // At top of page
          header.style.top = "";
          header.classList.remove("header-bg");
        }

        lastScrollTop = st;
        didScroll = false;
      }
    };

    // Initial measurement
    if (header) {
      navbarHeight = header.offsetHeight;
    }

    // Set up event listeners
    window.addEventListener("scroll", handleScroll);
    const scrollInterval = setInterval(checkScroll, 250);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(scrollInterval);
    };
  }, [pathname]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Close any open modal
    const bootstrap = require("bootstrap"); // dynamically import bootstrap
    const modalElements = document.querySelectorAll(".modal.show");
    modalElements.forEach((modal) => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });

    // Close any open offcanvas
    const offcanvasElements = document.querySelectorAll(".offcanvas.show");
    offcanvasElements.forEach((offcanvas) => {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });
  }, [pathname]); // Runs every time the route changes
  useEffect(() => {
    const WOW = require("@/utlis/wow");
    const wow = new WOW.default({
      mobile: false,
      live: false,
    });
    wow.init();
  }, [pathname]);
  // Register service worker (production only: in dev its cache would serve
  // stale chunks and edits would never reach the browser).
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => reg.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      return;
    }

    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("SW registration failed", err));
  }, []);

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <meta name="apple-mobile-web-app-title" content="espublicar" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body>
        <div id="wrapper">
          <ReduxProvider>
            <AuthProvider>
              <Context>
                {children}
                <MobileTabBar />
                <Login />
                <Register />
                <Cart />
                <Quickview />
                <MobileMenu />
                <ScrollTop />
                <Toolbar />
                <Search />
                <AddParallax />
              </Context>
            </AuthProvider>
          </ReduxProvider>
          <ToastContainer
            position="bottom-left"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </body>
    </html>
  );
}
