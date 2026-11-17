import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BIBLE_STEPS, DEVOTIONALS, GALLERY, GIVEAWAYS, RULES_PLACEHOLDER } from "@/lib/sample-data";
import { useApp } from "@/lib/store";
import { Badge, Button, Chip, EmptyState, Field, Header, Photo, SampleMark, Screen, TextArea } from "@/components/ui-kit";

export function GiveawaysScreen() {
  const app = useApp();
  const mine = app.entries.filter((e) => e.userId === app.user?.id);
  return (
    <Screen>
      <Header title="Giveaways" right={<Link to={"/giveaways/rules" as never} className="text-[12px] font-semibold text-[var(--secondary-ink)]">Rules</Link>} />
      <div className="space-y-4 px-4 py-4">
        {GIVEAWAYS.map((g) => (
          <Link key={g.id} to={"/giveaways/$giveawayId" as never} params={{ giveawayId: g.id } as never} className="block overflow-hidden rounded-2xl border border-border bg-card">
            <Photo name={g.photo} alt={g.title} className="h-40" />
            <div className="p-3">
              <SampleMark />
              <h2 className="display mt-2 text-2xl">{g.title}</h2>
              <p className="text-[13px] text-muted-foreground">{g.summary}</p>
            </div>
          </Link>
        ))}
        <h2 className="display text-xl">My entries</h2>
        {mine.length === 0 ? <p className="text-[14px] text-muted-foreground">No SAMPLE entries yet.</p> : mine.map((e) => <p key={e.id} className="text-[14px]">Entered · {GIVEAWAYS.find((g) => g.id === e.giveawayId)?.title}</p>)}
      </div>
    </Screen>
  );
}

export function GiveawayDetail({ id }: { id: string }) {
  const g = GIVEAWAYS.find((x) => x.id === id);
  const app = useApp();
  const [consent, setConsent] = useState(false);
  const [rules, setRules] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!g) return <Screen><Header title="Giveaway" /><EmptyState title="Not found" body="That giveaway is not in the sample list." /></Screen>;
  const remaining = new Date(g.deadline).getTime() - now;
  const closed = remaining <= 0;
  const entered = app.entries.some((e) => e.userId === app.user?.id && e.giveawayId === g.id);
  const parts = remaining > 0 ? { d: Math.floor(remaining / 86400000), h: Math.floor((remaining / 3600000) % 24), m: Math.floor((remaining / 60000) % 60), s: Math.floor((remaining / 1000) % 60) } : null;
  return (
    <Screen>
      <Header title={g.title} />
      <div className="space-y-3 px-4 py-4">
        <Photo name={g.photo} alt={g.title} className="h-48 rounded-2xl" />
        <SampleMark />
        <p className="text-[15px] leading-relaxed">{g.prize}</p>
        <p className="text-[13px] text-muted-foreground">{g.eligibility}</p>
        {parts ? <p className="display text-2xl">{parts.d}d {parts.h}h {parts.m}m {parts.s}s</p> : <Badge tone="red">Entry closed</Badge>}
        <ol className="list-decimal space-y-1 pl-5 text-[14px] text-muted-foreground">{g.how.map((h) => <li key={h}>{h}</li>)}</ol>
        {entered && <p className="text-[14px] text-success">Already entered. This SAMPLE entry is stored on the device.</p>}
        {!closed && !entered && (
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); const result = app.enterGiveaway(g.id, consent, rules); if (!result.ok && result.reason !== "auth") setError(result.reason); if (result.ok) setError(""); }}>
            <label className="flex gap-2 text-[13px]"><input type="checkbox" checked={consent} onChange={(ev) => setConsent(ev.target.checked)} /> I agree to be contacted about this SAMPLE entry.</label>
            <label className="flex gap-2 text-[13px]"><input type="checkbox" checked={rules} onChange={(ev) => setRules(ev.target.checked)} /> I accept the placeholder official rules.</label>
            {error && <p className="text-[13px] text-destructive">{error}</p>}
            <Button type="submit" full>Enter giveaway</Button>
          </form>
        )}
        <Link to={"/giveaways/rules" as never} className="block text-[13px] text-[var(--secondary-ink)]">Official rules placeholder</Link>
        <Link to={"/gallery" as never} className="block text-[13px] text-[var(--secondary-ink)]">Past winners in the gallery</Link>
      </div>
    </Screen>
  );
}

export function RulesScreen() {
  return (
    <Screen>
      <Header title="Official rules" />
      <div className="space-y-3 px-4 py-4">
        {RULES_PLACEHOLDER.map((p) => <p key={p} className="text-[15px] leading-relaxed">{p}</p>)}
      </div>
    </Screen>
  );
}

export function GalleryScreen() {
  const [chip, setChip] = useState("All");
  const items = GALLERY.filter((g) => chip === "All" || (chip === "Fabrication Projects" && g.category === "fabrication") || (chip === "Laser-Cut Designs" && g.category === "laser") || (chip === "Past Giveaways & Winners" && g.category === "winners"));
  return (
    <Screen>
      <Header title="Gallery" subtitle="Past projects and winners" />
      <div className="px-4 py-4">
        <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
          {["All", "Fabrication Projects", "Laser-Cut Designs", "Past Giveaways & Winners"].map((c) => <Chip key={c} active={chip === c} onClick={() => setChip(c)}>{c}</Chip>)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {items.map((g) => (
            <Link key={g.id} to={"/gallery/$projectId" as never} params={{ projectId: g.id } as never} className="overflow-hidden rounded-xl border border-border">
              <Photo name={g.photo} alt={g.title} className="aspect-square" />
              <p className="p-2 text-[12px] font-medium">{g.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </Screen>
  );
}

export function ProjectDetail({ id }: { id: string }) {
  const project = GALLERY.find((g) => g.id === id);
  const [scale, setScale] = useState(1);
  if (!project) return <Screen><Header title="Project" /><EmptyState title="Not in the gallery" body="That photo is not in the sample set." /></Screen>;
  const share = async () => {
    const text = `${project.title} — Angry Anvil Fabrication`;
    if (navigator.share) await navigator.share({ title: project.title, text }).catch(() => undefined);
    else {
      await navigator.clipboard.writeText(text);
    }
  };
  return (
    <Screen>
      <Header title={project.title} right={<button type="button" className="text-[13px] font-semibold text-[var(--secondary-ink)]" onClick={() => void share()}>Share</button>} />
      <div className="space-y-3 px-4 py-4">
        <div className="overflow-auto rounded-2xl">
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <Photo name={project.photo} alt={project.title} className="w-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setScale((s) => Math.min(2.4, s + 0.2))}>Zoom in</Button>
          <Button variant="ghost" onClick={() => setScale(1)}>Reset</Button>
        </div>
        <Badge>{project.category === "fabrication" ? "Fabrication" : project.category === "laser" ? "Laser-cut" : "Giveaway"}</Badge>
        <p className="text-[15px] leading-relaxed">{project.description}</p>
        <p className="text-[13px] text-muted-foreground">{project.materials}</p>
      </div>
    </Screen>
  );
}

export function BibleHome() {
  const nav = useNavigate();
  return (
    <Screen>
      <Header title="Bible Exchange" />
      <div className="space-y-3 px-4 py-4">
        <Photo name="bible" alt="Open book on a workbench" className="h-44 rounded-2xl" />
        <h2 className="display text-3xl">Share a Bible. Share the Word.</h2>
        <p className="text-[15px] leading-relaxed text-muted-foreground">If you have a Bible to pass on, or you need one, tell the shop. The tone here is simple on purpose.</p>
        <Button full onClick={() => nav({ to: "/bible/offer" as never })}>Offer a Bible</Button>
        <Button full variant="secondary" onClick={() => nav({ to: "/bible/request" as never })}>Request a Bible</Button>
        <Button full variant="ghost" onClick={() => nav({ to: "/bible/how" as never })}>How it Works</Button>
      </div>
    </Screen>
  );
}

export function BibleHow() {
  return (
    <Screen>
      <Header title="How it works" />
      <div className="space-y-3 px-4 py-4">
        <SampleMark />
        <p className="text-[14px] text-muted-foreground">SAMPLE steps. Exchange policies are not final and are not invented here.</p>
        <ol className="list-decimal space-y-2 pl-5 text-[15px]">{BIBLE_STEPS.map((s) => <li key={s}>{s}</li>)}</ol>
      </div>
    </Screen>
  );
}

export function BibleOffer() {
  const app = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", contact: "", translation: "KJV", condition: "Good", quantity: "1", preference: "Pickup", notes: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  if (done) return <Screen><Header title="Offer sent" /><div className="px-4 py-8"><h2 className="display text-3xl">Thank you.</h2><p className="mt-2 text-[15px] text-muted-foreground">The SAMPLE offer is saved on this device. The shop has not received it yet.</p><Button className="mt-4" onClick={() => nav({ to: "/profile/community" as never })}>My offers</Button></div></Screen>;
  return (
    <Screen>
      <Header title="Offer a Bible" />
      <form className="space-y-3 px-4 py-4" onSubmit={(e) => { e.preventDefault(); if (form.name.trim().length < 2 || form.contact.trim().length < 3) { setError("Name and a way to reach you are required."); return; } const result = app.createOffer(form); if (result.ok) setDone(true); else if (result.reason !== "auth") setError(result.reason); }}>
        <Field label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Field label="Contact" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
        <Field label="Translation" value={form.translation} onChange={(e) => set("translation", e.target.value)} />
        <Field label="Condition" value={form.condition} onChange={(e) => set("condition", e.target.value)} />
        <Field label="Quantity" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
        <Field label="Shipping or pickup" value={form.preference} onChange={(e) => set("preference", e.target.value)} />
        <TextArea label="Notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        {error && <p className="text-[13px] text-destructive">{error}</p>}
        <Button type="submit" full>Submit offer</Button>
      </form>
    </Screen>
  );
}

export function BibleRequest() {
  const app = useApp();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", contact: "", translation: "KJV", address: "", notes: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  if (done) return <Screen><Header title="Request sent" /><div className="px-4 py-8"><h2 className="display text-3xl">We have your note.</h2><p className="mt-2 text-[15px] text-muted-foreground">SAMPLE request, saved on this device only.</p><Button className="mt-4" onClick={() => nav({ to: "/profile/community" as never })}>My requests</Button></div></Screen>;
  return (
    <Screen>
      <Header title="Request a Bible" />
      <form className="space-y-3 px-4 py-4" onSubmit={(e) => { e.preventDefault(); if (form.name.trim().length < 2 || form.contact.trim().length < 3 || form.address.trim().length < 4) { setError("Name, contact, and an address are required."); return; } const result = app.createRequest(form); if (result.ok) setDone(true); else if (result.reason !== "auth") setError(result.reason); }}>
        <Field label="Name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Field label="Contact" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
        <Field label="Preferred translation" value={form.translation} onChange={(e) => set("translation", e.target.value)} />
        <TextArea label="Shipping address" value={form.address} onChange={(e) => set("address", e.target.value)} />
        <TextArea label="Optional note" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
        {error && <p className="text-[13px] text-destructive">{error}</p>}
        <Button type="submit" full>Submit request</Button>
      </form>
    </Screen>
  );
}

export function DevotionalList() {
  const app = useApp();
  const [q, setQ] = useState("");
  const rows = useMemo(() => DEVOTIONALS.filter((d) => `${d.title} ${d.reference}`.toLowerCase().includes(q.toLowerCase())), [q]);
  return (
    <Screen>
      <Header title="Devotionals" />
      <div className="space-y-3 px-4 py-4">
        <Photo name="devotional" alt="Quiet workshop morning light" className="h-36 rounded-2xl" />
        <Field label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <label className="flex items-center justify-between text-[14px]">
          Daily reminder on this device
          <input type="checkbox" checked={app.devotionalReminder} onChange={() => app.toggleReminder()} className="h-5 w-5" />
        </label>
        {rows.length === 0 ? <EmptyState title="No readings" body="Try another word." /> : rows.map((d) => (
          <Link key={d.id} to={"/devotionals/$devotionalId" as never} params={{ devotionalId: d.id } as never} className="block rounded-2xl border border-border bg-card p-3">
            <p className="text-[12px] text-[var(--secondary-ink)]">{d.date}</p>
            <p className="font-semibold">{d.title}</p>
            <p className="text-[12px] text-muted-foreground">{d.reference}</p>
          </Link>
        ))}
        <p className="text-[12px] text-muted-foreground">Scripture is King James Version, public domain. Reflections are SAMPLE.</p>
      </div>
    </Screen>
  );
}

export function DevotionalDetail({ id }: { id: string }) {
  const d = DEVOTIONALS.find((x) => x.id === id);
  const app = useApp();
  if (!d) return <Screen><Header title="Devotional" /><EmptyState title="Not found" body="That reading is not in the sample set." /></Screen>;
  const saved = app.savedDevotionals.includes(d.id);
  const share = async () => {
    const text = `${d.title} — ${d.reference}`;
    if (navigator.share) await navigator.share({ title: d.title, text }).catch(() => undefined);
    else await navigator.clipboard.writeText(`${text}\n${d.scripture}`);
  };
  return (
    <Screen>
      <Header title={d.title} />
      <article className="space-y-3 px-4 py-4">
        <Photo name="devotional" alt="" className="h-36 rounded-2xl" />
        <p className="text-[13px] text-[var(--secondary-ink)]">{new Date(d.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
        <h2 className="display text-3xl">{d.reference}</h2>
        <blockquote className="text-[17px] leading-relaxed">{d.scripture}</blockquote>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{d.reflection}</p>
        <SampleMark />
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => app.toggleSavedDevotional(d.id)}>{saved ? "Saved" : "Save"}</Button>
          <Button variant="ghost" onClick={() => void share()}>Share</Button>
        </div>
      </article>
    </Screen>
  );
}

