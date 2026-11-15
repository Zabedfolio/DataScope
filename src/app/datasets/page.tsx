import { redirect } from "next/navigation";

export default function DatasetsRedirectPage() {
  redirect("/dashboard/datasets");
}
