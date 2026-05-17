import Link from "next/link";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="bg-primary-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Scale className="w-12 h-12 text-primary-700 opacity-50" />
        </div>
        <h1 className="text-6xl font-bold text-primary-700 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">الصفحة التي تبحث عنها غير موجودة أو تم نقلها</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">العودة للرئيسية</Link>
          <Link href="/dashboard" className="btn-gold">لوحة التحكم</Link>
        </div>
      </div>
    </div>
  );
}
