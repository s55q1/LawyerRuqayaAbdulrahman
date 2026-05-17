import { Scale, Award, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";

export default function AboutPage() {
  const { settings } = getCmsData();

  const qualifications: string[] = (() => { try { return JSON.parse(settings.qualifications || "[]"); } catch { return []; } })();
  const experiences: { year: string; title: string; place: string }[] = (() => { try { return JSON.parse(settings.experiences || "[]"); } catch { return []; } })();
  const aboutValues: { title: string; desc: string }[] = (() => { try { return JSON.parse(settings.aboutValues || "[]"); } catch { return []; } })();
  const journeyParagraphs = (settings.journeyText || "").split("\n\n").filter(Boolean);

  const valueIcons = [<Scale key="s" className="w-10 h-10" />, <Award key="a" className="w-10 h-10" />, <BookOpen key="b" className="w-10 h-10" />];

  return (
    <>
      {/* Header Banner */}
      <section className="relative bg-[#0B1325] py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.aboutImage || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"}
            alt="Law Library"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1325]/80 to-[#0B1325]" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2 font-arabic">من نحن</h1>
          <div className="w-12 h-1 bg-[#C5A059] mx-auto rounded-full" />
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 bg-white rounded-t-[50px] lg:rounded-t-[100px] -mt-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="text-[#C5A059] font-bold text-lg font-arabic">رحلتنا</span>
                <div className="w-10 h-0.5 bg-[#C5A059] mt-1" />
              </div>
              <div className="text-slate-600 space-y-4 text-base leading-relaxed">
                {journeyParagraphs.length > 0
                  ? journeyParagraphs.map((p, i) => <p key={i}>{p}</p>)
                  : <p>{settings.aboutText}</p>
                }
              </div>
            </div>
            <div className="relative justify-self-center lg:justify-self-end">
              <div className="w-[300px] h-[350px] md:w-[350px] md:h-[400px] relative">
                <div className="absolute inset-0 border border-slate-300 rounded-[40px] transform translate-x-3 translate-y-3" />
                <div className="absolute inset-0 rounded-[40px] overflow-hidden border-2 border-white shadow-xl">
                  <img
                    src={settings.aboutImage || "https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}
                    alt="رحلتنا"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      {(settings.vision || settings.mission) && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {settings.vision && (
                <div className="relative bg-[#0B1325] rounded-3xl overflow-hidden p-8 text-white min-h-[200px] flex flex-col justify-between group">
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Vision" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1325] via-transparent to-[#0B1325]/50 z-0" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-0.5 bg-white/30 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" /></div>
                      <h3 className="text-2xl font-bold font-arabic">رؤيتنا</h3>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{settings.vision}</p>
                  </div>
                </div>
              )}
              {settings.mission && (
                <div className="relative bg-[#0B1325] rounded-3xl overflow-hidden p-8 text-white min-h-[200px] flex flex-col justify-between group">
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Mission" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1325] via-transparent to-[#0B1325]/50 z-0" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold font-arabic">رسالتنا</h3>
                      <div className="flex-1 h-0.5 bg-white/30 relative"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" /></div>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{settings.mission}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experiences.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-primary-700 text-center mb-14">المسيرة المهنية</h2>
            <div className="max-w-2xl mx-auto space-y-8">
              {experiences.map((exp, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-gold mt-1 flex-shrink-0"></div>
                    {i < experiences.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 my-1"></div>}
                  </div>
                  <div className="pb-8">
                    <span className="text-sm text-gold font-semibold">{exp.year}</span>
                    <h3 className="text-xl font-bold text-primary-700 mt-1">{exp.title}</h3>
                    <p className="text-gray-600">{exp.place}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {aboutValues.length > 0 && (
        <section className="py-20 bg-primary-700">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-white text-center mb-14">قيمنا المهنية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutValues.map((v, i) => (
                <div key={i} className="text-center p-6">
                  <div className="text-gold mx-auto mb-4 flex justify-center">{valueIcons[i % valueIcons.length]}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-blue-200">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary-700 mb-4">هل تريد العمل معنا؟</h2>
          <p className="text-gray-600 mb-8 text-lg">تواصل معنا اليوم للحصول على استشارتك الأولى</p>
          <Link href="/contact" className="btn-primary text-lg">
            <Users className="w-5 h-5 inline-block ml-2" />
            تواصل معنا
          </Link>
        </div>
      </section>
    </>
  );
}
