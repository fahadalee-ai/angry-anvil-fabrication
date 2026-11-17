import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, Flame, Gift, GraduationCap, Images, Search, Shirt, ShoppingCart, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/img/logo.png";
import {
  CATEGORIES,
  COURSES,
  DEVOTIONALS,
  GALLERY,
  GIVEAWAYS,
  PHOTOS,
  SHOP,
  getCatalog,
  money,
} from "@/lib/sample-data";
import { isUnread, useApp, visibleNotifications } from "@/lib/store";
import { asset } from "@/lib/utils";
import { Badge, Button, Chip, EmptyState, ErrorBlock, Eyebrow, Field, LoadBlock, Photo, Price, SafetyNote, SampleMark, Screen, SectionTitle, useScreenLoad } from "@/components/ui-kit";

const ACTIONS = [
  { to: "/shop", label: "Welding Kits", icon: Flame },
  { to: "/services", label: "Custom Fab", icon: Wrench },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/giveaways", label: "Giveaways", icon: Gift },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/bible", label: "Bible Exchange", icon: BookOpen },
  { to: "/devotionals", label: "Devotional", icon: BookOpen },
];

export function HomeScreen() {
  const app = useApp();
  const nav = useNavigate();
  const load = useScreenLoad("home");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [chip, setChip] = useState("All");
  const hour = new Date().getHours();
  const hello = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = app.user?.firstName ?? "there";
  const kits = getCatalog().filter((p) => p.category === "kits");
  const unread = visibleNotifications(app).filter((n) => isUnread(n, app.readerKey)).length;
  const cart = app.cart.reduce((n, l) => n + l.qty, 0);
  const today = DEVOTIONALS[0];
  const giveaway = GIVEAWAYS[0];
  const shots = [
    { photo: "sparks" as const, alt: "Sparks over a steel bench" },
    { photo: "galWildlife" as const, alt: "Laser-cut wildlife panel" },
    { photo: "catMerch" as const, alt: "Blank work apparel on a bench" },
    { photo: "interior" as const, alt: "Workshop interior before the first arc" },
  ];
  const filtered = GALLERY.filter((g) => chip === "All" || (chip === "Fabrication Projects" && g.category === "fabrication") || (chip === "Laser-Cut Designs" && g.category === "laser") || (chip === "Past Giveaways & Winners" && g.category === "winners"));

  useEffect(() => {
    if (app.hydrated && !app.onboarded) nav({ to: "/onboarding" as never });
  }, [app.hydrated, app.onboarded, nav]);

  if (load.loading) {
    return (
      <Screen>
        <LoadBlock />
      </Screen>
    );
  }
  if (load.error) {
    return (
      <Screen>
        <ErrorBlock onRetry={load.retry} />
      </Screen>
    );
  }

  return (
    <Screen>
      {!app.announcementDismissed && (
        <div className="flex items-center gap-3 bg-secondary px-4 py-2 text-[13px] font-semibold text-secondary-foreground">
          <p className="flex-1">{SHOP.announcement}</p>
          <button type="button" aria-label="Dismiss announcement" className="h-11 px-2" onClick={app.dismissAnnouncement}>
            Close
          </button>
        </div>
      )}
      <header className="flex items-center gap-3 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button type="button" aria-label="Open profile" onClick={() => nav({ to: "/profile" as never })}>
          <img src={logo} alt="" className="h-11 w-11 object-contain" />
        </button>
        <div className="min-w-0 flex-1">
          <Eyebrow>{hello}</Eyebrow>
          <p className="truncate text-[17px] font-semibold">{name}</p>
        </div>
        <IconLink label="Search" to="/search"><Search size={18} /></IconLink>
        <IconLink label={unread ? `Notifications, ${unread} unread` : "Notifications"} to="/notifications">
          <Bell size={18} />
          {unread > 0 && <i className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
        </IconLink>
        <IconLink label={cart ? `Cart, ${cart} items` : "Cart"} to="/shop/cart">
          <ShoppingCart size={18} />
          {cart > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">{cart}</span>}
        </IconLink>
      </header>

      <div className="space-y-8 px-4 pb-8">
        <section className="relative h-[26rem] overflow-hidden rounded-2xl border border-border">
          <Photo name="hero" alt="Welder in a dark shop with sparks flying" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <Eyebrow>Angry Anvil</Eyebrow>
            <h1 className="display mt-2 max-w-[16rem] text-[2.4rem] text-white">{SHOP.tagline}</h1>
            <p className="mt-2 max-w-[18rem] text-[14px] leading-relaxed text-white/80">Welding kits, laser-cut steel, and custom work from a shop that still builds the thing itself.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Button full onClick={() => nav({ to: "/shop" as never })}>Shop Welding Kits</Button>
              <Button full variant="secondary" onClick={() => nav({ to: "/gallery" as never })}>Explore Our Work</Button>
            </div>
          </div>
        </section>

        <section>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
              <Link key={a.label} to={a.to as never} className="flex w-[4.6rem] shrink-0 flex-col items-center gap-2 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-[var(--secondary-ink)]">
                  <Icon size={20} />
                </span>
                <span className="text-[11px] font-medium leading-tight">{a.label}</span>
              </Link>
              );
            })}
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Catalog" title="Shop by Category" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={"/shop" as never} className="w-44 shrink-0 overflow-hidden rounded-2xl border border-border bg-card">
                <Photo name={c.photo} alt={c.label} className="h-28" />
                <div className="p-3">
                  <p className="display text-[15px]">{c.label}</p>
                  <p className="mt-1 text-[12px] text-[var(--secondary-ink)]">{c.action}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="On the bench" title="Featured Welding Kits" action={<Link to={"/shop" as never} className="text-[13px] font-semibold text-[var(--secondary-ink)]">See all</Link>} />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {kits.map((p) => (
              <article key={p.id} className="w-52 shrink-0 rounded-2xl border border-border bg-card p-2">
                <Link to={"/shop/product/$productId" as never} params={{ productId: p.id } as never}>
                  <Photo name={p.photos[0]} alt={p.name} className="h-36 rounded-xl" />
                  <div className="mt-2 flex flex-wrap gap-1">{p.badge === "beginner" && <Badge tone="red">Best for beginners</Badge>}{p.badge === "staff" && <Badge tone="teal">Staff pick</Badge>}<SampleMark /></div>
                  <h3 className="mt-2 text-[15px] font-semibold leading-tight">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{p.summary}</p>
                  <div className="mt-2"><Price value={p.price} /></div>
                </Link>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  <Button onClick={() => app.addToCart(p.id, "")}>Add to Cart</Button>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-3"><SafetyNote /></div>
        </section>

        <section>
          <SectionTitle eyebrow="Learn" title="Recommended Courses" action={<Link to={"/courses" as never} className="text-[13px] font-semibold text-[var(--secondary-ink)]">All courses</Link>} />
          <div className="space-y-3">
            {COURSES.slice(0, 3).map((c) => {
              const owned = app.entitlements.some((e) => e.userId === app.user?.id && e.courseId === c.id && e.status === "active");
              return (
                <Link key={c.id} to={"/courses/$courseId" as never} params={{ courseId: c.id } as never} className="flex gap-3 rounded-2xl border border-border bg-card p-2">
                  <Photo name={c.photo} alt="" className="h-20 w-24 rounded-xl" />
                  <div className="min-w-0 py-1">
                    <div className="flex flex-wrap gap-1"><SampleMark />{owned ? <Badge tone="teal">Unlocked</Badge> : <Badge>Locked</Badge>}</div>
                    <p className="mt-1 font-semibold leading-tight">{c.title}</p>
                    <p className="text-[12px] text-muted-foreground">{c.level} · {money(c.price)} sample</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <Photo name="merchBanner" alt="Blank black work apparel folded on a steel bench" className="h-40" />
          <div className="p-4">
            <Eyebrow>Merchandise</Eyebrow>
            <h2 className="display mt-1 text-3xl">Wear your work ethic.</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {["T-Shirts", "Hoodies", "Hats", "Accessories"].map((label) => <Chip key={label} onClick={() => nav({ to: "/shop" as never })}>{label}</Chip>)}
            </div>
            <Button className="mt-4" full onClick={() => nav({ to: "/shop" as never })}>Shop All Merchandise</Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <Photo name="prize" alt="Welding setup arranged as a prize on a workbench" className="h-44" />
          <div className="space-y-3 p-4">
            <SampleMark />
            <h2 className="display text-3xl">{giveaway.summary}</h2>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{giveaway.prize}</p>
            <p className="text-[13px] text-muted-foreground">Entry deadline {new Date(giveaway.deadline).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}. {giveaway.eligibility}</p>
            <Button full onClick={() => nav({ to: "/giveaways/$giveawayId" as never, params: { giveawayId: giveaway.id } as never })}>Enter Giveaway</Button>
            <Button full variant="secondary" onClick={() => nav({ to: "/giveaways" as never })}>View All Giveaways</Button>
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="From the floor" title="Past Projects & Winners" />
          <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
            {["All", "Fabrication Projects", "Laser-Cut Designs", "Past Giveaways & Winners"].map((c) => <Chip key={c} active={chip === c} onClick={() => setChip(c)}>{c}</Chip>)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {filtered.slice(0, 6).map((g) => (
              <Link key={g.id} to={"/gallery/$projectId" as never} params={{ projectId: g.id } as never} className="overflow-hidden rounded-xl">
                <Photo name={g.photo} alt={g.title} className="aspect-square" />
              </Link>
            ))}
          </div>
          <Button className="mt-3" full variant="secondary" onClick={() => nav({ to: "/gallery" as never })}>Explore the Gallery</Button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <Photo name="bible" alt="Open book on a rustic workbench beside cut steel" className="mb-3 h-36 rounded-xl" />
          <h2 className="display text-3xl">Share a Bible. Share the Word.</h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">Offer a Bible you can spare, or ask for one. The shop keeps the exchange personal.</p>
          <div className="mt-3 grid gap-2">
            <Button onClick={() => nav({ to: "/bible/offer" as never })}>Offer a Bible</Button>
            <Button variant="secondary" onClick={() => nav({ to: "/bible/request" as never })}>Request a Bible</Button>
            <Button variant="ghost" onClick={() => nav({ to: "/bible/how" as never })}>How it Works</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4">
          <Eyebrow>{new Date(today.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</Eyebrow>
          <h2 className="display mt-1 text-3xl">{today.title}</h2>
          <p className="mt-1 text-[13px] text-[var(--secondary-ink)]">{today.reference}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{today.reflection}</p>
          <div className="mt-3 grid gap-2">
            <Button onClick={() => nav({ to: "/devotionals/$devotionalId" as never, params: { devotionalId: today.id } as never })}>Read Today's Devotional</Button>
            <Button variant="secondary" onClick={() => nav({ to: "/devotionals" as never })}>Explore All Devotionals</Button>
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Updates" title="Sparks, projects & shop updates" />
          <div className="grid grid-cols-4 gap-2">
            {shots.map((s) => <Photo key={s.photo} name={s.photo} alt={s.alt} className="aspect-square rounded-xl" />)}
          </div>
          <a href={SHOP.website} target="_blank" rel="noreferrer" className="mt-3 flex h-11 items-center justify-center rounded-xl border border-[var(--secondary-ink)] text-[15px] font-semibold text-[var(--secondary-ink)]">
            Visit the shop site
          </a>
          <p className="mt-2 text-[12px] text-muted-foreground">A Facebook page URL was not confirmed, so this opens angryanvil.store.</p>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border">
          <div className="relative h-28">
            <img src={asset(PHOTOS.newsletter)} alt="" className="h-full w-full object-cover" />
          </div>
          <form
            className="space-y-3 bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setEmailError("Enter a valid email.");
                return;
              }
              if (!consent) {
                setEmailError("Confirm you want shop updates.");
                return;
              }
              setEmailError("");
              app.subscribeNewsletter(email);
            }}
          >
            <h2 className="display text-3xl">Stay in the loop.</h2>
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" error={emailError} />
            <label className="flex items-start gap-2 text-[13px] text-muted-foreground">
              <input type="checkbox" className="mt-1 h-4 w-4" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              Send me shop updates by email. This SAMPLE form stays on this device.
            </label>
            <Button type="submit" full>Get Shop Updates</Button>
            {app.newsletterEmail && <p className="text-[13px] text-success">Saved for {app.newsletterEmail}.</p>}
          </form>
        </section>
      </div>
    </Screen>
  );
}

function IconLink({ to, label, children }: { to: string; label: string; children: React.ReactNode }) {
  return (
    <Link to={to as never} aria-label={label} className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card">
      {children}
    </Link>
  );
}

export function Missing({ title }: { title: string }) {
  return <Screen><EmptyState title={title} body="That page is not in the sample catalog." action={<Link to="/" className="text-[var(--secondary-ink)]">Back home</Link>} /></Screen>;
}
