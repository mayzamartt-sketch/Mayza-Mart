/**
 * MAYZA MART • WONDERLAND STUDIO ADMIN ENGINE
 * Curated for Mauji, Aynul & Faiza
 * Fully reactive state engine with localStorage persistence, audio synthesis,
 * interactive SVG analytics, WhatsApp dispatch, and invoice generator.
 */

// =========================================================
// 1. DEFAULT SEED DATA (Clean Empty State for Production)
// =========================================================
const DEFAULT_PRODUCTS = [];

const DEFAULT_ORDERS = [];

const DEFAULT_COUPONS = [];

const DEFAULT_VIPS = [];

const DEFAULT_REVIEWS = [];

const DEFAULT_WHOLESALE_PURCHASES = [];

// =========================================================
// PERMANENT DEFAULT STORE CATEGORIES (Protected, Never Removed)
// =========================================================
const DEFAULT_CATEGORIES = [
  { name: "Hair Accessories", emoji: "🎀", image: "assets/cat-hair.jpg", subtitle: "Style in every strand", colorClass: "bg-acc" },
  { name: "Return Gifts", emoji: "🎁", image: "assets/cat-return-gifts.jpg", subtitle: "Make it memorable", colorClass: "bg-sec" },
  { name: "Clips & Hair Bands", emoji: "🌸", image: "assets/p-clips.jpg", subtitle: "Cute & trendy", colorClass: "bg-lav" },
  { name: "Handbags & Purses", emoji: "🛍️", shortName: "Handbags", image: "assets/cat-bags.jpg", subtitle: "Carry your style", colorClass: "bg-sec" },
  { name: "Toys", emoji: "🧸", image: "assets/cat-toys.jpg", subtitle: "Fun for all ages", colorClass: "bg-sky" },
  { name: "Stationery", emoji: "✏️", image: "assets/cat-stationery.jpg", subtitle: "Write • Create • Dream", colorClass: "bg-lav" },
  { name: "Home & Lifestyle", emoji: "🏠", shortName: "Home", image: "assets/cat-home.jpg", subtitle: "Make it cozy", colorClass: "bg-pea" },
  { name: "Jewellery & Fashion", emoji: "💎", shortName: "Jewellery", image: "assets/cat-jewellery.jpg", subtitle: "Accessorize your style", colorClass: "bg-acc" },
  { name: "Party Supplies", emoji: "🎉", shortName: "Party", image: "assets/cat-party.jpg", subtitle: "Celebrate in style", colorClass: "bg-sec" },
  { name: "Phone Accessories", emoji: "📱", shortName: "Phone", image: "assets/cat-phone.jpg", subtitle: "Stay connected", colorClass: "bg-sky" }
];

// =========================================================
// 2. STATE MANAGER & PERSISTENCE
// =========================================================
class StudioState {
  constructor() {
    // Purge old demo mock data if previously stored
    const isMockCleaned = localStorage.getItem("mm_demo_purged_v2");
    if (!isMockCleaned) {
      localStorage.removeItem("mm_products");
      localStorage.removeItem("mm_orders");
      localStorage.removeItem("mm_coupons");
      localStorage.removeItem("mm_vips");
      localStorage.removeItem("mm_reviews");
      localStorage.removeItem("mm_wholesale");
      localStorage.setItem("mm_demo_purged_v2", "true");
    }

    this.products = this.load("mm_products", DEFAULT_PRODUCTS);
    this.orders = this.load("mm_orders", DEFAULT_ORDERS);
    this.coupons = this.load("mm_coupons", DEFAULT_COUPONS);
    this.vips = this.load("mm_vips", DEFAULT_VIPS);
    this.reviews = this.load("mm_reviews", DEFAULT_REVIEWS);
    this.wholesalePurchases = this.load("mm_wholesale", DEFAULT_WHOLESALE_PURCHASES);
    this.customCategories = this.load("mm_custom_categories", []);
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
    localStorage.setItem("mm_products_timestamp", Date.now().toString());
    localStorage.setItem("mm_orders", JSON.stringify(this.orders));
    localStorage.setItem("mm_coupons", JSON.stringify(this.coupons));
    localStorage.setItem("mm_vips", JSON.stringify(this.vips));
    localStorage.setItem("mm_reviews", JSON.stringify(this.reviews));
    localStorage.setItem("mm_wholesale", JSON.stringify(this.wholesalePurchases));
    localStorage.setItem("mm_custom_categories", JSON.stringify(this.customCategories || []));
    localStorage.setItem("mm_categories_timestamp", Date.now().toString());

    window.dispatchEvent(new CustomEvent('mayza:products-updated', {
      detail: { products: this.products }
    }));
    window.dispatchEvent(new CustomEvent('mayza:categories-updated', {
      detail: { categories: this.getAllCategories(), customCategories: this.customCategories }
    }));
  }

  getAllCategories() {
    const defaults = DEFAULT_CATEGORIES.map(c => ({ ...c }));
    try {
      const overrides = JSON.parse(localStorage.getItem('mm_category_overrides') || '{}');
      defaults.forEach(cat => {
        const ov = overrides[cat.name];
        if (ov) {
          if (ov.image) cat.image = ov.image;
          if (ov.subtitle) cat.subtitle = ov.subtitle;
          if (ov.emoji) cat.emoji = ov.emoji;
        }
      });
    } catch(e) {}
    const custom = Array.isArray(this.customCategories) ? this.customCategories : [];
    
    const existingNames = new Set([
      ...defaults.map(c => c.name.toLowerCase()),
      ...custom.map(c => c.name.toLowerCase())
    ]);
    
    const extraFromProducts = [];
    if (Array.isArray(this.products)) {
      this.products.forEach(p => {
        if (p.category && !existingNames.has(p.category.toLowerCase())) {
          existingNames.add(p.category.toLowerCase());
          extraFromProducts.push({
            name: p.category,
            emoji: "🏷️",
            image: "assets/cat-return-gifts.jpg",
            subtitle: "Explore collection",
            isCustom: true
          });
        }
      });
    }

    return [...defaults, ...custom, ...extraFromProducts];
  }

  addCustomCategory(name, emoji = "✨", image = "", subtitle = "") {
    const trimmed = (name || "").trim();
    if (!trimmed) return null;
    
    const existing = this.getAllCategories().find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (existing.isCustom && (image || subtitle)) {
        if (image) existing.image = image;
        if (subtitle) existing.subtitle = subtitle;
        if (emoji && emoji !== "✨") existing.emoji = emoji;
        this.save();
      }
      return existing;
    }

    const defaultImg = "assets/cat-return-gifts.jpg";
    const newCat = {
      name: trimmed,
      emoji: (emoji || "").trim() || "✨",
      image: (image || "").trim() || defaultImg,
      subtitle: (subtitle || "").trim() || "Explore collection",
      isCustom: true
    };

    if (!Array.isArray(this.customCategories)) {
      this.customCategories = [];
    }
    this.customCategories.push(newCat);
    this.save();
    return newCat;
  }

  deleteCustomCategory(name) {
    if (!name) return false;
    const isDefault = DEFAULT_CATEGORIES.some(c => c.name.toLowerCase() === name.toLowerCase());
    if (isDefault) return false; // Default categories can NEVER be deleted

    this.customCategories = (this.customCategories || []).filter(c => c.name.toLowerCase() !== name.toLowerCase());
    this.save();
    return true;
  }

  async initCloudSync() {
    if (!window.mayzaSupabase || !window.mayzaSupabase.isConfigured()) return false;
    try {
      const data = await window.mayzaSupabase.syncSupabaseToLocal();
      if (data) {
        if (Array.isArray(data.products)) this.products = data.products;
        if (Array.isArray(data.orders)) this.orders = data.orders;
        if (Array.isArray(data.wholesalePurchases)) this.wholesalePurchases = data.wholesalePurchases;
        if (Array.isArray(data.coupons)) this.coupons = data.coupons;
        if (Array.isArray(data.vips)) this.vips = data.vips;
        if (Array.isArray(data.reviews)) this.reviews = data.reviews;
        this.save();
        return true;
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
    this.customCategories = [];
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

  playBubblePop(freq = 520) {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
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
        <td colspan="8" style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 2.4rem; margin-bottom: 8px;">📦</div>
          <strong style="font-size: 0.95rem; color: var(--text-pure); display: block; margin-bottom: 4px;">No customer orders yet</strong>
          <span style="font-size: 0.8rem; opacity: 0.8;">Customer orders from your Mayza Mart store will appear here in real-time.</span>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const nextStatus = getNextStatus(o.status);
    const nextLabel = nextStatus ? `➔ ${nextStatus}` : "Completed ✨";
    const waUrl = getWhatsAppDispatchUrl(o);
    const isPOS = o.channel === "pos" || (o.source && o.source.includes("In-Store")) || (o.payment && o.payment.includes("In-Store"));
    const channelBadge = isPOS
      ? `<span class="channel-badge channel-pos">🏬 In-Store POS</span>`
      : `<span class="channel-badge channel-online">🌐 Online Store</span>`;

    return `
      <tr data-order-id="${o.id}">
        <td>
          <span class="order-id-badge">${o.id}</span>
          <div>${channelBadge}</div>
        </td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: var(--text-bright);">${o.customer.name}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${o.customer.phone || 'No phone'}</span>
            <span style="font-size: 0.7rem; color: var(--text-dim);">${o.customer.city || o.customer.address || 'In-Store'}</span>
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
            <button class="row-btn delete-order-btn" onclick="deleteOrder('${o.id}')" title="Delete Order">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function deleteOrder(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  if (confirm(`Are you sure you want to delete order "${order.id}" (${order.customer.name} - ₹${order.total})?`)) {
    state.orders = state.orders.filter(o => o.id !== orderId);
    state.save();

    if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
      window.mayzaSupabase.deleteOrder?.(orderId).catch(console.warn);
    }

    audio.playClick();
    showToast(`Deleted order ${order.id}.`);
    renderOrdersTable();
    renderDashboardOverview();
  }
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
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 10px;">🌸</div>
          <h3 style="margin: 0 0 6px; color: var(--text-pure); font-weight: 800; font-size: 1.15rem;">No products in inventory yet</h3>
          <p style="font-size: 0.85rem; margin-bottom: 20px; opacity: 0.8;">Click below or log a Wholesale Purchase to begin curating your store catalog!</p>
          <button class="action-btn primary-glow-btn" onclick="openAddProductModal()" style="margin: 0 auto;">
            <span>✨ Add First Product</span>
          </button>
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
      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
              No products in inventory yet. Click "+ Add Product" to add your first item.
            </td>
          </tr>
        `;
        return;
      }

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

// =========================================================
// CATEGORY MANAGEMENT & DYNAMIC SELECTION ENGINE
// =========================================================
function renderCategorySelects(selectedCategory = null) {
  const prodSelect = document.getElementById("prodCategory");
  const wsSelect = document.getElementById("wsCategory");
  const wsFilterSelect = document.getElementById("wholesaleCategoryFilter");
  const allCats = state.getAllCategories();

  if (prodSelect) {
    const currentVal = selectedCategory || prodSelect.value;
    prodSelect.innerHTML = allCats.map(c => `
      <option value="${c.name}">${c.emoji ? c.emoji + " " : ""}${c.name}</option>
    `).join("") + `
      <option value="__create_new__">＋ Add New Category...</option>
    `;
    if (currentVal && currentVal !== "__create_new__") {
      prodSelect.value = currentVal;
    }
  }

  if (wsSelect) {
    const currentWsVal = selectedCategory || wsSelect.value;
    wsSelect.innerHTML = allCats.map(c => `
      <option value="${c.name}">${c.emoji ? c.emoji + " " : ""}${c.name}</option>
    `).join("") + `
      <option value="__create_new__">＋ Add New Category...</option>
    `;
    if (currentWsVal && currentWsVal !== "__create_new__") {
      wsSelect.value = currentWsVal;
    }
  }

  if (wsFilterSelect) {
    const currentFilterVal = wsFilterSelect.value || "all";
    wsFilterSelect.innerHTML = `<option value="all">All Categories</option>` + allCats.map(c => `
      <option value="${c.name}">${c.emoji ? c.emoji + " " : ""}${c.name}</option>
    `).join("");
    wsFilterSelect.value = currentFilterVal;
  }
}

function renderCategoryFilterPills() {
  const container = document.getElementById("productCategoryPills");
  if (!container) return;

  const allCats = state.getAllCategories();
  const current = state.currentCategoryFilter || "all";

  let html = `<button class="cat-filter-pill ${current === 'all' ? 'active' : ''}" data-category="all">All Products</button>`;

  allCats.forEach(c => {
    const isActive = current === c.name ? "active" : "";
    const label = `${c.emoji ? c.emoji + " " : ""}${c.shortName || c.name}`;
    const deleteBtn = c.isCustom ? `<span class="pill-del-btn" title="Remove custom category (Defaults are protected)" data-del-cat="${c.name}">&times;</span>` : "";
    html += `<button class="cat-filter-pill ${isActive}" data-category="${c.name}">${label}${deleteBtn}</button>`;
  });

  container.innerHTML = html;
}

function showInlineCategoryCreator(isWholesale = false) {
  const box = document.getElementById(isWholesale ? "wsInlineCategoryBox" : "inlineCategoryBox");
  const input = document.getElementById(isWholesale ? "wsInlineCategoryName" : "inlineCategoryName");
  const subtitleInput = document.getElementById(isWholesale ? "wsInlineCategorySubtitle" : "inlineCategorySubtitle");
  const imageUrlInput = document.getElementById(isWholesale ? "wsInlineCategoryImageUrl" : "inlineCategoryImageUrl");
  const emoji = document.getElementById(isWholesale ? "wsInlineCategoryEmoji" : "inlineCategoryEmoji");
  const feedback = document.getElementById(isWholesale ? "wsInlineCategoryFeedback" : "inlineCategoryFeedback");
  const previewRow = document.getElementById(isWholesale ? "wsCategoryPreviewRow" : "inlineCategoryPreviewRow");
  const previewImg = document.getElementById(isWholesale ? "wsCategoryPreviewImg" : "inlineCategoryPreviewImg");

  if (!box) return;

  box.classList.remove("hidden");
  if (feedback) {
    feedback.textContent = "";
    feedback.classList.remove("visible");
  }
  if (emoji && !emoji.value) {
    emoji.value = "✨";
  }
  if (input) {
    input.value = "";
    setTimeout(() => input.focus(), 60);
  }
  if (subtitleInput) subtitleInput.value = "";
  if (imageUrlInput) imageUrlInput.value = "";
  if (previewRow) previewRow.style.display = "none";
  if (previewImg) previewImg.src = "";
}

function hideInlineCategoryCreator(isWholesale = false) {
  const box = document.getElementById(isWholesale ? "wsInlineCategoryBox" : "inlineCategoryBox");
  if (box) box.classList.add("hidden");
  const select = document.getElementById(isWholesale ? "wsCategory" : "prodCategory");
  if (select && select.value === "__create_new__") {
    select.value = DEFAULT_CATEGORIES[0].name;
  }
  const previewRow = document.getElementById(isWholesale ? "wsCategoryPreviewRow" : "inlineCategoryPreviewRow");
  const previewImg = document.getElementById(isWholesale ? "wsCategoryPreviewImg" : "inlineCategoryPreviewImg");
  if (previewRow) previewRow.style.display = "none";
  if (previewImg) previewImg.src = "";
}

function updateCategoryPreview(isWholesale = false, src = "") {
  const previewRow = document.getElementById(isWholesale ? "wsCategoryPreviewRow" : "inlineCategoryPreviewRow");
  const previewImg = document.getElementById(isWholesale ? "wsCategoryPreviewImg" : "inlineCategoryPreviewImg");
  const imageUrlInput = document.getElementById(isWholesale ? "wsInlineCategoryImageUrl" : "inlineCategoryImageUrl");

  if (!previewRow || !previewImg) return;
  const cleanSrc = (src || imageUrlInput?.value || "").trim();
  if (cleanSrc) {
    previewImg.src = cleanSrc;
    previewRow.style.display = "flex";
  } else {
    previewImg.src = "";
    previewRow.style.display = "none";
  }
}

function handleCategoryFileUpload(isWholesale = false, fileInput) {
  const file = fileInput?.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file! 🖼️", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const imageUrlInput = document.getElementById(isWholesale ? "wsInlineCategoryImageUrl" : "inlineCategoryImageUrl");
    if (imageUrlInput) {
      imageUrlInput.value = dataUrl;
    }
    updateCategoryPreview(isWholesale, dataUrl);
    showToast("Category image loaded! ✨");
  };
  reader.readAsDataURL(file);
}

function saveInlineCategory(isWholesale = false) {
  const input = document.getElementById(isWholesale ? "wsInlineCategoryName" : "inlineCategoryName");
  const subtitleInput = document.getElementById(isWholesale ? "wsInlineCategorySubtitle" : "inlineCategorySubtitle");
  const imageUrlInput = document.getElementById(isWholesale ? "wsInlineCategoryImageUrl" : "inlineCategoryImageUrl");
  const emojiInput = document.getElementById(isWholesale ? "wsInlineCategoryEmoji" : "inlineCategoryEmoji");
  const feedback = document.getElementById(isWholesale ? "wsInlineCategoryFeedback" : "inlineCategoryFeedback");

  const name = (input?.value || "").trim();
  const emoji = (emojiInput?.value || "").trim() || "✨";
  const subtitle = (subtitleInput?.value || "").trim();
  const image = (imageUrlInput?.value || "").trim();

  if (!name) {
    if (feedback) {
      feedback.textContent = "Please enter a category name!";
      feedback.classList.add("visible");
    }
    input?.focus();
    return;
  }

  const existing = state.getAllCategories().find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    if (existing.isCustom && (image || subtitle)) {
      state.addCustomCategory(name, emoji, image, subtitle);
    }
    renderCategorySelects(existing.name);
    renderCategoryFilterPills();
    hideInlineCategoryCreator(isWholesale);
    showToast(`Category "${existing.name}" is already available and selected! ✨`);
    return;
  }

  const newCat = state.addCustomCategory(name, emoji, image, subtitle);
  if (newCat) {
    renderCategorySelects(newCat.name);
    renderCategoryFilterPills();
    hideInlineCategoryCreator(isWholesale);
    showToast(`Added new category "${newCat.emoji} ${newCat.name}" with live store sync! 🌸`);
    if (audio?.playSuccess) audio.playSuccess();
  }
}

// =========================================================
// MANAGE CATEGORIES MODAL (Edit Images & Details)
// =========================================================
let _editingCatName = null; // track which category is being edited

function openManageCategoriesModal() {
  const modal = document.getElementById("manageCategoriesModal");
  if (!modal) return;
  modal.classList.add("active");
  renderManageCatGrid();
  // hide edit panel
  const panel = document.getElementById("manageCatEditPanel");
  if (panel) panel.classList.add("hidden");
  _editingCatName = null;
  audio.playClick();
}

function closeManageCategoriesModal() {
  const modal = document.getElementById("manageCategoriesModal");
  if (modal) modal.classList.remove("active");
  _editingCatName = null;
}

function renderManageCatGrid() {
  const grid = document.getElementById("manageCatGrid");
  if (!grid) return;

  const allCats = state.getAllCategories();
  const defaultNames = new Set(DEFAULT_CATEGORIES.map(c => c.name.toLowerCase()));

  grid.innerHTML = allCats.map(cat => {
    const isDefault = defaultNames.has(cat.name.toLowerCase());
    const img = cat.image || "assets/cat-return-gifts.jpg";
    const label = `${cat.emoji || ""} ${cat.name}`.trim();
    const selectedClass = _editingCatName === cat.name ? "selected" : "";
    const defaultBadge = isDefault ? `<span class="manage-cat-thumb-default-badge">DEFAULT</span>` : "";

    return `
      <div class="manage-cat-thumb ${selectedClass}" data-cat-name="${cat.name}" title="Click to edit ${cat.name}">
        ${defaultBadge}
        <img src="${cat.image || 'assets/cat-return-gifts.jpg'}" alt="${cat.name}"
             onerror="this.onerror=null; this.src='assets/cat-return-gifts.jpg';">
        <div class="manage-cat-thumb-label">${label}</div>
        <div class="manage-cat-thumb-edit-icon">✏️</div>
      </div>
    `;
  }).join("");

  // Bind click on each thumb
  grid.querySelectorAll(".manage-cat-thumb").forEach(thumb => {
    thumb.addEventListener("click", () => {
      const catName = thumb.dataset.catName;
      openCatEditPanel(catName);
    });
  });
}

function openCatEditPanel(catName) {
  const allCats = state.getAllCategories();
  const cat = allCats.find(c => c.name === catName);
  if (!cat) return;

  _editingCatName = catName;

  // Update selected state
  document.querySelectorAll(".manage-cat-thumb").forEach(t => {
    t.classList.toggle("selected", t.dataset.catName === catName);
  });

  // Populate fields
  const nameInput = document.getElementById("manageCatNameInput");
  const subtitleInput = document.getElementById("manageCatSubtitleInput");
  const emojiInput = document.getElementById("manageCatEmojiInput");
  const imageUrlInput = document.getElementById("manageCatImageUrl");
  const previewImg = document.getElementById("manageCatPreviewImg");
  const previewName = document.getElementById("manageCatPreviewName");
  const editNameLabel = document.getElementById("manageCatEditName");
  const feedback = document.getElementById("manageCatFeedback");

  if (nameInput) nameInput.value = cat.name;
  if (subtitleInput) subtitleInput.value = cat.subtitle || "";
  if (emojiInput) emojiInput.value = cat.emoji || "✨";
  if (imageUrlInput) imageUrlInput.value = cat.image || "";
  if (previewImg) {
    previewImg.src = cat.image || "assets/cat-return-gifts.jpg";
    previewImg.onerror = function() { this.onerror = null; this.src = "assets/cat-return-gifts.jpg"; };
  }
  if (previewName) previewName.textContent = `${cat.emoji || ""} ${cat.name}`;
  if (editNameLabel) editNameLabel.textContent = cat.name;
  if (feedback) { feedback.textContent = ""; feedback.classList.remove("visible"); }

  // Show panel
  const panel = document.getElementById("manageCatEditPanel");
  if (panel) {
    panel.classList.remove("hidden");
    setTimeout(() => panel.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }

  // File preview: reset file input
  const fileInput = document.getElementById("manageCatImageFile");
  if (fileInput) fileInput.value = "";
}

function saveCategoryImageChanges() {
  if (!_editingCatName) return;

  const nameInput = document.getElementById("manageCatNameInput");
  const subtitleInput = document.getElementById("manageCatSubtitleInput");
  const emojiInput = document.getElementById("manageCatEmojiInput");
  const imageUrlInput = document.getElementById("manageCatImageUrl");
  const feedback = document.getElementById("manageCatFeedback");

  const newName = (nameInput?.value || "").trim();
  const newSubtitle = (subtitleInput?.value || "").trim();
  const newEmoji = (emojiInput?.value || "").trim() || "✨";
  const newImage = (imageUrlInput?.value || "").trim();

  if (!newName) {
    if (feedback) { feedback.textContent = "Category name cannot be empty!"; feedback.classList.add("visible"); }
    nameInput?.focus();
    return;
  }

  const allCats = state.getAllCategories();
  const cat = allCats.find(c => c.name === _editingCatName);
  if (!cat) return;

  const defaultNames = new Set(DEFAULT_CATEGORIES.map(c => c.name.toLowerCase()));
  const isDefault = defaultNames.has(_editingCatName.toLowerCase());

  // For default categories: only allow updating image and subtitle (not name/emoji since they're protected)
  // For custom categories: allow all edits
  if (isDefault) {
    // Store default category overrides in a separate localStorage key
    const overrides = JSON.parse(localStorage.getItem("mm_category_overrides") || "{}");
    overrides[_editingCatName] = {
      image: newImage || cat.image,
      subtitle: newSubtitle || cat.subtitle,
      emoji: newEmoji || cat.emoji
    };
    localStorage.setItem("mm_category_overrides", JSON.stringify(overrides));
    localStorage.setItem("mm_categories_timestamp", Date.now().toString());

    // Apply to in-memory DEFAULT_CATEGORIES too for immediate effect
    const defCat = DEFAULT_CATEGORIES.find(c => c.name === _editingCatName);
    if (defCat) {
      if (newImage) defCat.image = newImage;
      if (newSubtitle) defCat.subtitle = newSubtitle;
      if (newEmoji) defCat.emoji = newEmoji;
    }

    showToast(`Updated picture & details for "${_editingCatName}"! 🌸 Syncing to live store...`);
  } else {
    // Custom category — update directly in state
    const customCat = state.customCategories.find(c => c.name === _editingCatName);
    if (customCat) {
      customCat.image = newImage || customCat.image;
      customCat.subtitle = newSubtitle || customCat.subtitle;
      customCat.emoji = newEmoji || customCat.emoji;
      if (newName !== _editingCatName) {
        customCat.name = newName;
        _editingCatName = newName;
      }
    }
    state.save();
    renderCategorySelects();
    renderCategoryFilterPills();
    showToast(`Category "${newName}" updated! 🖼️ Live store refreshed!`);
  }

  window.dispatchEvent(new CustomEvent('mayza:categories-updated', {
    detail: { categories: state.getAllCategories() }
  }));

  renderManageCatGrid();
  if (feedback) { feedback.textContent = ""; feedback.classList.remove("visible"); }
  audio.playSuccess?.();
}

function handleManageCatFileUpload(fileInput) {
  const file = fileInput?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file! 🖼️", "warning");
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const imageUrlInput = document.getElementById("manageCatImageUrl");
    const previewImg = document.getElementById("manageCatPreviewImg");
    if (imageUrlInput) imageUrlInput.value = dataUrl;
    if (previewImg) previewImg.src = dataUrl;
    showToast("Image loaded! Click Save Changes to apply. ✨");
  };
  reader.readAsDataURL(file);
}


function openAddProductModal() {
  document.getElementById("productModalTitle").textContent = "Add New Wonderland Product";
  document.getElementById("editProductId").value = "";
  document.getElementById("productForm").reset();
  renderCategorySelects();
  hideInlineCategoryCreator(false);
  document.getElementById("prodSku").value = `MM-${Date.now().toString().slice(-4)}`;
  document.getElementById("productModal").classList.add("active");
  audio.playClick();
}

function openEditProductModal(productId) {
  const prod = state.products.find(p => p.id === productId);
  if (!prod) return;

  renderCategorySelects(prod.category);
  hideInlineCategoryCreator(false);

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
  hideInlineCategoryCreator(false);
  document.getElementById("productModal").classList.remove("active");
}

function handleProductFormSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById("editProductId").value;
  const title = document.getElementById("prodTitle").value.trim();
  const category = document.getElementById("prodCategory").value;
  if (!category || category === "__create_new__") {
    showToast("Please choose or save a valid category first! ⚠️", "warning");
    return;
  }
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
  renderCategoryFilterPills();
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

function printSlipDocument(elementId, docTitle = "Mayza Mart • Packing Slip") {
  const printArea = document.getElementById(elementId);
  if (!printArea) {
    window.print();
    return;
  }

  // Create or reuse an isolated hidden iframe for 100% clean, blank-free printing
  let iframe = document.getElementById("mayzaPrintIframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = "mayzaPrintIframe";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);
  }

  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=JetBrains+Mono:wght@500;700&family=Outfit:wght@600;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body {
      background: #ffffff !important;
      color: #0f172a !important;
      margin: 0 !important;
      padding: 16px !important;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-size: 14px;
      line-height: 1.5;
    }
    .invoice-printable-sheet {
      display: block !important;
      width: 100% !important;
      max-width: 800px !important;
      margin: 0 auto !important;
      padding: 24px !important;
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 12px !important;
    }
    .inv-top-bar { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
    .inv-brand { display: flex; align-items: center; gap: 14px; }
    .inv-mascot { width: 54px; height: 54px; object-fit: contain; }
    .inv-store-name { font-family: 'Outfit', sans-serif; font-size: 1.45rem; font-weight: 900; color: #0F172A; margin: 0; }
    .inv-founders { font-size: 0.8rem; color: #D9657B; font-weight: 800; margin: 2px 0 0; }
    .inv-contact { font-size: 0.72rem; color: #64748B; margin: 2px 0 0; }
    .inv-badge-block { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .inv-badge-pill { font-size: 0.65rem; font-weight: 800; background: #0F172A; color: #FFFFFF; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.05em; }
    .inv-barcode { font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; letter-spacing: 3px; color: #334155; }
    .inv-order-id { font-family: 'JetBrains Mono', monospace; font-size: 1.15rem; font-weight: 900; color: #D9657B; }
    .inv-divider { margin: 18px 0; border: none; border-top: 1px dashed #CBD5E1; }
    .inv-addresses-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .inv-box { background: #F8FAFC !important; border: 1px solid #CBD5E1 !important; border-radius: 8px; padding: 12px; }
    .inv-box-title { font-size: 0.68rem; font-weight: 800; letter-spacing: 0.08em; color: #64748B; margin-bottom: 4px; display: block; }
    .inv-customer-name { font-size: 0.95rem; font-weight: 800; color: #0F172A; }
    .inv-detail-line { font-size: 0.78rem; color: #475569; line-height: 1.4; }
    .inv-meta-row { display: flex; justify-content: space-between; font-size: 0.78rem; color: #475569; margin-bottom: 3px; }
    .inv-items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #CBD5E1; }
    .inv-items-table th { background: #F1F5F9 !important; color: #334155; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; padding: 9px 12px; border-bottom: 1px solid #CBD5E1; text-align: left; }
    .inv-items-table td { padding: 9px 12px; font-size: 0.82rem; color: #1E293B; border-bottom: 1px solid #E2E8F0; }
    .inv-total-row td { font-size: 1rem; color: #D9657B; border-top: 2px solid #CBD5E1; padding-top: 12px; font-weight: 800; }
    .inv-footer-note { margin-top: 18px; background: #FFF1F5 !important; border: 1px solid #FFE4ED !important; border-radius: 8px; padding: 14px; text-align: center; }
    .note-stamp { font-size: 0.68rem; font-weight: 800; color: #D9657B; letter-spacing: 0.08em; margin-bottom: 4px; }
    .note-script { font-family: 'Caveat', cursive; font-size: 1.3rem; color: #9F1239; margin: 4px 0; }
    .note-sign { font-size: 0.75rem; font-weight: 800; color: #BE185D; margin: 2px 0 0; }
    .text-right { text-align: right !important; }
    .font-mono { font-family: 'JetBrains Mono', monospace !important; }
  </style>
</head>
<body>
  <div class="invoice-printable-sheet">
    ${printArea.innerHTML}
  </div>
</body>
</html>`);
  iframeDoc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (err) {
      window.print();
    }
  }, 250);
}

window.printSlipDocument = printSlipDocument;

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

async function deleteCoupon(index) {
  const coupon = state.coupons[index];
  if (!coupon) return;
  state.coupons.splice(index, 1);
  state.save();
  renderCoupons();
  showToast("Coupon removed.");

  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    try {
      await window.mayzaSupabase.deleteCoupon(coupon.code);
    } catch (err) {
      console.warn('[Admin] Cloud deleteCoupon error:', err);
    }
  }
}

function openAddCouponModal() {
  document.getElementById("couponForm").reset();
  document.getElementById("couponModal").classList.add("active");
  audio.playClick();
}

function closeCouponModal() {
  document.getElementById("couponModal").classList.remove("active");
}

async function handleCouponFormSubmit(e) {
  e.preventDefault();
  const code = document.getElementById("couponCode").value.trim().toUpperCase();
  const discount = parseInt(document.getElementById("couponDiscount").value) || 10;
  const minSpend = parseInt(document.getElementById("couponMinSpend").value) || 0;
  const desc = document.getElementById("couponDesc").value.trim() || `${discount}% off Mayza Mart wonderland order`;

  const newCoupon = { code, discount, minSpend, desc, active: true, uses: 0 };
  state.coupons.unshift(newCoupon);
  state.save();
  closeCouponModal();
  renderCoupons();
  showToast(`Created new wonder coupon: ${code} ✨`);
  triggerCelebration();
  audio?.playSuccess();

  // Instantly push to Supabase Cloud so live store receives it immediately
  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    try {
      await window.mayzaSupabase.upsertCoupon(newCoupon);
      showToast(`Coupon ${code} synced live to Supabase! ⚡`);
    } catch (err) {
      console.warn('[Admin] Cloud upsertCoupon error:', err);
    }
  }
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

  renderCategorySelects();
  hideInlineCategoryCreator(true);
  populateWholesaleProductSelect();
  calculateWholesaleLiveMargin();

  modal.classList.add("active");
  audio.playClick();
}

function closeAddWholesaleModal() {
  hideInlineCategoryCreator(true);
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

  if (!category || category === "__create_new__") {
    showToast("Please choose or save a valid category first! ⚠️", "warning");
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

// =========================================================
// 14. IN-STORE POS CUSTOMER BILLING ENGINE
// =========================================================
let posCart = []; // [{ id, title, sku, price, qty, image, maxStock }]

function openInStoreBillModal() {
  const modal = document.getElementById("inStoreBillModal");
  if (!modal) return;

  posCart = [];
  document.getElementById("posCustName").value = "Walk-in Customer";
  document.getElementById("posCustPhone").value = "";
  document.getElementById("posBillDiscount").value = "0";
  document.getElementById("posProductSearch").value = "";
  
  renderPosProductList();
  renderPosCartItems();
  calculatePosBillTotals();

  modal.classList.add("active");
  audio.playClick();
}

function closeInStoreBillModal() {
  const modal = document.getElementById("inStoreBillModal");
  if (modal) modal.classList.remove("active");
  posCart = [];
}

function renderPosProductList(filterText = "") {
  const container = document.getElementById("posProductList");
  const countEl = document.getElementById("posCatalogCount");
  if (!container) return;

  const query = filterText.toLowerCase().trim();
  const products = (state.products || []).filter(p => {
    if (!query) return true;
    return (p.title && p.title.toLowerCase().includes(query)) ||
           (p.category && p.category.toLowerCase().includes(query)) ||
           (p.sku && p.sku.toLowerCase().includes(query));
  });

  if (countEl) countEl.textContent = `${products.length} products`;

  if (products.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 25px 15px; color: var(--text-muted); font-size: 0.82rem;">
        No matching products in catalog. Add products in Inventory first.
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(p => {
    const stock = typeof p.stock === "number" ? p.stock : (parseInt(p.stock, 10) || 0);
    const isOutOfStock = stock <= 0;
    return `
      <div class="pos-prod-card" data-prod-id="${p.id}" style="cursor: ${isOutOfStock ? 'not-allowed' : 'pointer'};">
        <div class="pos-prod-left">
          <img src="${p.image || 'assets/cat-return-gifts.jpg'}" alt="${p.title}" class="pos-prod-thumb"
               onerror="this.onerror=null; this.src='assets/cat-return-gifts.jpg';">
          <div class="pos-prod-meta">
            <span class="pos-prod-title">${p.title}</span>
            <span class="pos-prod-sub">₹${p.price} • Stock: <strong>${stock}</strong></span>
          </div>
        </div>
        <button type="button" class="pos-add-btn" data-prod-id="${p.id}" ${isOutOfStock ? "disabled style='opacity:0.4; cursor:not-allowed;'" : ""}>
          ${isOutOfStock ? "Out of Stock" : "＋ Add"}
        </button>
      </div>
    `;
  }).join("");
}

function addPosProductToCart(productId) {
  if (!productId && productId !== 0) return;
  const prod = (state.products || []).find(p => String(p.id) === String(productId));
  if (!prod) {
    console.warn("Product not found in state:", productId);
    return;
  }

  const stock = typeof prod.stock === "number" ? prod.stock : (parseInt(prod.stock, 10) || 0);
  if (stock <= 0) {
    showToast(`"${prod.title}" is out of stock!`, "warning");
    return;
  }

  const existing = posCart.find(item => String(item.id) === String(productId));
  if (existing) {
    if (existing.qty >= stock) {
      showToast(`Cannot add more than available stock (${stock})!`, "warning");
      return;
    }
    existing.qty += 1;
  } else {
    posCart.push({
      id: prod.id,
      title: prod.title,
      sku: prod.sku || "MM-POS",
      price: Number(prod.price) || 0,
      qty: 1,
      image: prod.image,
      maxStock: stock
    });
  }

  try {
    if (audio && typeof audio.playBubblePop === "function") {
      audio.playBubblePop(620);
    } else if (audio && typeof audio.playClick === "function") {
      audio.playClick();
    }
  } catch (err) {}

  showToast(`Added "${prod.title}" to bill! 🛍️`);
  renderPosCartItems();
  calculatePosBillTotals();
}

function updatePosCartItemQty(productId, delta) {
  const item = posCart.find(i => String(i.id) === String(productId));
  if (!item) return;

  const newQty = item.qty + delta;
  if (newQty <= 0) {
    removePosCartItem(productId);
    return;
  }

  if (newQty > item.maxStock) {
    showToast(`Maximum available stock is ${item.maxStock}`, "warning");
    return;
  }

  item.qty = newQty;
  renderPosCartItems();
  calculatePosBillTotals();
  try { audio?.playClick?.(); } catch (e) {}
}

function removePosCartItem(productId) {
  posCart = posCart.filter(i => String(i.id) !== String(productId));
  renderPosCartItems();
  calculatePosBillTotals();
  try { audio?.playClick?.(); } catch (e) {}
}

function renderPosCartItems() {
  const container = document.getElementById("posCartItemsList");
  const countBadge = document.getElementById("posCartItemCount");
  if (!container) return;

  const totalItemCount = posCart.reduce((sum, i) => sum + i.qty, 0);
  if (countBadge) countBadge.textContent = totalItemCount;

  if (posCart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); font-size: 0.82rem;">
        <span style="font-size: 1.6rem; display: block; margin-bottom: 4px;">🛍️</span>
        Bill is empty. Pick items from the left catalog to add to this customer's bill.
      </div>
    `;
    return;
  }

  container.innerHTML = posCart.map(item => `
    <div class="pos-cart-row">
      <div style="display: flex; flex-direction: column; max-width: 140px;">
        <strong style="font-size: 0.78rem; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</strong>
        <span style="font-size: 0.7rem; color: var(--text-muted);">₹${item.price} each</span>
      </div>
      <div class="pos-cart-qty-ctrl">
        <button type="button" class="pos-qty-btn" data-action="dec" data-prod-id="${item.id}">-</button>
        <span style="font-weight: 700; font-size: 0.85rem; min-width: 20px; text-align: center;">${item.qty}</span>
        <button type="button" class="pos-qty-btn" data-action="inc" data-prod-id="${item.id}">+</button>
      </div>
      <span style="font-family: var(--font-brand); font-weight: 800; font-size: 0.85rem; color: var(--text-primary); min-width: 45px; text-align: right;">
        ₹${item.price * item.qty}
      </span>
      <button type="button" class="pos-del-item-btn" data-action="del" data-prod-id="${item.id}" title="Remove item">×</button>
    </div>
  `).join("");
}

// Export POS functions globally on window
window.addPosProductToCart = addPosProductToCart;
window.updatePosCartItemQty = updatePosCartItemQty;
window.removePosCartItem = removePosCartItem;
window.deleteOrder = deleteOrder;
window.advanceOrderStatus = advanceOrderStatus;
window.openInvoiceModal = openInvoiceModal;

function calculatePosBillTotals() {
  const subtotal = posCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const discount = Math.max(0, parseFloat(document.getElementById("posBillDiscount")?.value) || 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const subtotalEl = document.getElementById("posBillSubtotal");
  const grandTotalEl = document.getElementById("posBillGrandTotal");

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal.toLocaleString("en-IN")}`;
}

function handlePosBillSubmit(e) {
  e.preventDefault();

  if (posCart.length === 0) {
    showToast("Please add at least 1 product to the bill!", "warning");
    return;
  }

  const custName = (document.getElementById("posCustName")?.value || "").trim() || "Walk-in Customer";
  const custPhone = (document.getElementById("posCustPhone")?.value || "").trim() || "+91 (In-Store)";
  const paymentMode = document.getElementById("posPaymentMode")?.value || "Cash • In-Store";
  const discount = Math.max(0, parseFloat(document.getElementById("posBillDiscount")?.value) || 0);
  const subtotal = posCart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const grandTotal = Math.max(0, subtotal - discount);

  const orderId = `MM-POS-${Math.floor(1000 + Math.random() * 9000)}`;

  // Deduct stock from products
  posCart.forEach(cartItem => {
    const prod = (state.products || []).find(p => String(p.id) === String(cartItem.id));
    if (prod) {
      const curStock = typeof prod.stock === "number" ? prod.stock : (parseInt(prod.stock, 10) || 0);
      const curSales = typeof prod.salesCount === "number" ? prod.salesCount : (parseInt(prod.salesCount, 10) || 0);
      prod.stock = Math.max(0, curStock - cartItem.qty);
      prod.salesCount = curSales + cartItem.qty;
      if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
        window.mayzaSupabase.upsertProduct(prod).catch(console.warn);
      }
    }
  });

  const newOrder = {
    id: orderId,
    channel: "pos",
    source: "In-Store / POS (Walk-in)",
    customer: {
      name: custName,
      phone: custPhone,
      city: "In-Store (Mayza Mart)",
      address: "In-Store Billing Counter"
    },
    items: posCart.map(i => ({
      name: i.title,
      sku: i.sku || "MM-POS",
      qty: i.qty,
      price: i.price
    })),
    subtotal: subtotal,
    discount: discount,
    shipping: 0,
    total: grandTotal,
    payment: paymentMode,
    status: "Delivered",
    timestamp: "Just now",
    rawDate: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
  };

  state.orders.unshift(newOrder);
  state.save();

  if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
    window.mayzaSupabase.createOrder(newOrder).catch(console.warn);
  }

  closeInStoreBillModal();
  showToast(`🧾 In-Store Bill generated for ${custName}! (₹${grandTotal})`);
  triggerCelebration();
  audio?.playSuccess();

  renderOrdersTable();
  renderProductMatrix();
  renderDashboardOverview();

  // Open invoice / slip for instant printing
  openInvoiceModal(orderId);
}

// =========================================================
// ADMIN MASTER AUTHENTICATION ENGINE
// =========================================================
const ADMIN_MASTER_PASSCODE = "Mayza*000";

function initAdminAuth() {
  const lockScreen = document.getElementById("adminLockScreen");
  const lockForm = document.getElementById("adminLockForm");
  const passwordInput = document.getElementById("adminPasswordInput");
  const togglePassBtn = document.getElementById("toggleAdminPassVisibility");
  const errorMsg = document.getElementById("lockErrorMsg");
  const logoutBtn = document.getElementById("adminLogoutBtn");
  const lockCard = document.querySelector(".admin-lock-card");

  if (!lockScreen) return;

  const isAuthed = sessionStorage.getItem("mm_admin_auth") === "true";
  if (isAuthed) {
    lockScreen.classList.add("unlocked");
  } else {
    lockScreen.classList.remove("unlocked");
    setTimeout(() => passwordInput?.focus(), 300);
  }

  // Toggle password visibility
  togglePassBtn?.addEventListener("click", () => {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      togglePassBtn.textContent = "🙈";
    } else {
      passwordInput.type = "password";
      togglePassBtn.textContent = "👁️";
    }
  });

  // Forgot Passcode helper
  const forgotPassBtn = document.getElementById("adminForgotPasscodeBtn");
  const recoveryBox = document.getElementById("adminRecoveryBox");
  const autofillBtn = document.getElementById("adminAutofillPassBtn");

  forgotPassBtn?.addEventListener("click", () => {
    if (recoveryBox) {
      const isVisible = recoveryBox.style.display === "block";
      recoveryBox.style.display = isVisible ? "none" : "block";
      if (!isVisible) audio?.playBubblePop(520);
    }
  });

  autofillBtn?.addEventListener("click", () => {
    if (passwordInput) {
      passwordInput.value = ADMIN_MASTER_PASSCODE;
      lockForm?.dispatchEvent(new Event("submit"));
    }
  });

  // Handle unlock form submission
  lockForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = passwordInput.value.trim();

    if (entered === ADMIN_MASTER_PASSCODE) {
      sessionStorage.setItem("mm_admin_auth", "true");
      lockScreen.classList.add("unlocked");
      if (errorMsg) errorMsg.textContent = "";
      passwordInput.value = "";
      showToast("Welcome back to Wonderland Studio, Founders! ✦");
      triggerCelebration();
      audio?.playSuccess();
    } else {
      if (errorMsg) errorMsg.textContent = "Incorrect Master Passcode. Access denied.";
      if (lockCard) {
        lockCard.classList.remove("shake");
        void lockCard.offsetWidth;
        lockCard.classList.add("shake");
      }
      passwordInput.value = "";
      passwordInput.focus();
      audio?.playBubblePop(220);
    }
  });

  // Handle logout
  logoutBtn?.addEventListener("click", () => {
    if (confirm("Lock Wonderland Studio session and log out?")) {
      sessionStorage.removeItem("mm_admin_auth");
      lockScreen.classList.remove("unlocked");
      if (passwordInput) {
        passwordInput.value = "";
        passwordInput.focus();
      }
      showToast("Admin Studio locked.");
      audio?.playClick();
    }
  });
}

// =========================================================
// 14. EVENT LISTENERS SETUP
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  initAdminAuth();
  startLiveClock();
  renderDashboardOverview();

  // Initialize dynamic category filters & selects on load
  renderCategoryFilterPills();
  renderCategorySelects();

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

  // In-Store POS Billing Modal Listeners
  document.getElementById("openInStoreBillModalBtn")?.addEventListener("click", openInStoreBillModal);
  document.getElementById("closeInStoreBillBtn")?.addEventListener("click", closeInStoreBillModal);
  document.getElementById("cancelInStoreBillBtn")?.addEventListener("click", closeInStoreBillModal);
  document.getElementById("inStoreBillModal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("inStoreBillModal")) closeInStoreBillModal();
  });
  document.getElementById("posBillForm")?.addEventListener("submit", handlePosBillSubmit);
  document.getElementById("posProductSearch")?.addEventListener("input", (e) => {
    renderPosProductList(e.target.value);
  });
  document.getElementById("posBillDiscount")?.addEventListener("input", calculatePosBillTotals);
  document.getElementById("posClearCartBtn")?.addEventListener("click", () => {
    posCart = [];
    renderPosCartItems();
    calculatePosBillTotals();
    try { audio?.playClick?.(); } catch (e) {}
  });

  // Delegated click listeners for POS catalog (card or + Add button)
  document.getElementById("posProductList")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".pos-add-btn");
    if (btn) {
      if (btn.disabled) return;
      const pid = btn.dataset.prodId;
      if (pid) addPosProductToCart(pid);
      return;
    }
    const card = e.target.closest(".pos-prod-card");
    if (card) {
      const cardBtn = card.querySelector(".pos-add-btn");
      if (cardBtn && !cardBtn.disabled) {
        const pid = cardBtn.dataset.prodId;
        if (pid) addPosProductToCart(pid);
      }
    }
  });

  // Delegated click listeners for POS cart items (+, -, x)
  document.getElementById("posCartItemsList")?.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest(".pos-qty-btn");
    if (qtyBtn) {
      e.preventDefault();
      const pid = qtyBtn.dataset.prodId;
      const action = qtyBtn.dataset.action;
      if (pid) {
        updatePosCartItemQty(pid, action === "inc" ? 1 : -1);
      }
      return;
    }
    const delBtn = e.target.closest(".pos-del-item-btn");
    if (delBtn) {
      e.preventDefault();
      const pid = delBtn.dataset.prodId;
      if (pid) {
        removePosCartItem(pid);
      }
      return;
    }
  });

  // Real-time live online orders listener from Storefront (cross-tab sync)
  window.addEventListener("storage", (e) => {
    if (e.key === "mm_orders" || e.key === "mm_orders_timestamp") {
      state.orders = state.load("mm_orders", DEFAULT_ORDERS);
      renderOrdersTable();
      renderDashboardOverview();
      audio?.playBubblePop(880);
      showToast("⚡ New live online order received from storefront! 🛍️");
    }
  });
  window.addEventListener("mayza:orders-updated", (e) => {
    if (e.detail?.orders) {
      state.orders = e.detail.orders;
    } else {
      state.orders = state.load("mm_orders", DEFAULT_ORDERS);
    }
    renderOrdersTable();
    renderDashboardOverview();
  });

  // Product category pills (filter + delete custom categories)
  document.getElementById("productCategoryPills")?.addEventListener("click", (e) => {
    // Handle delete button on custom category pills
    const delBtn = e.target.closest(".pill-del-btn");
    if (delBtn) {
      e.stopPropagation();
      const catName = delBtn.dataset.delCat;
      if (catName && confirm(`Remove custom category "${catName}"? Products in this category will keep their category label but the filter pill will be removed.`)) {
        const deleted = state.deleteCustomCategory(catName);
        if (deleted) {
          if (state.currentCategoryFilter === catName) {
            state.currentCategoryFilter = "all";
          }
          renderCategoryFilterPills();
          renderCategorySelects();
          showToast(`Removed category "${catName}" 🗑️`);
          audio.playClick();
        } else {
          showToast("Default categories cannot be removed! 🔒", "warning");
        }
      }
      return;
    }
    const pill = e.target.closest(".cat-filter-pill");
    if (pill) {
      document.querySelectorAll(".cat-filter-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.currentCategoryFilter = pill.dataset.category;
      audio.playClick();
      renderProductMatrix();
    }
  });

  // --- Inline Category Creator: Product Modal ---
  // Toggle box via "＋ New Category" button next to label
  document.getElementById("toggleAddCategoryBtn")?.addEventListener("click", () => {
    const box = document.getElementById("inlineCategoryBox");
    if (box && box.classList.contains("hidden")) {
      showInlineCategoryCreator(false);
    } else {
      hideInlineCategoryCreator(false);
    }
  });

  // Also open when user picks "+ Add New Category..." from dropdown
  document.getElementById("prodCategory")?.addEventListener("change", (e) => {
    if (e.target.value === "__create_new__") {
      showInlineCategoryCreator(false);
    } else {
      hideInlineCategoryCreator(false);
    }
  });

  document.getElementById("saveInlineCategoryBtn")?.addEventListener("click", () => saveInlineCategory(false));
  document.getElementById("cancelInlineCategoryBtn")?.addEventListener("click", () => hideInlineCategoryCreator(false));

  // Enter key saves the category
  document.getElementById("inlineCategoryName")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); saveInlineCategory(false); }
    if (e.key === "Escape") { hideInlineCategoryCreator(false); }
  });
  document.getElementById("inlineCategoryImageUrl")?.addEventListener("input", () => updateCategoryPreview(false));
  document.getElementById("inlineCategoryImageFile")?.addEventListener("change", function() {
    handleCategoryFileUpload(false, this);
  });
  document.getElementById("inlineCategoryRemoveImg")?.addEventListener("click", () => {
    const input = document.getElementById("inlineCategoryImageUrl");
    if (input) input.value = "";
    const file = document.getElementById("inlineCategoryImageFile");
    if (file) file.value = "";
    updateCategoryPreview(false, "");
  });

  // --- Inline Category Creator: Wholesale Modal ---
  document.getElementById("toggleWsAddCategoryBtn")?.addEventListener("click", () => {
    const box = document.getElementById("wsInlineCategoryBox");
    if (box && box.classList.contains("hidden")) {
      showInlineCategoryCreator(true);
    } else {
      hideInlineCategoryCreator(true);
    }
  });

  document.getElementById("wsCategory")?.addEventListener("change", (e) => {
    if (e.target.value === "__create_new__") {
      showInlineCategoryCreator(true);
    } else {
      hideInlineCategoryCreator(true);
    }
  });

  document.getElementById("saveWsInlineCategoryBtn")?.addEventListener("click", () => saveInlineCategory(true));
  document.getElementById("cancelWsInlineCategoryBtn")?.addEventListener("click", () => hideInlineCategoryCreator(true));

  document.getElementById("wsInlineCategoryName")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); saveInlineCategory(true); }
    if (e.key === "Escape") { hideInlineCategoryCreator(true); }
  });
  document.getElementById("wsInlineCategoryImageUrl")?.addEventListener("input", () => updateCategoryPreview(true));
  document.getElementById("wsCategoryImageFile")?.addEventListener("change", function() {
    handleCategoryFileUpload(true, this);
  });
  document.getElementById("wsCategoryRemoveImg")?.addEventListener("click", () => {
    const input = document.getElementById("wsInlineCategoryImageUrl");
    if (input) input.value = "";
    const file = document.getElementById("wsCategoryImageFile");
    if (file) file.value = "";
    updateCategoryPreview(true, "");
  });

  // --- Manage Categories Modal ---
  document.getElementById("manageCategoriesBtn")?.addEventListener("click", () => openManageCategoriesModal());
  document.getElementById("closeManageCategoriesBtn")?.addEventListener("click", () => closeManageCategoriesModal());
  document.getElementById("manageCategoriesModal")?.addEventListener("click", (e) => {
    if (e.target === document.getElementById("manageCategoriesModal")) closeManageCategoriesModal();
  });
  document.getElementById("saveCatChangesBtn")?.addEventListener("click", () => saveCategoryImageChanges());
  document.getElementById("cancelCatChangesBtn")?.addEventListener("click", () => {
    const panel = document.getElementById("manageCatEditPanel");
    if (panel) panel.classList.add("hidden");
    _editingCatName = null;
    document.querySelectorAll(".manage-cat-thumb").forEach(t => t.classList.remove("selected"));
  });
  document.getElementById("closeCatEditPanelBtn")?.addEventListener("click", () => {
    const panel = document.getElementById("manageCatEditPanel");
    if (panel) panel.classList.add("hidden");
    _editingCatName = null;
    document.querySelectorAll(".manage-cat-thumb").forEach(t => t.classList.remove("selected"));
  });
  document.getElementById("manageCatImageUrl")?.addEventListener("input", () => {
    const url = document.getElementById("manageCatImageUrl")?.value?.trim();
    const previewImg = document.getElementById("manageCatPreviewImg");
    if (previewImg && url) {
      previewImg.src = url;
      previewImg.onerror = function() { this.onerror = null; this.src = "assets/cat-return-gifts.jpg"; };
    }
  });
  document.getElementById("manageCatImageFile")?.addEventListener("change", function() {
    handleManageCatFileUpload(this);
  });
  document.getElementById("manageCatNameInput")?.addEventListener("input", () => {
    const previewName = document.getElementById("manageCatPreviewName");
    const emoji = document.getElementById("manageCatEmojiInput")?.value || "";
    const name = document.getElementById("manageCatNameInput")?.value || "";
    if (previewName) previewName.textContent = `${emoji} ${name}`.trim();
  });
  document.getElementById("manageCatEmojiInput")?.addEventListener("input", () => {
    const previewName = document.getElementById("manageCatPreviewName");
    const emoji = document.getElementById("manageCatEmojiInput")?.value || "";
    const name = document.getElementById("manageCatNameInput")?.value || "";
    if (previewName) previewName.textContent = `${emoji} ${name}`.trim();
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
    printSlipDocument("invoicePrintArea", "Mayza Mart • Customer Packing Slip");
  });

  // Coupons
  document.getElementById("openAddCouponModalBtn")?.addEventListener("click", openAddCouponModal);
  document.getElementById("closeCouponModalBtn")?.addEventListener("click", closeCouponModal);
  document.getElementById("cancelCouponBtn")?.addEventListener("click", closeCouponModal);
  document.getElementById("couponForm")?.addEventListener("submit", handleCouponFormSubmit);

  // Storefront top banner save & live cloud sync
  const marqueeInput = document.getElementById("marqueeTextInput");
  const saveMarqueeBtn = document.getElementById("saveMarqueeBtn");

  if (marqueeInput && window.mayzaSupabase) {
    window.mayzaSupabase.getStoreBanners().then(res => {
      if (res && res.announcement) marqueeInput.value = res.announcement;
    }).catch(console.warn);
  }

  saveMarqueeBtn?.addEventListener("click", async () => {
    const text = marqueeInput?.value?.trim();
    if (!text) {
      showToast("Please enter an announcement message first.", "warning");
      return;
    }

    saveMarqueeBtn.disabled = true;
    saveMarqueeBtn.innerHTML = "<span>Publishing... ⏳</span>";

    try {
      if (window.mayzaSupabase) {
        await window.mayzaSupabase.saveStoreBanners(text);
      } else {
        localStorage.setItem("mm_announcement_banner", text);
      }
      showToast("Announcement banner published live to store! 📢✨");
      triggerCelebration();
      audio?.playSuccess();
    } catch (err) {
      showToast(`Banner save error: ${err.message}`, "warning");
    } finally {
      saveMarqueeBtn.disabled = false;
      saveMarqueeBtn.innerHTML = "<span>⚡ Publish Live to Store</span>";
    }
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
  document.getElementById("printWholesaleBillBtn")?.addEventListener("click", () => {
    printSlipDocument("wholesalePrintArea", "Mayza Mart • Wholesale Procurement Voucher");
  });

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
