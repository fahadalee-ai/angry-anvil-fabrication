import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  DEMO_EMAIL,
  DEMO_PASSWORD,
  GIVEAWAYS,
  uid,
  type CategoryId,
  type Fulfillment,
} from "./sample-data";
import { confirmPayment, restoreReceipts, SAMPLE_OTP } from "./services";
import { readStorage, writeStorage } from "./storage";

const KEY = "aaf.store.v1";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  emailVerified: boolean;
  photo?: string;
};

export type CartLine = { id: string; productId: string; qty: number; variant: string };
export type OrderStatus = "Processing" | "In production" | "Shipped" | "Delivered" | "Cancelled" | "Return requested";
export type OrderLine = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  variant: string;
  fulfillment: Fulfillment;
};
export type Order = {
  id: string;
  userId: string;
  lines: OrderLine[];
  subtotal: number;
  status: OrderStatus;
  createdAt: string;
  addressLabel: string;
  paymentLabel: string;
  note: string;
  tracking: { label: string; done: boolean }[];
};

export type BookingStatus = "Submitted" | "In Review" | "Quote Sent" | "Approved" | "In Fabrication" | "Ready" | "Cancelled";
export type Booking = {
  id: string;
  userId: string;
  serviceId: string;
  kind: "inquiry" | "consultation";
  projectType: string;
  budget: string;
  timeline: string;
  notes: string;
  attachmentName?: string;
  date?: string;
  time?: string;
  name: string;
  email: string;
  status: BookingStatus;
  createdAt: string;
};

export type EntitlementStatus = "active" | "revoked";
export type Entitlement = { id: string; userId: string; courseId: string; status: EntitlementStatus; purchasedAt: string; reference: string };
export type LessonProgress = { position: number; complete: boolean; notes: string };
export type GiveawayEntry = { id: string; userId: string; giveawayId: string; name: string; email: string; createdAt: string };
export type BibleOffer = { id: string; userId: string; name: string; contact: string; translation: string; condition: string; quantity: string; preference: string; notes: string; status: string; createdAt: string };
export type BibleRequest = { id: string; userId: string; name: string; contact: string; translation: string; address: string; notes: string; status: string; createdAt: string };
export type Address = { id: string; userId: string; label: string; name: string; line1: string; city: string; region: string; postal: string };
export type PayMethod = { id: string; userId: string; label: string; brand: string; last4: string };
export type AppNotification = { id: string; userId: string | null; category: "Orders" | "Courses" | "Giveaways" | "Inquiries" | "Devotional" | "Promotions"; title: string; body: string; href: string; readBy: string[]; createdAt: string };
export type ChatMessage = { id: string; from: "user" | "shop"; text: string; image?: string; at: string };
export type Thread = { id: string; userId: string; topic: string; messages: ChatMessage[]; unread: number; updatedAt: string };

export type Prefs = { orders: boolean; courses: boolean; giveaways: boolean; inquiries: boolean; devotionals: boolean; promotions: boolean };

export type Persisted = {
  version: 1;
  theme: "dark" | "light";
  onboarded: boolean;
  announcementDismissed: boolean;
  guest: boolean;
  userId: string | null;
  users: User[];
  cart: CartLine[];
  wishlist: string[];
  orders: Order[];
  bookings: Booking[];
  entitlements: Entitlement[];
  progress: Record<string, LessonProgress>;
  entries: GiveawayEntry[];
  offers: BibleOffer[];
  requests: BibleRequest[];
  savedDevotionals: string[];
  devotionalReminder: boolean;
  addresses: Address[];
  payments: PayMethod[];
  notifications: AppNotification[];
  threads: Thread[];
  recentSearches: string[];
  prefs: Prefs;
  newsletterEmail: string | null;
  pendingOtp: { email: string; purpose: "reset" | "verify" } | null;
  resetAllowedEmail: string | null;
};

export type Toast = { id: number; title: string; body?: string };

const demoUser: User = {
  id: "user_demo",
  firstName: "Sample",
  lastName: "Builder",
  email: DEMO_EMAIL,
  phone: "",
  password: DEMO_PASSWORD,
  emailVerified: true,
};

function seed(): Persisted {
  return {
    version: 1,
    theme: "dark",
    onboarded: false,
    announcementDismissed: false,
    guest: true,
    userId: null,
    users: [demoUser],
    cart: [],
    wishlist: [],
    orders: [
      {
        id: "order_sample",
        userId: demoUser.id,
        lines: [{ productId: "merch-hoodie", name: "Shop Hoodie", qty: 1, unitPrice: 58, variant: "L / Black", fulfillment: "printify" }],
        subtotal: 58,
        status: "Delivered",
        createdAt: "2026-10-02T15:00:00.000Z",
        addressLabel: "SAMPLE shop address",
        paymentLabel: "SAMPLE card · 4242",
        note: "SAMPLE order. Shipping was not calculated.",
        tracking: [
          { label: "Placed", done: true },
          { label: "Queued with print partner", done: true },
          { label: "In production", done: true },
          { label: "Shipped", done: true },
          { label: "Delivered", done: true },
        ],
      },
    ],
    bookings: [
      {
        id: "book_sample",
        userId: demoUser.id,
        serviceId: "custom-metal",
        kind: "inquiry",
        projectType: "Custom Metal Fabrication",
        budget: "$250–$750",
        timeline: "Flexible",
        notes: "SAMPLE inquiry for a bench bracket.",
        name: "Sample Builder",
        email: DEMO_EMAIL,
        status: "In Review",
        createdAt: "2026-11-01T15:00:00.000Z",
      },
    ],
    entitlements: [],
    progress: {},
    entries: [],
    offers: [],
    requests: [],
    savedDevotionals: [],
    devotionalReminder: false,
    addresses: [
      { id: "addr_demo", userId: demoUser.id, label: "Shop", name: "Sample Builder", line1: "SAMPLE street — client to confirm", city: "SAMPLE city", region: "KY", postal: "00000" },
    ],
    payments: [{ id: "pay_demo", userId: demoUser.id, label: "SAMPLE card", brand: "Card", last4: "4242" }],
    notifications: [
      { id: "n1", userId: null, category: "Promotions", title: "Kits are on the bench", body: "Welding kits are in the shop tab. Prices are SAMPLE.", href: "/shop", readBy: [], createdAt: "2026-11-16T12:00:00.000Z" },
      { id: "n2", userId: null, category: "Giveaways", title: "Shop-Starter Prize Pack", body: "SAMPLE giveaway. Rules are not final.", href: "/giveaways/shop-starter", readBy: [], createdAt: "2026-11-15T12:00:00.000Z" },
      { id: "n3", userId: null, category: "Devotional", title: "Work as Worship", body: "Today's reading is ready.", href: "/devotionals/d-work", readBy: [], createdAt: "2026-11-17T12:00:00.000Z" },
      { id: "n4", userId: demoUser.id, category: "Orders", title: "Hoodie delivered", body: "SAMPLE tracking marked delivered.", href: "/shop/orders/order_sample", readBy: [], createdAt: "2026-10-12T12:00:00.000Z" },
      { id: "n5", userId: demoUser.id, category: "Inquiries", title: "Inquiry in review", body: "The bench bracket inquiry is in review.", href: "/services/bookings/book_sample", readBy: [], createdAt: "2026-11-02T12:00:00.000Z" },
      { id: "n6", userId: null, category: "Courses", title: "Beginner Welding is open to browse", body: "Lessons stay locked until a verified payment.", href: "/courses/course-beginner", readBy: [], createdAt: "2026-11-10T12:00:00.000Z" },
    ],
    threads: [
      {
        id: "thread_demo",
        userId: demoUser.id,
        topic: "Order status",
        unread: 1,
        updatedAt: "2026-11-12T18:00:00.000Z",
        messages: [
          { id: "m1", from: "user", text: "Where is the sample hoodie order?", at: "2026-11-12T17:40:00.000Z" },
          { id: "m2", from: "shop", text: "SAMPLE reply — this thread is stored on the device only. A teammate is not connected.", at: "2026-11-12T18:00:00.000Z" },
        ],
      },
    ],
    recentSearches: [],
    prefs: { orders: true, courses: true, giveaways: true, inquiries: true, devotionals: true, promotions: true },
    newsletterEmail: null,
    pendingOtp: null,
    resetAllowedEmail: null,
  };
}

function merge(saved: Persisted): Persisted {
  const base = seed();
  const users = [...(saved.users ?? [])];
  if (!users.some((u) => u.email.toLowerCase() === DEMO_EMAIL)) users.unshift(demoUser);
  return {
    ...base,
    ...saved,
    version: 1,
    users,
    prefs: { ...base.prefs, ...(saved.prefs ?? {}) },
    cart: saved.cart ?? [],
    wishlist: saved.wishlist ?? [],
    orders: saved.orders ?? base.orders,
    bookings: saved.bookings ?? base.bookings,
    entitlements: saved.entitlements ?? [],
    progress: saved.progress ?? {},
    entries: saved.entries ?? [],
    offers: saved.offers ?? [],
    requests: saved.requests ?? [],
    savedDevotionals: saved.savedDevotionals ?? [],
    addresses: saved.addresses ?? base.addresses,
    payments: saved.payments ?? base.payments,
    notifications: saved.notifications ?? base.notifications,
    threads: saved.threads ?? base.threads,
    recentSearches: saved.recentSearches ?? [],
  };
}

type Store = Persisted & {
  hydrated: boolean;
  toasts: Toast[];
  authGate: string | null;
  payState: "idle" | "processing" | "failed" | "success";
  user: User | null;
  authed: boolean;
  readerKey: string;
  dismissToast: (id: number) => void;
  toast: (title: string, body?: string) => void;
  openAuth: (message: string) => void;
  closeAuth: () => void;
  setTheme: (theme: "dark" | "light") => void;
  dismissAnnouncement: () => void;
  markOnboarded: () => void;
  login: (email: string, password: string) => { ok: true } | { ok: false; reason: string };
  register: (input: { firstName: string; lastName: string; email: string; phone: string; password: string }) => { ok: true } | { ok: false; reason: string };
  logout: () => void;
  continueAsGuest: () => void;
  signInWithApple: () => void;
  updateProfile: (patch: Partial<Pick<User, "firstName" | "lastName" | "phone" | "photo">>) => void;
  changePassword: (current: string, next: string) => { ok: true } | { ok: false; reason: string };
  requestOtp: (email: string, purpose: "reset" | "verify") => { ok: true } | { ok: false; reason: string };
  verifyOtp: (code: string) => { ok: true; purpose: "reset" | "verify" } | { ok: false; reason: string };
  resetPassword: (password: string) => { ok: true } | { ok: false; reason: string };
  addToCart: (productId: string, variant: string) => void;
  setQty: (lineId: string, qty: number) => void;
  removeFromCart: (lineId: string) => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (input: { addressId: string; paymentId: string; simulateFailure?: boolean }) => Promise<{ ok: true; orderId: string } | { ok: false; reason: string }>;
  cancelOrder: (orderId: string) => { ok: true } | { ok: false; reason: string };
  requestReturn: (orderId: string, note: string) => { ok: true } | { ok: false; reason: string };
  saveAddress: (input: Omit<Address, "id" | "userId">) => void;
  removeAddress: (id: string) => void;
  savePayment: (input: { label: string; last4: string }) => { ok: true } | { ok: false; reason: string };
  removePayment: (id: string) => void;
  createBooking: (input: Omit<Booking, "id" | "userId" | "status" | "createdAt">) => { ok: true; id: string } | { ok: false; reason: string };
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, date: string, time: string) => void;
  purchaseCourse: (courseId: string, simulateFailure?: boolean) => Promise<{ ok: true } | { ok: false; reason: string }>;
  restorePurchases: () => Promise<void>;
  revokeEntitlement: (courseId: string) => void;
  setLessonProgress: (lessonId: string, patch: Partial<LessonProgress>) => void;
  enterGiveaway: (giveawayId: string, consent: boolean, rules: boolean) => { ok: true } | { ok: false; reason: string };
  createOffer: (input: Omit<BibleOffer, "id" | "userId" | "status" | "createdAt">) => { ok: true } | { ok: false; reason: string };
  createRequest: (input: Omit<BibleRequest, "id" | "userId" | "status" | "createdAt">) => { ok: true } | { ok: false; reason: string };
  toggleSavedDevotional: (id: string) => void;
  toggleReminder: () => void;
  sendMessage: (threadId: string, text: string, image?: string) => void;
  startThread: (topic: string, text: string) => string | null;
  markThreadRead: (threadId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  addRecentSearch: (q: string) => void;
  subscribeNewsletter: (email: string) => void;
  togglePref: (key: keyof Prefs) => void;
  resetPay: () => void;
};

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(seed);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [authGate, setAuthGate] = useState<string | null>(null);
  const [payState, setPayState] = useState<Store["payState"]>("idle");
  const ref = useRef(state);
  ref.current = state;

  useEffect(() => {
    const saved = readStorage<Persisted>(KEY);
    if (saved?.version === 1) setState(merge(saved));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(KEY, state);
  }, [state, hydrated]);

  const api = useMemo(() => {
    const patch = (fn: (s: Persisted) => Persisted) => setState((prev) => fn(prev));
    const toast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, title, body }]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
    };
    const currentUser = () => {
      const s = ref.current;
      if (s.guest || !s.userId) return null;
      return s.users.find((u) => u.id === s.userId) ?? null;
    };
    const requireUser = (message: string) => {
      const u = currentUser();
      if (!u) {
        setAuthGate(message);
        return null;
      }
      return u;
    };
    const progressKey = (userId: string, lessonId: string) => `${userId}:${lessonId}`;

    return {
      toast,
      dismissToast: (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
      openAuth: (message: string) => setAuthGate(message),
      closeAuth: () => setAuthGate(null),
      setTheme: (theme: "dark" | "light") => patch((s) => ({ ...s, theme })),
      dismissAnnouncement: () => patch((s) => ({ ...s, announcementDismissed: true })),
      markOnboarded: () => patch((s) => ({ ...s, onboarded: true })),
      login: (email: string, password: string) => {
        const found = ref.current.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (!found || found.password !== password) return { ok: false as const, reason: "That email and password do not match." };
        patch((s) => ({ ...s, guest: false, userId: found.id }));
        toast("Welcome back", found.firstName);
        return { ok: true as const };
      },
      register: (input: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
        const email = input.email.trim().toLowerCase();
        if (ref.current.users.some((u) => u.email.toLowerCase() === email)) return { ok: false as const, reason: "An account with that email already exists." };
        const created: User = { id: uid("user"), firstName: input.firstName.trim(), lastName: input.lastName.trim(), email, phone: input.phone.trim(), password: input.password, emailVerified: false };
        patch((s) => ({ ...s, users: [...s.users, created], guest: false, userId: created.id, pendingOtp: { email, purpose: "verify" } }));
        return { ok: true as const };
      },
      logout: () => {
        patch((s) => ({ ...s, guest: true, userId: null, cart: [] }));
        toast("Signed out");
      },
      continueAsGuest: () => patch((s) => ({ ...s, guest: true, userId: null, onboarded: true })),
      signInWithApple: () => {
        const email = "apple.sample@angryanvil.local";
        let user = ref.current.users.find((u) => u.email === email);
        if (!user) {
          user = { id: uid("user"), firstName: "Apple", lastName: "Sign-In", email, phone: "", password: uid("pw"), emailVerified: true };
          const created = user;
          patch((s) => ({ ...s, users: [...s.users, created], guest: false, userId: created.id, onboarded: true }));
        } else {
          patch((s) => ({ ...s, guest: false, userId: user!.id, onboarded: true }));
        }
        toast("Signed in with Apple", "SAMPLE sign-in. Apple has not authenticated this session.");
      },
      updateProfile: (p: Partial<Pick<User, "firstName" | "lastName" | "phone" | "photo">>) => patch((s) => ({ ...s, users: s.users.map((u) => (u.id === s.userId ? { ...u, ...p } : u)) })),
      changePassword: (current: string, next: string) => {
        const u = currentUser();
        if (!u) return { ok: false as const, reason: "Sign in first." };
        if (u.password !== current) return { ok: false as const, reason: "Current password is wrong." };
        patch((s) => ({ ...s, users: s.users.map((x) => (x.id === u.id ? { ...x, password: next } : x)) }));
        toast("Password updated");
        return { ok: true as const };
      },
      requestOtp: (email: string, purpose: "reset" | "verify") => {
        const found = ref.current.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
        if (purpose === "reset" && !found) return { ok: false as const, reason: "No account uses that email." };
        patch((s) => ({ ...s, pendingOtp: { email: email.trim().toLowerCase(), purpose }, resetAllowedEmail: null }));
        return { ok: true as const };
      },
      verifyOtp: (code: string) => {
        const pending = ref.current.pendingOtp;
        if (!pending) return { ok: false as const, reason: "Request a code first." };
        if (code.trim() !== SAMPLE_OTP) return { ok: false as const, reason: "That code does not match." };
        if (pending.purpose === "verify") {
          patch((s) => ({ ...s, users: s.users.map((u) => (u.email === pending.email ? { ...u, emailVerified: true } : u)), pendingOtp: null }));
          toast("Email verified");
        } else {
          patch((s) => ({ ...s, resetAllowedEmail: pending.email, pendingOtp: null }));
        }
        return { ok: true as const, purpose: pending.purpose };
      },
      resetPassword: (password: string) => {
        const email = ref.current.resetAllowedEmail;
        if (!email) return { ok: false as const, reason: "Verify the code first." };
        patch((s) => ({ ...s, users: s.users.map((u) => (u.email === email ? { ...u, password } : u)), resetAllowedEmail: null }));
        toast("Password saved");
        return { ok: true as const };
      },
      addToCart: (productId: string, variant: string) => {
        const id = `${productId}|${variant}`;
        patch((s) => {
          const existing = s.cart.find((l) => l.id === id);
          const cart = existing ? s.cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)) : [...s.cart, { id, productId, qty: 1, variant }];
          return { ...s, cart };
        });
        toast("Added to cart");
      },
      setQty: (lineId: string, qty: number) => patch((s) => ({ ...s, cart: qty <= 0 ? s.cart.filter((l) => l.id !== lineId) : s.cart.map((l) => (l.id === lineId ? { ...l, qty } : l)) })),
      removeFromCart: (lineId: string) => patch((s) => ({ ...s, cart: s.cart.filter((l) => l.id !== lineId) })),
      toggleWishlist: (productId: string) => {
        if (!requireUser("Sign in to save a wishlist.")) return;
        patch((s) => ({ ...s, wishlist: s.wishlist.includes(productId) ? s.wishlist.filter((id) => id !== productId) : [...s.wishlist, productId] }));
      },
      placeOrder: async (input: { addressId: string; paymentId: string; simulateFailure?: boolean }) => {
        const { addressId, paymentId, simulateFailure } = input;
        const u = requireUser("Sign in to check out.");
        if (!u) return { ok: false as const, reason: "auth" };
        if (!u.emailVerified) return { ok: false as const, reason: "Verify your email before checkout." };
        const s = ref.current;
        const address = s.addresses.find((a) => a.id === addressId && a.userId === u.id);
        const payment = s.payments.find((p) => p.id === paymentId && p.userId === u.id);
        if (!address || !payment) return { ok: false as const, reason: "Add an address and a payment method." };
        if (s.cart.length === 0) return { ok: false as const, reason: "Your cart is empty." };
        setPayState("processing");
        const result = await confirmPayment({ kind: "order", amountLabel: "cart", simulateFailure });
        if (!result.ok) {
          setPayState("failed");
          return { ok: false as const, reason: "Payment was not confirmed. Nothing was ordered." };
        }
        const { getProduct } = await import("./sample-data");
        const lines: OrderLine[] = [];
        for (const line of ref.current.cart) {
          const product = getProduct(line.productId);
          if (!product || product.price == null || product.fulfillment === "quote") continue;
          lines.push({ productId: product.id, name: product.name, qty: line.qty, unitPrice: product.price, variant: line.variant, fulfillment: product.fulfillment });
        }
        if (!lines.length) {
          setPayState("failed");
          return { ok: false as const, reason: "Nothing in the cart can be purchased." };
        }
        const orderId = uid("order");
        const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.qty, 0);
        const hasPrint = lines.some((l) => l.fulfillment === "printify");
        const order: Order = {
          id: orderId,
          userId: u.id,
          lines,
          subtotal,
          status: "Processing",
          createdAt: new Date().toISOString(),
          addressLabel: `${address.line1}, ${address.city}`,
          paymentLabel: `${payment.label} · ${payment.last4}`,
          note: hasPrint ? "SAMPLE order. Printify has not received it. Shipping is not calculated." : "SAMPLE order. Shipping is not calculated.",
          tracking: hasPrint
            ? [
                { label: "Placed", done: true },
                { label: "Queued with print partner", done: false },
                { label: "In production", done: false },
                { label: "Shipped", done: false },
                { label: "Delivered", done: false },
              ]
            : [
                { label: "Placed", done: true },
                { label: "Packing at the shop", done: false },
                { label: "Shipped", done: false },
                { label: "Delivered", done: false },
              ],
        };
        patch((prev) => ({
          ...prev,
          cart: [],
          orders: [order, ...prev.orders],
          notifications: [
            { id: uid("n"), userId: u.id, category: "Orders", title: "Order placed", body: "SAMPLE confirmation. No charge was made.", href: `/shop/orders/${orderId}`, readBy: [], createdAt: new Date().toISOString() },
            ...prev.notifications,
          ],
        }));
        setPayState("success");
        return { ok: true as const, orderId };
      },
      cancelOrder: (orderId: string) => {
        const order = ref.current.orders.find((o) => o.id === orderId);
        if (!order || order.status !== "Processing") return { ok: false as const, reason: "This order can no longer be cancelled here." };
        patch((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: "Cancelled" } : o)) }));
        toast("Order cancelled", "SAMPLE only. Nothing was refunded.");
        return { ok: true as const };
      },
      requestReturn: (orderId: string, note: string) => {
        const order = ref.current.orders.find((o) => o.id === orderId);
        if (!order || order.status !== "Delivered") return { ok: false as const, reason: "A return can be requested after delivery." };
        patch((s) => ({ ...s, orders: s.orders.map((o) => (o.id === orderId ? { ...o, status: "Return requested", note } : o)) }));
        toast("Return requested", "SAMPLE request. The shop has not received it.");
        return { ok: true as const };
      },
      saveAddress: (input: Omit<Address, "id" | "userId">) => {
        const u = requireUser("Sign in to save an address.");
        if (!u) return;
        patch((s) => ({ ...s, addresses: [...s.addresses, { ...input, id: uid("addr"), userId: u.id }] }));
        toast("Address saved");
      },
      removeAddress: (id: string) => patch((s) => ({ ...s, addresses: s.addresses.filter((a) => a.id !== id) })),
      savePayment: (input: { label: string; last4: string }) => {
        const { label, last4 } = input;
        const u = requireUser("Sign in to save a payment method.");
        if (!u) return { ok: false as const, reason: "auth" };
        if (!/^\d{4}$/.test(last4)) return { ok: false as const, reason: "Enter the last 4 digits only." };
        patch((s) => ({ ...s, payments: [...s.payments, { id: uid("pay"), userId: u.id, label, brand: "Card", last4 }] }));
        toast("Payment method saved", "The full card number is not stored.");
        return { ok: true as const };
      },
      removePayment: (id: string) => patch((s) => ({ ...s, payments: s.payments.filter((p) => p.id !== id) })),
      createBooking: (input: Omit<Booking, "id" | "userId" | "status" | "createdAt">) => {
        const u = requireUser("Sign in to send a project to the shop.");
        if (!u) return { ok: false as const, reason: "auth" };
        const id = uid("book");
        const booking: Booking = { ...input, id, userId: u.id, status: "Submitted", createdAt: new Date().toISOString() };
        patch((s) => ({
          ...s,
          bookings: [booking, ...s.bookings],
          notifications: [{ id: uid("n"), userId: u.id, category: "Inquiries", title: "Inquiry received", body: "Scope, pricing and timing are confirmed together.", href: `/services/bookings/${id}`, readBy: [], createdAt: new Date().toISOString() }, ...s.notifications],
        }));
        return { ok: true as const, id };
      },
      cancelBooking: (id: string) => {
        patch((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b)) }));
        toast("Booking cancelled");
      },
      rescheduleBooking: (id: string, date: string, time: string) => {
        patch((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, date, time, status: b.status === "Cancelled" ? b.status : "Submitted" } : b)) }));
        toast("Time updated", "The shop still confirms the slot.");
      },
      purchaseCourse: async (courseId: string, simulateFailure?: boolean) => {
        const u = requireUser("Sign in to buy a course.");
        if (!u) return { ok: false as const, reason: "auth" };
        if (!u.emailVerified) return { ok: false as const, reason: "Verify your email before buying a course." };
        if (ref.current.entitlements.some((e) => e.userId === u.id && e.courseId === courseId && e.status === "active")) {
          return { ok: true as const };
        }
        setPayState("processing");
        const result = await confirmPayment({ kind: "course", amountLabel: courseId, simulateFailure });
        if (!result.ok) {
          setPayState("failed");
          return { ok: false as const, reason: "Payment was not confirmed. The lessons stay locked." };
        }
        patch((s) => ({
          ...s,
          entitlements: [...s.entitlements, { id: uid("ent"), userId: u.id, courseId, status: "active", purchasedAt: new Date().toISOString(), reference: result.reference }],
          notifications: [{ id: uid("n"), userId: u.id, category: "Courses", title: "Course unlocked", body: "Access was recorded after the sample confirmation.", href: `/courses/${courseId}`, readBy: [], createdAt: new Date().toISOString() }, ...s.notifications],
        }));
        setPayState("success");
        return { ok: true as const };
      },
      restorePurchases: async () => {
        const u = requireUser("Sign in to restore purchases.");
        if (!u) return;
        await restoreReceipts();
        toast("Purchases checked", "This device already holds your SAMPLE entitlements. A live app will ask Apple or the payment server.");
      },
      revokeEntitlement: (courseId: string) => {
        const u = currentUser();
        if (!u) return;
        patch((s) => ({ ...s, entitlements: s.entitlements.map((e) => (e.userId === u.id && e.courseId === courseId ? { ...e, status: "revoked" } : e)) }));
        toast("Access revoked", "SAMPLE refund state. Lessons are locked again.");
      },
      setLessonProgress: (lessonId: string, p: Partial<LessonProgress>) => {
        const u = currentUser();
        if (!u) return;
        const key = progressKey(u.id, lessonId);
        patch((s) => {
          const prev = s.progress[key] ?? { position: 0, complete: false, notes: "" };
          return { ...s, progress: { ...s.progress, [key]: { ...prev, ...p } } };
        });
      },
      enterGiveaway: (giveawayId: string, consent: boolean, rules: boolean) => {
        const u = requireUser("Sign in to enter the giveaway.");
        if (!u) return { ok: false as const, reason: "auth" };
        if (!consent || !rules) return { ok: false as const, reason: "Consent and the rules placeholder are both required." };
        if (!GIVEAWAYS.some((g) => g.id === giveawayId)) return { ok: false as const, reason: "That giveaway is not open." };
        if (ref.current.entries.some((e) => e.userId === u.id && e.giveawayId === giveawayId)) return { ok: false as const, reason: "You already have a SAMPLE entry." };
        patch((s) => ({ ...s, entries: [...s.entries, { id: uid("entry"), userId: u.id, giveawayId, name: `${u.firstName} ${u.lastName}`, email: u.email, createdAt: new Date().toISOString() }] }));
        toast("Entry saved", "SAMPLE entry on this device. Winner selection is not running.");
        return { ok: true as const };
      },
      createOffer: (input: Omit<BibleOffer, "id" | "userId" | "status" | "createdAt">) => {
        const u = requireUser("Sign in to offer a Bible.");
        if (!u) return { ok: false as const, reason: "auth" };
        patch((s) => ({ ...s, offers: [{ ...input, id: uid("offer"), userId: u.id, status: "Submitted", createdAt: new Date().toISOString() }, ...s.offers] }));
        toast("Offer submitted", "SAMPLE record. The shop has not received it.");
        return { ok: true as const };
      },
      createRequest: (input: Omit<BibleRequest, "id" | "userId" | "status" | "createdAt">) => {
        const u = requireUser("Sign in to request a Bible.");
        if (!u) return { ok: false as const, reason: "auth" };
        patch((s) => ({ ...s, requests: [{ ...input, id: uid("req"), userId: u.id, status: "Submitted", createdAt: new Date().toISOString() }, ...s.requests] }));
        toast("Request submitted", "SAMPLE record. The shop has not received it.");
        return { ok: true as const };
      },
      toggleSavedDevotional: (id: string) => patch((s) => ({ ...s, savedDevotionals: s.savedDevotionals.includes(id) ? s.savedDevotionals.filter((x) => x !== id) : [...s.savedDevotionals, id] })),
      toggleReminder: () => patch((s) => ({ ...s, devotionalReminder: !s.devotionalReminder })),
      sendMessage: (threadId: string, text: string, image?: string) => {
        const u = currentUser();
        if (!u) return;
        const msg: ChatMessage = { id: uid("msg"), from: "user", text, image, at: new Date().toISOString() };
        patch((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, msg], updatedAt: msg.at } : t)) }));
        setTimeout(() => {
          const reply: ChatMessage = { id: uid("msg"), from: "shop", text: "SAMPLE reply — a teammate is not connected. Your note stays on this device.", at: new Date().toISOString() };
          patch((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, reply], unread: t.unread + 1, updatedAt: reply.at } : t)) }));
        }, 700);
      },
      startThread: (topic: string, text: string) => {
        const u = requireUser("Sign in to message the shop.");
        if (!u) return null;
        const id = uid("thread");
        const msg: ChatMessage = { id: uid("msg"), from: "user", text, at: new Date().toISOString() };
        patch((s) => ({ ...s, threads: [{ id, userId: u.id, topic, messages: [msg], unread: 0, updatedAt: msg.at }, ...s.threads] }));
        setTimeout(() => {
          const reply: ChatMessage = { id: uid("msg"), from: "shop", text: "SAMPLE reply — a teammate is not connected. Your note stays on this device.", at: new Date().toISOString() };
          patch((s) => ({ ...s, threads: s.threads.map((t) => (t.id === id ? { ...t, messages: [...t.messages, reply], unread: 1, updatedAt: reply.at } : t)) }));
        }, 700);
        return id;
      },
      markThreadRead: (threadId: string) => patch((s) => ({ ...s, threads: s.threads.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t)) })),
      markNotificationRead: (id: string) => {
        const key = ref.current.userId ?? "guest";
        patch((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id && !n.readBy.includes(key) ? { ...n, readBy: [...n.readBy, key] } : n)) }));
      },
      markAllNotificationsRead: () => {
        const key = ref.current.userId ?? "guest";
        patch((s) => ({ ...s, notifications: s.notifications.map((n) => (n.readBy.includes(key) ? n : { ...n, readBy: [...n.readBy, key] })) }));
      },
      clearNotifications: () => {
        const key = ref.current.userId ?? "guest";
        patch((s) => ({
          ...s,
          notifications: s.notifications.map((n) =>
            n.userId && n.userId !== key ? n : { ...n, readBy: [...new Set([...n.readBy, key, `hide:${key}`])] },
          ),
        }));
      },
      addRecentSearch: (q: string) => {
        const query = q.trim();
        if (query.length < 2) return;
        patch((s) => ({ ...s, recentSearches: [query, ...s.recentSearches.filter((x) => x.toLowerCase() !== query.toLowerCase())].slice(0, 8) }));
      },
      subscribeNewsletter: (email: string) => {
        patch((s) => ({ ...s, newsletterEmail: email.trim() }));
        toast("You're on the list", "Saved on this device. It has not been sent to a server.");
      },
      togglePref: (key: keyof Prefs) => patch((s) => ({ ...s, prefs: { ...s.prefs, [key]: !s.prefs[key] } })),
      resetPay: () => setPayState("idle"),
    };
  }, []);

  const user = !state.guest && state.userId ? state.users.find((u) => u.id === state.userId) ?? null : null;

  const value: Store = {
    ...state,
    hydrated,
    toasts,
    authGate,
    payState,
    user,
    authed: !!user,
    readerKey: user?.id ?? "guest",
    ...api,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function visibleNotifications(app: Pick<Store, "notifications" | "user" | "prefs" | "readerKey">) {
  return app.notifications.filter((n) => {
    if (n.readBy.includes(`hide:${app.readerKey}`)) return false;
    if (n.userId && n.userId !== app.user?.id) return false;
    if (n.category === "Orders" && !app.prefs.orders) return false;
    if (n.category === "Courses" && !app.prefs.courses) return false;
    if (n.category === "Giveaways" && !app.prefs.giveaways) return false;
    if (n.category === "Inquiries" && !app.prefs.inquiries) return false;
    if (n.category === "Devotional" && !app.prefs.devotionals) return false;
    if (n.category === "Promotions" && !app.prefs.promotions) return false;
    return true;
  });
}

export function isUnread(n: AppNotification, readerKey: string) {
  return !n.readBy.includes(readerKey);
}

export type { CategoryId };
