export default function DbNotice({ feature = "this admin section" }: { feature?: string }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-6" role="alert">
      <h2 className="text-base font-semibold text-amber-900">Database not configured</h2>
      <p className="mt-1 text-sm text-amber-800">
        <code>DATABASE_URL</code> is not set, so {feature} is unavailable. Configure the
        database (see DEPLOY.md) and reload.
      </p>
    </div>
  );
}
