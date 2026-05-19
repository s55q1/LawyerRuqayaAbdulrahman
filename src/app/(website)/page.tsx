import ClientHome from "./ClientHome";
import { getCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cmsData = getCmsData();
  return <ClientHome cmsData={cmsData} />;
}
