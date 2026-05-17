import WebsiteHeader from "@/components/website/Header";
import WebsiteFooter from "@/components/website/Footer";
import FloatingContactButtons from "@/components/website/WhatsAppButton";
import { getCmsData } from "@/lib/cms";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = getCmsData();
  return (
    <>
      <WebsiteHeader phone={settings.phone} />
      <main className="min-h-screen" style={{ background: "#0F172A" }}>{children}</main>
      <WebsiteFooter settings={settings} />
      <FloatingContactButtons />
    </>
  );
}
