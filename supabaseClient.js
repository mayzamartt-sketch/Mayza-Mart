/**
 * MAYZA MART • SUPABASE CLOUD CLIENT BRIDGE
 * Robust client wrapper connecting Storefront & Admin to Supabase PostgreSQL.
 * Supports real-time cloud operations, offline fallback, and one-click data migration.
 */

(function(window) {
  'use strict';

  const STORAGE_KEYS = {
    URL: 'mm_supabase_url',
    KEY: 'mm_supabase_key'
  };

  const DEFAULT_URL = 'https://twvxffxtotizfbsxvgjb.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dnhmZnh0b3RpemZic3h2Z2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3MjU2NTksImV4cCI6MjEwNTMwMTY1OX0.HUwhwlUMyBPC6qBIVGZNyFNCBsMcoMvlrsGJFWUX_YM';

  class MayzaSupabaseClient {
    constructor() {
      this.client = null;
      this.url = localStorage.getItem(STORAGE_KEYS.URL) || DEFAULT_URL;
      this.key = localStorage.getItem(STORAGE_KEYS.KEY) || DEFAULT_KEY;
      this.isConnected = false;
      this.lastSyncTime = null;
      this.realtimeChannel = null;
      this.init();
    }

    init() {
      if (this.url && this.key && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
          this.client = window.supabase.createClient(this.url, this.key, {
            auth: { persistSession: false }
          });
          this.isConnected = true;
          this.notifyStatus(true, 'Supabase Client Ready');
          this.initRealtime();
        } catch (err) {
          console.error('[Supabase] Init Error:', err);
          this.client = null;
          this.isConnected = false;
          this.notifyStatus(false, 'Initialization Failed: ' + err.message);
        }
      } else {
        this.client = null;
        this.isConnected = false;
        this.notifyStatus(false, this.url ? 'Waiting for Supabase library' : 'Credentials not configured');
      }
    }

    initRealtime() {
      if (!this.client) return;
      try {
        if (this.realtimeChannel) {
          try { this.client.removeChannel(this.realtimeChannel); } catch (e) {}
        }
        this.realtimeChannel = this.client
          .channel('mayza-cloud-sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
            console.log('[Supabase Realtime] Products event:', payload.eventType);
            window.dispatchEvent(new CustomEvent('mayza:cloud-products-changed', { detail: payload }));
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            console.log('[Supabase Realtime] Orders event:', payload.eventType);
            window.dispatchEvent(new CustomEvent('mayza:cloud-orders-changed', { detail: payload }));
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'coupons' }, (payload) => {
            console.log('[Supabase Realtime] Coupons event:', payload.eventType);
            const code = String(payload.new?.code || payload.old?.code || '');
            if (code.startsWith('CART_')) {
              window.dispatchEvent(new CustomEvent('mayza:cloud-cart-changed', { detail: payload }));
            } else {
              window.dispatchEvent(new CustomEvent('mayza:cloud-coupons-changed', { detail: payload }));
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'wholesale_purchases' }, (payload) => {
            console.log('[Supabase Realtime] Wholesale event:', payload.eventType);
            window.dispatchEvent(new CustomEvent('mayza:cloud-wholesale-changed', { detail: payload }));
          })
          .subscribe((status) => {
            console.log('[Supabase Realtime Connection Status]:', status);
          });
      } catch (err) {
        console.warn('[Supabase Realtime] Channel subscription fallback to polling:', err);
      }
    }

    isConfigured() {
      return Boolean(this.url && this.key && this.client);
    }

    setCredentials(url, key) {
      this.url = (url || '').trim();
      this.key = (key || '').trim();
      localStorage.setItem(STORAGE_KEYS.URL, this.url);
      localStorage.setItem(STORAGE_KEYS.KEY, this.key);
      this.init();
    }

    clearCredentials() {
      this.url = '';
      this.key = '';
      localStorage.removeItem(STORAGE_KEYS.URL);
      localStorage.removeItem(STORAGE_KEYS.KEY);
      this.client = null;
      this.isConnected = false;
      this.notifyStatus(false, 'Disconnected');
    }

    notifyStatus(connected, message = '') {
      window.dispatchEvent(new CustomEvent('mayza:supabase-status', {
        detail: { connected, message, url: this.url, isConfigured: this.isConfigured() }
      }));
    }

    // Ping / Test connection
    async testConnection() {
      if (!this.isConfigured()) {
        return { success: false, message: 'Please provide both Project URL and Anon API Key.' };
      }
      try {
        const { data, error } = await this.client.from('products').select('id').limit(1);
        if (error) throw error;
        this.isConnected = true;
        this.notifyStatus(true, 'Connected to Supabase PostgreSQL!');
        return { success: true, message: 'Connection successful! Database is online.' };
      } catch (err) {
        this.isConnected = false;
        this.notifyStatus(false, err.message);
        return { success: false, message: 'Connection failed: ' + (err.message || 'Check URL & Key') };
      }
    }

    // =========================================================
    // PRODUCTS CRUD
    // =========================================================
    async fetchProducts() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        return data.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          sku: p.sku,
          price: Number(p.price),
          comparePrice: p.compare_price ? Number(p.compare_price) : undefined,
          stock: Number(p.stock),
          tag: p.tag || 'General',
          image: p.image || 'assets/p-clips.jpg',
          salesCount: Number(p.sales_count || 0)
        }));
      } catch (err) {
        console.warn('[Supabase] fetchProducts error:', err);
        return null;
      }
    }

    async upsertProduct(product) {
      if (!this.isConfigured()) return null;
      try {
        const row = {
          id: product.id,
          title: product.title,
          category: product.category,
          sku: product.sku,
          price: product.price,
          compare_price: product.comparePrice || null,
          stock: product.stock,
          tag: product.tag || 'General',
          image: product.image,
          sales_count: product.salesCount || 0
        };
        const { data, error } = await this.client.from('products').upsert(row).select();
        if (error) throw error;
        return data ? data[0] : row;
      } catch (err) {
        console.error('[Supabase] upsertProduct error:', err);
        throw err;
      }
    }

    async deleteProduct(id) {
      if (!id) return false;

      // 1. Mark as permanently deleted in localStorage so auto-sync never resurrects it
      try {
        const deletedIds = JSON.parse(localStorage.getItem('mm_deleted_product_ids') || '[]');
        if (!deletedIds.includes(String(id))) {
          deletedIds.push(String(id));
          localStorage.setItem('mm_deleted_product_ids', JSON.stringify(deletedIds));
        }
      } catch (e) {}

      // 2. Remove immediately from local cached products list
      try {
        const localProds = JSON.parse(localStorage.getItem('mm_products') || '[]');
        const filtered = localProds.filter(p => String(p.id) !== String(id));
        localStorage.setItem('mm_products', JSON.stringify(filtered));
      } catch (e) {}

      if (!this.isConfigured()) return true;

      try {
        const { error } = await this.client.from('products').delete().eq('id', id);
        if (error) throw error;

        // Broadcast to all tabs & storefront
        window.dispatchEvent(new CustomEvent('mayza:cloud-products-changed', {
          detail: { eventType: 'DELETE', old: { id: id } }
        }));
        window.dispatchEvent(new CustomEvent('mayza:products-updated', {
          detail: { deletedId: id }
        }));

        return true;
      } catch (err) {
        console.error('[Supabase] deleteProduct error:', err);
        throw err;
      }
    }

    // =========================================================
    // ORDERS CRUD
    // =========================================================
    async fetchOrders() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data.map(o => ({
          id: o.id,
          customer: o.customer || {},
          items: o.items || [],
          subtotal: Number(o.subtotal || 0),
          shipping: Number(o.shipping || 0),
          total: Number(o.total || 0),
          payment: o.payment || 'Cash on Delivery',
          status: o.status || 'New',
          timestamp: 'Just now',
          rawDate: o.raw_date || new Date(o.created_at).toLocaleString('en-IN')
        }));
      } catch (err) {
        console.warn('[Supabase] fetchOrders error:', err);
        return null;
      }
    }

    async upsertOrder(order) {
      if (!this.isConfigured()) return null;
      try {
        const row = {
          id: order.id,
          customer: order.customer,
          items: order.items,
          subtotal: order.subtotal,
          shipping: order.shipping || 0,
          total: order.total,
          payment: order.payment,
          status: order.status || 'New',
          raw_date: order.rawDate || new Date().toLocaleString('en-IN')
        };
        const { data, error } = await this.client.from('orders').upsert(row).select();
        if (error) throw error;
        return data ? data[0] : row;
      } catch (err) {
        console.error('[Supabase] upsertOrder error:', err);
        throw err;
      }
    }

    async updateOrderStatus(orderId, newStatus) {
      // Always sync localStorage first so customer profile stays up-to-date
      try {
        const localOrders = JSON.parse(localStorage.getItem('mm_orders') || '[]');
        const idx = localOrders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          localOrders[idx].status = newStatus;
          localStorage.setItem('mm_orders', JSON.stringify(localOrders));
        }
      } catch (e) {}

      if (!this.isConfigured()) return false;
      try {
        const { error } = await this.client
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[Supabase] updateOrderStatus error:', err);
        throw err;
      }
    }

    async createOrder(order) {
      return this.upsertOrder(order);
    }

    async deleteOrder(orderId) {
      if (!this.isConfigured()) return false;
      try {
        const { error } = await this.client.from('orders').delete().eq('id', orderId);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[Supabase] deleteOrder error:', err);
        throw err;
      }
    }

    // =========================================================
    // WHOLESALE PURCHASES CRUD
    // =========================================================
    async fetchWholesale() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client
          .from('wholesale_purchases')
          .select('*')
          .order('date', { ascending: false });
        if (error) throw error;
        return data.map(w => ({
          id: w.id,
          billNumber: w.bill_number,
          date: w.date,
          supplier: w.supplier,
          location: w.location,
          productId: w.product_id,
          productName: w.product_name,
          category: w.category,
          quantity: Number(w.quantity),
          unitCost: Number(w.unit_cost),
          sellingPrice: Number(w.selling_price),
          totalCost: Number(w.total_cost),
          paymentStatus: w.payment_status,
          paymentMode: w.payment_mode,
          notes: w.notes || '',
          synced: true
        }));
      } catch (err) {
        console.warn('[Supabase] fetchWholesale error:', err);
        return null;
      }
    }

    async upsertWholesale(entry) {
      if (!this.isConfigured()) return null;
      try {
        const row = {
          id: entry.id,
          bill_number: entry.billNumber,
          date: entry.date,
          supplier: entry.supplier,
          location: entry.location,
          product_id: entry.productId || null,
          product_name: entry.productName,
          category: entry.category,
          quantity: entry.quantity,
          unit_cost: entry.unitCost,
          selling_price: entry.sellingPrice,
          total_cost: entry.totalCost,
          payment_status: entry.paymentStatus,
          payment_mode: entry.paymentMode,
          notes: entry.notes || ''
        };
        const { data, error } = await this.client.from('wholesale_purchases').upsert(row).select();
        if (error) throw error;
        return data ? data[0] : row;
      } catch (err) {
        console.error('[Supabase] upsertWholesale error:', err);
        throw err;
      }
    }

    async deleteWholesale(id) {
      if (!this.isConfigured()) return false;
      try {
        const { error } = await this.client.from('wholesale_purchases').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[Supabase] deleteWholesale error:', err);
        throw err;
      }
    }

    // =========================================================
    // COUPONS, VIPS, REVIEWS
    // =========================================================
    // COUPONS & STOREFRONT BANNERS
    // =========================================================
    async fetchCoupons() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client.from('coupons').select('*');
        if (error) throw error;
        return data
          .filter(c => c.code !== 'STORE_BANNER')
          .map(c => ({
            code: c.code,
            discount: Number(c.discount),
            minSpend: Number(c.min_spend),
            desc: c.desc,
            active: Boolean(c.active),
            uses: Number(c.uses || 0)
          }));
      } catch (err) {
        console.warn('[Supabase] fetchCoupons error:', err);
        return null;
      }
    }

    async upsertCoupon(coupon) {
      if (!this.isConfigured()) return null;
      try {
        const row = {
          code: coupon.code,
          discount: coupon.discount,
          min_spend: coupon.minSpend,
          desc: coupon.desc,
          active: coupon.active,
          uses: coupon.uses || 0
        };
        const { data, error } = await this.client.from('coupons').upsert(row).select();
        if (error) throw error;
        window.dispatchEvent(new CustomEvent('mayza:coupons-updated', { detail: { coupon } }));
        return data ? data[0] : row;
      } catch (err) {
        console.error('[Supabase] upsertCoupon error:', err);
        throw err;
      }
    }

    async deleteCoupon(code) {
      if (!this.isConfigured()) return false;
      try {
        const { error } = await this.client.from('coupons').delete().eq('code', code);
        if (error) throw error;
        window.dispatchEvent(new CustomEvent('mayza:coupons-updated', { detail: { deletedCode: code } }));
        return true;
      } catch (err) {
        console.error('[Supabase] deleteCoupon error:', err);
        throw err;
      }
    }

    // =========================================================
    // LIVE STOREFRONT BANNERS & ANNOUNCEMENTS
    // =========================================================
    async getStoreBanners() {
      const defaultAnnouncement = "✨ Free Express Delivery Across India on Orders Over ₹499 • Welcome to Mayza Mart! 💖 • 🎁 Handpicked Cute Finds & Gifts • 🌸 Handcrafted With Love By 3 Cousins ✨";
      const cached = localStorage.getItem('mm_announcement_banner') || defaultAnnouncement;

      if (!this.isConfigured()) {
        return { announcement: cached };
      }

      try {
        const { data, error } = await this.client
          .from('coupons')
          .select('*')
          .eq('code', 'STORE_BANNER')
          .limit(1);

        if (!error && data && data.length > 0 && data[0].desc) {
          localStorage.setItem('mm_announcement_banner', data[0].desc);
          return { announcement: data[0].desc };
        }
      } catch (err) {
        console.warn('[Supabase] getStoreBanners error:', err);
      }

      return { announcement: cached };
    }

    async saveStoreBanners(announcementText) {
      const text = (announcementText || '').trim();
      if (!text) return false;

      localStorage.setItem('mm_announcement_banner', text);

      if (this.isConfigured()) {
        try {
          const row = {
            code: 'STORE_BANNER',
            discount: 0,
            min_spend: 0,
            desc: text,
            active: true,
            uses: 0
          };
          await this.client.from('coupons').upsert(row);
        } catch (err) {
          console.warn('[Supabase] saveStoreBanners cloud error:', err);
        }
      }

      window.dispatchEvent(new CustomEvent('mayza:banner-updated', {
        detail: { announcement: text }
      }));

      return true;
    }

    async fetchVips() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client.from('vips').select('*');
        if (error) throw error;
        return data.map(v => ({
          name: v.name,
          city: v.city,
          orders: Number(v.orders || 0),
          spend: Number(v.spend || 0),
          badge: v.badge || 'Mayza VIP'
        }));
      } catch (err) {
        console.warn('[Supabase] fetchVips error:', err);
        return null;
      }
    }

    async fetchReviews() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client.from('reviews').select('*');
        if (error) throw error;
        return data.map(r => ({
          author: r.author,
          rating: Number(r.rating || 5),
          quote: r.quote,
          product: r.product
        }));
      } catch (err) {
        console.warn('[Supabase] fetchReviews error:', err);
        return null;
      }
    }

    // =========================================================
    // BULK MIGRATION & AUTOMATIC BI-DIRECTIONAL SYNC
    // =========================================================
    async syncLocalToSupabase(localState) {
      if (!this.isConfigured()) {
        throw new Error('Supabase is not configured yet. Please enter your URL and Key.');
      }

      const results = {
        products: 0,
        orders: 0,
        wholesale: 0,
        coupons: 0
      };

      // 1. Sync Products safely
      if (Array.isArray(localState.products) && localState.products.length > 0) {
        const seenSkus = new Set();
        for (let i = 0; i < localState.products.length; i++) {
          const p = localState.products[i];
          let sku = (p.sku || `MM-${i + 1000}`).trim();
          if (seenSkus.has(sku.toLowerCase())) {
            sku = `${sku}-${i}`;
          }
          seenSkus.add(sku.toLowerCase());

          const row = {
            id: String(p.id || `prod-${Date.now()}-${i}`),
            title: String(p.title || 'Untitled Item').trim(),
            category: String(p.category || 'General').trim(),
            sku: sku,
            price: Number(p.price) || 0,
            compare_price: p.comparePrice ? Number(p.comparePrice) : null,
            stock: Number(p.stock) || 0,
            tag: String(p.tag || 'General').trim(),
            image: String(p.image || 'assets/p-clips.jpg'),
            sales_count: Number(p.salesCount || p.sales_count || 0)
          };
          try {
            await this.client.from('products').upsert(row);
            results.products++;
          } catch (err) {
            console.warn('[Supabase Sync] Product row skip:', p.id, err.message);
          }
        }
      }

      // 2. Sync Orders safely
      if (Array.isArray(localState.orders) && localState.orders.length > 0) {
        for (const o of localState.orders) {
          if (!o.id) continue;
          const row = {
            id: String(o.id),
            customer: o.customer || {},
            items: Array.isArray(o.items) ? o.items : [],
            subtotal: Number(o.subtotal) || 0,
            shipping: Number(o.shipping) || 0,
            total: Number(o.total) || 0,
            payment: String(o.payment || 'Cash on Delivery'),
            status: String(o.status || 'New'),
            raw_date: String(o.rawDate || o.raw_date || new Date().toLocaleString('en-IN'))
          };
          try {
            await this.client.from('orders').upsert(row);
            results.orders++;
          } catch (err) {
            console.warn('[Supabase Sync] Order row skip:', o.id, err.message);
          }
        }
      }

      // 3. Sync Wholesale safely
      if (Array.isArray(localState.wholesalePurchases) && localState.wholesalePurchases.length > 0) {
        for (let i = 0; i < localState.wholesalePurchases.length; i++) {
          const w = localState.wholesalePurchases[i];
          const row = {
            id: String(w.id || `bill-${Date.now()}-${i}`),
            bill_number: String(w.billNumber || `BILL-${i + 1}`),
            date: w.date ? String(w.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
            supplier: String(w.supplier || 'General Supplier'),
            location: String(w.location || 'Local Market'),
            product_id: w.productId ? String(w.productId) : null,
            product_name: String(w.productName || 'Wholesale Goods'),
            category: String(w.category || 'General'),
            quantity: Math.max(1, Number(w.quantity) || 1),
            unit_cost: Number(w.unitCost) || 0,
            selling_price: Number(w.sellingPrice) || 0,
            total_cost: Number(w.totalCost) || 0,
            payment_status: String(w.paymentStatus || 'Paid'),
            payment_mode: String(w.paymentMode || 'UPI / GPay'),
            notes: String(w.notes || '')
          };
          try {
            await this.client.from('wholesale_purchases').upsert(row);
            results.wholesale++;
          } catch (err) {
            console.warn('[Supabase Sync] Wholesale row skip:', w.id, err.message);
          }
        }
      }

      // 4. Sync Coupons safely
      if (Array.isArray(localState.coupons) && localState.coupons.length > 0) {
        for (const c of localState.coupons) {
          if (!c.code) continue;
          const row = {
            code: String(c.code).trim().toUpperCase(),
            discount: Number(c.discount) || 0,
            min_spend: Number(c.minSpend || c.min_spend) || 0,
            desc: String(c.desc || ''),
            active: Boolean(c.active !== false),
            uses: Number(c.uses || 0)
          };
          try {
            await this.client.from('coupons').upsert(row);
            results.coupons++;
          } catch (err) {
            console.warn('[Supabase Sync] Coupon row skip:', c.code, err.message);
          }
        }
      }

      this.lastSyncTime = new Date();
      return results;
    }

    async syncSupabaseToLocal() {
      if (!this.isConfigured()) return null;
      const [products, orders, wholesale, coupons, vips, reviews] = await Promise.all([
        this.fetchProducts(),
        this.fetchOrders(),
        this.fetchWholesale(),
        this.fetchCoupons(),
        this.fetchVips(),
        this.fetchReviews()
      ]);

      return {
        products: products || undefined,
        orders: orders || undefined,
        wholesalePurchases: wholesale || undefined,
        coupons: coupons || undefined,
        vips: vips || undefined,
        reviews: reviews || undefined
      };
    }

    // Smart 2-way automatic sync: merges cloud and local without losing any items
    async autoSyncBidirectional(localState) {
      if (!this.isConfigured()) return null;
      try {
        const deletedProductIds = new Set(JSON.parse(localStorage.getItem('mm_deleted_product_ids') || '[]'));

        // Fetch current cloud data
        const cloudData = await this.syncSupabaseToLocal();
        if (!cloudData) return null;

        // Filter out any deleted products from cloud results
        if (Array.isArray(cloudData.products)) {
          cloudData.products = cloudData.products.filter(p => !deletedProductIds.has(String(p.id)));
        }

        const cloudProductIds = new Set((cloudData.products || []).map(p => String(p.id)));
        const cloudOrderIds = new Set((cloudData.orders || []).map(o => String(o.id)));
        const cloudWholesaleIds = new Set((cloudData.wholesalePurchases || []).map(w => String(w.id)));

        // Find any local items not yet stored in Supabase (excluding deleted items!)
        const pendingProducts = (localState.products || []).filter(p => p && p.id && !cloudProductIds.has(String(p.id)) && !deletedProductIds.has(String(p.id)));
        const pendingOrders = (localState.orders || []).filter(o => o && o.id && !cloudOrderIds.has(String(o.id)));
        const pendingWholesale = (localState.wholesalePurchases || []).filter(w => w && w.id && !cloudWholesaleIds.has(String(w.id)));

        let pushedAny = false;
        if (pendingProducts.length > 0) {
          console.log(`[Supabase Auto-Sync] Pushing ${pendingProducts.length} local products to cloud...`);
          for (const p of pendingProducts) {
            try { await this.upsertProduct(p); pushedAny = true; } catch (e) {}
          }
        }

        if (pendingOrders.length > 0) {
          console.log(`[Supabase Auto-Sync] Pushing ${pendingOrders.length} local orders to cloud...`);
          for (const o of pendingOrders) {
            try { await this.upsertOrder(o); pushedAny = true; } catch (e) {}
          }
        }

        if (pendingWholesale.length > 0) {
          console.log(`[Supabase Auto-Sync] Pushing ${pendingWholesale.length} local wholesale entries to cloud...`);
          for (const w of pendingWholesale) {
            try { await this.upsertWholesale(w); pushedAny = true; } catch (e) {}
          }
        }

        // If local items were uploaded, pull the combined fresh state
        if (pushedAny) {
          const fresh = await this.syncSupabaseToLocal();
          if (fresh && Array.isArray(fresh.products)) {
            fresh.products = fresh.products.filter(p => !deletedProductIds.has(String(p.id)));
          }
          return fresh;
        }

        return cloudData;
      } catch (err) {
        console.warn('[Supabase AutoSync error]:', err);
        return null;
      }
    }

    // =========================================================
    // STOREFRONT CART REAL-TIME CLOUD SYNC
    // =========================================================
    getCartStorageKey() {
      const cust = this.getCurrentCustomer();
      if (cust && cust.id) {
        return `CART_CUST_${cust.id}`;
      }
      return 'CART_SHARED_LIVE';
    }

    async getCloudCart() {
      let localItems = [];
      try {
        const stored = localStorage.getItem('mm_storefront_cart');
        if (stored) localItems = JSON.parse(stored);
      } catch (e) {}

      if (!this.isConfigured()) return localItems;

      const key = this.getCartStorageKey();
      try {
        const { data, error } = await this.client
          .from('coupons')
          .select('desc')
          .eq('code', key)
          .limit(1);

        if (!error && data && data.length > 0 && data[0].desc) {
          const cloudItems = JSON.parse(data[0].desc);
          if (Array.isArray(cloudItems)) {
            localStorage.setItem('mm_storefront_cart', JSON.stringify(cloudItems));
            return cloudItems;
          }
        }
      } catch (err) {
        console.warn('[Supabase] getCloudCart error:', err);
      }

      return localItems;
    }

    async saveCloudCart(items) {
      const cleanItems = Array.isArray(items) ? items : [];
      try {
        localStorage.setItem('mm_storefront_cart', JSON.stringify(cleanItems));
      } catch (e) {}

      if (!this.isConfigured()) return true;

      const key = this.getCartStorageKey();
      try {
        const row = {
          code: key,
          discount: 0,
          min_spend: 0,
          desc: JSON.stringify(cleanItems),
          active: true,
          uses: cleanItems.length
        };
        await this.client.from('coupons').upsert(row);

        // Broadcast to other tabs & listeners
        window.dispatchEvent(new CustomEvent('mayza:cloud-cart-changed', {
          detail: { items: cleanItems }
        }));
      } catch (err) {
        console.warn('[Supabase] saveCloudCart error:', err);
      }

      return true;
    }

    // =========================================================
    // CUSTOMER AUTH & DASHBOARD SERVICES
    // =========================================================
    getCurrentCustomer() {
      try {
        const stored = localStorage.getItem('mm_customer_session');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }

    setCurrentCustomer(customer) {
      if (!customer) {
        localStorage.removeItem('mm_customer_session');
      } else {
        localStorage.setItem('mm_customer_session', JSON.stringify(customer));
      }
      window.dispatchEvent(new CustomEvent('mayza:customer-auth-changed', {
        detail: { customer }
      }));
    }

    logoutCustomer() {
      this.setCurrentCustomer(null);
    }

    // Auto-sync any local accounts to Supabase Cloud
    async syncCustomersToCloud() {
      if (!this.isConfigured()) return;
      try {
        const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
        if (Array.isArray(localCusts) && localCusts.length > 0) {
          for (const c of localCusts) {
            if (c.email && c.password) {
              await this.client.from('customers').upsert([{
                id: c.id || ('CUST-' + Math.floor(100000 + Math.random() * 900000)),
                name: c.name || 'Valued Customer',
                email: c.email.trim().toLowerCase(),
                phone: c.phone || '',
                address: c.address || '',
                password: c.password,
                created_at: c.created_at || new Date().toISOString()
              }], { onConflict: 'email' });
            }
          }
        }
      } catch (err) {
        console.warn('[Supabase] syncCustomersToCloud error:', err);
      }
    }

    async registerCustomer({ name, email, phone, address, password }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (name || '').trim();
      const cleanPhone = (phone || '').trim();
      const cleanAddress = (address || '').trim();

      if (!cleanEmail || !cleanName || !password) {
        return { success: false, message: 'Name, email and password are required.' };
      }

      const newCustomer = {
        id: 'CUST-' + Math.floor(100000 + Math.random() * 900000),
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
        password: password,
        created_at: new Date().toISOString()
      };

      // 1. Save directly to Supabase Cloud PostgreSQL
      if (this.isConfigured()) {
        try {
          const { data: existing, error: checkErr } = await this.client
            .from('customers')
            .select('id')
            .eq('email', cleanEmail)
            .limit(1);

          if (!checkErr && existing && existing.length > 0) {
            return { success: false, message: 'An account with this email already exists. Please sign in!' };
          }

          const { error: insErr } = await this.client.from('customers').upsert([newCustomer], { onConflict: 'email' });
          if (insErr) {
            console.warn('[Supabase] Customer insert cloud error:', insErr.message);
          }
        } catch (err) {
          console.warn('[Supabase] Customer register cloud error:', err);
        }
      }

      // 2. Save locally for instant offline session
      try {
        const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
        const idx = localCusts.findIndex(c => (c.email || '').toLowerCase() === cleanEmail);
        if (idx !== -1) {
          localCusts[idx] = newCustomer;
        } else {
          localCusts.push(newCustomer);
        }
        localStorage.setItem('mm_local_customers', JSON.stringify(localCusts));
      } catch (e) {}

      // Safe session object
      const safeCustomer = {
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address
      };
      this.setCurrentCustomer(safeCustomer);
      return { success: true, customer: safeCustomer };
    }

    async loginCustomer({ email, password }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !password) {
        return { success: false, message: 'Please enter both email and password.' };
      }

      // 1. Check Supabase Cloud database first (works across all sites & devices)
      if (this.isConfigured()) {
        try {
          console.log('[Auth] Querying Supabase customers table for:', cleanEmail);
          const { data, error } = await this.client
            .from('customers')
            .select('*')
            .eq('email', cleanEmail)
            .limit(1);

          if (error) {
            // If table doesn't exist, error.code will be '42P01'
            console.error('[Auth] Supabase customers query error:', error.code, error.message, error.details);
            if (error.code === '42P01') {
              console.error('[Auth] ❌ The "customers" table does not exist in Supabase! Please run supabase_schema.sql in the Supabase SQL Editor.');
            }
          } else if (data && data.length > 0) {
            const user = data[0];
            console.log('[Auth] ✅ Found user in Supabase cloud:', user.email);
            if (user.password === password) {
              const safeCustomer = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
              };
              this.setCurrentCustomer(safeCustomer);

              // Cache user locally for offline access
              try {
                const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
                const idx = localCusts.findIndex(c => (c.email || '').toLowerCase() === cleanEmail);
                if (idx !== -1) {
                  localCusts[idx] = user;
                } else {
                  localCusts.push(user);
                }
                localStorage.setItem('mm_local_customers', JSON.stringify(localCusts));
              } catch (e) {}

              return { success: true, customer: safeCustomer };
            } else {
              return { success: false, message: 'Incorrect password. Please try again.' };
            }
          } else {
            console.log('[Auth] No user found in Supabase cloud with email:', cleanEmail);
          }
        } catch (err) {
          console.error('[Auth] Login cloud exception:', err.message, err);
        }
      } else {
        console.warn('[Auth] Supabase not configured — skipping cloud lookup');
      }

      // 2. Check local storage fallback (and auto-push to cloud if found)
      try {
        const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
        const found = localCusts.find(c => (c.email || '').toLowerCase() === cleanEmail);
        if (found) {
          if (found.password === password) {
            const safeCustomer = {
              id: found.id,
              name: found.name,
              email: found.email,
              phone: found.phone,
              address: found.address
            };
            this.setCurrentCustomer(safeCustomer);

            // Auto-push to Supabase so it's permanently synced across all devices
            if (this.isConfigured()) {
              this.client.from('customers').upsert([found], { onConflict: 'email' }).catch(console.warn);
            }

            return { success: true, customer: safeCustomer };
          } else {
            return { success: false, message: 'Incorrect password. Please try again.' };
          }
        }
      } catch (e) {}

      return { success: false, message: 'No registered account found with this email. Please create an account first!' };
    }

    async checkCustomerEmailExists(email) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) return { exists: false, message: 'Please enter an email address.' };

      // Check cloud database
      if (this.isConfigured()) {
        try {
          const { data, error } = await this.client
            .from('customers')
            .select('id, name, email')
            .eq('email', cleanEmail)
            .limit(1);

          if (!error && data && data.length > 0) {
            return { exists: true, name: data[0].name, email: data[0].email };
          }
        } catch (err) {
          console.warn('[Supabase] checkCustomerEmailExists error:', err);
        }
      }

      // Check local storage fallback
      try {
        const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
        const found = localCusts.find(c => (c.email || '').toLowerCase() === cleanEmail);
        if (found) {
          return { exists: true, name: found.name, email: found.email };
        }
      } catch (e) {}

      return { exists: false, message: 'No registered account found with this email address.' };
    }

    async resetCustomerPassword({ email, newPassword }) {
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) return { success: false, message: 'Email address is required.' };
      if (!newPassword || newPassword.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters long.' };
      }

      let updatedInCloud = false;
      let updatedInLocal = false;

      // Update in Supabase
      if (this.isConfigured()) {
        try {
          const { error } = await this.client
            .from('customers')
            .update({ password: newPassword })
            .eq('email', cleanEmail);

          if (!error) {
            updatedInCloud = true;
          } else {
            console.warn('[Supabase] resetCustomerPassword cloud update error:', error.message);
          }
        } catch (err) {
          console.warn('[Supabase] resetCustomerPassword cloud error:', err);
        }
      }

      // Update in localStorage
      try {
        const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
        const idx = localCusts.findIndex(c => (c.email || '').toLowerCase() === cleanEmail);
        if (idx !== -1) {
          localCusts[idx].password = newPassword;
          localStorage.setItem('mm_local_customers', JSON.stringify(localCusts));
          updatedInLocal = true;
        }
      } catch (e) {}

      if (updatedInCloud || updatedInLocal) {
        return { success: true, message: 'Password has been successfully reset! You can now sign in.' };
      }

      return { success: false, message: 'Account could not be found to update password.' };
    }

    async updateCustomerProfile(updatedData) {
      const current = this.getCurrentCustomer();
      if (!current) return { success: false, message: 'Not signed in' };

      const updated = { ...current, ...updatedData };
      this.setCurrentCustomer(updated);

      if (this.isConfigured()) {
        try {
          await this.client
            .from('customers')
            .update({
              name: updated.name,
              phone: updated.phone,
              address: updated.address
            })
            .eq('email', current.email);
        } catch (e) {
          console.warn('[Supabase] updateCustomerProfile cloud error:', e);
        }
      }
      return { success: true, customer: updated };
    }

    async getCustomerOrders(email, phone) {
      const cleanEmail = (email || '').trim().toLowerCase();
      let orders = [];
      let fromSupabase = false;

      // Fetch from Supabase
      if (this.isConfigured()) {
        try {
          const allOrders = await this.fetchOrders();
          if (Array.isArray(allOrders)) {
            const customerOrders = allOrders.filter(o => {
              const cust = o.customer || {};
              const orderEmail = (cust.email || '').toLowerCase();
              const orderPhone = (cust.phone || '').trim();
              return (cleanEmail && orderEmail === cleanEmail) || (phone && orderPhone === phone);
            });
            if (customerOrders.length > 0) {
              orders = customerOrders;
              fromSupabase = true;
              // Sync fresh Supabase statuses back into localStorage
              try {
                const localOrders = JSON.parse(localStorage.getItem('mm_orders') || '[]');
                let changed = false;
                customerOrders.forEach(sbOrder => {
                  const li = localOrders.findIndex(lo => lo.id === sbOrder.id);
                  if (li !== -1 && localOrders[li].status !== sbOrder.status) {
                    localOrders[li].status = sbOrder.status;
                    changed = true;
                  }
                });
                if (changed) localStorage.setItem('mm_orders', JSON.stringify(localOrders));
              } catch (e) {}
            }
          }
        } catch (err) {
          console.warn('[Supabase] getCustomerOrders error:', err);
        }
      }

      // If empty or offline, check local storage orders
      if (!fromSupabase || orders.length === 0) {
        try {
          const localOrders = JSON.parse(localStorage.getItem('mm_orders') || '[]');
          const localFiltered = localOrders.filter(o => {
            const cust = o.customer || {};
            const orderEmail = (cust.email || '').toLowerCase();
            const orderPhone = (cust.phone || '').trim();
            return (cleanEmail && orderEmail === cleanEmail) || (phone && orderPhone === phone);
          });
          if (localFiltered.length > 0) orders = localFiltered;
        } catch (e) {}
      }

      return orders;
    }
  }

  // Expose globally
  window.mayzaSupabase = new MayzaSupabaseClient();

})(window);
