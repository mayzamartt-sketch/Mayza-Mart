/**
 * MAYZA MART • WONDERLAND STUDIO ADMIN ENGINE
 * Curated for Mauji, Aynul & Faiza
 * Fully reactive state engine with localStorage persistence, audio synthesis,
 * interactive SVG analytics, WhatsApp dispatch, and invoice generator.
 */

// =========================================================
// 1. DEFAULT SEED DATA (Mayza Mart Catalog & Operations)
// =========================================================
const DEFAULT_PRODUCTS = [
  {
    id: "prod-1",
    title: "Cute Hair Clips Set (Pack of 12)",
    category: "Hair Accessories",
    sku: "MM-HAIR-01",
    price: 249,
    comparePrice: 399,
    stock: 42,
    tag: "Best Seller",
    image: "assets/p-clips.jpg",
    salesCount: 184
  },
  {
    id: "prod-2",
    title: "Unicorn Return Gift Box (Set of 5)",
    category: "Return Gifts",
    sku: "MM-GIFT-02",
    price: 299,
    comparePrice: 499,
    stock: 18,
    tag: "Best Seller",
    image: "assets/p-giftbox.jpg",
    salesCount: 142
  },
  {
    id: "prod-3",
    title: "Pastel Crossbody Handbag & Sling",
    category: "Handbags & Purses",
    sku: "MM-BAG-03",
    price: 499,
    comparePrice: 799,
    stock: 7, // Low stock trigger
    tag: "Cousin's Pick",
    image: "assets/p-handbag.jpg",
    salesCount: 96
  },
  {
    id: "prod-4",
    title: "Kawaii Sipper Water Bottle (600ml)",
    category: "Home & Lifestyle",
    sku: "MM-HOME-04",
    price: 349,
    comparePrice: 549,
    stock: 24,
    tag: "Trending",
    image: "assets/p-bottle.jpg",
    salesCount: 88
  },
  {
    id: "prod-5",
    title: "Lavender & Vanilla Scented Jar Candle",
    category: "Home & Lifestyle",
    sku: "MM-HOME-05",
    price: 199,
    comparePrice: 299,
    stock: 31,
    tag: "New Arrival",
    image: "assets/p-candle.jpg",
    salesCount: 75
  },
  {
    id: "prod-6",
    title: "Satin Silk Scrunchies Cloud Pack (Set of 6)",
    category: "Hair Accessories",
    sku: "MM-HAIR-06",
    price: 149,
    comparePrice: 249,
    stock: 65,
    tag: "Best Seller",
    image: "assets/p-scrunchies.jpg",
    salesCount: 220
  },
  {
    id: "prod-7",
    title: "Pastel Dream Journal & Calligraphy Pen Kit",
    category: "Stationery",
    sku: "MM-STAT-07",
    price: 279,
    comparePrice: 399,
    stock: 14,
    tag: "Cousin's Pick",
    image: "assets/cat-stationery.jpg",
    salesCount: 64
  },
  {
    id: "prod-8",
    title: "Fluffy Bunny Plush Toy & Keychain",
    category: "Toys",
    sku: "MM-TOY-08",
    price: 189,
    comparePrice: 299,
    stock: 5, // Low stock trigger
    tag: "Trending",
    image: "assets/cat-toys.jpg",
    salesCount: 110
  },
  {
    id: "prod-9",
    title: "Dainty Butterfly Charm Pearl Bracelet",
    category: "Jewellery & Fashion",
    sku: "MM-JEW-09",
    price: 229,
    comparePrice: 350,
    stock: 28,
    tag: "New Arrival",
    image: "assets/cat-jewellery.jpg",
    salesCount: 52
  }
];

const DEFAULT_ORDERS = [
  {
    id: "MM-8841",
    customer: {
      name: "Ananya Sharma",
      phone: "+91 98201 44521",
      city: "Mumbai, MH",
      address: "Flat 402, Lotus Blossom Heights, Bandra West, Mumbai - 400050"
    },
    items: [
      { name: "Cute Hair Clips Set (Pack of 12)", sku: "MM-HAIR-01", qty: 1, price: 249 },
      { name: "Satin Silk Scrunchies Cloud Pack", sku: "MM-HAIR-06", qty: 2, price: 149 }
    ],
    subtotal: 547,
    shipping: 0,
    total: 547,
    payment: "UPI • GPay",
    status: "New",
    timestamp: "12 mins ago",
    rawDate: "17 Sep 2026, 06:15 PM"
  },
  {
    id: "MM-8840",
    customer: {
      name: "Priya Mehta",
      phone: "+91 99800 12345",
      city: "Bengaluru, KA",
      address: "14/B, Ferns Habitat, Indiranagar, Bengaluru - 560038"
    },
    items: [
      { name: "Unicorn Return Gift Box (Set of 5)", sku: "MM-GIFT-02", qty: 2, price: 299 }
    ],
    subtotal: 598,
    shipping: 0,
    total: 598,
    payment: "UPI • PhonePe",
    status: "New",
    timestamp: "24 mins ago",
    rawDate: "17 Sep 2026, 06:03 PM"
  },
  {
    id: "MM-8839",
    customer: {
      name: "Sneha Kulkarni",
      phone: "+91 97654 88910",
      city: "Pune, MH",
      address: "B-201, Marvel Imperial, Koregaon Park, Pune - 411001"
    },
    items: [
      { name: "Pastel Crossbody Handbag & Sling", sku: "MM-BAG-03", qty: 1, price: 499 },
      { name: "Lavender & Vanilla Scented Jar Candle", sku: "MM-HOME-05", qty: 1, price: 199 }
    ],
    subtotal: 698,
    shipping: 0,
    total: 698,
    payment: "HDFC Credit Card",
    status: "Packed",
    timestamp: "1 hr ago",
    rawDate: "17 Sep 2026, 05:18 PM"
  },
  {
    id: "MM-8838",
    customer: {
      name: "Ritu Verma",
      phone: "+91 98112 34567",
      city: "New Delhi, DL",
      address: "C-45, Greater Kailash 1, New Delhi - 110048"
    },
    items: [
      { name: "Kawaii Sipper Water Bottle (600ml)", sku: "MM-HOME-04", qty: 1, price: 349 },
      { name: "Pastel Dream Journal & Calligraphy Pen Kit", sku: "MM-STAT-07", qty: 1, price: 279 }
    ],
    subtotal: 628,
    shipping: 0,
    total: 628,
    payment: "Paytm UPI",
    status: "Packed",
    timestamp: "2 hrs ago",
    rawDate: "17 Sep 2026, 04:30 PM"
  },
  {
    id: "MM-8837",
    customer: {
      name: "Aarav Sen",
      phone: "+91 98302 99120",
      city: "Kolkata, WB",
      address: "88, Southern Avenue, Lake Market, Kolkata - 700029"
    },
    items: [
      { name: "Unicorn Return Gift Box (Set of 5)", sku: "MM-GIFT-02", qty: 3, price: 299 }
    ],
    subtotal: 897,
    shipping: 0,
    total: 897,
    payment: "Cash on Delivery",
    status: "Dispatched",
    timestamp: "3 hrs ago",
    rawDate: "17 Sep 2026, 03:20 PM"
  },
  {
    id: "MM-8836",
    customer: {
      name: "Tanvi Patel",
      phone: "+91 97240 55431",
      city: "Ahmedabad, GJ",
      address: "302, Shivalik Highstreet, Bodakdev, Ahmedabad - 380054"
    },
    items: [
      { name: "Dainty Butterfly Charm Pearl Bracelet", sku: "MM-JEW-09", qty: 1, price: 229 },
      { name: "Satin Silk Scrunchies Cloud Pack", sku: "MM-HAIR-06", qty: 1, price: 149 }
    ],
    subtotal: 378,
    shipping: 49,
    total: 427,
    payment: "UPI • GPay",
    status: "Dispatched",
    timestamp: "5 hrs ago",
    rawDate: "17 Sep 2026, 01:10 PM"
  },
  {
    id: "MM-8835",
    customer: {
      name: "Diya Nair",
      phone: "+91 98470 11984",
      city: "Kochi, KL",
      address: "Villa 12, Skyline Riverdale, Edappally, Kochi - 682024"
    },
    items: [
      { name: "Fluffy Bunny Plush Toy & Keychain", sku: "MM-TOY-08", qty: 1, price: 189 },
      { name: "Cute Hair Clips Set (Pack of 12)", sku: "MM-HAIR-01", qty: 1, price: 249 }
    ],
    subtotal: 438,
    shipping: 49,
    total: 487,
    payment: "UPI • PhonePe",
    status: "Delivered",
    timestamp: "Yesterday",
    rawDate: "16 Sep 2026, 04:45 PM"
  },
  {
    id: "MM-8834",
    customer: {
      name: "Meera Chawla",
      phone: "+91 98711 77652",
      city: "Chandigarh, CH",
      address: "House 1024, Sector 18-C, Chandigarh - 160018"
    },
    items: [
      { name: "Pastel Crossbody Handbag & Sling", sku: "MM-BAG-03", qty: 1, price: 499 }
    ],
    subtotal: 499,
    shipping: 0,
    total: 499,
    payment: "ICICI Netbanking",
    status: "Delivered",
    timestamp: "Yesterday",
    rawDate: "16 Sep 2026, 02:15 PM"
  }
];

const DEFAULT_COUPONS = [
  {
    code: "WONDERLAND20",
    discount: 20,
    minSpend: 499,
    desc: "20% off wonderland celebration on all orders above ₹499",
    active: true,
    uses: 142
  },
  {
    code: "COUSINS15",
    discount: 15,
    minSpend: 299,
    desc: "15% off by Mauji, Aynul & Faiza for first-time shoppers",
    active: true,
    uses: 289
  },
  {
    code: "FREESHIP",
    discount: 100,
    minSpend: 349,
    desc: "Free express delivery across India",
    active: true,
    uses: 95
  },
  {
    code: "SPARKLE100",
    discount: 25,
    minSpend: 799,
    desc: "Flat ₹100 / 25% festive gift discount",
    active: true,
    uses: 61
  }
];

const DEFAULT_VIPS = [
  { name: "Ananya Sharma", city: "Mumbai", orders: 9, spend: 4820, badge: "Wonderland Star" },
  { name: "Sneha Kulkarni", city: "Pune", orders: 7, spend: 3940, badge: "Joy Curator" },
  { name: "Priya Mehta", city: "Bengaluru", orders: 6, spend: 3450, badge: "Mayza VIP" },
  { name: "Kavita Joshi", city: "Jaipur", orders: 5, spend: 2890, badge: "Mayza VIP" }
];

const DEFAULT_REVIEWS = [
  {
    author: "Ananya S. • Mumbai",
    rating: 5,
    quote: "The packaging felt like opening a luxury surprise from the cousins! My scrunchies and hair clips are so gentle.",
    product: "Satin Silk Scrunchies & Hair Clips"
  },
  {
    author: "Sneha K. • Pune",
    rating: 5,
    quote: "Super fast shipping by Aynul and the team! The sling bag is my new everyday go-to.",
    product: "Pastel Crossbody Handbag"
  },
  {
    author: "Ritu V. • New Delhi",
    rating: 5,
    quote: "Bought unicorn return gifts for my daughter's birthday. All 20 kids were ecstatic! Truly magical.",
    product: "Unicorn Return Gift Box"
  }
];

const DEFAULT_WHOLESALE_PURCHASES = [
  {
    id: "ws-1",
    billNumber: "INV-WS-801",
    date: "2026-09-14",
    supplier: "Surat Textile & Accessory Hub",
    location: "Surat, Gujarat",
    productId: "prod-6",
    productName: "Satin Silk Scrunchies Cloud Pack (Set of 6)",
    category: "Hair Accessories",
    quantity: 200,
    unitCost: 42,
    sellingPrice: 149,
    totalCost: 8400,
    paymentStatus: "Paid",
    paymentMode: "Bank NEFT / RTGS",
    notes: "Direct factory lot #14. High sheen mulberry satin fabric.",
    synced: true
  },
  {
    id: "ws-2",
    billNumber: "INV-WS-802",
    date: "2026-09-15",
    supplier: "Sadar Bazaar Wholesalers",
    location: "Old Delhi, DL",
    productId: "prod-1",
    productName: "Cute Hair Clips Set (Pack of 12)",
    category: "Hair Accessories",
    quantity: 150,
    unitCost: 65,
    sellingPrice: 249,
    totalCost: 9750,
    paymentStatus: "Paid",
    paymentMode: "UPI / GPay",
    notes: "Box packaging with acrylic pastel gloss clips.",
    synced: true
  },
  {
    id: "ws-3",
    billNumber: "INV-WS-803",
    date: "2026-09-16",
    supplier: "Jaipur Artisans Leather & Handbag Emporium",
    location: "Jaipur, RJ",
    productId: "prod-3",
    productName: "Pastel Crossbody Handbag & Sling",
    category: "Handbags & Purses",
    quantity: 40,
    unitCost: 160,
    sellingPrice: 499,
    totalCost: 6400,
    paymentStatus: "Partial",
    paymentMode: "Bank NEFT / RTGS",
    notes: "₹3,400 advance paid, ₹3,000 balance on 30-day term.",
    synced: true
  },
  {
    id: "ws-4",
    billNumber: "INV-WS-804",
    date: "2026-09-16",
    supplier: "Metro Return Gifts & Toy Depot",
    location: "Mumbai, MH",
    productId: "prod-2",
    productName: "Unicorn Return Gift Box (Set of 5)",
    category: "Return Gifts",
    quantity: 80,
    unitCost: 95,
    sellingPrice: 299,
    totalCost: 7600,
    paymentStatus: "Paid",
    paymentMode: "UPI / GPay",
    notes: "Party pack bulk discount 8% included in invoice.",
    synced: true
  },
  {
    id: "ws-5",
    billNumber: "INV-WS-805",
    date: "2026-09-17",
    supplier: "Global Kawaii Stationery Imports",
    location: "Kolkata Port, WB",
    productId: "prod-7",
    productName: "Pastel Dream Journal & Calligraphy Pen Kit",
    category: "Stationery",
    quantity: 60,
    unitCost: 85,
    sellingPrice: 279,
    totalCost: 5100,
    paymentStatus: "Credit",
    paymentMode: "30-Day Credit",
    notes: "Invoice due on 17 October 2026.",
    synced: true
  },
  {
    id: "ws-6",
    billNumber: "INV-WS-806",
    date: "2026-09-18",
    supplier: "Aroma Bliss Home Crafts",
    location: "Bengaluru, KA",
    productId: "prod-5",
    productName: "Lavender & Vanilla Scented Jar Candle",
    category: "Home & Lifestyle",
    quantity: 100,
    unitCost: 60,
    sellingPrice: 199,
    totalCost: 6000,
    paymentStatus: "Paid",
    paymentMode: "UPI / GPay",
    notes: "Soy wax natural essential oils, frosted glass containers.",
    synced: true
  }
];

// =========================================================
// 2. STATE MANAGER & PERSISTENCE
// =========================================================
class StudioState {
  constructor() {
    this.products = this.load("mm_products", DEFAULT_PRODUCTS);
    this.orders = this.load("mm_orders", DEFAULT_ORDERS);
    this.coupons = this.load("mm_coupons", DEFAULT_COUPONS);
    this.vips = this.load("mm_vips", DEFAULT_VIPS);
    this.reviews = this.load("mm_reviews", DEFAULT_REVIEWS);
    this.wholesalePurchases = this.load("mm_wholesale", DEFAULT_WHOLESALE_PURCHASES);
    this.soundEnabled = localStorage.getItem("mm_sound") !== "false"; // default true
    this.currentView = "dashboard";
    this.currentCategoryFilter = "all";
    this.currentOrderStatusFilter = "all";
  }

  load(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save() {
    localStorage.setItem("mm_products", JSON.stringify(this.products));
    localStorage.setItem("mm_orders", JSON.stringify(this.orders));
    localStorage.setItem("mm_coupons", JSON.stringify(this.coupons));
    localStorage.setItem("mm_vips", JSON.stringify(this.vips));
    localStorage.setItem("mm_reviews", JSON.stringify(this.reviews));
    localStorage.setItem("mm_wholesale", JSON.stringify(this.wholesalePurchases));
  }

  async initCloudSync() {
    if (!window.mayzaSupabase || !window.mayzaSupabase.isConfigured()) return false;
    try {
      const data = await window.mayzaSupabase.syncSupabaseToLocal();
      if (data) {
        let hasChanges = false;
        if (data.products && data.products.length > 0) {
          this.products = data.products;
          hasChanges = true;
        }
        if (data.orders && data.orders.length > 0) {
          this.orders = data.orders;
          hasChanges = true;
        }
        if (data.wholesalePurchases && data.wholesalePurchases.length > 0) {
          this.wholesalePurchases = data.wholesalePurchases;
          hasChanges = true;
        }
        if (data.coupons && data.coupons.length > 0) {
          this.coupons = data.coupons;
          hasChanges = true;
        }
        if (data.vips && data.vips.length > 0) {
          this.vips = data.vips;
          hasChanges = true;
        }
        if (data.reviews && data.reviews.length > 0) {
          this.reviews = data.reviews;
          hasChanges = true;
        }
        if (hasChanges) {
          this.save();
          return true;
        }
      }
    } catch (err) {
      console.warn('[StudioState] initCloudSync error:', err);
    }
    return false;
  }

  reset() {
    localStorage.clear();
    this.products = [...DEFAULT_PRODUCTS];
    this.orders = [...DEFAULT_ORDERS];
    this.coupons = [...DEFAULT_COUPONS];
    this.vips = [...DEFAULT_VIPS];
    this.reviews = [...DEFAULT_REVIEWS];
    this.wholesalePurchases = [...DEFAULT_WHOLESALE_PURCHASES];
    this.save();
  }
}

const state = new StudioState();

// =========================================================
// 3. AUDIO SYNTHESIZER (Crisp UI Click / Chime Synthesizer)
// =========================================================
class StudioAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playSuccess() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.2);
      });
    } catch (e) {}
  }
}

const audio = new StudioAudio();

// =========================================================
// 4. TOAST NOTIFICATIONS & CONFETTI
// =========================================================
function showToast(message, type = "success") {
  const rack = document.getElementById("toastRack");
  if (!rack) return;

  const toast = document.createElement("div");
  toast.className = `studio-toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-emoji">${type === "success" ? "✨" : "⚠️"}</span>
    <span class="toast-text">${message}</span>
  `;

  rack.appendChild(toast);
  audio.playClick();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function triggerCelebration() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.65 },
      colors: ["#FF4D8D", "#9E7BFF", "#00E5A3", "#FFA726", "#FFFFFF"]
    });
  }
  audio.playSuccess();
}

// =========================================================
// 5. INTERACTIVE CHART & ANALYTICS ENGINE
// =========================================================
const CHART_DATA_PRESETS = {
  today: {
    times: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"],
    revenue: [1200, 800, 4500, 11400, 18900, 36400, 48920],
    orders: [1, 1, 4, 8, 14, 27, 34],
    peak: "06:00 PM – 09:30 PM (₹19,450)"
  },
  week: {
    times: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [32400, 38900, 42100, 45600, 58200, 64500, 48920],
    orders: [24, 28, 31, 35, 46, 52, 34],
    peak: "Saturday Night Rush (₹64,500)"
  },
  month: {
    times: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [112000, 145000, 168000, 194000],
    orders: [85, 110, 134, 158],
    peak: "Festive Weekend Week 4"
  },
  year: {
    times: ["Q1", "Q2", "Q3", "Q4"],
    revenue: [450000, 680000, 890000, 1240000],
    orders: [350, 520, 710, 990],
    peak: "Q4 Gifting Season"
  }
};

let currentChartTimeframe = "today";

function renderSalesChart(timeframe = "today") {
  currentChartTimeframe = timeframe;
  const data = CHART_DATA_PRESETS[timeframe] || CHART_DATA_PRESETS.today;
  const svg = document.getElementById("salesSvgChart");
  const areaPath = document.getElementById("chartAreaPath");
  const strokePath = document.getElementById("chartStrokePath");
  const pointsGroup = document.getElementById("chartPointsGroup");
  const xLabels = document.getElementById("chartXLabels");

  if (!svg || !areaPath || !strokePath) return;

  // Update X-axis labels
  if (xLabels) {
    xLabels.innerHTML = data.times.map(t => `<span>${t}</span>`).join("");
  }

  const width = 1000;
  const height = 320;
  const padLeft = 40;
  const padRight = 960;
  const padTop = 40;
  const padBottom = 260;

  const maxVal = Math.max(...data.revenue) * 1.15;
  const minVal = 0;

  // Calculate coordinates
  const coords = data.revenue.map((val, i) => {
    const x = padLeft + (i / (data.revenue.length - 1)) * (padRight - padLeft);
    const y = padBottom - ((val - minVal) / (maxVal - minVal)) * (padBottom - padTop);
    return { x, y, rev: val, order: data.orders[i], time: data.times[i] };
  });

  // Build SVG path with smooth bezier curves
  let dStroke = `M ${coords[0].x},${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const mx = (p0.x + p1.x) / 2;
    dStroke += ` C ${mx},${p0.y} ${mx},${p1.y} ${p1.x},${p1.y}`;
  }

  const dArea = `${dStroke} L ${coords[coords.length - 1].x},${padBottom} L ${coords[0].x},${padBottom} Z`;

  areaPath.setAttribute("d", dArea);
  strokePath.setAttribute("d", dStroke);

  // Render interactive hover nodes
  if (pointsGroup) {
    pointsGroup.innerHTML = coords.map((c, idx) => `
      <circle class="chart-point-node" data-idx="${idx}" cx="${c.x}" cy="${c.y}" r="5" fill="#0B0F19" stroke="#FF4D8D" stroke-width="2.5" style="cursor: pointer; transition: transform 0.2s;" />
    `).join("");
  }

  // Setup interactive chart mouse tracking
  setupChartHover(coords);
}

function setupChartHover(coords) {
  const container = document.getElementById("chartContainer");
  const tooltip = document.getElementById("chartTooltip");
  const crosshair = document.getElementById("chartCrosshair");
  const activeDot = document.getElementById("chartActiveDot");
  const timeEl = document.getElementById("tooltipTime");
  const revEl = document.getElementById("tooltipRev");
  const ordEl = document.getElementById("tooltipOrders");

  if (!container || !tooltip) return;

  container.onmousemove = (e) => {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const svgWidth = 1000;
    const scaleX = svgWidth / rect.width;
    const targetX = mouseX * scaleX;

    // Find closest data coordinate
    let closest = coords[0];
    let minDiff = Infinity;
    coords.forEach(c => {
      const diff = Math.abs(c.x - targetX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = c;
      }
    });

    if (closest) {
      crosshair.setAttribute("x1", closest.x);
      crosshair.setAttribute("x2", closest.x);
      crosshair.setAttribute("opacity", "0.8");

      activeDot.setAttribute("cx", closest.x);
      activeDot.setAttribute("cy", closest.y);
      activeDot.setAttribute("opacity", "1");

      timeEl.textContent = closest.time;
      revEl.textContent = `₹${closest.rev.toLocaleString("en-IN")}`;
      ordEl.textContent = `${closest.order} Orders`;

      const tooltipX = (closest.x / 1000) * rect.width;
      const tooltipY = Math.max(10, (closest.y / 320) * rect.height - 70);

      tooltip.style.left = `${Math.min(rect.width - 140, Math.max(10, tooltipX - 50))}px`;
      tooltip.style.top = `${tooltipY}px`;
      tooltip.style.opacity = "1";
    }
  };

  container.onmouseleave = () => {
    tooltip.style.opacity = "0";
    if (crosshair) crosshair.setAttribute("opacity", "0");
    if (activeDot) activeDot.setAttribute("opacity", "0");
  };
}

// =========================================================
// 6. VIEW NAVIGATION & TOGGLING
// =========================================================
function switchView(viewName) {
  state.currentView = viewName;
  audio.playClick();

  // Update sidebar buttons
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  // Update views
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.toggle("active", panel.id === `view-${viewName}`);
  });

  // Close mobile sidebar if open
  const sidebar = document.getElementById("studioSidebar");
  if (sidebar) sidebar.classList.remove("open");

  // Re-render target view contents
  if (viewName === "dashboard") {
    renderDashboardOverview();
  } else if (viewName === "orders") {
    renderOrdersTable();
  } else if (viewName === "products") {
    renderProductMatrix();
  } else if (viewName === "wholesale") {
    renderWholesalePurchases();
  } else if (viewName === "marketing") {
    renderCoupons();
  } else if (viewName === "customers") {
    renderVIPsAndReviews();
  }
}

// =========================================================
// 7. DASHBOARD OVERVIEW RENDERING
// =========================================================
function renderDashboardOverview() {
  // Update KPI counters
  const totalRev = state.orders.reduce((sum, o) => sum + o.total, 48920);
  const activeOrders = state.orders.length;
  const aov = Math.round(totalRev / activeOrders);

  const kpiRev = document.getElementById("kpiRevenue");
  const kpiOrd = document.getElementById("kpiOrders");
  const kpiAov = document.getElementById("kpiAov");

  if (kpiRev) kpiRev.textContent = totalRev.toLocaleString("en-IN");
  if (kpiOrd) kpiOrd.textContent = activeOrders;
  if (kpiAov) kpiAov.textContent = aov;

  // Sidebar count badges
  const navOrderBadge = document.getElementById("ordersNavCount");
  const navProdBadge = document.getElementById("productsNavCount");
  if (navOrderBadge) navOrderBadge.textContent = activeOrders;
  if (navProdBadge) navProdBadge.textContent = state.products.length;

  // Render recent orders feed (Top 5)
  const ordersList = document.getElementById("dashboardOrdersList");
  if (ordersList) {
    ordersList.innerHTML = state.orders.slice(0, 5).map(o => {
      const itemsSummary = o.items.map(i => `${i.qty}x ${i.name}`).join(", ");
      return `
        <div class="mini-order-row">
          <div class="mini-order-left">
            <span class="order-id-badge">${o.id}</span>
            <div class="order-cust-info">
              <span class="cust-name">${o.customer.name}</span>
              <span class="order-item-summary">${itemsSummary}</span>
            </div>
          </div>
          <div class="mini-order-right">
            <span class="order-amount">₹${o.total}</span>
            <span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // Render hot sellers in dashboard
  const hotList = document.getElementById("dashboardHotProducts");
  if (hotList) {
    const sorted = [...state.products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 5);
    hotList.innerHTML = sorted.map(p => `
      <div class="hot-prod-item">
        <div class="hot-prod-left">
          <img src="${p.image}" alt="${p.title}" class="hot-prod-img">
          <div class="hot-prod-meta">
            <span class="hot-prod-name">${p.title}</span>
            <span class="hot-prod-cat">${p.category}</span>
          </div>
        </div>
        <div class="hot-prod-right">
          <span class="hot-prod-sold">${p.salesCount || 100} sold</span>
          <span class="hot-prod-stock">${p.stock} in stock</span>
        </div>
      </div>
    `).join("");
  }

  // Render Chart
  renderSalesChart(currentChartTimeframe);
}

// =========================================================
// 8. ORDERS & DISPATCH LOGISTICS ENGINE
// =========================================================
function renderOrdersTable() {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  const filterText = (document.getElementById("orderFilterInput")?.value || "").toLowerCase();
  const statusFilter = state.currentOrderStatusFilter;

  // Filter orders
  const filtered = state.orders.filter(o => {
    const matchStatus = statusFilter === "all" || o.status.toLowerCase() === statusFilter.toLowerCase();
    const matchQuery = !filterText ||
      o.id.toLowerCase().includes(filterText) ||
      o.customer.name.toLowerCase().includes(filterText) ||
      o.customer.phone.includes(filterText) ||
      o.customer.city.toLowerCase().includes(filterText);
    return matchStatus && matchQuery;
  });

  // Update status tabs counts
  updateOrderTabCounts();

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No orders found matching the criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const nextStatus = getNextStatus(o.status);
    const nextLabel = nextStatus ? `➔ ${nextStatus}` : "Completed ✨";
    const waUrl = getWhatsAppDispatchUrl(o);

    return `
      <tr data-order-id="${o.id}">
        <td>
          <span class="order-id-badge">${o.id}</span>
        </td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: var(--text-bright);">${o.customer.name}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${o.customer.phone}</span>
            <span style="font-size: 0.7rem; color: var(--text-dim);">${o.customer.city}</span>
          </div>
        </td>
        <td>
          <div style="font-size: 0.78rem; max-width: 200px; color: var(--text-body);">
            ${o.items.map(i => `<div>${i.qty}× ${i.name}</div>`).join("")}
          </div>
        </td>
        <td>
          <span style="font-family: var(--font-brand); font-weight: 800; font-size: 1rem; color: var(--color-rose);">
            ₹${o.total}
          </span>
        </td>
        <td>
          <span style="font-size: 0.78rem; color: var(--text-muted);">${o.payment}</span>
        </td>
        <td>
          <span class="status-pill status-${o.status.toLowerCase()}">${o.status}</span>
        </td>
        <td>
          <span style="font-size: 0.72rem; color: var(--text-dim);">${o.timestamp}</span>
        </td>
        <td class="text-right">
          <div class="row-actions">
            ${nextStatus ? `
              <button class="row-btn primary-advance-btn" onclick="advanceOrderStatus('${o.id}')" title="Advance to ${nextStatus}">
                ${nextLabel}
              </button>
            ` : ""}
            <a href="${waUrl}" target="_blank" class="row-btn wa-btn" title="Ping Customer on WhatsApp">
              💬 WhatsApp
            </a>
            <button class="row-btn slip-btn" onclick="openInvoiceModal('${o.id}')" title="Print Packing Slip">
              🖨️ Slip
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function getNextStatus(current) {
  if (current === "New") return "Packed";
  if (current === "Packed") return "Dispatched";
  if (current === "Dispatched") return "Delivered";
  return null;
}

function advanceOrderStatus(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const next = getNextStatus(order.status);
  if (next) {
    order.status = next;
    state.save();

    if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
      window.mayzaSupabase.updateOrderStatus(order.id, next).catch(console.warn);
    }

    showToast(`Order ${order.id} moved to status: ${next}! 🚀`);
    if (next === "Packed" || next === "Delivered") {
      triggerCelebration();
    } else {
      audio.playClick();
    }
    renderOrdersTable();
    renderDashboardOverview();
  }
}

function updateOrderTabCounts() {
  const all = state.orders.length;
  const newCnt = state.orders.filter(o => o.status === "New").length;
  const packedCnt = state.orders.filter(o => o.status === "Packed").length;
  const shipCnt = state.orders.filter(o => o.status === "Dispatched").length;
  const delivCnt = state.orders.filter(o => o.status === "Delivered").length;

  const cAll = document.getElementById("countAllOrders");
  const cNew = document.getElementById("countNewOrders");
  const cPacked = document.getElementById("countPackedOrders");
  const cShipped = document.getElementById("countShippedOrders");
  const cDelivered = document.getElementById("countDeliveredOrders");

  if (cAll) cAll.textContent = all;
  if (cNew) cNew.textContent = newCnt;
  if (cPacked) cPacked.textContent = packedCnt;
  if (cShipped) cShipped.textContent = shipCnt;
  if (cDelivered) cDelivered.textContent = delivCnt;
}

function getWhatsAppDispatchUrl(order) {
  const phoneClean = order.customer.phone.replace(/[^0-9]/g, "");
  const text = `Hi ${order.customer.name}! 💕
Greetings from Mayza Mart Wonderland! 🌸

Your order *${order.id}* (Total: ₹${order.total}) has been *${order.status.toUpperCase()}* with lots of love by Mauji, Aynul & Faiza.

📦 Items:
${order.items.map(i => `• ${i.qty}x ${i.name}`).join("\n")}

Thank you for being part of our wonderland journey! ✨`;

  return `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encodeURIComponent(text)}`;
}

// =========================================================
// 9. PRODUCT MATRIX & INVENTORY MANAGEMENT
// =========================================================
let currentViewMode = "grid";

function renderProductMatrix() {
  const gridContainer = document.getElementById("productGrid");
  const tableCard = document.getElementById("productTableCard");
  const tableBody = document.getElementById("productTableBody");
  const query = (document.getElementById("productSearchInput")?.value || "").toLowerCase();
  const selectedCategory = state.currentCategoryFilter;

  // Filter products
  const filtered = state.products.filter(p => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchQuery = !query ||
      p.title.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.tag && p.tag.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (currentViewMode === "grid") {
    if (gridContainer) gridContainer.classList.remove("hidden");
    if (tableCard) tableCard.classList.add("hidden");

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-muted);">
          No wonderland products found matching your search.
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = filtered.map(p => {
      const isLowStock = p.stock < 10;
      return `
        <div class="product-card" data-product-id="${p.id}">
          <div class="product-card-media">
            <img src="${p.image}" alt="${p.title}" class="product-card-img" loading="lazy">
            ${p.tag && p.tag !== "None" ? `<span class="product-curated-badge">${p.tag}</span>` : ""}
            <span class="product-sku-tag">${p.sku}</span>
          </div>
          <div class="product-card-body">
            <span class="prod-category-tag">${p.category}</span>
            <h4 class="prod-title">${p.title}</h4>
            
            <div class="prod-price-row">
              <span class="prod-curr-price">₹${p.price}</span>
              ${p.comparePrice ? `<span class="prod-orig-price">₹${p.comparePrice}</span>` : ""}
            </div>

            <div class="stock-control-row">
              <span class="stock-status-pill ${isLowStock ? 'stock-low' : 'stock-ok'}">
                ${isLowStock ? `⚠️ Low: ${p.stock}` : `In Stock: ${p.stock}`}
              </span>

              <div class="stock-stepper">
                <button class="stepper-btn" onclick="adjustStock('${p.id}', -1)" title="Decrease stock">-</button>
                <span class="stepper-val">${p.stock}</span>
                <button class="stepper-btn" onclick="adjustStock('${p.id}', 1)" title="Increase stock">+</button>
              </div>
            </div>

            <div class="product-card-actions">
              <button class="card-action-btn edit-btn" onclick="openEditProductModal('${p.id}')">✏️ Edit</button>
              <button class="card-action-btn delete-btn" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

  } else {
    // Table mode
    if (gridContainer) gridContainer.classList.add("hidden");
    if (tableCard) tableCard.classList.remove("hidden");

    if (tableBody) {
      tableBody.innerHTML = filtered.map(p => `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${p.image}" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover;">
              <strong style="color: var(--text-bright);">${p.title}</strong>
            </div>
          </td>
          <td>${p.category}</td>
          <td class="font-mono">${p.sku}</td>
          <td style="font-weight: 700; color: var(--color-rose);">₹${p.price}</td>
          <td>
            <div class="stock-stepper" style="display: inline-flex;">
              <button class="stepper-btn" onclick="adjustStock('${p.id}', -1)">-</button>
              <span class="stepper-val">${p.stock}</span>
              <button class="stepper-btn" onclick="adjustStock('${p.id}', 1)">+</button>
            </div>
          </td>
          <td>
            <span class="stock-status-pill ${p.stock < 10 ? 'stock-low' : 'stock-ok'}">
              ${p.stock < 10 ? 'Low Stock' : 'Optimal'}
            </span>
          </td>
          <td>${p.tag || '-'}</td>
          <td class="text-right">
            <button class="row-btn" onclick="openEditProductModal('${p.id}')">Edit</button>
            <button class="row-btn" style="color: #EF4444;" onclick="deleteProduct('${p.id}')">Delete</button>
          </td>
        </tr>
      `).join("");
    }
  }
}

function adjustStock(productId, delta) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  prod.stock = Math.max(0, prod.stock + delta);
  state.save();

  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    window.mayzaSupabase.upsertProduct(prod).catch(console.warn);
  }

  audio.playClick();
  renderProductMatrix();
  renderDashboardOverview();

  if (prod.stock < 5) {
    showToast(`Low Stock Alert: ${prod.title} has only ${prod.stock} left!`, "warning");
  }
}

function deleteProduct(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  if (confirm(`Are you sure you want to remove "${prod.title}" from Wonderland Studio?`)) {
    state.products = state.products.filter(p => p.id !== productId);
    state.save();

    if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
      window.mayzaSupabase.deleteProduct(productId).catch(console.warn);
    }

    showToast(`Removed "${prod.title}" from inventory.`);
    audio.playClick();
    renderProductMatrix();
    renderDashboardOverview();
  }
}

// Product Modal (Add / Edit)
function openAddProductModal() {
  document.getElementById("productModalTitle").textContent = "Add New Wonderland Product";
  document.getElementById("editProductId").value = "";
  document.getElementById("productForm").reset();
  document.getElementById("prodSku").value = `MM-${Date.now().toString().slice(-4)}`;
  document.getElementById("productModal").classList.add("active");
  audio.playClick();
}

function openEditProductModal(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  document.getElementById("productModalTitle").textContent = "Edit Wonderland Product";
  document.getElementById("editProductId").value = prod.id;
  document.getElementById("prodTitle").value = prod.title;
  document.getElementById("prodCategory").value = prod.category;
  document.getElementById("prodSku").value = prod.sku;
  document.getElementById("prodPrice").value = prod.price;
  document.getElementById("prodComparePrice").value = prod.comparePrice || "";
  document.getElementById("prodStock").value = prod.stock;
  document.getElementById("prodTag").value = prod.tag || "None";
  document.getElementById("prodImageSelect").value = prod.image.startsWith("assets/") ? prod.image : "custom";
  
  const customInput = document.getElementById("prodCustomImageUrl");
  if (!prod.image.startsWith("assets/")) {
    customInput.value = prod.image;
    customInput.classList.remove("hidden");
  } else {
    customInput.classList.add("hidden");
  }

  document.getElementById("productModal").classList.add("active");
  audio.playClick();
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("active");
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById("editProductId").value;
  const title = document.getElementById("prodTitle").value.trim();
  const category = document.getElementById("prodCategory").value;
  const sku = document.getElementById("prodSku").value.trim() || `MM-${Date.now().toString().slice(-4)}`;
  const price = parseFloat(document.getElementById("prodPrice").value) || 0;
  const comparePrice = parseFloat(document.getElementById("prodComparePrice").value) || null;
  const stock = parseInt(document.getElementById("prodStock").value) || 0;
  const tag = document.getElementById("prodTag").value;

  let image = document.getElementById("prodImageSelect").value;
  if (image === "custom") {
    image = document.getElementById("prodCustomImageUrl").value.trim() || "assets/p-clips.jpg";
  }

  let targetProduct = null;
  if (editId) {
    const prod = state.products.find(p => p.id === editId);
    if (prod) {
      prod.title = title;
      prod.category = category;
      prod.sku = sku;
      prod.price = price;
      prod.comparePrice = comparePrice;
      prod.stock = stock;
      prod.tag = tag;
      prod.image = image;
      targetProduct = prod;
      showToast(`Updated "${title}" successfully! ✨`);
    }
  } else {
    const newProd = {
      id: `prod-${Date.now()}`,
      title,
      category,
      sku,
      price,
      comparePrice,
      stock,
      tag,
      image,
      salesCount: 0
    };
    state.products.unshift(newProd);
    targetProduct = newProd;
    showToast(`Added "${title}" to Wonderland Studio! 🌸`);
    triggerCelebration();
  }

  state.save();

  if (targetProduct && window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    window.mayzaSupabase.upsertProduct(targetProduct).catch(console.warn);
  }

  closeProductModal();
  renderProductMatrix();
  renderDashboardOverview();
}

// =========================================================
// 10. PRINTABLE PACKING SLIP & INVOICE MODAL
// =========================================================
function openInvoiceModal(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  document.getElementById("invOrderId").textContent = order.id;
  document.getElementById("invBarcode").textContent = `|||| ${order.id} ||||`;
  document.getElementById("invCustName").textContent = order.customer.name;
  document.getElementById("invCustPhone").textContent = order.customer.phone;
  document.getElementById("invCustAddress").textContent = order.customer.address;
  document.getElementById("invDate").textContent = order.rawDate || "17 Sep 2026";
  document.getElementById("invPaymentMode").textContent = order.payment;
  document.getElementById("invStatus").textContent = order.status;

  const itemsBody = document.getElementById("invItemsTableBody");
  if (itemsBody) {
    itemsBody.innerHTML = order.items.map(item => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td class="font-mono">${item.sku}</td>
        <td>${item.qty}</td>
        <td class="font-mono">₹${item.price}</td>
        <td class="text-right font-mono">₹${item.qty * item.price}</td>
      </tr>
    `).join("");
  }

  document.getElementById("invSubtotal").textContent = `₹${order.subtotal}`;
  document.getElementById("invShipping").textContent = order.shipping > 0 ? `₹${order.shipping}` : "FREE";
  document.getElementById("invGrandTotal").textContent = `₹${order.total}`;

  document.getElementById("invoiceModal").classList.add("active");
  audio.playClick();
}

function closeInvoiceModal() {
  document.getElementById("invoiceModal").classList.remove("active");
}

// =========================================================
// 11. PROMO & COUPON WIZARD
// =========================================================
function renderCoupons() {
  const container = document.getElementById("couponsGrid");
  if (!container) return;

  container.innerHTML = state.coupons.map((c, i) => `
    <div class="coupon-ticket">
      <div class="coupon-ticket-header">
        <span class="coupon-code-pill">${c.code}</span>
        <span class="coupon-discount-badge">${c.discount}% OFF</span>
      </div>
      <p class="coupon-desc">${c.desc}</p>
      <div class="coupon-meta-row">
        <span>Min Cart: ₹${c.minSpend || 0}</span>
        <span>Redeemed: ${c.uses || 0} times</span>
      </div>
      <div class="coupon-actions">
        <button class="copy-code-btn" onclick="copyCouponCode('${c.code}')">📋 Copy Code</button>
        <button class="card-action-btn delete-btn" onclick="deleteCoupon(${i})">Remove</button>
      </div>
    </div>
  `).join("");
}

function copyCouponCode(code) {
  navigator.clipboard.writeText(code);
  showToast(`Copied coupon code: ${code}!`);
  audio.playClick();
}

function deleteCoupon(index) {
  state.coupons.splice(index, 1);
  state.save();
  renderCoupons();
  showToast("Coupon removed.");
}

function openAddCouponModal() {
  document.getElementById("couponForm").reset();
  document.getElementById("couponModal").classList.add("active");
  audio.playClick();
}

function closeCouponModal() {
  document.getElementById("couponModal").classList.remove("active");
}

function handleCouponFormSubmit(e) {
  e.preventDefault();
  const code = document.getElementById("couponCode").value.trim().toUpperCase();
  const discount = parseInt(document.getElementById("couponDiscount").value) || 10;
  const minSpend = parseInt(document.getElementById("couponMinSpend").value) || 0;
  const desc = document.getElementById("couponDesc").value.trim() || `${discount}% off Mayza Mart wonderland order`;

  state.coupons.unshift({ code, discount, minSpend, desc, active: true, uses: 0 });
  state.save();
  closeCouponModal();
  renderCoupons();
  showToast(`Created new wonder coupon: ${code} ✨`);
  triggerCelebration();
}

// =========================================================
// 12. VIPS & REVIEWS
// =========================================================
function renderVIPsAndReviews() {
  const vipsGrid = document.getElementById("vipsGrid");
  const reviewsList = document.getElementById("reviewsList");

  if (vipsGrid) {
    vipsGrid.innerHTML = state.vips.map(v => `
      <div class="vip-customer-card">
        <div class="vip-crown-avatar">👑</div>
        <div class="vip-info">
          <span class="vip-name">${v.name}</span>
          <span class="vip-city">📍 ${v.city} • ${v.orders} Orders</span>
          <span class="vip-spend">Total Spent: ₹${v.spend.toLocaleString("en-IN")}</span>
        </div>
      </div>
    `).join("");
  }

  if (reviewsList) {
    reviewsList.innerHTML = state.reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <span class="review-author">${r.author}</span>
          <span class="review-stars">★★★★★</span>
        </div>
        <p class="review-quote">"${r.quote}"</p>
        <span class="review-prod-tag">🌸 Verified Purchase: ${r.product}</span>
      </div>
    `).join("");
  }
}

// =========================================================
// 13. WHOLESALE PURCHASES & PROCUREMENT ENGINE
// =========================================================
function renderWholesalePurchases() {
  const searchInput = document.getElementById("wholesaleSearchInput");
  const catFilter = document.getElementById("wholesaleCategoryFilter");
  const payFilter = document.getElementById("wholesalePaymentFilter");

  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const cat = catFilter ? catFilter.value : "all";
  const pay = payFilter ? payFilter.value : "all";

  // Filter purchases
  let filtered = state.wholesalePurchases || [];

  if (query) {
    filtered = filtered.filter(p => 
      p.billNumber.toLowerCase().includes(query) ||
      p.supplier.toLowerCase().includes(query) ||
      (p.location && p.location.toLowerCase().includes(query)) ||
      p.productName.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  if (cat !== "all") {
    filtered = filtered.filter(p => p.category === cat);
  }

  if (pay !== "all") {
    filtered = filtered.filter(p => p.paymentStatus === pay);
  }

  // Update nav badge count
  const navBadge = document.getElementById("wholesaleNavCount");
  if (navBadge) {
    navBadge.textContent = state.wholesalePurchases.length;
  }

  // Update Aurora KPI Cards
  renderWholesaleKpis();

  // Render Table Rows
  const tableBody = document.getElementById("wholesaleTableBody");
  if (!tableBody) return;

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="table-empty-row">
          <div class="empty-state-box">
            <span class="empty-emoji">🏭</span>
            <h4>No Wholesale Purchases Found</h4>
            <p>Log your bulk purchases to track wholesale costs, quantities, and profit margins.</p>
            <button class="action-btn primary-glow-btn mt-3" onclick="openAddWholesaleModal()">
              <span>＋ Log First Wholesale Purchase</span>
            </button>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(p => {
    const totalCost = p.quantity * p.unitCost;
    const unitProfit = p.sellingPrice - p.unitCost;
    const totalProfit = unitProfit * p.quantity;
    const marginPct = p.unitCost > 0 ? Math.round((unitProfit / p.unitCost) * 100) : 0;

    let marginClass = "margin-high";
    if (marginPct < 60) marginClass = "margin-low";
    else if (marginPct < 120) marginClass = "margin-mid";

    let payClass = "pay-paid";
    let payIcon = "🟢";
    if (p.paymentStatus === "Partial") {
      payClass = "pay-partial";
      payIcon = "🟡";
    } else if (p.paymentStatus === "Credit") {
      payClass = "pay-credit";
      payIcon = "🔴";
    }

    const formattedDate = new Date(p.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    return `
      <tr class="wholesale-row">
        <td>
          <div class="ws-date-cell">
            <span class="ws-bill-code font-mono">${p.billNumber}</span>
            <span class="ws-bill-date">${formattedDate}</span>
          </div>
        </td>
        <td>
          <div class="ws-vendor-cell">
            <strong class="ws-vendor-name">${p.supplier}</strong>
            <span class="ws-vendor-city">📍 ${p.location || "Direct Hub"}</span>
          </div>
        </td>
        <td>
          <div class="ws-product-cell">
            <strong class="ws-product-title">${p.productName}</strong>
            <span class="ws-category-badge">${p.category}</span>
          </div>
        </td>
        <td>
          <div class="ws-qty-cell">
            <span class="ws-qty-val font-mono">${p.quantity} pcs</span>
            <span class="ws-unit-cost font-mono">@ ₹${p.unitCost.toLocaleString("en-IN")} / pc</span>
          </div>
        </td>
        <td>
          <span class="ws-total-spend font-mono">₹${totalCost.toLocaleString("en-IN")}</span>
        </td>
        <td>
          <span class="ws-selling-price font-mono">₹${p.sellingPrice.toLocaleString("en-IN")}</span>
        </td>
        <td>
          <div class="ws-margin-cell">
            <span class="ws-profit-val font-mono text-mint">+₹${totalProfit.toLocaleString("en-IN")}</span>
            <span class="ws-margin-badge ${marginClass}">+${marginPct}% (+₹${unitProfit}/pc)</span>
          </div>
        </td>
        <td>
          <span class="ws-pay-pill ${payClass}">${payIcon} ${p.paymentStatus}</span>
        </td>
        <td class="text-right ws-actions-cell">
          <div class="ws-row-actions">
            ${p.synced 
              ? `<button class="row-btn synced-pill" title="Stock synced with Product Matrix" onclick="syncWholesaleToProducts('${p.id}')">✓ Synced</button>`
              : `<button class="row-btn sync-btn" title="Add or update stock in Product Matrix" onclick="syncWholesaleToProducts('${p.id}')">🔄 Sync</button>`
            }
            <button class="row-btn" title="View & Print Voucher" onclick="viewWholesaleBill('${p.id}')">📄 Voucher</button>
            <button class="row-btn row-del-btn" title="Delete purchase" onclick="deleteWholesalePurchase('${p.id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderWholesaleKpis() {
  const purchases = state.wholesalePurchases || [];

  const totalSpend = purchases.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
  const totalUnits = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const uniqueProducts = new Set(purchases.map(p => p.productName.toLowerCase().trim())).size;
  const totalRetail = purchases.reduce((sum, p) => sum + (p.quantity * p.sellingPrice), 0);
  const totalProfit = totalRetail - totalSpend;
  const avgMargin = totalSpend > 0 ? Math.round((totalProfit / totalSpend) * 100) : 0;
  const uniqueVendors = new Set(purchases.map(p => p.supplier.toLowerCase().trim())).size;

  const spendEl = document.getElementById("kpiWholesaleSpend");
  const unitsEl = document.getElementById("kpiWholesaleUnits");
  const prodsEl = document.getElementById("kpiWholesaleProducts");
  const profitEl = document.getElementById("kpiWholesaleProfit");
  const marginPctEl = document.getElementById("kpiWholesaleMarginPct");
  const retailSubEl = document.getElementById("kpiWholesaleRetailSub");
  const vendorsSubEl = document.getElementById("kpiWholesaleVendorsSub");

  if (spendEl) spendEl.textContent = totalSpend.toLocaleString("en-IN");
  if (unitsEl) unitsEl.textContent = totalUnits.toLocaleString("en-IN");
  if (prodsEl) prodsEl.textContent = uniqueProducts;
  if (profitEl) profitEl.textContent = totalProfit.toLocaleString("en-IN");
  if (marginPctEl) marginPctEl.textContent = `+${avgMargin}% Avg Markup`;
  if (retailSubEl) retailSubEl.textContent = `Est. Retail Value: ₹${totalRetail.toLocaleString("en-IN")}`;
  if (vendorsSubEl) vendorsSubEl.textContent = `From ${uniqueVendors} wholesale suppliers`;
}

function calculateWholesaleLiveMargin() {
  const qty = parseFloat(document.getElementById("wsQuantity")?.value) || 0;
  const unitCost = parseFloat(document.getElementById("wsUnitCost")?.value) || 0;
  const sellingPrice = parseFloat(document.getElementById("wsSellingPrice")?.value) || 0;

  const totalCost = qty * unitCost;
  const retailRev = qty * sellingPrice;
  const unitProfit = sellingPrice - unitCost;
  const totalProfit = retailRev - totalCost;
  const marginPct = unitCost > 0 ? Math.round((unitProfit / unitCost) * 100) : 0;

  const prevCost = document.getElementById("prevTotalCost");
  const prevRev = document.getElementById("prevRetailRev");
  const prevUProf = document.getElementById("prevUnitProfit");
  const prevTProf = document.getElementById("prevTotalProfit");
  const prevMarg = document.getElementById("prevMarginPct");

  if (prevCost) prevCost.textContent = `₹${totalCost.toLocaleString("en-IN")}`;
  if (prevRev) prevRev.textContent = `₹${retailRev.toLocaleString("en-IN")}`;
  if (prevUProf) {
    prevUProf.textContent = `${unitProfit >= 0 ? "+" : ""}₹${unitProfit.toLocaleString("en-IN")}`;
    prevUProf.style.color = unitProfit >= 0 ? "var(--color-mint)" : "#EF4444";
  }
  if (prevTProf) {
    prevTProf.textContent = `${totalProfit >= 0 ? "+" : ""}₹${totalProfit.toLocaleString("en-IN")}`;
    prevTProf.style.color = totalProfit >= 0 ? "var(--color-mint)" : "#EF4444";
  }
  if (prevMarg) {
    prevMarg.textContent = `${marginPct >= 0 ? "+" : ""}${marginPct}%`;
    prevMarg.className = `preview-badge ${marginPct >= 120 ? 'margin-high' : marginPct >= 60 ? 'margin-mid' : 'margin-low'}`;
  }
}

function populateWholesaleProductSelect() {
  const select = document.getElementById("wsProductSelect");
  if (!select) return;

  select.innerHTML = `<option value="">-- New Product (Or pick existing store product) --</option>` +
    state.products.map(p => `
      <option value="${p.id}" data-title="${p.title}" data-category="${p.category}" data-price="${p.price}">
        ${p.title} (Current Stock: ${p.stock} | Selling: ₹${p.price})
      </option>
    `).join("");
}

function openAddWholesaleModal() {
  const modal = document.getElementById("wholesaleModal");
  const form = document.getElementById("wholesaleForm");
  if (!modal || !form) return;

  form.reset();
  document.getElementById("editWholesaleId").value = "";
  document.getElementById("wsBillNumber").value = `INV-WS-${Math.floor(100 + Math.random() * 900)}`;
  document.getElementById("wsPurchaseDate").value = new Date().toISOString().split("T")[0];
  document.getElementById("wsSyncCheckbox").checked = true;

  populateWholesaleProductSelect();
  calculateWholesaleLiveMargin();

  modal.classList.add("active");
  audio.playClick();
}

function closeAddWholesaleModal() {
  const modal = document.getElementById("wholesaleModal");
  if (modal) modal.classList.remove("active");
}

function handleWholesaleFormSubmit(e) {
  e.preventDefault();

  const supplier = document.getElementById("wsSupplierName").value.trim();
  const location = document.getElementById("wsSupplierLocation").value.trim() || "India";
  const billNumber = document.getElementById("wsBillNumber").value.trim();
  const date = document.getElementById("wsPurchaseDate").value || new Date().toISOString().split("T")[0];
  const selectedProdId = document.getElementById("wsProductSelect").value;
  const productName = document.getElementById("wsProductName").value.trim();
  const category = document.getElementById("wsCategory").value;
  const quantity = parseInt(document.getElementById("wsQuantity").value) || 0;
  const unitCost = parseFloat(document.getElementById("wsUnitCost").value) || 0;
  const sellingPrice = parseFloat(document.getElementById("wsSellingPrice").value) || 0;
  const paymentStatus = document.getElementById("wsPaymentStatus").value;
  const paymentMode = document.getElementById("wsPaymentMode").value;
  const notes = document.getElementById("wsNotes").value.trim();
  const shouldSync = document.getElementById("wsSyncCheckbox").checked;

  if (!supplier || !productName || quantity <= 0 || unitCost <= 0) {
    showToast("Please provide supplier, product, quantity and cost.", "warning");
    return;
  }

  const newPurchase = {
    id: `ws-${Date.now()}`,
    billNumber,
    date,
    supplier,
    location,
    productId: selectedProdId || null,
    productName,
    category,
    quantity,
    unitCost,
    sellingPrice,
    totalCost: quantity * unitCost,
    paymentStatus,
    paymentMode,
    notes,
    synced: false
  };

  // Sync to product catalog if requested
  if (shouldSync) {
    let existingProd = null;
    if (selectedProdId) {
      existingProd = state.products.find(p => p.id === selectedProdId);
    }
    if (!existingProd) {
      existingProd = state.products.find(p => p.title.toLowerCase().trim() === productName.toLowerCase().trim());
    }

    if (existingProd) {
      existingProd.stock += quantity;
      existingProd.price = sellingPrice;
      newPurchase.productId = existingProd.id;
      showToast(`Updated existing store inventory for "${existingProd.title}" (+${quantity} units)! 📦`);
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        title: productName,
        category: category,
        sku: `MM-${category.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        price: sellingPrice,
        comparePrice: Math.round(sellingPrice * 1.35),
        stock: quantity,
        tag: "New Arrival",
        image: "assets/p-giftbox.jpg",
        salesCount: 0
      };
      state.products.unshift(newProd);
      newPurchase.productId = newProd.id;
      showToast(`Created new store product "${productName}" with ${quantity} units stock! 🌸`);
    }
    newPurchase.synced = true;
  }

  state.wholesalePurchases.unshift(newPurchase);
  state.save();

  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    window.mayzaSupabase.upsertWholesale(newPurchase).catch(console.warn);
    if (shouldSync && newPurchase.productId) {
      const pToSync = state.products.find(p => p.id === newPurchase.productId);
      if (pToSync) window.mayzaSupabase.upsertProduct(pToSync).catch(console.warn);
    }
  }

  triggerCelebration();
  showToast(`Wholesale purchase ${billNumber} logged successfully! (₹${(quantity * unitCost).toLocaleString("en-IN")})`);

  closeAddWholesaleModal();
  renderWholesalePurchases();
  renderProductMatrix();
  renderDashboardOverview();
}

function syncWholesaleToProducts(purchaseId) {
  const purchase = state.wholesalePurchases.find(p => p.id === purchaseId);
  if (!purchase) return;

  let existing = null;
  if (purchase.productId) {
    existing = state.products.find(p => p.id === purchase.productId);
  }
  if (!existing) {
    existing = state.products.find(p => p.title.toLowerCase().trim() === purchase.productName.toLowerCase().trim());
  }

  let prodToSync = null;
  if (existing) {
    existing.stock += purchase.quantity;
    existing.price = purchase.sellingPrice;
    prodToSync = existing;
  } else {
    const newProd = {
      id: `prod-${Date.now()}`,
      title: purchase.productName,
      category: purchase.category,
      sku: `MM-${purchase.category.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      price: purchase.sellingPrice,
      comparePrice: Math.round(purchase.sellingPrice * 1.35),
      stock: purchase.quantity,
      tag: "New Arrival",
      image: "assets/p-giftbox.jpg",
      salesCount: 0
    };
    state.products.unshift(newProd);
    purchase.productId = newProd.id;
    prodToSync = newProd;
  }

  purchase.synced = true;
  state.save();

  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    window.mayzaSupabase.upsertWholesale(purchase).catch(console.warn);
    if (prodToSync) window.mayzaSupabase.upsertProduct(prodToSync).catch(console.warn);
  }

  audio.playSuccess();
  showToast(`Synced ${purchase.quantity} units of "${purchase.productName}" into Product Matrix! 📦`);
  renderWholesalePurchases();
  renderProductMatrix();
  renderDashboardOverview();
}

function deleteWholesalePurchase(purchaseId) {
  const purchase = state.wholesalePurchases.find(p => p.id === purchaseId);
  if (!purchase) return;

  if (confirm(`Are you sure you want to delete wholesale bill "${purchase.billNumber}" from ${purchase.supplier}?`)) {
    state.wholesalePurchases = state.wholesalePurchases.filter(p => p.id !== purchaseId);
    state.save();

    if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
      window.mayzaSupabase.deleteWholesale(purchaseId).catch(console.warn);
    }

    audio.playClick();
    showToast(`Deleted wholesale purchase ${purchase.billNumber}.`);
    renderWholesalePurchases();
  }
}

function viewWholesaleBill(purchaseId) {
  const p = state.wholesalePurchases.find(x => x.id === purchaseId);
  if (!p) return;

  const area = document.getElementById("wholesalePrintArea");
  const modal = document.getElementById("wholesaleBillModal");
  if (!area || !modal) return;

  const totalCost = p.quantity * p.unitCost;
  const unitProfit = p.sellingPrice - p.unitCost;
  const totalProfit = unitProfit * p.quantity;
  const marginPct = p.unitCost > 0 ? Math.round((unitProfit / p.unitCost) * 100) : 0;
  const formattedDate = new Date(p.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  area.innerHTML = `
    <div class="inv-top-bar">
      <div class="inv-brand">
        <img src="mascot.png" alt="Mayza Logo" class="inv-mascot">
        <div>
          <h2 class="inv-store-name">Mayza Mart Wonderland</h2>
          <p class="inv-founders">Inventory Inward &amp; Procurement Voucher</p>
          <p class="inv-contact">Curated by Mauji, Aynul &amp; Faiza • New Delhi, IN</p>
        </div>
      </div>
      <div class="inv-badge-block">
        <div class="inv-badge-pill" style="background: rgba(139, 92, 246, 0.15); color: #8B5CF6;">B2B WHOLESALE INWARD</div>
        <div class="inv-barcode">|||| ${p.billNumber} ||||</div>
        <div class="inv-order-id">#${p.billNumber}</div>
      </div>
    </div>

    <hr class="inv-divider">

    <div class="inv-addresses-grid">
      <div class="inv-box">
        <span class="inv-box-title">SUPPLIER / VENDOR DETAILS</span>
        <div class="inv-customer-name">${p.supplier}</div>
        <div class="inv-detail-line">Market / City: <strong>${p.location || "India"}</strong></div>
        <div class="inv-detail-line">Bill / Invoice Reference: <strong>${p.billNumber}</strong></div>
        <div class="inv-detail-line">Purchase Date: <strong>${formattedDate}</strong></div>
      </div>
      <div class="inv-box">
        <span class="inv-box-title">PAYMENT &amp; SETTLEMENT</span>
        <div class="inv-meta-row"><span>Payment Status:</span> <strong>${p.paymentStatus}</strong></div>
        <div class="inv-meta-row"><span>Payment Method:</span> <strong>${p.paymentMode || "Bank Transfer"}</strong></div>
        <div class="inv-meta-row"><span>Stock Matrix Sync:</span> <strong>${p.synced ? "✓ Synced to Catalog" : "Pending Sync"}</strong></div>
        <div class="inv-meta-row"><span>Authorized By:</span> <strong>Mauji &amp; Aynul</strong></div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="inv-items-table">
      <thead>
        <tr>
          <th>Procured Product Description</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Wholesale Unit Cost</th>
          <th class="text-right">Total Spent</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${p.productName}</strong></td>
          <td><span class="ws-category-badge">${p.category}</span></td>
          <td class="font-mono"><strong>${p.quantity} pcs</strong></td>
          <td class="font-mono">₹${p.unitCost.toLocaleString("en-IN")}</td>
          <td class="text-right font-mono"><strong>₹${totalCost.toLocaleString("en-IN")}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="inv-summary-deck">
      <div class="inv-calc-box">
        <span class="inv-calc-title">RETAIL MARGIN PROJECTION</span>
        <div class="inv-meta-row"><span>Target Selling Price:</span> <strong>₹${p.sellingPrice.toLocaleString("en-IN")} / pc</strong></div>
        <div class="inv-meta-row"><span>Gross Profit per Unit:</span> <strong style="color: var(--color-mint);">+₹${unitProfit.toLocaleString("en-IN")}</strong></div>
        <div class="inv-meta-row"><span>Projected Retail Value:</span> <strong>₹${(p.quantity * p.sellingPrice).toLocaleString("en-IN")}</strong></div>
        <div class="inv-meta-row"><span>Estimated Total Profit:</span> <strong style="color: var(--color-mint);">+₹${totalProfit.toLocaleString("en-IN")} (+${marginPct}%)</strong></div>
      </div>

      <div class="inv-totals-box">
        <div class="inv-total-row final-total">
          <span>Total Capital Invested:</span>
          <span class="font-mono">₹${totalCost.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>

    ${p.notes ? `
      <div style="margin-top: 20px; padding: 12px 16px; background: rgba(0,0,0,0.03); border-radius: 8px; font-size: 0.85rem;">
        <strong>Supplier Remarks / Notes:</strong> ${p.notes}
      </div>
    ` : ""}

    <div class="inv-footer-love">
      <p class="love-msg">Official Mayza Mart Wholesale Procurement Record</p>
      <p class="note-sign">— Managed by Mauji, Aynul &amp; Faiza 🌸✨</p>
    </div>
  `;

  modal.classList.add("active");
  audio.playClick();
}

function closeWholesaleBillModal() {
  const modal = document.getElementById("wholesaleBillModal");
  if (modal) modal.classList.remove("active");
}

function exportWholesaleCSV() {
  const purchases = state.wholesalePurchases || [];
  if (purchases.length === 0) {
    showToast("No wholesale purchases to export.", "warning");
    return;
  }

  const headers = [
    "Bill Number",
    "Date",
    "Supplier",
    "Location",
    "Product Name",
    "Category",
    "Quantity (Units)",
    "Wholesale Cost Per Unit (INR)",
    "Total Cost Spent (INR)",
    "Target Selling Price (INR)",
    "Profit Per Unit (INR)",
    "Projected Total Profit (INR)",
    "Markup Margin %",
    "Payment Status",
    "Payment Mode",
    "Catalog Synced",
    "Notes"
  ];

  const rows = purchases.map(p => {
    const totalCost = p.quantity * p.unitCost;
    const unitProfit = p.sellingPrice - p.unitCost;
    const totalProfit = unitProfit * p.quantity;
    const marginPct = p.unitCost > 0 ? Math.round((unitProfit / p.unitCost) * 100) : 0;

    return [
      `"${p.billNumber}"`,
      `"${p.date}"`,
      `"${p.supplier.replace(/"/g, '""')}"`,
      `"${(p.location || "").replace(/"/g, '""')}"`,
      `"${p.productName.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.quantity,
      p.unitCost,
      totalCost,
      p.sellingPrice,
      unitProfit,
      totalProfit,
      `${marginPct}%`,
      `"${p.paymentStatus}"`,
      `"${p.paymentMode || ""}"`,
      p.synced ? "Yes" : "No",
      `"${(p.notes || "").replace(/"/g, '""')}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Mayza_Mart_Wholesale_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  audio.playSuccess();
  showToast("Wholesale procurement ledger exported to CSV! 📥");
}

// =========================================================
// 14. LIVE CLOCK & SIMULATED REAL-TIME ACTIONS
// =========================================================
function startLiveClock() {
  const clockEl = document.getElementById("clockTime");
  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });
    }
  }
  update();
  setInterval(update, 1000);
}

function simulateNewCustomerOrder() {
  const names = ["Ayesha Khan", "Simran Bedi", "Kavya Nair", "Pooja Hegde", "Zara Merchant", "Rohit Malhotra"];
  const cities = ["New Delhi", "Mumbai", "Jaipur", "Bengaluru", "Kolkata", "Hyderabad"];
  const randomProduct = state.products[Math.floor(Math.random() * state.products.length)];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];

  const newOrder = {
    id: `MM-${Math.floor(8842 + Math.random() * 500)}`,
    customer: {
      name: randomName,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
      city: `${randomCity}, IN`,
      address: `Tower ${Math.floor(1 + Math.random() * 12)}, Sunshine Heights, ${randomCity}`
    },
    items: [
      { name: randomProduct.title, sku: randomProduct.sku, qty: 1, price: randomProduct.price }
    ],
    subtotal: randomProduct.price,
    shipping: randomProduct.price > 499 ? 0 : 49,
    total: randomProduct.price + (randomProduct.price > 499 ? 0 : 49),
    payment: "UPI • Instant",
    status: "New",
    timestamp: "Just now",
    rawDate: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
  };

  state.orders.unshift(newOrder);
  state.save();
  showToast(`⚡ New order received: ${newOrder.id} from ${randomName}! (₹${newOrder.total})`);
  triggerCelebration();
  renderOrdersTable();
  renderDashboardOverview();
}

// =========================================================
// 14. EVENT LISTENERS SETUP
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  startLiveClock();
  renderDashboardOverview();

  // Sidebar navigation clicks
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  // Mobile nav toggle
  const mobileToggle = document.getElementById("mobileNavToggle");
  const sidebar = document.getElementById("studioSidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      audio.playClick();
    });
  }

  // Audio FX toggle
  const soundBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      localStorage.setItem("mm_sound", state.soundEnabled);
      if (soundIcon) soundIcon.textContent = state.soundEnabled ? "🔊" : "🔇";
      showToast(`Sound FX ${state.soundEnabled ? "Enabled" : "Muted"}`);
      audio.playClick();
    });
  }

  // Theme Switcher (Light Wonderland [Default] / Velvet Twilight)
  const themeBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
  const savedTheme = localStorage.getItem("mm_theme") || "light";
  if (savedTheme === "twilight") {
    document.body.classList.add("twilight-theme");
    if (themeIcon) themeIcon.textContent = "🌙";
  } else {
    document.body.classList.remove("twilight-theme");
    if (themeIcon) themeIcon.textContent = "🌸";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isTwilight = document.body.classList.toggle("twilight-theme");
      const current = isTwilight ? "twilight" : "light";
      localStorage.setItem("mm_theme", current);
      if (themeIcon) themeIcon.textContent = isTwilight ? "🌙" : "🌸";
      showToast(`Theme: ${isTwilight ? "Velvet Twilight 🌙" : "Light Wonderland 🌸"}`);
      audio.playClick();
      renderSalesChart(currentChartTimeframe);
    });
  }

  // Mascot Co-pilot quick action
  const mascotActionBtn = document.getElementById("mascotActionBtn");
  if (mascotActionBtn) {
    mascotActionBtn.addEventListener("click", () => {
      switchView("orders");
      state.currentOrderStatusFilter = "New";
      document.querySelectorAll(".status-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.status === "New");
      });
      renderOrdersTable();
    });
  }

  // Dashboard buttons
  document.getElementById("refreshMetricsBtn")?.addEventListener("click", () => {
    showToast("Command Pulse metrics refreshed! ⚡");
    triggerCelebration();
    renderDashboardOverview();
  });

  document.getElementById("quickNewProductBtn")?.addEventListener("click", openAddProductModal);
  document.getElementById("openAddProductModalBtn")?.addEventListener("click", openAddProductModal);
  document.getElementById("closeProductModalBtn")?.addEventListener("click", closeProductModal);
  document.getElementById("cancelProductBtn")?.addEventListener("click", closeProductModal);
  document.getElementById("productForm")?.addEventListener("submit", handleProductFormSubmit);

  // Timeframe chart tabs
  document.getElementById("timeframeSelector")?.addEventListener("click", (e) => {
    if (e.target.classList.contains("tf-btn")) {
      document.querySelectorAll(".tf-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      audio.playClick();
      renderSalesChart(e.target.dataset.time);
    }
  });

  // Quick navigation helpers in dashboard
  document.getElementById("goToOrdersBtn")?.addEventListener("click", () => switchView("orders"));
  document.getElementById("goToProductsBtn")?.addEventListener("click", () => switchView("products"));

  // Order status filter tabs
  document.getElementById("orderStatusTabs")?.addEventListener("click", (e) => {
    const tab = e.target.closest(".status-tab");
    if (tab) {
      document.querySelectorAll(".status-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.currentOrderStatusFilter = tab.dataset.status;
      audio.playClick();
      renderOrdersTable();
    }
  });

  // Order filter search input
  document.getElementById("orderFilterInput")?.addEventListener("input", renderOrdersTable);
  document.getElementById("simulateOrderBtn")?.addEventListener("click", simulateNewCustomerOrder);

  // Product category pills
  document.getElementById("productCategoryPills")?.addEventListener("click", (e) => {
    const pill = e.target.closest(".cat-filter-pill");
    if (pill) {
      document.querySelectorAll(".cat-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.currentCategoryFilter = pill.dataset.category;
      audio.playClick();
      renderProductMatrix();
    }
  });

  // Product search input
  document.getElementById("productSearchInput")?.addEventListener("input", renderProductMatrix);

  // View mode switcher (Grid / Table)
  document.getElementById("viewModeToggle")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (btn) {
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentViewMode = btn.dataset.mode;
      audio.playClick();
      renderProductMatrix();
    }
  });

  // Product image select dropdown
  document.getElementById("prodImageSelect")?.addEventListener("change", (e) => {
    const customInput = document.getElementById("prodCustomImageUrl");
    if (e.target.value === "custom") {
      customInput?.classList.remove("hidden");
    } else {
      customInput?.classList.add("hidden");
    }
  });

  // Invoice Modal Print & Close
  document.getElementById("closeInvoiceModalBtn")?.addEventListener("click", closeInvoiceModal);
  document.getElementById("printInvoiceBtn")?.addEventListener("click", () => {
    window.print();
  });

  // Coupons
  document.getElementById("openAddCouponModalBtn")?.addEventListener("click", openAddCouponModal);
  document.getElementById("closeCouponModalBtn")?.addEventListener("click", closeCouponModal);
  document.getElementById("cancelCouponBtn")?.addEventListener("click", closeCouponModal);
  document.getElementById("couponForm")?.addEventListener("submit", handleCouponFormSubmit);

  // Storefront top banner save
  document.getElementById("saveMarqueeBtn")?.addEventListener("click", () => {
    const text = document.getElementById("marqueeTextInput")?.value;
    localStorage.setItem("mm_marquee", text);
    showToast("Storefront announcement banner updated live! 📢");
    triggerCelebration();
  });

  // Global search (Ctrl + K)
  const globalSearch = document.getElementById("globalSearchInput");
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      globalSearch?.focus();
    }
  });

  globalSearch?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    if (!val) return;
    // Auto switch to products or orders if query matches
    if (state.currentView !== "products" && state.currentView !== "orders") {
      switchView("products");
      const prodSearch = document.getElementById("productSearchInput");
      if (prodSearch) {
        prodSearch.value = val;
        renderProductMatrix();
      }
    }
  });

  // Wholesale purchases handlers
  document.getElementById("openAddWholesaleModalBtn")?.addEventListener("click", openAddWholesaleModal);
  document.getElementById("closeWholesaleModalBtn")?.addEventListener("click", closeAddWholesaleModal);
  document.getElementById("cancelWholesaleBtn")?.addEventListener("click", closeAddWholesaleModal);
  document.getElementById("wholesaleForm")?.addEventListener("submit", handleWholesaleFormSubmit);

  // Live margin calculations
  ["wsQuantity", "wsUnitCost", "wsSellingPrice"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", calculateWholesaleLiveMargin);
  });

  // Link to existing product dropdown
  document.getElementById("wsProductSelect")?.addEventListener("change", (e) => {
    const selectedOption = e.target.selectedOptions[0];
    if (selectedOption && selectedOption.value) {
      document.getElementById("wsProductName").value = selectedOption.dataset.title || "";
      document.getElementById("wsCategory").value = selectedOption.dataset.category || "Hair Accessories";
      document.getElementById("wsSellingPrice").value = selectedOption.dataset.price || "";
      calculateWholesaleLiveMargin();
    }
  });

  // Wholesale filters & export
  document.getElementById("wholesaleSearchInput")?.addEventListener("input", renderWholesalePurchases);
  document.getElementById("wholesaleCategoryFilter")?.addEventListener("change", renderWholesalePurchases);
  document.getElementById("wholesalePaymentFilter")?.addEventListener("change", renderWholesalePurchases);
  document.getElementById("exportWholesaleCsvBtn")?.addEventListener("click", exportWholesaleCSV);

  // Wholesale bill slip modal
  document.getElementById("closeWholesaleBillModalBtn")?.addEventListener("click", closeWholesaleBillModal);
  document.getElementById("printWholesaleBillBtn")?.addEventListener("click", () => window.print());

  // Initial render of wholesale count badge & data
  renderWholesalePurchases();

  // Initialize Supabase Cloud Manager
  initSupabaseManager();

  // Reset to default demo data
  document.getElementById("resetDataBtn")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all data back to factory demo defaults?")) {
      state.reset();
      showToast("Store data restored to demo defaults.");
      renderDashboardOverview();
      renderOrdersTable();
      renderProductMatrix();
      renderCoupons();
      renderWholesalePurchases();
    }
  });
});

// =========================================================
// 15. SUPABASE CLOUD CONNECTION MANAGER
// =========================================================
function initSupabaseManager() {
  const pillBtn = document.getElementById("supabasePillBtn");
  const pillText = document.getElementById("supabasePillText");
  const modal = document.getElementById("supabaseModal");
  const closeBtn = document.getElementById("closeSupabaseModalBtn");
  const form = document.getElementById("supabaseConfigForm");
  const urlInput = document.getElementById("supabaseUrlInput");
  const keyInput = document.getElementById("supabaseKeyInput");
  const testBtn = document.getElementById("testSupabaseBtn");
  const disconnectBtn = document.getElementById("disconnectSupabaseBtn");
  const pushBtn = document.getElementById("pushToSupabaseBtn");
  const pullBtn = document.getElementById("pullFromSupabaseBtn");
  const statusBanner = document.getElementById("supabaseStatusBanner");
  const bannerIcon = document.getElementById("supabaseBannerIcon");
  const bannerTitle = document.getElementById("supabaseBannerTitle");
  const bannerDetail = document.getElementById("supabaseBannerDetail");

  function updateStatusUI(connected, message) {
    if (!pillBtn || !pillText) return;
    if (connected) {
      pillBtn.className = "supabase-cloud-pill connected";
      pillText.textContent = "Supabase: Cloud Active";
      pillBtn.title = "Supabase PostgreSQL is connected & synced";
      if (statusBanner) {
        statusBanner.className = "supabase-status-banner connected";
        if (bannerIcon) bannerIcon.textContent = "🟢";
        if (bannerTitle) bannerTitle.textContent = "Connected to Supabase Cloud";
        if (bannerDetail) bannerDetail.textContent = message || `Project: ${window.mayzaSupabase?.url || ""}`;
      }
    } else {
      pillBtn.className = "supabase-cloud-pill disconnected";
      pillText.textContent = "Supabase: Offline";
      pillBtn.title = "Click to configure Supabase Cloud Database";
      if (statusBanner) {
        statusBanner.className = "supabase-status-banner";
        if (bannerIcon) bannerIcon.textContent = "🟡";
        if (bannerTitle) bannerTitle.textContent = "Local Cache Mode";
        if (bannerDetail) bannerDetail.textContent = message || "Running locally with browser storage. Enter credentials to connect.";
      }
    }
  }

  // Listen to custom events from supabaseClient.js
  window.addEventListener("mayza:supabase-status", (e) => {
    updateStatusUI(e.detail.connected, e.detail.message);
  });

  // Pre-fill inputs if credentials exist
  if (window.mayzaSupabase) {
    if (urlInput) urlInput.value = window.mayzaSupabase.url || "https://twvxffxtotizfbsxvgjb.supabase.co";
    if (keyInput) keyInput.value = window.mayzaSupabase.key || "";
    updateStatusUI(window.mayzaSupabase.isConfigured(), window.mayzaSupabase.isConfigured() ? "Cloud database connected" : "");
  }

  // Open modal
  pillBtn?.addEventListener("click", () => {
    modal?.classList.add("active");
    audio?.playClick();
  });

  // Close modal
  closeBtn?.addEventListener("click", () => {
    modal?.classList.remove("active");
  });

  // Test Connection
  testBtn?.addEventListener("click", async () => {
    if (!window.mayzaSupabase) return;
    const url = urlInput?.value.trim();
    const key = keyInput?.value.trim();
    if (!url || !key) {
      showToast("Please enter both Project URL and Anon Key first.", "warning");
      return;
    }

    testBtn.disabled = true;
    testBtn.innerHTML = "<span>⏳ Testing Connection...</span>";
    
    window.mayzaSupabase.setCredentials(url, key);
    const res = await window.mayzaSupabase.testConnection();
    
    testBtn.disabled = false;
    testBtn.innerHTML = "<span>🔍 Test Connection</span>";

    if (res.success) {
      showToast("Supabase Connection Successful! ⚡ Database online.");
      triggerCelebration();
      updateStatusUI(true, res.message);
    } else {
      showToast(res.message, "warning");
      updateStatusUI(false, res.message);
    }
  });

  // Save Credentials Form
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!window.mayzaSupabase) return;
    const url = urlInput.value.trim();
    const key = keyInput.value.trim();

    window.mayzaSupabase.setCredentials(url, key);
    showToast("Supabase credentials saved! Testing database link...");

    const res = await window.mayzaSupabase.testConnection();
    if (res.success) {
      showToast("Supabase Cloud Connected! Loading latest cloud data...");
      triggerCelebration();
      updateStatusUI(true, "Cloud Database Connected");
      // Pull and refresh
      const pulled = await state.initCloudSync();
      if (pulled) {
        renderDashboardOverview();
        renderOrdersTable();
        renderProductMatrix();
        renderCoupons();
        renderWholesalePurchases();
        showToast("Synced with cloud catalog! 🌸");
      }
      modal?.classList.remove("active");
    } else {
      showToast(`Credentials saved, but connection failed: ${res.message}`, "warning");
    }
  });

  // Disconnect
  disconnectBtn?.addEventListener("click", () => {
    if (!window.mayzaSupabase) return;
    if (confirm("Disconnect Supabase cloud? Your app will switch back to local browser storage.")) {
      window.mayzaSupabase.clearCredentials();
      if (urlInput) urlInput.value = "https://twvxffxtotizfbsxvgjb.supabase.co";
      if (keyInput) keyInput.value = "";
      showToast("Supabase disconnected. Operating in local mode.");
      updateStatusUI(false, "Disconnected from cloud.");
      modal?.classList.remove("active");
    }
  });

  // Push Local Data to Supabase
  pushBtn?.addEventListener("click", async () => {
    if (!window.mayzaSupabase || !window.mayzaSupabase.isConfigured()) {
      showToast("Please save and connect your Supabase credentials first.", "warning");
      return;
    }

    pushBtn.disabled = true;
    pushBtn.innerHTML = "<span>⏳ Uploading Catalog...</span>";

    try {
      const res = await window.mayzaSupabase.syncLocalToSupabase(state);
      showToast(`Cloud Sync Complete! Uploaded ${res.products} products, ${res.orders} orders, ${res.wholesale} wholesale bills! 🚀`);
      triggerCelebration();
      audio?.playSuccess();
    } catch (err) {
      showToast(`Sync error: ${err.message}`, "warning");
    } finally {
      pushBtn.disabled = false;
      pushBtn.innerHTML = "<span>⬆️ Push Local Data to Supabase</span>";
    }
  });

  // Pull Cloud Data to Local
  pullBtn?.addEventListener("click", async () => {
    if (!window.mayzaSupabase || !window.mayzaSupabase.isConfigured()) {
      showToast("Please save and connect your Supabase credentials first.", "warning");
      return;
    }

    pullBtn.disabled = true;
    pullBtn.innerHTML = "<span>⏳ Fetching Cloud Data...</span>";

    try {
      const pulled = await state.initCloudSync();
      if (pulled) {
        renderDashboardOverview();
        renderOrdersTable();
        renderProductMatrix();
        renderCoupons();
        renderWholesalePurchases();
        showToast("Successfully synced all catalog and orders from Supabase! 🌸");
        triggerCelebration();
        audio?.playSuccess();
      } else {
        showToast("Cloud sync check completed. Local catalog is already up-to-date!");
      }
    } catch (err) {
      showToast(`Pull error: ${err.message}`, "warning");
    } finally {
      pullBtn.disabled = false;
      pullBtn.innerHTML = "<span>⬇️ Pull Cloud Data to Local</span>";
    }
  });

  // Initial cloud sync if configured
  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    state.initCloudSync().then((hasChanges) => {
      if (hasChanges) {
        renderDashboardOverview();
        renderOrdersTable();
        renderProductMatrix();
        renderCoupons();
        renderWholesalePurchases();
      }
    }).catch(console.warn);
  }
}
