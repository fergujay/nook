type EditorialSectionKickerProps = {
  /** Small caps wayfinding line (section intent). */
  label: string;
  /** Optional serif context line (e.g. place name) — avoids arbitrary index numbers. */
  preline?: string;
  className?: string;
};

/**
 * Print-style section opener: vertical rule + words, not chapter numerals.
 */
export function EditorialSectionKicker({ label, preline, className = "" }: EditorialSectionKickerProps) {
  return (
    <div className={`editorial-kicker ${className}`}>
      <span className="editorial-kicker-accent" aria-hidden />
      <div className="min-w-0 space-y-3">
        {preline ? (
          <p className="font-editorial text-[1.15rem] leading-snug text-foreground sm:text-xl">{preline}</p>
        ) : null}
        <p className="editorial-kicker-heading max-w-2xl text-pretty">{label}</p>
      </div>
    </div>
  );
}
