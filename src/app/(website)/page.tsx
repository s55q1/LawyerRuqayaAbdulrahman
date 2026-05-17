import ClientHome from "./ClientHome";
import { getCmsData } from "@/lib/cms";

export default async function HomePage() {
  const cmsData = getCmsData();
  return <ClientHome cmsData={cmsData} />;
}
