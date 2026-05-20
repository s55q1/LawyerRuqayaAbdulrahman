import { BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";

export default function BlogPage() {
  const { blog } = getCmsData();
  const posts = blog.filter(p => p.published).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Arabic Months array helper for beautiful custom date strings matching the screenshot
  const formatArDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = d.getDate();
      const year = d.getFullYear();
      const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ];
      const monthName = months[d.getMonth()];
      return `${day} ${monthName}، ${year}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <section className="relative text-white overflow-hidden" style={{ minHeight: "300px", background: "linear-gradient(135deg, #040812 0%, #0B1325 55%, #112040 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#C5A059 1px, transparent 1px), linear-gradient(90deg, #C5A059 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }} />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center py-20">
          <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] mb-3 font-arabic">المعرفة القانونية</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-arabic">المدونة القانونية</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto font-arabic">
            مقالات ومعلومات قانونية مفيدة لمساعدتك في فهم حقوقك والاطلاع على أحدث الأنظمة والتعاميم
          </p>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAFA]" dir="rtl">
        <div className="container mx-auto px-6 max-w-7xl">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-500 font-arabic">لا توجد مقالات بعد</h2>
              <p className="text-gray-400 mt-2 font-arabic">سيتم نشر المقالات قريباً</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100/80 hover:shadow-[0_20px_50px_rgba(19,122,99,0.08)] hover:border-[#137A63]/30 transition-all duration-500 h-full flex flex-col relative group cursor-pointer"
                >
                  {/* Category Pill Tag */}
                  <span className="absolute top-5 right-5 z-20 bg-[#137A63] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md transition-all group-hover:scale-105">
                    {(post as any).category || "أنظمة ولوائح"}
                  </span>

                  {/* Top Image */}
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img 
                      src={(post as any).imageUrl || "/images/blog-1.png"} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex-1 flex flex-col items-center text-center justify-between">
                    <div>
                      {/* Date */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 justify-center">
                        <Calendar className="w-4.5 h-4.5 text-gray-400" />
                        <span className="font-medium">{formatArDate(post.createdAt)}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-arabic leading-snug hover:text-[#137A63] transition-colors">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-6 font-arabic line-clamp-3 text-center">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Read More Link */}
                    <Link 
                      href={`/blog/${post.slug || post.id}`}
                      className="inline-flex items-center gap-2 text-[#137A63] hover:text-[#0b4d3e] font-bold text-base transition-all duration-300 mt-auto group/link"
                    >
                      <span className="font-arabic">اقرأ المزيد</span>
                      <span className="text-lg transition-transform duration-300 group-hover/link:-translate-x-1">←</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
