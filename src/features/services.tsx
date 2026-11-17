import { Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BUDGETS, HELPFUL_DETAILS, PROCESS, PROJECT_TYPES, SERVICES, TIMELINES, TIME_SLOTS, getService } from "@/lib/sample-data";
import { useApp, type Booking } from "@/lib/store";
import { Badge, Button, Chip, EmptyState, ErrorBlock, Field, Header, LoadBlock, Photo, SampleMark, Screen, SelectField, TextArea, useScreenLoad } from "@/components/ui-kit";

export function ServicesHome() {
  const load = useScreenLoad("services");
  const [q, setQ] = useState("");
  const list = useMemo(() => SERVICES.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()) || s.summary.toLowerCase().includes(q.toLowerCase())), [q]);
  if (load.loading) return <Screen><Header title="Services" back={false} /><LoadBlock /></Screen>;
  if (load.error) return <Screen><Header title="Services" back={false} /><ErrorBlock onRetry={load.retry} /></Screen>;
  return (
    <Screen>
      <Header title="Services" subtitle="Custom fabrication" back={false} />
      <div className="space-y-4 px-4 py-4">
        <Field label="Search services" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Laser, frames, gifts" />
        {list.length === 0 && <EmptyState title="No matching service" body="Try a shorter word, or start an inquiry and describe the job." />}
        {list.map((s) => (
          <Link key={s.id} to={"/services/$serviceId" as never} params={{ serviceId: s.id } as never} className="block overflow-hidden rounded-2xl border border-border bg-card">
            <Photo name={s.photo} alt={s.title} className="h-40" />
            <div className="p-3">
              <SampleMark />
              <h2 className="display mt-2 text-2xl">{s.title}</h2>
              <p className="mt-1 text-[14px] text-muted-foreground">{s.summary}</p>
            </div>
          </Link>
        ))}
        <div className="grid gap-2">
          <Link to={"/services/inquire" as never} className="display flex h-11 items-center justify-center rounded-xl bg-primary text-white">Start a Project Inquiry</Link>
          <Link to={"/services/book" as never} className="display flex h-11 items-center justify-center rounded-xl border border-[var(--secondary-ink)] text-[var(--secondary-ink)]">Book a Consultation</Link>
          <Link to={"/services/bookings" as never} className="text-center text-[13px] font-semibold text-[var(--secondary-ink)]">My inquiries</Link>
        </div>
        <ol className="space-y-3">
          {PROCESS.map((step) => (
            <li key={step.n} className="rounded-2xl border border-border bg-card p-3">
              <p className="display text-primary">{step.n}</p>
              <p className="font-semibold">{step.title}</p>
              <p className="text-[13px] text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Screen>
  );
}

export function ServiceDetail({ serviceId }: { serviceId: string }) {
  const service = getService(serviceId);
  const nav = useNavigate();
  if (!service) return <Screen><Header title="Service" /><EmptyState title="Unknown service" body="Pick one of the three shop services." /></Screen>;
  const related = SERVICES.filter((s) => s.id !== service.id);
  return (
    <Screen>
      <Header title={service.title} />
      <div className="space-y-4 px-4 py-4">
        <Photo name={service.photo} alt={service.title} className="h-52 rounded-2xl" />
        <div className="flex gap-2">{service.gallery.map((p) => <Photo key={p} name={p} alt="" className="h-16 w-16 rounded-lg" />)}</div>
        <p className="text-[15px] leading-relaxed">{service.description}</p>
        <h2 className="display text-xl">What's included</h2>
        <ul className="list-disc space-y-1 pl-5 text-[14px] text-muted-foreground">{service.included.map((i) => <li key={i}>{i}</li>)}</ul>
        <h2 className="display text-xl">Ideal for</h2>
        <ul className="list-disc space-y-1 pl-5 text-[14px] text-muted-foreground">{service.ideal.map((i) => <li key={i}>{i}</li>)}</ul>
        <h2 className="display text-xl">Example projects</h2>
        <Link to={"/gallery" as never} className="text-[14px] text-[var(--secondary-ink)]">See these in the gallery</Link>
        <h2 className="display text-xl">Process</h2>
        {PROCESS.map((step) => <p key={step.n} className="text-[14px]"><span className="text-primary">{step.n}</span> {step.title} — {step.body}</p>)}
        <h2 className="display text-xl">FAQs</h2>
        {service.faqs.map((f) => (
          <details key={f.q} className="rounded-xl border border-border bg-card p-3">
            <summary className="cursor-pointer font-semibold">{f.q}</summary>
            <p className="mt-2 text-[14px] text-muted-foreground">{f.a}</p>
          </details>
        ))}
        <h2 className="display text-xl">Related</h2>
        {related.map((s) => <Link key={s.id} to={"/services/$serviceId" as never} params={{ serviceId: s.id } as never} className="block text-[14px] text-[var(--secondary-ink)]">{s.title}</Link>)}
        <Button full onClick={() => nav({ to: "/services/inquire" as never, search: { service: service.id } as never })}>Start a Project Inquiry</Button>
      </div>
    </Screen>
  );
}

function useInquiryForm(kind: Booking["kind"]) {
  const app = useApp();
  const [form, setForm] = useState({ name: app.user ? `${app.user.firstName} ${app.user.lastName}` : "", email: app.user?.email ?? "", projectType: PROJECT_TYPES[0], budget: BUDGETS[4], timeline: TIMELINES[3], notes: "", date: "", time: TIME_SLOTS[0], attachmentName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));
  const submit = (serviceId: string) => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.projectType) next.projectType = "Choose a project type.";
    if (form.notes.trim().length < 8) next.notes = "Tell us about the idea.";
    if (kind === "consultation" && !form.date) next.date = "Pick a date.";
    setErrors(next);
    if (Object.keys(next).length) return null;
    setBusy(true);
    const result = app.createBooking({
      serviceId,
      kind,
      projectType: form.projectType,
      budget: form.budget,
      timeline: form.timeline,
      notes: form.notes.trim(),
      attachmentName: form.attachmentName || undefined,
      date: kind === "consultation" ? form.date : undefined,
      time: kind === "consultation" ? form.time : undefined,
      name: form.name.trim(),
      email: form.email.trim(),
    });
    setBusy(false);
    return result;
  };
  return { form, set, errors, busy, submit };
}

export function InquireScreen({ serviceId }: { serviceId?: string }) {
  const nav = useNavigate();
  const form = useInquiryForm("inquiry");
  const service = serviceId ? getService(serviceId) : undefined;
  return (
    <Screen>
      <Header title="Project inquiry" subtitle={service?.title ?? "Custom work"} />
      <form className="space-y-3 px-4 py-4" onSubmit={(e) => { e.preventDefault(); const result = form.submit(service?.id ?? "custom-metal"); if (result && result.ok) nav({ to: "/services/bookings/$bookingId" as never, params: { bookingId: result.id } as never }); }}>
        <p className="text-[13px] text-muted-foreground">No fixed price. Scope, pricing and timing are confirmed together.</p>
        <Field label="Name" value={form.form.name} onChange={(e) => form.set("name", e.target.value)} error={form.errors.name} />
        <Field label="Email" type="email" value={form.form.email} onChange={(e) => form.set("email", e.target.value)} error={form.errors.email} />
        <SelectField label="Project type" value={form.form.projectType} onChange={(e) => form.set("projectType", e.target.value)} error={form.errors.projectType}>
          {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </SelectField>
        <SelectField label="Approximate budget" value={form.form.budget} onChange={(e) => form.set("budget", e.target.value)}>
          {BUDGETS.map((t) => <option key={t}>{t}</option>)}
        </SelectField>
        <SelectField label="Ideal timeline" value={form.form.timeline} onChange={(e) => form.set("timeline", e.target.value)}>
          {TIMELINES.map((t) => <option key={t}>{t}</option>)}
        </SelectField>
        <TextArea label="Tell us about your idea" value={form.form.notes} onChange={(e) => form.set("notes", e.target.value)} error={form.errors.notes} />
        <label className="block text-[13px] font-medium">Reference photo or sketch
          <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-[13px]" onChange={(e) => form.set("attachmentName", e.target.files?.[0]?.name ?? "")} />
        </label>
        {form.form.attachmentName && <p className="text-[12px] text-muted-foreground">Attached: {form.form.attachmentName}</p>}
        <div>
          <p className="text-[13px] font-semibold">Helpful details to include</p>
          <ul className="mt-1 list-disc pl-5 text-[13px] text-muted-foreground">{HELPFUL_DETAILS.map((d) => <li key={d}>{d}</li>)}</ul>
        </div>
        <p className="text-[12px] text-muted-foreground">By submitting, you agree to be contacted about your project.</p>
        <Button type="submit" full loading={form.busy}>Submit inquiry</Button>
      </form>
    </Screen>
  );
}

export function BookScreen() {
  const nav = useNavigate();
  const form = useInquiryForm("consultation");
  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  return (
    <Screen>
      <Header title="Book a consultation" />
      <form className="space-y-3 px-4 py-4" onSubmit={(e) => { e.preventDefault(); const result = form.submit(serviceId); if (result && result.ok) nav({ to: "/services/bookings/$bookingId" as never, params: { bookingId: result.id } as never, search: { confirmed: "1" } as never }); }}>
        <SelectField label="Service" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
          {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
        </SelectField>
        <Field label="Name" value={form.form.name} onChange={(e) => form.set("name", e.target.value)} error={form.errors.name} />
        <Field label="Email" type="email" value={form.form.email} onChange={(e) => form.set("email", e.target.value)} error={form.errors.email} />
        <Field label="Date" type="date" value={form.form.date} onChange={(e) => form.set("date", e.target.value)} error={form.errors.date} />
        <p className="text-[13px] font-medium">Time</p>
        <div className="flex flex-wrap gap-2">{TIME_SLOTS.map((slot) => <Chip key={slot} active={form.form.time === slot} onClick={() => form.set("time", slot)}>{slot}</Chip>)}</div>
        <SelectField label="Project type" value={form.form.projectType} onChange={(e) => form.set("projectType", e.target.value)}>
          {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
        </SelectField>
        <TextArea label="Notes" value={form.form.notes} onChange={(e) => form.set("notes", e.target.value)} error={form.errors.notes} />
        <p className="text-[13px] text-muted-foreground">Scope, pricing and timing are confirmed together. The slot is a request until the shop accepts it.</p>
        <Button type="submit" full>Request this time</Button>
      </form>
    </Screen>
  );
}

export function BookingsScreen() {
  const app = useApp();
  const rows = app.bookings.filter((b) => b.userId === app.user?.id);
  return (
    <Screen>
      <Header title="My inquiries" />
      {!app.authed ? <EmptyState title="Sign in to see inquiries" body="Project notes stay with your account." action={<Button onClick={() => app.openAuth("Sign in to see your inquiries.")}>Sign in</Button>} /> : rows.length === 0 ? <EmptyState title="No inquiries yet" body="Tell the shop what you want made." action={<Link to={"/services/inquire" as never} className="text-[var(--secondary-ink)]">Start an inquiry</Link>} /> : (
        <ul className="space-y-2 px-4 py-4">
          {rows.map((b) => (
            <li key={b.id}><Link to={"/services/bookings/$bookingId" as never} params={{ bookingId: b.id } as never} className="block rounded-2xl border border-border bg-card p-3"><div className="flex justify-between gap-2"><span className="font-semibold">{b.projectType}</span><Badge>{b.status === "Ready" ? "Ready / Completed" : b.status}</Badge></div><p className="text-[12px] text-muted-foreground">{b.kind === "consultation" ? "Consultation" : "Inquiry"} · {new Date(b.createdAt).toLocaleDateString()}</p></Link></li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function BookingDetail({ bookingId, confirmed }: { bookingId: string; confirmed?: boolean }) {
  const app = useApp();
  const booking = app.bookings.find((b) => b.id === bookingId);
  const [date, setDate] = useState(booking?.date ?? "");
  const [time, setTime] = useState(booking?.time ?? TIME_SLOTS[0]);
  const [icsDone, setIcsDone] = useState(false);
  if (!booking) return <Screen><Header title="Inquiry" /><EmptyState title="Not found" body="That inquiry is not on this device." /></Screen>;
  const locked = booking.status === "Cancelled" || booking.status === "Ready" || booking.status === "In Fabrication";
  const downloadIcs = () => {
    if (!booking.date || !booking.time) return;
    const start = new Date(`${booking.date}T${to24(booking.time)}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const body = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${stamp(start)}\nDTEND:${stamp(end)}\nSUMMARY:Angry Anvil consultation\nEND:VEVENT\nEND:VCALENDAR`;
    const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "angry-anvil-consultation.ics";
    a.click();
    URL.revokeObjectURL(url);
    setIcsDone(true);
  };
  return (
    <Screen>
      <Header title={booking.kind === "consultation" ? "Consultation" : "Inquiry"} />
      <div className="space-y-3 px-4 py-4">
        {confirmed && <p className="rounded-xl border border-success/40 bg-card p-3 text-[14px]">Request received. Scope, pricing and timing are confirmed together.</p>}
        <Badge>{booking.status === "Ready" ? "Ready / Completed" : booking.status}</Badge>
        <p className="text-[15px]">{booking.notes}</p>
        <p className="text-[13px] text-muted-foreground">{booking.projectType} · Budget {booking.budget} · {booking.timeline}</p>
        {booking.date && <p className="text-[14px]">{booking.date} · {booking.time}</p>}
        {booking.attachmentName && <p className="text-[13px]">File: {booking.attachmentName}</p>}
        <p className="text-[13px] text-muted-foreground">Scope, pricing and timing are confirmed together. This screen does not show a price.</p>
        {booking.kind === "consultation" && booking.date && <Button variant="secondary" onClick={downloadIcs}>{icsDone ? "Calendar file saved" : "Add to calendar"}</Button>}
        {!locked && booking.kind === "consultation" && (
          <div className="space-y-2 rounded-2xl border border-border p-3">
            <p className="font-semibold">Reschedule</p>
            <Field label="New date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <div className="flex flex-wrap gap-2">{TIME_SLOTS.map((slot) => <Chip key={slot} active={time === slot} onClick={() => setTime(slot)}>{slot}</Chip>)}</div>
            <Button onClick={() => date && app.rescheduleBooking(booking.id, date, time)} disabled={!date}>Update time</Button>
          </div>
        )}
        {!locked && <Button variant="ghost" onClick={() => app.cancelBooking(booking.id)}>Cancel</Button>}
      </div>
    </Screen>
  );
}

function to24(label: string) {
  const [time, mer] = label.split(" ");
  const [h, m] = time.split(":").map(Number);
  const hour = mer === "PM" && h !== 12 ? h + 12 : mer === "AM" && h === 12 ? 0 : h;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}
