import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import logo from "@/img/logo.png";
import { CHAT_TOPICS, COURSES, DEVOTIONALS, GALLERY, GIVEAWAYS, PHOTOS, SERVICES, SHOP, getCatalog } from "@/lib/sample-data";
import { isUnread, useApp, visibleNotifications } from "@/lib/store";
import { asset } from "@/lib/utils";
import { Badge, Button, Chip, Dialog, EmptyState, Field, Header, Photo, Screen, TextArea } from "@/components/ui-kit";

export function OnboardingScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const slides = [
    { photo: "onb1" as const, title: "Gear for the shop.", body: "Starter kits and the gear a builder actually reaches for." },
    { photo: "onb2" as const, title: "From a blank sheet to something bold.", body: "Custom metal and precision laser-cut pieces, quoted to the job." },
    { photo: "onb3" as const, title: "Build the skill.", body: "Paid courses with video and PDF materials. Lessons stay locked until payment is confirmed." },
    { photo: "onb4" as const, title: "More than a shop.", body: "Giveaways, a Bible exchange, and a daily devotional." },
  ];
  const last = i === slides.length - 1;
  const finish = () => {
    app.markOnboarded();
    nav({ to: "/login" as never });
  };
  const slide = slides[i];
  return (
    <Screen className="flex min-h-dvh flex-col">
      <div className="relative h-[58dvh]">
        <Photo name={slide.photo} alt="" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <img src={logo} alt="Angry Anvil Fabrication" className="mb-3 h-12 w-auto self-start object-contain" />
        <h1 className="display text-4xl">{slide.title}</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{slide.body}</p>
        <div className="mt-4 flex gap-1" aria-label="Progress">
          {slides.map((_, n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n === i ? "bg-primary" : "bg-border"}`} />)}
        </div>
        <div className="mt-auto flex gap-2 pt-6">
          {!last && <Button variant="ghost" onClick={finish}>Skip</Button>}
          <Button full onClick={() => (last ? finish() : setI(i + 1))}>{last ? "Get Started" : "Next"}</Button>
        </div>
      </div>
    </Screen>
  );
}

function AuthFrame({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <Screen>
      <div className="relative min-h-dvh">
        <img src={asset(PHOTOS.auth)} alt="" className="absolute inset-0 h-48 w-full object-cover opacity-70" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent to-background" />
        <div className={`relative px-5 pt-[max(6.5rem,env(safe-area-inset-top))] ${footer ? "pb-52" : "pb-8"}`}>
          <img src={logo} alt="Angry Anvil Fabrication" className="mb-4 h-16 object-contain" />
          <h1 className="display text-4xl">{title}</h1>
          {subtitle && <p className="mt-2 text-[14px] text-muted-foreground">{subtitle}</p>}
          <div className="mt-5">{children}</div>
        </div>
        {footer}
      </div>
    </Screen>
  );
}

export function LoginScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <AuthFrame
      title="Sign in"
      subtitle="Any email and password will sign you in."
      footer={
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-background/95 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <p className="text-center text-[13px] text-muted-foreground">New here?</p>
          <Link to={"/register" as never} className="display mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-card text-[15px] text-[var(--secondary-ink)] ring-1 ring-[var(--secondary-ink)]">
            Create an account
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link to={"/terms" as never} className="flex h-11 items-center justify-center rounded-xl border border-border text-[14px] font-semibold text-[var(--secondary-ink)]">Terms</Link>
            <Link to={"/privacy" as never} className="flex h-11 items-center justify-center rounded-xl border border-border text-[14px] font-semibold text-[var(--secondary-ink)]">Privacy</Link>
          </div>
        </div>
      }
    >
      <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); setBusy(true); app.login(email, password); setBusy(false); nav({ to: "/" as never }); }}>
        <Field label="Email" type="text" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative">
          <Field label="Password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-9" onClick={() => setShow((s) => !s)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        <Link to={"/forgot-password" as never} className="text-[13px] text-[var(--secondary-ink)]">Forgot password</Link>
        <Button type="submit" full loading={busy}>Sign in</Button>
        <Button full variant="secondary" onClick={() => { app.signInWithApple(); nav({ to: "/" as never }); }}>Sign in with Apple</Button>
        <p className="text-[12px] text-muted-foreground">Apple sign-in is a SAMPLE session. Apple has not verified it. No other social login is offered.</p>
        <Button full variant="ghost" onClick={() => { app.continueAsGuest(); nav({ to: "/" as never }); }}>Continue as Guest</Button>
      </form>
    </AuthFrame>
  );
}

export function RegisterScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "" });
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <AuthFrame title="Create account" subtitle="Guests can browse the shop and course list. Checkout, courses, chat, giveaways, Bible requests, and bookings need an account.">
      <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); app.register(form); nav({ to: "/verify-email" as never }); }}>
        <Field label="First name" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
        <Field label="Last name" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
        <Field label="Email" type="text" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <Field label="Phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <div className="relative">
          <Field label="Password" type={show ? "text" : "password"} value={form.password} onChange={(e) => set("password", e.target.value)} />
          <button type="button" aria-label="Toggle password" className="absolute right-3 top-9" onClick={() => setShow((s) => !s)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        <label className="flex gap-2 text-[13px]"><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> I agree to the <Link to={"/terms" as never} className="text-[var(--secondary-ink)]">Terms</Link> and <Link to={"/privacy" as never} className="text-[var(--secondary-ink)]">Privacy Policy</Link>.</label>
        <Button type="submit" full>Create account</Button>
        <p className="text-[14px]">Already have an account? <Link to={"/login" as never} className="text-[var(--secondary-ink)]">Sign in</Link></p>
      </form>
    </AuthFrame>
  );
}

export function ForgotScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <AuthFrame title="Forgot password" subtitle="We'll mark a sample code for this device. No email is sent.">
      <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); app.requestOtp(email, "reset"); nav({ to: "/otp" as never }); }}>
        <Field label="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" full>Send code</Button>
      </form>
    </AuthFrame>
  );
}

export function OtpScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  return (
    <AuthFrame title="Enter the code" subtitle="Any code is accepted.">
      <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); const result = app.verifyOtp(code); nav({ to: (result.purpose === "reset" ? "/reset-password" : "/") as never }); }}>
        <Field label="6-digit code" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="submit" full>Verify</Button>
      </form>
    </AuthFrame>
  );
}

export function VerifyEmailScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  return (
    <AuthFrame title="Verify email" subtitle="Any code is accepted. Nothing is emailed.">
      <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); if (!app.pendingOtp) app.requestOtp(app.user?.email ?? "", "verify"); app.verifyOtp(code); nav({ to: "/" as never }); }}>
        <Field label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="submit" full>Verify and continue</Button>
      </form>
    </AuthFrame>
  );
}

export function ResetScreen() {
  const app = useApp();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  if (done) return <AuthFrame title="Password updated"><Button full onClick={() => nav({ to: "/login" as never })}>Back to sign in</Button></AuthFrame>;
  return (
    <AuthFrame title="New password">
      <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); app.resetPassword(password); setDone(true); }}>
        <Field label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" full>Save password</Button>
      </form>
    </AuthFrame>
  );
}

export function UpdatePasswordScreen() {
  const app = useApp();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  return (
    <Screen>
      <Header title="Change password" />
      <form noValidate className="space-y-3 px-4 py-4" onSubmit={(e) => { e.preventDefault(); app.changePassword(current, next); }}>
        <Field label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <Field label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} />
        <Button type="submit" full>Update password</Button>
      </form>
    </Screen>
  );
}

export function ProfileScreen() {
  const app = useApp();
  const [logout, setLogout] = useState(false);
  const rows: { to: string; label: string }[] = [
    { to: "/profile/edit", label: "Edit profile" },
    { to: "/update-password", label: "Change password" },
    { to: "/shop/orders", label: "My orders" },
    { to: "/services/bookings", label: "My bookings" },
    { to: "/courses/my", label: "My courses" },
    { to: "/shop/wishlist", label: "Wishlist" },
    { to: "/profile/payments", label: "Payment methods" },
    { to: "/profile/addresses", label: "Saved addresses" },
    { to: "/notifications", label: "Notifications" },
    { to: "/profile/community", label: "Community" },
    { to: "/about", label: "About us" },
    { to: "/contact", label: "Contact" },
    { to: "/shipping", label: "Shipping & returns" },
    { to: "/privacy", label: "Privacy policy" },
    { to: "/terms", label: "Terms & conditions" },
    { to: "/giveaways/rules", label: "Giveaway official rules" },
    { to: "/chat", label: "Help & support" },
  ];
  return (
    <Screen>
      <Header title="Profile" />
      <div className="space-y-4 px-4 py-4">
        {app.user ? (
          <div className="flex items-center gap-3">
            {app.user.photo ? <img src={app.user.photo} alt="" className="h-14 w-14 rounded-full object-cover" /> : <span className="display flex h-14 w-14 items-center justify-center rounded-full bg-card text-xl">{app.user.firstName[0]}</span>}
            <div>
              <p className="font-semibold">{app.user.firstName} {app.user.lastName}</p>
              <p className="text-[13px] text-muted-foreground">{app.user.email}</p>
              {!app.user.emailVerified && <Link to={"/verify-email" as never} className="text-[13px] text-primary">Verify email</Link>}
            </div>
          </div>
        ) : (
          <Button full onClick={() => app.openAuth("Sign in to open your profile tools.")}>Sign in</Button>
        )}
        <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-3 text-[15px]">
          Light theme
          <input type="checkbox" className="h-5 w-5" checked={app.theme === "light"} onChange={() => app.setTheme(app.theme === "light" ? "dark" : "light")} />
        </label>
        <div className="rounded-2xl border border-border bg-card">
          <p className="px-3 pt-3 text-[13px] text-muted-foreground">Language: English. More languages wait on the client.</p>
          {(["orders", "courses", "giveaways", "inquiries", "devotionals", "promotions"] as const).map((key) => (
            <label key={key} className="flex items-center justify-between border-t border-border px-3 py-3 text-[14px] capitalize">
              {key} alerts
              <input type="checkbox" checked={app.prefs[key]} onChange={() => app.togglePref(key)} className="h-5 w-5" />
            </label>
          ))}
        </div>
        <ul className="overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map((r) => <li key={r.to} className="border-b border-border last:border-0"><Link to={r.to as never} className="block px-3 py-3 text-[15px]">{r.label}</Link></li>)}
        </ul>
        <Button variant="secondary" full onClick={() => void app.restorePurchases()}>Restore purchases</Button>
        {app.authed && <Button full onClick={() => setLogout(true)}>Log out</Button>}
        <a href={SHOP.website} className="block text-center text-[13px] text-[var(--secondary-ink)]" target="_blank" rel="noreferrer">angryanvil.store</a>
      </div>
      <Dialog open={logout} title="Log out?" body="You'll keep browsing as a guest. The cart on this device clears." confirmLabel="Log out" danger onConfirm={() => { app.logout(); setLogout(false); }} onClose={() => setLogout(false)} />
    </Screen>
  );
}

export function EditProfile() {
  const app = useApp();
  const user = app.user;
  const [firstName, setFirst] = useState(user?.firstName ?? "");
  const [lastName, setLast] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  if (!user) return <Screen><Header title="Edit profile" /><EmptyState title="Sign in" body="Profile edits need an account." /></Screen>;
  return (
    <Screen>
      <Header title="Edit profile" />
      <form noValidate className="space-y-3 px-4 py-4" onSubmit={(e) => { e.preventDefault(); app.updateProfile({ firstName, lastName, phone }); }}>
        <Field label="First name" value={firstName} onChange={(e) => setFirst(e.target.value)} />
        <Field label="Last name" value={lastName} onChange={(e) => setLast(e.target.value)} />
        <Field label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Field label="Email" value={user.email} disabled />
        <label className="block text-[13px]">Profile photo
          <input type="file" accept="image/*" className="mt-1 block w-full text-[13px]" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => app.updateProfile({ photo: String(reader.result) });
            reader.readAsDataURL(file);
          }} />
        </label>
        <Button type="submit" full>Save</Button>
      </form>
    </Screen>
  );
}

export function AddressesScreen() {
  const app = useApp();
  const [form, setForm] = useState({ label: "Home", name: "", line1: "", city: "", region: "", postal: "" });
  const rows = app.addresses.filter((a) => a.userId === app.user?.id);
  return (
    <Screen>
      <Header title="Addresses" />
      <div className="space-y-3 px-4 py-4">
        {rows.map((a) => <div key={a.id} className="rounded-xl border border-border p-3 text-[14px]">{a.label}: {a.line1}, {a.city} {a.region} {a.postal}<button type="button" className="ml-2 text-destructive" onClick={() => app.removeAddress(a.id)}>Remove</button></div>)}
        <Field label="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <Field label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Field label="Street" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
        <Field label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Field label="State" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
        <Field label="Postal code" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
        <Button full onClick={() => app.saveAddress(form)}>Save address</Button>
      </div>
    </Screen>
  );
}

export function PaymentsScreen() {
  const app = useApp();
  const [label, setLabel] = useState("SAMPLE card");
  const [last4, setLast4] = useState("");
  const rows = app.payments.filter((p) => p.userId === app.user?.id);
  return (
    <Screen>
      <Header title="Payment methods" />
      <div className="space-y-3 px-4 py-4">
        <p className="text-[13px] text-muted-foreground">Only a nickname and the last 4 digits are kept. Nothing is charged.</p>
        {rows.map((p) => <div key={p.id} className="flex justify-between rounded-xl border border-border p-3"><span>{p.label} · {p.last4}</span><button type="button" className="text-destructive" onClick={() => app.removePayment(p.id)}>Remove</button></div>)}
        <Field label="Nickname" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Field label="Last 4 digits" value={last4} onChange={(e) => setLast4(e.target.value)} />
        <Button full onClick={() => { app.savePayment({ label, last4 }); }}>Save method</Button>
      </div>
    </Screen>
  );
}

export function CommunityHub() {
  const app = useApp();
  const entries = app.entries.filter((e) => e.userId === app.user?.id);
  const offers = app.offers.filter((o) => o.userId === app.user?.id);
  const requests = app.requests.filter((r) => r.userId === app.user?.id);
  const saved = DEVOTIONALS.filter((d) => app.savedDevotionals.includes(d.id));
  return (
    <Screen>
      <Header title="Community" />
      <div className="space-y-4 px-4 py-4">
        <h2 className="display text-xl">My giveaway entries</h2>
        {entries.length === 0 ? <p className="text-[14px] text-muted-foreground">None yet.</p> : entries.map((e) => <p key={e.id}>{GIVEAWAYS.find((g) => g.id === e.giveawayId)?.title} · <Badge>Entered</Badge></p>)}
        <h2 className="display text-xl">Bible offers</h2>
        {offers.length === 0 ? <p className="text-[14px] text-muted-foreground">None yet.</p> : offers.map((o) => <p key={o.id}>{o.translation} · {o.status}</p>)}
        <h2 className="display text-xl">Bible requests</h2>
        {requests.length === 0 ? <p className="text-[14px] text-muted-foreground">None yet.</p> : requests.map((o) => <p key={o.id}>{o.translation} · {o.status}</p>)}
        <h2 className="display text-xl">Saved devotionals</h2>
        {saved.length === 0 ? <p className="text-[14px] text-muted-foreground">None saved.</p> : saved.map((d) => <Link key={d.id} to={"/devotionals/$devotionalId" as never} params={{ devotionalId: d.id } as never} className="block text-[var(--secondary-ink)]">{d.title}</Link>)}
      </div>
    </Screen>
  );
}

export function NotificationsScreen() {
  const app = useApp();
  const [cat, setCat] = useState("All");
  const rows = visibleNotifications(app).filter((n) => cat === "All" || n.category === cat);
  const cats = ["All", "Orders", "Courses", "Giveaways", "Inquiries", "Devotional", "Promotions"];
  return (
    <Screen>
      <Header title="Notifications" right={<button type="button" className="text-[12px] font-semibold text-[var(--secondary-ink)]" onClick={app.markAllNotificationsRead}>Read all</button>} />
      <div className="px-4 py-4">
        <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">{cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
        {rows.length === 0 ? <EmptyState title="You're caught up" body="Order, course, giveaway, and shop notes will land here." /> : (
          <ul className="space-y-2">
            {rows.map((n) => (
              <li key={n.id}>
                <Link to={n.href as never} onClick={() => app.markNotificationRead(n.id)} className="block rounded-xl border border-border bg-card p-3">
                  <div className="flex justify-between"><span className="text-[12px] text-[var(--secondary-ink)]">{n.category}</span>{isUnread(n, app.readerKey) && <Badge tone="red">New</Badge>}</div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-[13px] text-muted-foreground">{n.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Button className="mt-4" variant="ghost" onClick={app.clearNotifications}>Clear</Button>
      </div>
    </Screen>
  );
}

export function SearchScreen() {
  const app = useApp();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (query.length < 2) return null;
    return {
      products: getCatalog().filter((p) => `${p.name} ${p.summary}`.toLowerCase().includes(query)),
      courses: COURSES.filter((c) => `${c.title} ${c.summary}`.toLowerCase().includes(query)),
      services: SERVICES.filter((s) => `${s.title} ${s.summary}`.toLowerCase().includes(query)),
      gallery: GALLERY.filter((g) => `${g.title} ${g.description}`.toLowerCase().includes(query)),
      giveaways: GIVEAWAYS.filter((g) => `${g.title} ${g.prize}`.toLowerCase().includes(query)),
      devotionals: DEVOTIONALS.filter((d) => `${d.title} ${d.reference}`.toLowerCase().includes(query)),
    };
  }, [query]);
  const empty = results && Object.values(results).every((list) => list.length === 0);
  return (
    <Screen>
      <Header title="Search" />
      <div className="space-y-4 px-4 py-4">
        <Field label="Search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kits, courses, devotionals" onBlur={() => app.addRecentSearch(q)} />
        {!results && (
          <div>
            <p className="mb-2 text-[13px] text-muted-foreground">Recent</p>
            <div className="flex flex-wrap gap-2">
              {app.recentSearches.map((r) => (
                <Chip key={r} onClick={() => setQ(r)}>
                  {r}
                </Chip>
              ))}
            </div>
            {app.recentSearches.length === 0 && <p className="text-[13px] text-muted-foreground">Try helmet, laser, or worship.</p>}
          </div>
        )}
        {empty && <EmptyState title="No matches" body="Nothing in the sample catalog uses that wording." />}
        {results && !empty && (
          <div className="space-y-4">
            <Group title="Products">{results.products.map((p) => <Link key={p.id} to={"/shop/product/$productId" as never} params={{ productId: p.id } as never} className="block py-2">{p.name}</Link>)}</Group>
            <Group title="Courses">{results.courses.map((c) => <Link key={c.id} to={"/courses/$courseId" as never} params={{ courseId: c.id } as never} className="block py-2">{c.title}</Link>)}</Group>
            <Group title="Services">{results.services.map((s) => <Link key={s.id} to={"/services/$serviceId" as never} params={{ serviceId: s.id } as never} className="block py-2">{s.title}</Link>)}</Group>
            <Group title="Gallery">{results.gallery.map((g) => <Link key={g.id} to={"/gallery/$projectId" as never} params={{ projectId: g.id } as never} className="block py-2">{g.title}</Link>)}</Group>
            <Group title="Giveaways">{results.giveaways.map((g) => <Link key={g.id} to={"/giveaways/$giveawayId" as never} params={{ giveawayId: g.id } as never} className="block py-2">{g.title}</Link>)}</Group>
            <Group title="Devotionals">{results.devotionals.map((d) => <Link key={d.id} to={"/devotionals/$devotionalId" as never} params={{ devotionalId: d.id } as never} className="block py-2">{d.title}</Link>)}</Group>
          </div>
        )}
      </div>
    </Screen>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const list = Array.isArray(children) ? children : [children];
  if (list.filter(Boolean).length === 0) return null;
  return <section><h2 className="display text-xl">{title}</h2><div>{children}</div></section>;
}

export function ChatList() {
  const app = useApp();
  const nav = useNavigate();
  const threads = app.threads.filter((t) => t.userId === app.user?.id);
  if (!app.authed) return <Screen><Header title="Chat" back={false} /><EmptyState title="Sign in to message the shop" body="Orders, kits, custom work, and course access." action={<Button onClick={() => app.openAuth("Sign in to chat with the shop.")}>Sign in</Button>} /></Screen>;
  return (
    <Screen>
      <Header title="Chat" subtitle={SHOP.phone} back={false} />
      <div className="space-y-3 px-4 py-4">
        <p className="text-[13px] text-muted-foreground">{SHOP.email} · {SHOP.hours}</p>
        <div className="flex flex-wrap gap-2">
          {CHAT_TOPICS.map((topic) => <Chip key={topic} onClick={() => { const id = app.startThread(topic, topic); if (id) nav({ to: "/chat/$threadId" as never, params: { threadId: id } as never }); }}>{topic}</Chip>)}
        </div>
        {threads.length === 0 ? <EmptyState title="No conversations" body="Pick a topic above to leave a note for the shop. Replies here are SAMPLE." /> : threads.map((t) => (
          <Link key={t.id} to={"/chat/$threadId" as never} params={{ threadId: t.id } as never} className="block rounded-2xl border border-border bg-card p-3">
            <div className="flex justify-between"><span className="font-semibold">{t.topic}</span>{t.unread > 0 && <Badge tone="red">{t.unread}</Badge>}</div>
            <p className="line-clamp-1 text-[13px] text-muted-foreground">{t.messages[t.messages.length - 1]?.text}</p>
          </Link>
        ))}
      </div>
    </Screen>
  );
}

export function ChatThread({ threadId }: { threadId: string }) {
  const app = useApp();
  const thread = app.threads.find((t) => t.id === threadId && t.userId === app.user?.id);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (thread?.unread) app.markThreadRead(thread.id);
  }, [thread?.id, thread?.unread, app]);
  if (!thread) return <Screen><Header title="Chat" /><EmptyState title="No conversation" body="Start one from the chat tab." /></Screen>;
  return (
    <Screen className="flex min-h-dvh flex-col">
      <Header title={thread.topic} subtitle="SAMPLE thread" />
      <div className="flex-1 space-y-2 px-4 py-4">
        {thread.messages.map((m) => (
          <div key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-[14px] ${m.from === "user" ? "ml-auto bg-primary text-white" : "bg-card"}`}>
            {m.image && <img src={m.image} alt="Attachment" className="mb-2 max-h-40 rounded-lg" />}
            <p>{m.text}</p>
            <p className={`mt-1 text-[10px] ${m.from === "user" ? "text-white/80" : "text-muted-foreground"}`}>{new Date(m.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · {m.from === "user" ? "Sent" : "Sample"}</p>
          </div>
        ))}
        {typing && <p className="text-[12px] text-muted-foreground">Shop is typing…</p>}
      </div>
      <form noValidate className="sticky bottom-0 flex items-end gap-2 border-t border-border bg-background px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]" onSubmit={(e) => { e.preventDefault(); setTyping(true); app.sendMessage(thread.id, text.trim()); setText(""); setTimeout(() => setTyping(false), 700); }}>
        <label className="flex h-11 w-11 items-center justify-center rounded-xl border border-border" aria-label="Attach a photo">
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => app.sendMessage(thread.id, text.trim() || "Photo", String(reader.result));
            reader.readAsDataURL(file);
          }} />
          +
        </label>
        <TextArea label="Message" value={text} onChange={(e) => setText(e.target.value)} className="min-h-11" />
        <Button type="submit">Send</Button>
      </form>
    </Screen>
  );
}

export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Screen>
      <Header title={title} />
      <div className="space-y-3 px-4 py-4 text-[15px] leading-relaxed">{children}</div>
    </Screen>
  );
}

export function AboutPage() {
  return (
    <InfoPage title="About us">
      <img src={logo} alt="Angry Anvil Fabrication" className="h-24 object-contain" />
      <p>{SHOP.tagline}</p>
      <p>Angry Anvil is a laser cutting and welding shop. The work covers custom metal, welding kits, laser-cut pieces, and branded merchandise, plus a faith-minded corner of the shop: giveaways, a Bible exchange, and a daily reading.</p>
      <p>The shop's own site describes bespoke metalwork made to last. This app follows that shop and does not add services the client has not confirmed.</p>
      <a className="text-[var(--secondary-ink)]" href={SHOP.website}>angryanvil.store</a>
    </InfoPage>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [note, setNote] = useState("");
  return (
    <InfoPage title="Contact">
      <p><a className="text-[var(--secondary-ink)]" href={SHOP.phoneHref}>{SHOP.phone}</a></p>
      <p><a className="text-[var(--secondary-ink)]" href={`mailto:${SHOP.email}`}>{SHOP.email}</a></p>
      <p>{SHOP.hours}</p>
      {sent ? <p>Saved on this device. The shop has not received it. Use chat or email for a real note.</p> : (
        <form noValidate className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <TextArea label="Note" value={note} onChange={(e) => setNote(e.target.value)} />
          <Button type="submit">Save a note</Button>
        </form>
      )}
    </InfoPage>
  );
}

export function ShippingPage() {
  return <InfoPage title="Shipping & returns"><p>SAMPLE PLACEHOLDER. The shop will supply shipping rates, carriers, and the return window. This mockup does not state them.</p><p>Print-on-demand merchandise is meant to be fulfilled by Printify once that account is connected. Tracking states in the app are labeled for that handoff.</p></InfoPage>;
}

export function PrivacyPage() {
  return <InfoPage title="Privacy policy"><p>SAMPLE PLACEHOLDER. This is not a privacy policy. Angry Anvil will publish the real one before release. Do not treat this screen as a legal notice.</p></InfoPage>;
}

export function TermsPage() {
  return <InfoPage title="Terms & conditions"><p>SAMPLE PLACEHOLDER. This is not a terms agreement. Counsel will replace this copy. Creating an account in the sample accepts only this placeholder so the form can be completed.</p></InfoPage>;
}