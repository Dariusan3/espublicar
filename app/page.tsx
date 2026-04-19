import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import Categories from "@/components/homes/home-1/Categories";
import Products1 from "@/components/homes/home-1/Products1";
import HowItWorks from "@/components/homes/home-1/HowItWorks";
import Products3 from "@/components/homes/home-1/Products3";

export const metadata = {
  title: "espublicar — Compra y vende de segunda mano",
  description:
    "Marketplace de segunda mano para vender y comprar cerca de ti con pago seguro.",
};
export default function Home() {
  return (
    <>
      <Header1 />
      <Hero />
      <Categories />
      <Products1 />
      <HowItWorks />
      <Products3 />
      <Footer1 />
    </>
  );
}
