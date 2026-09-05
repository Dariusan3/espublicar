import SiteFooter from "@/components/footers/SiteFooter";
import SiteHeader from "@/components/headers/SiteHeader";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import NearbyListings from "@/components/home/NearbyListings";
import HowItWorks from "@/components/home/HowItWorks";
import LatestListings from "@/components/home/LatestListings";

export const metadata = {
  title: "espublicar — Compra y vende de segunda mano",
  description:
    "Marketplace de segunda mano para vender y comprar cerca de ti con pago seguro.",
};
export default function Home() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <Categories />
      <NearbyListings />
      <HowItWorks />
      <LatestListings />
      <SiteFooter />
    </>
  );
}
