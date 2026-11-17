import { Link, useNavigate } from "@tanstack/react-router";
import { FileText, Lock, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { COURSES, courseLessons, findLesson, getCourse, money } from "@/lib/sample-data";
import { PAYMENT_NOTICE, mediaForLesson } from "@/lib/services";
import { useApp } from "@/lib/store";
import { Badge, Button, Chip, EmptyState, ErrorBlock, Field, Header, LoadBlock, Photo, SampleMark, Screen, SelectField, useScreenLoad } from "@/components/ui-kit";

function entitled(app: ReturnType<typeof useApp>, courseId: string) {
  return app.entitlements.some((e) => e.userId === app.user?.id && e.courseId === courseId && e.status === "active");
}

export function CoursesHome() {
  const app = useApp();
  const load = useScreenLoad("courses");
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("featured");
  const [cat, setCat] = useState("all");
  const categories = ["all", ...new Set(COURSES.map((c) => c.category))];
  const list = useMemo(() => {
    let rows = COURSES.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
    if (level !== "all") rows = rows.filter((c) => c.level === level);
    if (cat !== "all") rows = rows.filter((c) => c.category === cat);
    if (sort === "price-asc") rows = [...rows].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") rows = [...rows].sort((a, b) => b.price - a.price);
    return rows;
  }, [q, level, sort, cat]);
  const mine = COURSES.filter((c) => entitled(app, c.id));
  if (load.loading) return <Screen><Header title="Courses" back={false} /><LoadBlock /></Screen>;
  if (load.error) return <Screen><Header title="Courses" back={false} /><ErrorBlock onRetry={load.retry} /></Screen>;
  return (
    <Screen>
      <Header title="Courses" subtitle="Browse free. Lessons unlock after payment." back={false} right={<Link to={"/courses/my" as never} className="text-[13px] font-semibold text-[var(--secondary-ink)]">My courses</Link>} />
      <div className="space-y-4 px-4 py-4">
        <Field label="Search courses" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {categories.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c === "all" ? "All" : c}</Chip>)}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <SelectField label="Level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">All</option>
            <option>Beginner</option>
            <option>All levels</option>
            <option>Intermediate</option>
          </SelectField>
          <SelectField label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price, low</option>
            <option value="price-desc">Price, high</option>
          </SelectField>
        </div>
        {mine.length > 0 && (
          <section>
            <h2 className="display mb-2 text-xl">Continue learning</h2>
            {mine.map((c) => <CourseRow key={c.id} id={c.id} />)}
          </section>
        )}
        {list.length === 0 ? <EmptyState title="No courses match" body="Clear a filter to see the SAMPLE catalog." /> : list.map((c) => <CourseRow key={c.id} id={c.id} />)}
      </div>
    </Screen>
  );
}

function CourseRow({ id }: { id: string }) {
  const app = useApp();
  const course = getCourse(id)!;
  const owned = entitled(app, course.id);
  const preview = courseLessons(course).some((l) => l.freePreview);
  return (
    <Link to={"/courses/$courseId" as never} params={{ courseId: course.id } as never} className="mb-3 flex gap-3 rounded-2xl border border-border bg-card p-2">
      <Photo name={course.photo} alt={course.title} className="h-24 w-28 rounded-xl" />
      <div>
        <div className="flex flex-wrap gap-1"><SampleMark />{preview && <Badge tone="teal">Free preview</Badge>}{owned ? <Badge tone="teal">Unlocked</Badge> : <Badge>Locked</Badge>}</div>
        <p className="mt-1 font-semibold">{course.title}</p>
        <p className="text-[12px] text-muted-foreground">{course.level} · {money(course.price)} sample</p>
      </div>
    </Link>
  );
}

export function CourseDetail({ courseId }: { courseId: string }) {
  const course = getCourse(courseId);
  const app = useApp();
  const nav = useNavigate();
  if (!course) return <Screen><Header title="Course" /><EmptyState title="Unknown course" body="This SAMPLE catalog has four courses." /></Screen>;
  const owned = entitled(app, course.id);
  return (
    <Screen>
      <Header title={course.title} />
      <div className="space-y-4 px-4 py-4">
        <Photo name={course.photo} alt={course.title} className="h-48 rounded-2xl" />
        <div className="flex flex-wrap gap-1"><SampleMark />{owned ? <Badge tone="teal">Unlocked</Badge> : <Badge>Locked until purchase</Badge>}</div>
        <p className="display text-3xl text-primary">{money(course.price)}</p>
        <p className="text-[12px] text-muted-foreground">Sample price. The client must confirm it. This is not a certification.</p>
        <p className="text-[15px] leading-relaxed">{course.description}</p>
        <p className="text-[13px] text-muted-foreground">{course.instructor}</p>
        <p className="text-[13px] text-muted-foreground">{course.level} · {course.durationLabel}</p>
        <h2 className="display text-xl">What you'll learn</h2>
        <ul className="list-disc pl-5 text-[14px] text-muted-foreground">{course.learn.map((i) => <li key={i}>{i}</li>)}</ul>
        <h2 className="display text-xl">Requirements</h2>
        <ul className="list-disc pl-5 text-[14px] text-muted-foreground">{course.requirements.map((i) => <li key={i}>{i}</li>)}</ul>
        <h2 className="display text-xl">Materials</h2>
        <ul className="list-disc pl-5 text-[14px] text-muted-foreground">{course.materials.map((i) => <li key={i}>{i}</li>)}</ul>
        <h2 className="display text-xl">Curriculum</h2>
        {course.chapters.map((ch) => (
          <div key={ch.id}>
            <p className="font-semibold">{ch.title}</p>
            <ul className="mt-2 space-y-2">
              {ch.lessons.map((lesson) => {
                const open = mediaForLesson(owned, !!lesson.freePreview) === "sample-player";
                return (
                  <li key={lesson.id}>
                    <button type="button" className="flex w-full items-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-left" onClick={() => nav({ to: "/courses/$courseId/lessons/$lessonId" as never, params: { courseId: course.id, lessonId: lesson.id } as never })}>
                      {open ? lesson.kind === "video" ? <Play size={16} /> : <FileText size={16} /> : <Lock size={16} />}
                      <span className="flex-1">
                        <span className="block text-[14px] font-medium">{lesson.title}</span>
                        <span className="text-[12px] text-muted-foreground">{open ? (lesson.freePreview ? "Free preview" : "Unlocked") : "Unlock with purchase"}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <p className="text-[13px] text-muted-foreground">Reviews will show when the client confirms a review source. None are invented here. Certificates are not offered.</p>
        {owned ? <Button full onClick={() => nav({ to: "/courses/my" as never })}>Continue learning</Button> : <Button full onClick={() => nav({ to: "/courses/purchase/$courseId" as never, params: { courseId: course.id } as never })}>Enroll / Buy Course</Button>}
        {owned && <button type="button" className="text-[12px] text-muted-foreground underline" onClick={() => app.revokeEntitlement(course.id)}>SAMPLE: simulate a refund and lock the lessons</button>}
      </div>
    </Screen>
  );
}

export function PurchaseScreen({ courseId }: { courseId: string }) {
  const course = getCourse(courseId);
  const app = useApp();
  const nav = useNavigate();
  const [method, setMethod] = useState("Sample card");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  if (!course) return <Screen><Header title="Purchase" /><EmptyState title="Unknown course" body="Go back to the catalog." /></Screen>;
  if (done) {
    return (
      <Screen>
        <Header title="You're in" back={false} />
        <div className="space-y-3 px-4 py-8">
          <h2 className="display text-4xl">Lessons unlocked.</h2>
          <p className="text-[15px] text-muted-foreground">Access was recorded after the sample confirmation. No restart needed. Nothing was charged.</p>
          <Button full onClick={() => nav({ to: "/courses/$courseId" as never, params: { courseId: course.id } as never })}>Start learning</Button>
        </div>
      </Screen>
    );
  }
  const buy = async (fail = false) => {
    setError("");
    const result = await app.purchaseCourse(course.id, fail);
    if (!result.ok && result.reason !== "auth") setError(result.reason);
    if (result.ok) setDone(true);
  };
  return (
    <Screen>
      <Header title="Buy course" />
      <div className="space-y-3 px-4 py-4">
        <Photo name={course.photo} alt="" className="h-32 rounded-2xl" />
        <h2 className="display text-3xl">{course.title}</h2>
        <p className="display text-3xl text-primary">{money(course.price)}</p>
        <SampleMark />
        <p className="text-[13px] leading-relaxed text-muted-foreground">{PAYMENT_NOTICE}</p>
        <SelectField label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option>Sample card</option>
          <option>Apple Pay (sample confirmation)</option>
        </SelectField>
        <p className="text-[14px]">Order review: {course.title} · {money(course.price)} sample · {method}. Digital access is recorded only after confirmation.</p>
        {app.payState === "processing" && <p className="text-[14px]">Waiting for confirmation…</p>}
        {error && <p className="text-[14px] text-destructive">{error}</p>}
        <Button full loading={app.payState === "processing"} onClick={() => void buy(false)}>Confirm purchase</Button>
        {app.payState === "failed" && <Button variant="secondary" full onClick={() => { app.resetPay(); void buy(false); }}>Retry</Button>}
        <button type="button" className="text-[12px] text-muted-foreground underline" onClick={() => void buy(true)}>Preview a failed payment</button>
      </div>
    </Screen>
  );
}

export function LessonScreen({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { course, lesson } = findLesson(courseId, lessonId);
  const app = useApp();
  const nav = useNavigate();
  const owned = course ? entitled(app, course.id) : false;
  const access = lesson ? mediaForLesson(owned, !!lesson.freePreview) : "locked";
  const key = app.user ? `${app.user.id}:${lessonId}` : "";
  const saved = key ? app.progress[key] : undefined;
  const [position, setPosition] = useState(saved?.position ?? 0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [notes, setNotes] = useState(saved?.notes ?? "");
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!playing || access !== "sample-player" || lesson?.kind !== "video") return;
    const t = setInterval(() => setPosition((p) => Math.min(100, p + speed)), 400);
    return () => clearInterval(t);
  }, [playing, speed, access, lesson?.kind]);

  if (!course || !lesson) return <Screen><Header title="Lesson" /><EmptyState title="Missing lesson" body="That lesson is not in the sample course." /></Screen>;

  if (access === "locked") {
    return (
      <Screen>
        <Header title={lesson.title} />
        <div className="space-y-3 px-4 py-8 text-center">
          <Lock className="mx-auto" />
          <h2 className="display text-3xl">Unlock with purchase</h2>
          <p className="text-[14px] text-muted-foreground">This {lesson.kind === "video" ? "video" : "PDF"} stays locked. No file address is loaded.</p>
          <Button full onClick={() => nav({ to: "/courses/purchase/$courseId" as never, params: { courseId } as never })}>Buy course</Button>
        </div>
      </Screen>
    );
  }

  const lessons = courseLessons(course);
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons[index + 1];

  return (
    <Screen>
      <Header title={lesson.title} subtitle={lesson.freePreview ? "Free preview" : "Unlocked"} />
      <div className={full ? "fixed inset-0 z-50 bg-black p-4" : "space-y-4 px-4 py-4"}>
        {lesson.kind === "video" ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Photo name={course.photo} alt="" className="h-48" />
            <div className="space-y-3 p-3">
              <p className="text-[12px] text-muted-foreground">SAMPLE player. No video URL is shipped. Progress is a timer, not a stream.</p>
              <input aria-label="Seek" type="range" min={0} max={100} value={position} onChange={(e) => setPosition(Number(e.target.value))} className="w-full" />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</Button>
                <SelectField label="Speed" value={String(speed)} onChange={(e) => setSpeed(Number(e.target.value))}>
                  <option value="1">1×</option>
                  <option value="1.5">1.5×</option>
                  <option value="2">2×</option>
                </SelectField>
                <Button variant="secondary" onClick={() => setFull((f) => !f)}>{full ? "Exit full screen" : "Full screen"}</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-4" style={{ fontSize: `${zoom}rem` }}>
            <p className="text-[12px] text-muted-foreground">SAMPLE PDF viewer. Download stays off until the client allows it. No file URL is exposed.</p>
            <h2 className="display mt-3 text-2xl">Page {page} of 2</h2>
            <p className="mt-2 leading-relaxed">{page === 1 ? lesson.notes : "Second SAMPLE page. This is practice copy, not a shop drawing or a certified manual."}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" onClick={() => setPage(1)} disabled={page === 1}>Previous</Button>
              <Button variant="secondary" onClick={() => setPage(2)} disabled={page === 2}>Next</Button>
              <Button variant="ghost" onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}>Zoom in</Button>
            </div>
            <button type="button" disabled className="mt-3 text-[13px] text-dim">Download unavailable</button>
          </div>
        )}
        {!full && (
          <>
            <Field label="Lesson notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <Button variant="secondary" onClick={() => app.user && app.setLessonProgress(lesson.id, { notes, position, complete: saved?.complete ?? false })}>Save notes</Button>
            <Button onClick={() => { app.setLessonProgress(lesson.id, { complete: true, position: 100, notes }); }}>{saved?.complete ? "Completed" : "Mark complete"}</Button>
            {next && <Button variant="ghost" onClick={() => nav({ to: "/courses/$courseId/lessons/$lessonId" as never, params: { courseId, lessonId: next.id } as never })}>Next lesson</Button>}
          </>
        )}
      </div>
    </Screen>
  );
}

export function MyCourses() {
  const app = useApp();
  const [tab, setTab] = useState<"Purchased" | "In Progress" | "Completed">("Purchased");
  const rows = COURSES.filter((c) => entitled(app, c.id)).map((c) => {
    const lessons = courseLessons(c);
    const done = lessons.filter((l) => app.progress[`${app.user?.id}:${l.id}`]?.complete).length;
    return { c, done, total: lessons.length };
  });
  const shown = rows.filter((r) => {
    if (tab === "Completed") return r.done === r.total && r.total > 0;
    if (tab === "In Progress") return r.done > 0 && r.done < r.total;
    return true;
  });
  return (
    <Screen>
      <Header title="My courses" />
      {!app.authed ? <EmptyState title="Sign in" body="Purchased courses follow your account." action={<Button onClick={() => app.openAuth("Sign in to see your courses.")}>Sign in</Button>} /> : (
        <div className="space-y-3 px-4 py-4">
          <div className="flex gap-2">{(["Purchased", "In Progress", "Completed"] as const).map((t) => <Chip key={t} active={tab === t} onClick={() => setTab(t)}>{t}</Chip>)}</div>
          {shown.length === 0 ? <EmptyState title="Nothing in this tab" body="Buy a SAMPLE course and the lock comes off after confirmation." /> : shown.map((r) => (
            <Link key={r.c.id} to={"/courses/$courseId" as never} params={{ courseId: r.c.id } as never} className="block rounded-2xl border border-border bg-card p-3">
              <p className="font-semibold">{r.c.title}</p>
              <p className="text-[12px] text-muted-foreground">{r.done} of {r.total} lessons complete</p>
              <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${r.total ? (r.done / r.total) * 100 : 0}%` }} /></div>
            </Link>
          ))}
        </div>
      )}
    </Screen>
  );
}
