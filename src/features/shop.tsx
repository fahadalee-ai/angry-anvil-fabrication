import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { CATEGORIES, SAFETY_NOTE, getCatalog, getProduct, money, type CategoryId, type Product } from "@/lib/sample-data";
import { PRINTIFY_NOTICE } from "@/lib/services";
import { useApp } from "@/lib/store";
import { Badge, Button, Chip, EmptyState, ErrorBlock, Field, Header, LoadBlock, Photo, Price, SampleMark, Screen, SelectField, Sheet, TextArea, useScreenLoad } from "@/components/ui-kit";

export type ShopSearch = { cat: "all" | CategoryId };

export function parseShopSearch(search: Record<string, unknown>): ShopSearch {
  const cat = search.cat;
  if (cat === "kits" || cat === "laser" || cat === "merch" || cat === "custom") return { cat };
  return { cat: "all" };
}

export function ShopHome({ search }: { search: ShopSearch }) {
  const load = useScreenLoad("shop");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [avail, setAvail] = useState("all");
  const [badge, setBadge] = useState("all");
  const [filters, setFilters] = useState(false);
  const products = useMemo(() => {
    let list = getCatalog().filter((p) => (search.cat === "all" ? true : p.category === search.cat));
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.summary}`.toLowerCase().includes(s));
    }
    if (avail !== "all") list = list.filter((p) => p.stock === avail);
    if (badge === "beginner") list = list.filter((p) => p.badge === "beginner");
    if (badge === "staff") list = list.filter((p) => p.badge === "staff");
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search.cat, q, sort, avail, badge]);

  if (load.loading) return <Screen><Header title="Shop" back={false} /><LoadBlock /></Screen>;
  if (load.error) return <Screen><Header title="Shop" back={false} /><ErrorBlock onRetry={load.retry} /></Screen>;

  return (
    <Screen>
      <Header title="Shop" subtitle="Kits, cuts, apparel" back={false} right={<button type="button" aria-label="Filters" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border" onClick={() => setFilters(true)}><SlidersHorizontal size={18} /></button>} />
      <div className="space-y-4 px-4 py-4">
        <Field label="Search the shop" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kits, panels, hoodies" />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          <CatLink id="all" label="All" active={search.cat === "all"} />
          {CATEGORIES.map((c) => <CatLink key={c.id} id={c.id} label={c.label} active={search.cat === c.id} />)}
        </div>
        <div className="flex items-center justify-between text-[13px] text-muted-foreground">
          <span>{products.length} items · SAMPLE catalog</span>
          <div className="flex gap-2">
            <Chip active={view === "grid"} onClick={() => setView("grid")}>Grid</Chip>
            <Chip active={view === "list"} onClick={() => setView("list")}>List</Chip>
          </div>
        </div>
        {search.cat === "merch" && <p className="text-[13px] leading-relaxed text-muted-foreground">{PRINTIFY_NOTICE}</p>}
        {products.length === 0 ? (
          <EmptyState title="Nothing in this cut" body="Try another category or clear the filters." />
        ) : (
          <div className={view === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
            {products.map((p) => <ProductCard key={p.id} product={p} wide={view === "list"} />)}
          </div>
        )}
        <p className="text-[13px] text-muted-foreground">{SAFETY_NOTE}</p>
      </div>
      <Sheet open={filters} title="Filter and sort" onClose={() => setFilters(false)}>
        <div className="space-y-3">
          <SelectField label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
            <option value="name">Name</option>
          </SelectField>
          <SelectField label="Availability" value={avail} onChange={(e) => setAvail(e.target.value)}>
            <option value="all">All</option>
            <option value="in_stock">In stock</option>
            <option value="made_to_order">Made to order</option>
          </SelectField>
          <SelectField label="Badge" value={badge} onChange={(e) => setBadge(e.target.value)}>
            <option value="all">All</option>
            <option value="beginner">Best for beginners</option>
            <option value="staff">Staff pick</option>
          </SelectField>
          <Button full onClick={() => setFilters(false)}>Show results</Button>
        </div>
      </Sheet>
    </Screen>
  );
}

function CatLink({ id, label, active }: { id: string; label: string; active: boolean }) {
  return (
    <Link to={"/shop" as never} search={{ cat: id === "all" ? undefined : id } as never} className={`display h-9 shrink-0 rounded-full border px-3 text-[13px] leading-9 ${active ? "border-primary bg-primary text-white" : "border-border"}`}>
      {label}
    </Link>
  );
}

function ProductCard({ product, wide }: { product: Product; wide?: boolean }) {
  const app = useApp();
  return (
    <article className={`rounded-2xl border border-border bg-card p-2 ${wide ? "flex gap-3" : ""}`}>
      <Link to={"/shop/product/$productId" as never} params={{ productId: product.id } as never} className={wide ? "w-28 shrink-0" : ""}>
        <Photo name={product.photos[0]} alt={product.name} className={wide ? "h-28 rounded-xl" : "aspect-square rounded-xl"} />
      </Link>
      <div className="min-w-0 flex-1 p-1">
        <div className="flex flex-wrap gap-1">
          {product.badge === "beginner" && <Badge tone="red">Best for beginners</Badge>}
          {product.badge === "staff" && <Badge tone="teal">Staff pick</Badge>}
          <Badge>{product.stock === "in_stock" ? "In stock" : "Made to order"}</Badge>
          <SampleMark />
        </div>
        <Link to={"/shop/product/$productId" as never} params={{ productId: product.id } as never}>
          <h3 className="mt-1 font-semibold leading-tight">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">{product.summary}</p>
        </Link>
        <div className="mt-2"><Price value={product.price} /></div>
        {product.fulfillment === "quote" ? (
          <Link to={"/services/inquire" as never} className="display mt-2 flex h-11 items-center justify-center rounded-xl bg-primary text-[15px] text-white">Start inquiry</Link>
        ) : product.variants ? (
          <Link to={"/shop/product/$productId" as never} params={{ productId: product.id } as never} className="display mt-2 flex h-11 items-center justify-center rounded-xl border border-[var(--secondary-ink)] text-[13px] text-[var(--secondary-ink)]">View Details</Link>
        ) : (
          <Button className="mt-2" full onClick={() => app.addToCart(product.id, "")}>Add to Cart</Button>
        )}
      </div>
    </article>
  );
}

export function ProductDetail({ productId }: { productId: string }) {
  const product = getProduct(productId);
  const app = useApp();
  const [photo, setPhoto] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const related = getCatalog().filter((p) => p.category === product?.category && p.id !== product?.id).slice(0, 3);
  if (!product) return <Screen><Header title="Product" /><EmptyState title="Not in the catalog" body="That item is not in the sample shop." /></Screen>;
  const variant = product.variants?.map((v) => choice[v.name]).filter(Boolean).join(" / ") ?? "";
  const add = () => {
    if (product.variants?.some((v) => !choice[v.name])) {
      setError("Choose each option.");
      return;
    }
    setError("");
    app.addToCart(product.id, variant);
  };
  return (
    <Screen>
      <Header title={product.name} right={<button type="button" aria-label="Wishlist" className="flex h-11 w-11 items-center justify-center rounded-xl border border-border" onClick={() => app.toggleWishlist(product.id)}><Heart size={18} fill={app.wishlist.includes(product.id) ? "currentColor" : "none"} /></button>} />
      <div className="space-y-4 px-4 py-4">
        <button type="button" className="block w-full overflow-hidden rounded-2xl" onClick={() => setZoom(true)} aria-label="Open image">
          <Photo name={product.photos[photo] ?? product.photos[0]} alt={product.name} className="aspect-square" />
        </button>
        <div className="flex gap-2">
          {product.photos.map((p, i) => (
            <button key={p + i} type="button" aria-label={`Image ${i + 1}`} onClick={() => setPhoto(i)} className={`h-16 w-16 overflow-hidden rounded-lg border ${i === photo ? "border-primary" : "border-border"}`}>
              <Photo name={p} alt="" className="h-full" />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <SampleMark />
          <Badge>{product.stock === "in_stock" ? "In stock" : "Made to order"}</Badge>
          {product.fulfillment === "printify" && <Badge tone="teal">Print partner</Badge>}
        </div>
        <Price value={product.price} />
        <p className="text-[15px] leading-relaxed text-muted-foreground">{product.description}</p>
        {product.leadTime && <p className="text-[13px] text-warning">{product.leadTime}</p>}
        <div>
          <h2 className="display text-xl">What's included</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-muted-foreground">{product.included.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <p className="text-[13px] text-muted-foreground">Specifications are not listed. The shop has not confirmed measurements, and this mockup does not invent them.</p>
        {product.variants?.map((v) => (
          <div key={v.name}>
            <p className="mb-2 text-[13px] font-medium">{v.name}</p>
            <div className="flex flex-wrap gap-2">
              {v.options.map((o) => <Chip key={o} active={choice[v.name] === o} onClick={() => setChoice((c) => ({ ...c, [v.name]: o }))}>{o}</Chip>)}
            </div>
          </div>
        ))}
        {error && <p className="text-[13px] text-destructive">{error}</p>}
        {product.fulfillment === "quote" ? (
          <Link to={"/services/inquire" as never} className="display flex h-11 items-center justify-center rounded-xl bg-primary text-white">Start a Project Inquiry</Link>
        ) : (
          <Button full onClick={add}>Add to Cart</Button>
        )}
        <p className="text-[13px] text-muted-foreground">{SAFETY_NOTE}</p>
        {related.length > 0 && (
          <div>
            <h2 className="display mb-2 text-xl">Related</h2>
            <div className="space-y-2">{related.map((p) => <ProductCard key={p.id} product={p} wide />)}</div>
          </div>
        )}
      </div>
      {zoom && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <button type="button" className="m-4 h-11 self-end px-3 text-white" onClick={() => setZoom(false)}>Close</button>
          <div className="flex flex-1 items-center overflow-auto">
            <img src="" alt="" className="hidden" />
            <Photo name={product.photos[photo] ?? product.photos[0]} alt={product.name} className="max-h-[80dvh]" />
          </div>
          <label className="p-4 text-[13px] text-white">Zoom is the fullscreen view. Pinch is left to the system photo viewer when a signed asset exists.</label>
        </div>
      )}
    </Screen>
  );
}

export function CartScreen() {
  const app = useApp();
  const nav = useNavigate();
  const lines = app.cart.map((l) => ({ ...l, product: getProduct(l.productId) })).filter((l) => l.product);
  const subtotal = lines.reduce((n, l) => n + (l.product?.price ?? 0) * l.qty, 0);
  return (
    <Screen>
      <Header title="Cart" />
      {lines.length === 0 ? (
        <EmptyState title="Cart is empty" body="Kits and apparel you add will wait here." action={<Button onClick={() => nav({ to: "/shop" as never })}>Browse the shop</Button>} />
      ) : (
        <div className="space-y-4 px-4 py-4">
          {lines.map((l) => (
            <div key={l.id} className="flex gap-3 rounded-2xl border border-border bg-card p-2">
              <Photo name={l.product!.photos[0]} alt="" className="h-20 w-20 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{l.product!.name}</p>
                {l.variant && <p className="text-[12px] text-muted-foreground">{l.variant}</p>}
                <p className="text-primary">{l.product!.price == null ? "By quote" : money(l.product!.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" aria-label="Decrease" className="h-11 w-11 rounded-lg border border-border" onClick={() => app.setQty(l.id, l.qty - 1)}>-</button>
                  <span>{l.qty}</span>
                  <button type="button" aria-label="Increase" className="h-11 w-11 rounded-lg border border-border" onClick={() => app.setQty(l.id, l.qty + 1)}>+</button>
                  <button type="button" className="ml-auto text-[13px] text-destructive" onClick={() => app.removeFromCart(l.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <p className="text-[14px]">Subtotal <span className="display text-2xl text-primary">{money(subtotal)}</span></p>
          <p className="text-[12px] text-muted-foreground">Shipping and tax are not calculated in this SAMPLE checkout.</p>
          <Button full onClick={() => (app.authed ? nav({ to: "/shop/checkout" as never }) : app.openAuth("Sign in to check out."))}>Checkout</Button>
        </div>
      )}
    </Screen>
  );
}

export function CheckoutScreen() {
  const app = useApp();
  const nav = useNavigate();
  const addresses = app.addresses.filter((a) => a.userId === app.user?.id);
  const payments = app.payments.filter((p) => p.userId === app.user?.id);
  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [paymentId, setPaymentId] = useState(payments[0]?.id ?? "");
  const [step, setStep] = useState<"review" | "success">("review");
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const lines = app.cart.map((l) => ({ ...l, product: getProduct(l.productId) })).filter((l) => l.product && l.product.price != null);
  const subtotal = lines.reduce((n, l) => n + (l.product!.price ?? 0) * l.qty, 0);

  if (!app.authed) {
    return <Screen><Header title="Checkout" /><EmptyState title="Sign in to check out" body="Guest browsing stops at the cart." action={<Button onClick={() => app.openAuth("Sign in to check out.")}>Sign in</Button>} /></Screen>;
  }

  const pay = async (simulateFailure = false) => {
    setError("");
    const result = await app.placeOrder({ addressId, paymentId, simulateFailure });
    if (!result.ok) {
      if (result.reason !== "auth") setError(result.reason);
      return;
    }
    setOrderId(result.orderId);
    setStep("success");
  };

  if (step === "success") {
    return (
      <Screen>
        <Header title="Order placed" back={false} />
        <div className="space-y-3 px-4 py-8">
          <h2 className="display text-4xl">You're in the queue.</h2>
          <p className="text-[15px] text-muted-foreground">SAMPLE confirmation. Nothing was charged. Shipping is still unpriced.</p>
          <Button full onClick={() => nav({ to: "/shop/orders/$orderId" as never, params: { orderId } as never })}>View order</Button>
          <Button full variant="secondary" onClick={() => nav({ to: "/shop" as never })}>Keep shopping</Button>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header title="Checkout" />
      <div className="space-y-4 px-4 py-4">
        <p className="text-[13px] leading-relaxed text-muted-foreground">Payment provider is not configured. This confirms a SAMPLE order only.</p>
        {lines.map((l) => <p key={l.id} className="text-[14px]">{l.qty} × {l.product!.name} {l.variant && `· ${l.variant}`}</p>)}
        <p className="display text-3xl text-primary">{money(subtotal)}</p>
        <SelectField label="Delivery address" value={addressId} onChange={(e) => setAddressId(e.target.value)}>
          {addresses.length === 0 && <option value="">No address yet</option>}
          {addresses.map((a) => <option key={a.id} value={a.id}>{a.label} — {a.line1}</option>)}
        </SelectField>
        <SelectField label="Payment method" value={paymentId} onChange={(e) => setPaymentId(e.target.value)}>
          {payments.length === 0 && <option value="">No method yet</option>}
          {payments.map((p) => <option key={p.id} value={p.id}>{p.label} · {p.last4}</option>)}
        </SelectField>
        <Link to={"/profile/addresses" as never} className="text-[13px] text-[var(--secondary-ink)]">Add an address</Link>
        <Link to={"/profile/payments" as never} className="block text-[13px] text-[var(--secondary-ink)]">Add a payment method</Link>
        {error && <p className="text-[13px] text-destructive">{error}</p>}
        {app.payState === "failed" && <Button variant="secondary" full onClick={() => { app.resetPay(); void pay(false); }}>Retry payment</Button>}
        <Button full loading={app.payState === "processing"} onClick={() => void pay(false)}>Place SAMPLE order</Button>
        <button type="button" className="text-[12px] text-muted-foreground underline" onClick={() => void pay(true)}>Preview a failed payment</button>
        <Link to={"/shipping" as never} className="block text-[13px] text-[var(--secondary-ink)]">Shipping & returns</Link>
      </div>
    </Screen>
  );
}

export function WishlistScreen() {
  const app = useApp();
  const items = getCatalog().filter((p) => app.wishlist.includes(p.id));
  return (
    <Screen>
      <Header title="Wishlist" />
      {!app.authed ? <EmptyState title="Sign in to see saves" body="Wishlist is kept with your account." action={<Button onClick={() => app.openAuth("Sign in to see your wishlist.")}>Sign in</Button>} /> : items.length === 0 ? <EmptyState title="Nothing saved" body="Tap the heart on a product to keep it here." /> : (
        <div className="space-y-3 px-4 py-4">{items.map((p) => <ProductCard key={p.id} product={p} wide />)}</div>
      )}
    </Screen>
  );
}

export function OrdersScreen() {
  const app = useApp();
  const orders = app.orders.filter((o) => o.userId === app.user?.id);
  return (
    <Screen>
      <Header title="Orders" />
      {!app.authed ? <EmptyState title="Sign in to see orders" body="Order history belongs to your account." action={<Button onClick={() => app.openAuth("Sign in to see orders.")}>Sign in</Button>} /> : orders.length === 0 ? <EmptyState title="No orders yet" body="A kit or a hoodie will show up here after checkout." /> : (
        <ul className="space-y-2 px-4 py-4">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={"/shop/orders/$orderId" as never} params={{ orderId: o.id } as never} className="block rounded-2xl border border-border bg-card p-3">
                <div className="flex items-center justify-between"><span className="font-semibold">{o.lines[0]?.name}</span><Badge>{o.status}</Badge></div>
                <p className="text-[12px] text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()} · {money(o.subtotal)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const app = useApp();
  const order = app.orders.find((o) => o.id === orderId && o.userId === app.user?.id);
  const [cancel, setCancel] = useState(false);
  const [ret, setRet] = useState(false);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  if (!order) return <Screen><Header title="Order" /><EmptyState title="Order not found" body="It may belong to another account." /></Screen>;
  return (
    <Screen>
      <Header title="Order" subtitle={order.status} />
      <div className="space-y-4 px-4 py-4">
        <SampleMark />
        {order.lines.map((l) => <p key={l.productId + l.variant}>{l.qty} × {l.name} {l.variant && `· ${l.variant}`} — {money(l.unitPrice)}</p>)}
        <p className="display text-3xl text-primary">{money(order.subtotal)}</p>
        <p className="text-[13px] text-muted-foreground">{order.note}</p>
        <p className="text-[13px]">Ship to {order.addressLabel}</p>
        <p className="text-[13px]">Paid with {order.paymentLabel}</p>
        <ol className="space-y-2">
          {order.tracking.map((t) => (
            <li key={t.label} className="flex items-center gap-2 text-[14px]">
              <span className={`h-2.5 w-2.5 rounded-full ${t.done ? "bg-success" : "bg-border"}`} />
              {t.label}
            </li>
          ))}
        </ol>
        {order.status === "Processing" && <Button variant="secondary" onClick={() => setCancel(true)}>Cancel order</Button>}
        {order.status === "Delivered" && <Button variant="secondary" onClick={() => setRet(true)}>Request a return</Button>}
        {message && <p className="text-[13px] text-destructive">{message}</p>}
        <Link to={"/shipping" as never} className="block text-[13px] text-[var(--secondary-ink)]">Shipping & returns policy</Link>
      </div>
      <Sheet open={cancel} title="Cancel order" onClose={() => setCancel(false)}>
        <p className="mb-3 text-[14px] text-muted-foreground">SAMPLE cancellation. Only orders still marked Processing can be cancelled here.</p>
        <Button full onClick={() => { const r = app.cancelOrder(order.id); if (!r.ok) setMessage(r.reason); setCancel(false); }}>Confirm cancel</Button>
      </Sheet>
      <Sheet open={ret} title="Request a return" onClose={() => setRet(false)}>
        <TextArea label="What should the shop know?" value={note} onChange={(e) => setNote(e.target.value)} />
        <Button className="mt-3" full onClick={() => { const r = app.requestReturn(order.id, note || "SAMPLE return request"); if (!r.ok) setMessage(r.reason); setRet(false); }}>Submit request</Button>
      </Sheet>
    </Screen>
  );
}
