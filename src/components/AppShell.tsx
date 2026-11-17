import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { GraduationCap, House, MessageCircle, ShoppingBag, Wrench } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/img/logo.png";
import { isUnread, useApp, visibleNotifications } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./ui-kit";

const TABS = [
  { to: "/", label: "Home", icon: House, match: (p: string) => p === "/" },
  { to: "/services", label: "Services", icon: Wrench, match: (p: string) => p.startsWith("/services") },
  { to: "/courses", label: "Courses", icon: GraduationCap, match: (p: string) => p.startsWith("/courses") },
  { to: "/shop", label: "Shop", icon: ShoppingBag, match: (p: string) => p.startsWith("/shop") },
  { to: "/chat", label: "Chat", icon: MessageCircle, match: (p: string) => p.startsWith("/chat") },
] as const;

const HIDE = /^\/(onboarding|login|register|forgot-password|reset-password|otp|verify-email|update-password)(\/|$)/;

export function AppShell({ children }: { children: ReactNode }) {
  const app = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [splashDone, setSplashDone] = useState(false);
  const [online, setOnline] = useState(true);
  const showTabs = splashDone && !HIDE.test(path) && !path.includes("/lessons/");

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const unreadNotes = visibleNotifications(app).filter((n) => isUnread(n, app.readerKey)).length;
  const unreadChat = app.threads.filter((t) => t.userId === app.user?.id).reduce((n, t) => n + t.unread, 0);

  return (
    <div data-theme={app.theme} className="app-frame">
      {(!app.hydrated || !splashDone) && <Splash hold={!app.hydrated} onDone={() => setSplashDone(true)} />}
      <div className={showTabs ? "pb-[calc(4.6rem+env(safe-area-inset-bottom))]" : ""}>{children}</div>
      {!online && splashDone && (
        <p className="fixed bottom-[calc(4.8rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 bg-warning px-4 py-2 text-center text-[13px] font-semibold text-black">
          You're offline. Saved SAMPLE data is still on this device.
        </p>
      )}
      {showTabs && <TabBar path={path} cart={app.cart.reduce((n, l) => n + l.qty, 0)} chat={unreadChat} />}
      <ToastList />
      <AuthGate />
      <span className="sr-only">{unreadNotes}</span>
    </div>
  );
}

function Splash({ hold, onDone }: { hold: boolean; onDone: () => void }) {
  const [minMet, setMinMet] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("aaf.splash") === "1";
    const ms = seen ? 0 : reduce ? 400 : 1600;
    const t = setTimeout(() => setMinMet(true), ms);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (minMet && !hold) {
      sessionStorage.setItem("aaf.splash", "1");
      onDone();
    }
  }, [minMet, hold, onDone]);
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <img src={logo} alt="Angry Anvil Fabrication" className="neon-power w-[15.5rem]" />
    </div>
  );
}

function TabBar({ path, cart, chat }: { path: string; cart: number; chat: number }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md" aria-label="Primary">
      <ul className="grid grid-cols-5">
        {TABS.map((tab) => {
          const active = tab.match(path);
          const Icon = tab.icon;
          const badge = tab.to === "/shop" ? cart : tab.to === "/chat" ? chat : 0;
          return (
            <li key={tab.to}>
              <Link
                to={tab.to as never}
                aria-current={active ? "page" : undefined}
                className={cn("flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-semibold tracking-wide", active ? "text-primary" : "text-dim")}
                style={active ? { filter: "drop-shadow(0 0 6px rgba(237,28,36,0.65))" } : undefined}
              >
                <span className="relative">
                  <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                  {badge > 0 && <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">{badge}</span>}
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function ToastList() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-50 w-[min(100%,480px)] -translate-x-1/2 space-y-2 px-4">
      {toasts.map((t) => (
        <button key={t.id} type="button" onClick={() => dismissToast(t.id)} className="w-full rounded-xl border border-border bg-card px-4 py-3 text-left shadow-lg">
          <p className="text-[14px] font-semibold">{t.title}</p>
          {t.body && <p className="text-[13px] text-muted-foreground">{t.body}</p>}
        </button>
      ))}
    </div>
  );
}

function AuthGate() {
  const { authGate, closeAuth } = useApp();
  const nav = useNavigate();
  if (!authGate) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" className="absolute inset-0 bg-black/65" aria-label="Close" onClick={closeAuth} />
      <div role="dialog" aria-modal="true" aria-label="Sign in" className="relative z-10 w-full max-w-[480px] rounded-t-3xl border border-border bg-surface px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <h2 className="display text-2xl">Sign in to continue</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">{authGate}</p>
        <div className="mt-4 space-y-2">
          <Button full onClick={() => { closeAuth(); nav({ to: "/login" as never }); }}>Sign in</Button>
          <Button full variant="secondary" onClick={() => { closeAuth(); nav({ to: "/register" as never }); }}>Create account</Button>
          <Button full variant="ghost" onClick={closeAuth}>Not now</Button>
        </div>
      </div>
    </div>
  );
}
