import { requireAdminPage } from "@/lib/require-admin";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";

export const dynamic = "force-dynamic";

export default async function NewCaseStudyPage() {
  await requireAdminPage();

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">New case study</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Write about a real project with real outcomes. It stays a draft until you publish it.
      </p>
      <CaseStudyForm />
    </div>
  );
}
