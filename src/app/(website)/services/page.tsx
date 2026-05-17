import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { Noto_Naskh_Arabic } from "next/font/google";
import { getCmsData } from "@/lib/cms";

const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "700"] });

export default async function ServicesPage() {
  const cmsData = getCmsData();
  const services = cmsData.services.filter(s => s.active).sort((a, b) => a.order - b.order);

  return (
    <>
      {/* HERO */}
      <div className="relative bg-[#0B1325] text-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1325] via-transparent to-[#0B1325]/80" />
        <div className="container mx-auto px-6 relative z-10 text-right">
          <div className="text-sm text-slate-300 mb-4">
            <span>الرئيسية</span><span className="mx-2">/</span>
            <span className="text-[#C5A059]">الخدمات والإستشارات القانونية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">الخدمات والإستشارات القانونية</h1>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl ml-auto">
            نقدم خدمات نوعية ومتنوعة لعملائنا مستندة إلى قدراتنا المتخصصة والمهنية العالية.
          </p>
          <div className="flex flex-wrap gap-4 justify-end">
            <Link href="/contact" className="flex items-center gap-2 bg-[#0B1325]/60 hover:bg-[#C5A059] transition-colors border border-white/20 px-6 py-2 rounded-full text-sm font-bold">
              <Phone size={16} /><span>اتصال</span>
            </Link>
            <Link href="/contact" className="flex items-center gap-2 bg-[#0B1325]/60 hover:bg-[#C5A059] transition-colors border border-white/20 px-6 py-2 rounded-full text-sm font-bold">
              <MessageSquare size={16} /><span>واتساب</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="bg-[#f5f5f3] py-20">
        <div className="container mx-auto px-6">
          <div className="text-right mb-12">
            <h2 className="text-3xl font-bold text-[#0B1325] mb-2">خدمات</h2>
            <div className="w-16 h-1 bg-[#C5A059] rounded-full mr-0 ml-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => (
              <Link href="/contact" key={svc.id} className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-[#0B1325]">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  {svc.imageUrl ? (
                    <img
                      src={svc.imageUrl}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0B1325]/50 flex items-center justify-center text-5xl">
                      {svc.icon || "⚖️"}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    خدمات
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 text-right">
                  <h3 className={`text-xl font-bold text-white mb-3 ${naskh.className}`}>{svc.title}</h3>
                  <p className={`text-slate-300 text-sm leading-loose mb-5 ${naskh.className}`}>{svc.description}</p>
                  <div className="flex items-center justify-end gap-2 text-[#C5A059] font-bold text-sm group-hover:gap-4 transition-all">
                    <span>اقرأ المزيد</span>
                    <span>←</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
