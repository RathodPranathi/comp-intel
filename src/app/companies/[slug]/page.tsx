import { notFound } from "next/navigation";
import { getCompanyBySlug, getRecordsForCompany } from "@/lib/data";
import { CompanyClient } from "./CompanyClient";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const records = getRecordsForCompany(slug);
  return <CompanyClient companyName={company.name} records={records} />;
}
