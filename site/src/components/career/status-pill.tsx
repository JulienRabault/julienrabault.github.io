/** Où en est le projet, dit en un mot à côté de son nom. */
export function StatusPill({ status }: { status: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-ochre-soft px-2 py-0.5 font-medium text-[11px] text-ochre">
      {status}
    </span>
  );
}
