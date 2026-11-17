import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { PHOTOS, type PhotoKey } from "@/lib/sample-data";
import { asset, cn } from "@/lib/utils";

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("min-h-dvh", className)}>{children}</div>;
}

export function Header({
  title,
  subtitle,
  back = true,
  right,
  fallback = "/",
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  fallback?: string;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md">
      <div className="flex items-center gap-3">
        {back && (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: fallback as never }))}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="display truncate text-[1.35rem]">{title}</h1>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--secondary-ink)]">{children}</p>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="display mt-1 text-[1.35rem]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function WarmRule() {
  return <div className="my-1 h-px w-10 bg-warm" aria-hidden />;
}

export function Button({
  children,
  variant = "primary",
  full,
  loading,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost"; full?: boolean; loading?: boolean }) {
  const styles = {
    primary: "bg-primary text-white shadow-[0_0_0_1px_rgba(237,28,36,0.4)] active:shadow-[0_0_16px_rgba(237,28,36,0.55)]",
    secondary: "border border-[var(--secondary-ink)] bg-transparent text-[var(--secondary-ink)] active:shadow-[0_0_16px_rgba(99,201,217,0.35)]",
    ghost: "bg-transparent text-foreground active:bg-white/5",
  }[variant];
  return (
    <button
      {...props}
      type={props.type ?? "button"}
      disabled={props.disabled || loading}
      className={cn(
        "display inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-[15px] tracking-[0.08em] transition active:scale-[0.98] disabled:opacity-45",
        full && "w-full",
        styles,
        className,
      )}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

export function IconButton({ label, children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      className={cn("relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground", className)}
    >
      {children}
    </button>
  );
}

const fieldClass =
  "h-12 w-full rounded-xl border border-border bg-card px-3 text-[15px] text-foreground outline-none placeholder:text-dim focus:border-[var(--secondary-ink)]";

export function Field({
  label,
  error,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string }) {
  const id = props.id ?? props.name;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[13px] font-medium text-foreground">{label}</span>
      <input id={id} {...props} className={cn(fieldClass, error && "border-destructive", props.className)} />
      {error ? <span className="mt-1 block text-[13px] text-destructive">{error}</span> : hint ? <span className="mt-1 block text-[12px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
      <textarea id={id} {...props} className={cn(fieldClass, "min-h-28 py-3", error && "border-destructive", props.className)} />
      {error && <span className="mt-1 block text-[13px] text-destructive">{error}</span>}
    </label>
  );
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-[13px] font-medium">{label}</span>
      <select id={id} {...props} className={cn(fieldClass, error && "border-destructive")}>
        {children}
      </select>
      {error && <span className="mt-1 block text-[13px] text-destructive">{error}</span>}
    </label>
  );
}

export function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "red" | "teal" | "muted" | "warm" }) {
  const tones = {
    red: "border-primary/50 text-primary",
    teal: "border-[var(--secondary-ink)] text-[var(--secondary-ink)]",
    muted: "border-border text-muted-foreground",
    warm: "border-warm text-warm",
  }[tone];
  return <span className={cn("display inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] tracking-[0.08em]", tones)}>{children}</span>;
}

export function Chip({
  active,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      type="button"
      className={cn(
        "h-9 shrink-0 rounded-full border px-3 text-[13px] font-medium",
        active ? "border-primary bg-primary text-white" : "border-border bg-card text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Photo({
  name,
  alt,
  className,
}: {
  name: PhotoKey;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={cn("steel flex items-end bg-card p-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground", className)} role="img" aria-label={alt}>
        {alt}
      </div>
    );
  }
  return <img src={asset(PHOTOS[name])} alt={alt} className={cn("h-full w-full object-cover", className)} onError={() => setFailed(true)} />;
}

export function Price({ value }: { value: number | null }) {
  if (value == null) return <span className="display text-xl text-foreground">By quote</span>;
  return <span className="display text-2xl text-primary">{value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span>;
}

export function SafetyNote() {
  return <p className="text-[13px] leading-relaxed text-muted-foreground">Welding involves heat, sparks and sharp metal. Always follow safety guidelines.</p>;
}

export function SampleMark({ children = "SAMPLE" }: { children?: ReactNode }) {
  return <Badge tone="warm">{children}</Badge>;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <AnvilMark />
      <h2 className="display mt-4 text-2xl">{title}</h2>
      <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function AnvilMark() {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden className="text-primary">
      <rect x="8" y="8" width="72" height="72" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <path d="M24 52h28l6-8H30l-6 8zm8 0v8h16v-8" fill="none" stroke="#63C9D9" strokeWidth="2" />
      <path d="M58 28c6 2 10 8 8 14" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="62" cy="26" r="2" fill="#63C9D9" />
    </svg>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-card", className)} />;
}

export function Sheet({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/65" aria-label="Close" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative z-10 max-h-[88dvh] w-full max-w-[480px] overflow-auto rounded-t-3xl border border-border bg-surface px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="display text-xl">{title}</h2>
          <button type="button" onClick={onClose} className="display text-[13px] tracking-[0.12em] text-[var(--secondary-ink)]">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Dialog({ open, title, body, confirmLabel, onConfirm, onClose, danger }: { open: boolean; title: string; body: string; confirmLabel: string; onConfirm: () => void; onClose: () => void; danger?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button type="button" className="absolute inset-0 bg-black/65" aria-label="Close dialog" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-5">
        <h2 id="dialog-title" className="display text-2xl">{title}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="ghost" full onClick={onClose}>Not now</Button>
          <Button full variant={danger ? "primary" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function Qty({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl border border-border">
      <button type="button" aria-label="Decrease quantity" className="h-11 w-11" onClick={() => onChange(value - 1)}>-</button>
      <span className="min-w-6 text-center text-[15px]">{value}</span>
      <button type="button" aria-label="Increase quantity" className="h-11 w-11" onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

export function useScreenLoad(key: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let live = true;
    const seen = sessionStorage.getItem(key) === "1";
    const t = setTimeout(() => {
      if (!live) return;
      if (!navigator.onLine) setError(true);
      else sessionStorage.setItem(key, "1");
      setLoading(false);
    }, seen ? 0 : 380);
    return () => {
      live = false;
      clearTimeout(t);
    };
  }, [key]);
  const refresh = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      if (!navigator.onLine) setError(true);
      setLoading(false);
    }, 650);
  };
  return { loading, error, refresh, retry: refresh };
}

export function LoadBlock() {
  return (
    <div className="space-y-3 px-4 py-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-44 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function ErrorBlock({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      title="This didn't load"
      body="Check the connection and try again. Nothing here was changed."
      action={<Button onClick={onRetry}>Try again</Button>}
    />
  );
}

export function TextLink({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to as never} className={cn("text-[13px] font-semibold text-[var(--secondary-ink)]", className)}>
      {children}
    </Link>
  );
}
