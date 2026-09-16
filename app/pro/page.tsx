import SiteHeader from "@/components/headers/SiteHeader";
import SiteFooter from "@/components/footers/SiteFooter";
import ProPlan from "@/components/pro/ProPlan";

export const metadata = {
  title: "espublicar Pro | espublicar",
  description: "Envío gratis, ofertas destacadas y aviso antes que nadie cuando busques algo.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <ProPlan />
      <SiteFooter />
    </>
  );
}
