import { requireAdminPage } from "@/lib/require-admin";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function NewTestimonialPage() {
  await requireAdminPage();

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">New testimonial</h1>
      <p className="mb-6 mt-1 text-sm text-slate-500">
        Use the client&apos;s real words. It stays private until you mark it approved.
      </p>
      <TestimonialForm />
    </div>
  );
}
