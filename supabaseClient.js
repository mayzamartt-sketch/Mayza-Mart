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
      if (!this.isConfigured()) return false;
      try {
        const { error } = await this.client.from('products').delete().eq('id', id);
        if (error) throw error;
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
    async fetchCoupons() {
      if (!this.isConfigured()) return null;
      try {
        const { data, error } = await this.client.from('coupons').select('*');
        if (error) throw error;
        return data.map(c => ({
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
        return data ? data[0] : row;
      } catch (err) {
        console.error('[Supabase] upsertCoupon error:', err);
        throw err;
      }
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
    // BULK MIGRATION & FULL SYNC
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

      // 1. Sync Products
      if (Array.isArray(localState.products) && localState.products.length > 0) {
        const rows = localState.products.map(p => ({
          id: p.id,
          title: p.title,
          category: p.category,
          sku: p.sku,
          price: p.price,
          compare_price: p.comparePrice || null,
          stock: p.stock,
          tag: p.tag || 'General',
          image: p.image,
          sales_count: p.salesCount || 0
        }));
        const { error } = await this.client.from('products').upsert(rows);
        if (error) throw new Error('Products sync failed: ' + error.message);
        results.products = rows.length;
      }

      // 2. Sync Orders
      if (Array.isArray(localState.orders) && localState.orders.length > 0) {
        const rows = localState.orders.map(o => ({
          id: o.id,
          customer: o.customer,
          items: o.items,
          subtotal: o.subtotal,
          shipping: o.shipping || 0,
          total: o.total,
          payment: o.payment,
          status: o.status || 'New',
          raw_date: o.rawDate || new Date().toLocaleString('en-IN')
        }));
        const { error } = await this.client.from('orders').upsert(rows);
        if (error) throw new Error('Orders sync failed: ' + error.message);
        results.orders = rows.length;
      }

      // 3. Sync Wholesale
      if (Array.isArray(localState.wholesalePurchases) && localState.wholesalePurchases.length > 0) {
        const rows = localState.wholesalePurchases.map(w => ({
          id: w.id,
          bill_number: w.billNumber,
          date: w.date,
          supplier: w.supplier,
          location: w.location,
          product_id: w.productId || null,
          product_name: w.productName,
          category: w.category,
          quantity: w.quantity,
          unit_cost: w.unitCost,
          selling_price: w.sellingPrice,
          total_cost: w.totalCost,
          payment_status: w.paymentStatus,
          payment_mode: w.paymentMode,
          notes: w.notes || ''
        }));
        const { error } = await this.client.from('wholesale_purchases').upsert(rows);
        if (error) throw new Error('Wholesale sync failed: ' + error.message);
        results.wholesale = rows.length;
      }

      // 4. Sync Coupons
      if (Array.isArray(localState.coupons) && localState.coupons.length > 0) {
        const rows = localState.coupons.map(c => ({
          code: c.code,
          discount: c.discount,
          min_spend: c.minSpend,
          desc: c.desc,
          active: c.active,
          uses: c.uses || 0
        }));
        const { error } = await this.client.from('coupons').upsert(rows);
        if (error) throw new Error('Coupons sync failed: ' + error.message);
        results.coupons = rows.length;
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

      // Try Supabase first if online
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

          const { data, error } = await this.client.from('customers').insert([newCustomer]).select();
          if (error) {
            console.warn('[Supabase] Customers table insert error, fallback local:', error.message);
          }
        } catch (err) {
          console.warn('[Supabase] Customer register fallback:', err);
        }
      }

      // Save locally as well for offline resilience
      try {
        const localCusts = JSON.parse(localStorage.getItem('mm_local_customers') || '[]');
        if (localCusts.some(c => (c.email || '').toLowerCase() === cleanEmail)) {
          return { success: false, message: 'An account with this email already exists. Please sign in!' };
        }
        localCusts.push(newCustomer);
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

      // Check cloud database
      if (this.isConfigured()) {
        try {
          const { data, error } = await this.client
            .from('customers')
            .select('*')
            .eq('email', cleanEmail)
            .limit(1);

          if (!error && data && data.length > 0) {
            const user = data[0];
            if (user.password === password) {
              const safeCustomer = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
              };
              this.setCurrentCustomer(safeCustomer);
              return { success: true, customer: safeCustomer };
            } else {
              return { success: false, message: 'Incorrect password. Please try again.' };
            }
          }
        } catch (err) {
          console.warn('[Supabase] Login check cloud error:', err);
        }
      }

      // Check local storage fallback
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
            return { success: true, customer: safeCustomer };
          } else {
            return { success: false, message: 'Incorrect password. Please try again.' };
          }
        }
      } catch (e) {}

      return { success: false, message: 'No account found with this email. Please create an account first!' };
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

      // Fetch from Supabase
      if (this.isConfigured()) {
        try {
          const allOrders = await this.fetchOrders();
          if (Array.isArray(allOrders)) {
            orders = allOrders.filter(o => {
              const cust = o.customer || {};
              const orderEmail = (cust.email || '').toLowerCase();
              const orderPhone = (cust.phone || '').trim();
              return (cleanEmail && orderEmail === cleanEmail) || (phone && orderPhone === phone);
            });
          }
        } catch (err) {
          console.warn('[Supabase] getCustomerOrders error:', err);
        }
      }

      // If empty or offline, check local storage orders
      if (!orders || orders.length === 0) {
        try {
          const localOrders = JSON.parse(localStorage.getItem('mm_orders') || '[]');
          orders = localOrders.filter(o => {
            const cust = o.customer || {};
            const orderEmail = (cust.email || '').toLowerCase();
            const orderPhone = (cust.phone || '').trim();
            return (cleanEmail && orderEmail === cleanEmail) || (phone && orderPhone === phone);
          });
        } catch (e) {}
      }

      return orders;
    }
  }

  // Expose globally
  window.mayzaSupabase = new MayzaSupabaseClient();

})(window);
