/* =========================================================
   Mayza Mart — Entrance Animation & Mascot Engine
   GSAP Timeline Orchestration, Web Audio API, & Interactions
   ========================================================= */

// Sound Engine using Web Audio API (Zero external audio files needed!)
class CuteSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.init();
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn('AudioContext init error:', e);
    }
  }

  ensureContext() {
    if (!this.ctx || this.ctx.state === 'suspended') {
      this.init();
    }
    return this.ctx;
  }

  // Soft cart wheel rolling rumble
  // Cute cartoon rubber wheel brake / skid squeak
  playWheelSkid() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.22);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    gain.gain.setValueAtTime(0.045, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  playWheelRoll() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }

  // Brush / pen stroke swoosh
  playSwoosh() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  // Sweet bubble pop
  playBubblePop(freq = 520, delay = 0) {
    if (!this.enabled) return;
    setTimeout(() => {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    }, delay);
  }

  // Mascot joyful pop-up boing
  playMascotPop() {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(680, ctx.currentTime + 0.22);
    osc.frequency.linearRampToValueAtTime(540, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.38);
  }

  // Radiant sparkle chime
  playSparkleChime() {
    if (!this.enabled) return;
    const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const ctx = this.ensureContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }, idx * 75);
    });
  }

  // Mascot giggle sound
  playGiggle() {
    if (!this.enabled) return;
    const giggles = [587.33, 739.99, 880, 739.99, 987.77];
    giggles.forEach((freq, i) => {
      setTimeout(() => {
        const ctx = this.ensureContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }, i * 65);
    });
  }
}

// Master Animation Controller
class MayzaEntranceApp {
  constructor() {
    this.sound = new CuteSoundEngine();
    this.mainTimeline = null;
    this.idleTimeline = null;
    this.isEntered = false;
    this.cartCount = 0;
    this.toastTimeout = null;

    this.initElements();
    this.initEventListeners();
    this.initStorefrontInteractions();
    this.setupAnimation();
  }

  initElements() {
    // Buttons & Intro
    this.introOverlay = document.getElementById('introOverlay');
    this.startExperienceBtn = document.getElementById('startExperienceBtn');
    this.soundBtn = document.getElementById('soundBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundLabel = document.getElementById('soundLabel');
    this.replayBtn = document.getElementById('replayBtn');
    this.enterStoreBtn = document.getElementById('enterStoreBtn');
    this.returnToAnimBtn = document.getElementById('returnToAnimBtn');

    // Sections
    this.stageContainer = document.getElementById('stageContainer');
    this.storefrontPreview = document.getElementById('storefrontPreview');
    this.animStatus = document.getElementById('animStatus');
    this.speechBubble = document.getElementById('speechBubble');

    // SVG elements
    this.mascotHitbox = document.getElementById('mascotHitbox');
    this.mascotGroup = document.getElementById('mascotGroup');
    this.rightWinkArc = document.getElementById('rightWinkArc');
    this.rightEye = document.getElementById('rightEye');
    this.leftEye = document.getElementById('leftEye');
    this.floatingHeartsContainer = document.getElementById('floatingHeartsContainer');
  }

  initEventListeners() {
    // Click to Enter Wonderland & Start Experience with Guaranteed Audio
    if (this.startExperienceBtn) {
      this.startExperienceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startExperience();
      });
    }

    if (this.introOverlay) {
      this.introOverlay.addEventListener('click', () => {
        this.startExperience();
      });
    }

    // Optional Sound Toggle
    if (this.soundBtn) {
      this.soundBtn.addEventListener('click', () => {
        this.sound.init();
        this.sound.enabled = !this.sound.enabled;
        if (this.sound.enabled) {
          if (this.soundIcon) this.soundIcon.textContent = '🔊';
          if (this.soundLabel) this.soundLabel.textContent = 'Sound On';
          this.sound.playBubblePop(620);
        } else {
          if (this.soundIcon) this.soundIcon.textContent = '🔇';
          if (this.soundLabel) this.soundLabel.textContent = 'Muted';
        }
      });
    }

    // Replay
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        this.sound.init();
        this.replayAnimation();
      });
    }

    // Enter Storefront
    if (this.enterStoreBtn) {
      this.enterStoreBtn.addEventListener('click', () => {
        this.enterStore();
      });
    }

    const quickStoreBtn = document.getElementById('quickStoreBtn');
    if (quickStoreBtn) {
      quickStoreBtn.addEventListener('click', () => {
        this.enterStore();
      });
    }

    // Return to Entrance Animation
    if (this.returnToAnimBtn) {
      this.returnToAnimBtn.addEventListener('click', () => {
        this.returnToAnimation();
      });
    }

    // Interactive Mascot Click (Giggle & Hearts)
    if (this.mascotHitbox) {
      this.mascotHitbox.addEventListener('click', () => {
        this.sound.init();
        this.triggerMascotReaction();
      });
    }

    // Automatically unlock Web Audio immediately on ANY user interaction, pointer movement, or window gesture
    const unlockSound = () => {
      this.sound.init();
    };
    ['pointerdown', 'pointermove', 'mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'focus', 'wheel'].forEach(evt => {
      window.addEventListener(evt, unlockSound, { passive: true });
    });
  }

  startExperience() {
    this.sound.init();
    this.sound.playBubblePop(720);

    if (this.introOverlay) {
      this.introOverlay.classList.add('dismissed');
      setTimeout(() => {
        this.introOverlay.style.display = 'none';
      }, 600);
    }

    // Play main animation timeline from second 0 with full sound!
    setTimeout(() => {
      this.mainTimeline.restart();
    }, 100);
  }

  setupAnimation() {
    // Set initial SVG states before play
    gsap.set('#groundShadow', { scaleX: 0, transformOrigin: 'center center', opacity: 0 });
    gsap.set('#wheelLeft', { x: -520, rotation: -1440, transformOrigin: 'center center', opacity: 0, scaleX: 1.15, scaleY: 0.88 });
    gsap.set('#wheelRight', { x: -520, rotation: -1440, transformOrigin: 'center center', opacity: 0, scaleX: 1.15, scaleY: 0.88 });
    gsap.set('#cartSwooshGroup', { scaleX: 0, scaleY: 0, transformOrigin: '300px 340px', opacity: 0 });
    gsap.set('#letterM', { y: -60, scale: 0.2, transformOrigin: '250px 330px', opacity: 0 });
    gsap.set('#mascotGroup', { y: 150, scale: 0.1, transformOrigin: '550px 320px', opacity: 0 });
    gsap.set('#mascotMouth', { scaleY: 0.5, transformOrigin: 'center center' });
    gsap.set('#rightArmGroup', { rotation: -30, transformOrigin: '0px 0px' });
    gsap.set('.bubbly-letter:not(#letterM)', { scale: 0, y: 35, transformOrigin: 'center center', opacity: 0 });
    gsap.set('.mart-letter', { scale: 0, y: 25, transformOrigin: 'center bottom', opacity: 0 });
    gsap.set('#sparkleRaysGroup g', { scale: 0, transformOrigin: 'bottom center', opacity: 0 });
    this.speechBubble.classList.remove('show');

    // Build Master GSAP Timeline
    this.mainTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        this.animStatus.innerHTML = '<span class="status-indicator"></span><span class="status-text">Playing entrance animation...</span>';
      },
      onComplete: () => {
        this.animStatus.innerHTML = '<span class="status-indicator" style="background:#10B981;"></span><span class="status-text">Your sweetest shopping spree starts now! 🛍️</span>';
        this.speechBubble.classList.add('show');
        this.startIdleLoops();
        this.celebrateConfetti();
      }
    });

    // ----------------------------------------------------
    // PHASE 1: Super Lively Cart Wheels Zoom In & Skid-Stop!
    // ----------------------------------------------------
    this.mainTimeline
      .add(() => { this.sound.playWheelRoll(); }, 0.1)
      // Shadow expands and pulses as cart arrives
      .to('#groundShadow', {
        scaleX: 1.1,
        opacity: 0.5,
        duration: 0.85,
        ease: 'power2.out'
      }, 0.1)
      .to('#groundShadow', {
        scaleX: 1,
        opacity: 0.45,
        duration: 0.4,
        ease: 'power1.out'
      }, 0.95)

      // Lead Wheel (Right) zooms in fast with overshoot, fast spin & squash-stretch!
      .to('#wheelRight', {
        x: 18,
        rotation: 35,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.82,
        ease: 'power3.out'
      }, 0.1)
      // Rear Wheel (Left) chases with dynamic stagger & overshoot
      .to('#wheelLeft', {
        x: 15,
        rotation: 30,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.86,
        ease: 'power3.out'
      }, 0.16)

      // Skid-stop brake squeak & cartoon smoke puff!
      .add(() => {
        this.sound.playWheelSkid();
        this.spawnSkidPuff(425, 646);
        this.spawnSkidPuff(640, 646);
      }, 0.88)

      // Wheels rock back from overshoot with lively spring settling
      .to('#wheelRight', {
        x: 0,
        rotation: 0,
        duration: 0.55,
        ease: 'elastic.out(1.4, 0.4)'
      }, 0.92)
      .to('#wheelLeft', {
        x: 0,
        rotation: 0,
        duration: 0.55,
        ease: 'elastic.out(1.4, 0.4)'
      }, 0.95)

      // Energetic double suspension bounce & squash!
      .to(['#wheelLeft', '#wheelRight'], {
        scaleY: 0.78,
        scaleX: 1.18,
        y: 4,
        transformOrigin: 'center bottom',
        duration: 0.14,
        ease: 'power2.in'
      }, 0.92)
      .to(['#wheelLeft', '#wheelRight'], {
        scaleY: 1.08,
        scaleX: 0.94,
        y: -14,
        duration: 0.22,
        ease: 'power2.out'
      }, 1.06)
      .to(['#wheelLeft', '#wheelRight'], {
        scaleY: 1,
        scaleX: 1,
        y: 0,
        duration: 0.25,
        ease: 'bounce.out'
      }, 1.28)

    // ----------------------------------------------------
    // PHASE 2: "M" Cart Swoosh & Basket Forms
    // ----------------------------------------------------
      .add(() => { this.sound.playSwoosh(); }, 1.3)
      .to('#cartSwooshGroup', {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.75)'
      }, 1.3)
      .to('#letterM', {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.85,
        ease: 'back.out(1.8)'
      }, 1.5)

    // ----------------------------------------------------
    // PHASE 3: Adorable Mascot Pair Pops Up!
    // ----------------------------------------------------
      .add(() => { this.sound.playMascotPop(); }, 2.0)
      .to('#mascotGroup', {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.0,
        ease: 'back.out(1.8)'
      }, 2.0)
      .to('#mascotGroup', { rotation: -2, duration: 0.35, yoyo: true, repeat: 1, transformOrigin: 'center bottom' }, 2.3)

    // ----------------------------------------------------
    // PHASE 4: "ayza" & "mart" Letters Bubble In!
    // ----------------------------------------------------
      .to(['#letterA1', '#letterY', '#letterZ', '#letterA2'], {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: 'elastic.out(1.2, 0.6)',
        onStart: () => {
          this.sound.playBubblePop(520, 0);
          this.sound.playBubblePop(620, 120);
          this.sound.playBubblePop(740, 240);
          this.sound.playBubblePop(880, 360);
        }
      }, 2.8)

      // "mart" nestled under
      .to('.mart-letter', {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.09,
        ease: 'back.out(2.0)',
        onStart: () => {
          this.sound.playBubblePop(660, 0);
          this.sound.playBubblePop(780, 90);
          this.sound.playBubblePop(920, 180);
          this.sound.playBubblePop(1050, 270);
        }
      }, 3.3)

    // ----------------------------------------------------
    // PHASE 5: 3 Radiant Sparkle Rays Pop & Glow
    // ----------------------------------------------------
      .add(() => { this.sound.playSparkleChime(); }, 3.8)
      .to(['#ray1', '#ray2', '#ray3'], {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(2.8)'
      }, 3.8)

      // Slight logo lockup gentle pulse
      .to('#mayzaSvg', {
        scale: 1.025,
        duration: 0.35,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      }, 4.2);

    // If intro overlay is NOT present, auto-play after brief moment
    if (!this.introOverlay) {
      setTimeout(() => {
        this.mainTimeline.play();
      }, 400);
    }
  }

  // Idle animations for liveliness after main intro
  startIdleLoops() {
    if (this.idleTimeline) this.idleTimeline.kill();

    this.idleTimeline = gsap.timeline({ repeat: -1 });

    // Mascot gentle breathing & floating sway
    this.idleTimeline
      .to('#mascotGroup', {
        y: -10,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1
      }, 0)
      .to('#mascotGroup', {
        rotation: 1.2,
        duration: 2.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
        transformOrigin: 'center bottom'
      }, 0)
      // Playful gentle suspension spring on wheels during idle
      .to(['#wheelLeft', '#wheelRight'], {
        y: -3,
        scaleY: 1.03,
        duration: 2.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
        transformOrigin: 'center bottom'
      }, 0);
  }

  blinkMascot() {
    if (this.leftEye && this.rightEye) {
      gsap.to(['#leftEye', '#rightEye'], {
        scaleY: 0.1,
        duration: 0.1,
        transformOrigin: 'center center',
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }
  }

  winkMascot() {
    if (this.rightEye && this.rightWinkArc) {
      this.rightEye.style.display = 'none';
      this.rightWinkArc.style.display = 'block';

      setTimeout(() => {
        this.rightEye.style.display = 'block';
        this.rightWinkArc.style.display = 'none';
      }, 450);
    }
  }

  // Interactive Mascot Reaction when clicked
  triggerMascotReaction() {
    this.sound.playGiggle();

    // Cheerful bounce & happy squeeze
    gsap.timeline()
      .to('#mascotGroup', { scale: 1.05, y: -18, duration: 0.22, ease: 'power2.out' })
      .to('#mascotGroup', { scale: 1, y: 0, duration: 0.45, ease: 'bounce.out' });

    // Spawn floating SVG hearts
    this.spawnFloatingHearts(5);

    // Update speech bubble
    const phrases = [
      'Yay! Welcome to Mayza Mart! 💕',
      'We are so happy to see you! ✨',
      'Everything is made with love! 💖',
      'Ready to explore the cutest boutique? 🍓'
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.speechBubble.querySelector('span').textContent = phrase;
    this.speechBubble.classList.add('show');
  }

  spawnSkidPuff(x, y) {
    const container = document.getElementById('wheelSparksGroup');
    if (!container) return;

    for (let i = 0; i < 5; i++) {
      const puff = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const angle = (Math.PI / 4) + (Math.random() * Math.PI / 2);
      const dist = 12 + Math.random() * 22;
      puff.setAttribute('cx', x);
      puff.setAttribute('cy', y);
      puff.setAttribute('r', (4 + Math.random() * 4).toString());
      puff.setAttribute('fill', Math.random() > 0.4 ? '#FFA2B4' : '#FFFFFF');
      puff.setAttribute('opacity', '0.85');
      container.appendChild(puff);

      gsap.to(puff, {
        cx: x - Math.cos(angle) * dist - 18,
        cy: y - Math.sin(angle) * dist,
        r: 1,
        opacity: 0,
        duration: 0.45 + Math.random() * 0.25,
        ease: 'power2.out',
        onComplete: () => {
          if (puff.parentNode) puff.parentNode.removeChild(puff);
        }
      });
    }
  }

  spawnFloatingHearts(count = 3) {
    const mascotBox = { x: 440, y: 165 };

    for (let i = 0; i < count; i++) {
      const heart = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      heart.textContent = '♥';
      heart.setAttribute('class', 'floating-heart');
      heart.setAttribute('x', mascotBox.x + (Math.random() * 80 - 40));
      heart.setAttribute('y', mascotBox.y + (Math.random() * 40 - 20));
      heart.setAttribute('font-size', '24');
      heart.setAttribute('fill', Math.random() > 0.5 ? '#D9657B' : '#FFA2B4');
      this.floatingHeartsContainer.appendChild(heart);

      gsap.to(heart, {
        y: -120 - Math.random() * 60,
        x: (Math.random() - 0.5) * 80,
        scale: 1.4,
        opacity: 0,
        duration: 1.2 + Math.random() * 0.6,
        ease: 'power1.out',
        onComplete: () => heart.remove()
      });
    }
  }

  celebrateConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.55 },
        colors: ['#D9657B', '#FFA2B4', '#FFE8DF', '#FFD1DA', '#FFFFFF']
      });
    }
  }

  replayAnimation() {
    if (this.idleTimeline) this.idleTimeline.pause();
    this.mainTimeline.restart();
  }

  enterStore() {
    this.isEntered = true;
    this.sound.playSparkleChime();

    // Smooth transition
    this.stageContainer.classList.add('fade-out');

    setTimeout(() => {
      this.stageContainer.style.display = 'none';
      this.storefrontPreview.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  }

  initStorefrontInteractions() {
    // Interactive Add to Cart buttons with Customer Auth Gatekeeper
    document.querySelectorAll('.add-to-cart-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-item-card');
        const name = card ? card.getAttribute('data-name') : 'Item';

        // Gatekeeper check: User must be signed in to add items to cart!
        const currentCustomer = window.mayzaSupabase?.getCurrentCustomer();
        if (!currentCustomer) {
          this.pendingCartAction = { name };
          this.openCustomerAuthModal("Please sign in or create an account to add items to your cart! 🛍️");
          return;
        }

        this.addToCart(name);
      });
    });

    // Wishlist Favorite Heart toggle
    document.querySelectorAll('.favorite-heart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
        this.sound.playBubblePop(780);
        this.showToast(btn.classList.contains('active') ? 'Saved to Wishlist! 💖' : 'Removed from Wishlist');
      });
    });

    // Live Search Filter for Bestsellers
    const searchInput = document.getElementById('storeSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.product-item-card').forEach(card => {
          const name = (card.getAttribute('data-name') || '').toLowerCase();
          if (!query || name.includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    // Initialize traveling mascot guide companion
    this.initTravelingMascot();

    // Initialize Customer Authentication & Dashboard Gateway
    this.initCustomerAuthAndDashboard();
  }

  // =========================================================
  // CUSTOMER AUTH & DASHBOARD ORCHESTRATION
  // =========================================================
  initCustomerAuthAndDashboard() {
    const authModal = document.getElementById('customerAuthModal');
    const closeAuthBtn = document.getElementById('closeCustomerAuthModalBtn');
    const dashModal = document.getElementById('customerDashboardModal');
    const closeDashBtn = document.getElementById('closeCustomerDashboardModalBtn');
    const accountBtn = document.getElementById('customerAccountBtn');

    // Tab buttons in Auth Modal
    const tabLogin = document.getElementById('authTabLogin');
    const tabRegister = document.getElementById('authTabRegister');
    const formLogin = document.getElementById('customerLoginForm');
    const formRegister = document.getElementById('customerRegisterForm');
    const switchToReg = document.getElementById('switchToRegisterBtn');
    const switchToLog = document.getElementById('switchToLoginBtn');

    // Forms & inputs
    const togglePw = document.getElementById('toggleLoginPwBtn');
    const loginPwInput = document.getElementById('loginPasswordInput');
    const loginEmailInput = document.getElementById('loginEmailInput');
    const loginFeedback = document.getElementById('loginFeedbackMsg');

    const regNameInput = document.getElementById('regNameInput');
    const regEmailInput = document.getElementById('regEmailInput');
    const regPhoneInput = document.getElementById('regPhoneInput');
    const regPassInput = document.getElementById('regPasswordInput');
    const regAddressInput = document.getElementById('regAddressInput');
    const regFeedback = document.getElementById('regFeedbackMsg');

    // Dashboard tabs
    const dashTabOrders = document.getElementById('dashTabOrders');
    const dashTabProfile = document.getElementById('dashTabProfile');
    const dashTabWishlist = document.getElementById('dashTabWishlist');
    const dashOrdersPanel = document.getElementById('dashOrdersPanel');
    const dashProfilePanel = document.getElementById('dashProfilePanel');
    const dashWishlistPanel = document.getElementById('dashWishlistPanel');

    const profileForm = document.getElementById('customerProfileUpdateForm');
    const logoutBtn = document.getElementById('customerLogoutBtn');
    const continueShoppingBtn = document.getElementById('dashContinueShoppingBtn');

    // Tab switching in Auth modal
    const setAuthTab = (tab) => {
      if (tab === 'register') {
        tabRegister?.classList.add('active');
        tabLogin?.classList.remove('active');
        if (formRegister) formRegister.style.display = 'flex';
        if (formLogin) formLogin.style.display = 'none';
        if (regFeedback) regFeedback.textContent = '';
      } else {
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
        if (formLogin) formLogin.style.display = 'flex';
        if (formRegister) formRegister.style.display = 'none';
        if (loginFeedback) loginFeedback.textContent = '';
      }
    };

    tabLogin?.addEventListener('click', () => setAuthTab('login'));
    tabRegister?.addEventListener('click', () => setAuthTab('register'));
    switchToReg?.addEventListener('click', () => setAuthTab('register'));
    switchToLog?.addEventListener('click', () => setAuthTab('login'));

    // Toggle password visibility
    togglePw?.addEventListener('click', () => {
      if (loginPwInput.type === 'password') {
        loginPwInput.type = 'text';
        togglePw.textContent = '🙈';
      } else {
        loginPwInput.type = 'password';
        togglePw.textContent = '👁️';
      }
    });

    // Close modal handlers
    closeAuthBtn?.addEventListener('click', () => this.closeCustomerAuthModal());
    closeDashBtn?.addEventListener('click', () => this.closeCustomerDashboardModal());
    continueShoppingBtn?.addEventListener('click', () => this.closeCustomerDashboardModal());

    authModal?.addEventListener('click', (e) => {
      if (e.target === authModal) this.closeCustomerAuthModal();
    });
    dashModal?.addEventListener('click', (e) => {
      if (e.target === dashModal) this.closeCustomerDashboardModal();
    });

    // Account Button Click: Open Dashboard if logged in, or Auth Modal if logged out
    accountBtn?.addEventListener('click', () => {
      const customer = window.mayzaSupabase?.getCurrentCustomer();
      if (customer) {
        this.openCustomerDashboardModal();
      } else {
        this.openCustomerAuthModal("Sign in to your Mayza Mart account or create a new one! 🌸");
      }
    });

    // Sign In Form Submit
    formLogin?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginEmailInput.value.trim();
      const password = loginPwInput.value;
      const submitBtn = document.getElementById('loginSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Signing in... ⏳</span>';
      if (loginFeedback) loginFeedback.textContent = '';

      try {
        const res = await window.mayzaSupabase.loginCustomer({ email, password });
        if (res.success) {
          this.closeCustomerAuthModal();
          this.updateCustomerHeaderUI();
          this.celebrateConfetti();
          this.sound.playSparkleChime();

          if (this.pendingCartAction) {
            const item = this.pendingCartAction.name;
            this.addToCart(item);
            this.showToast(`Welcome back, ${res.customer.name}! Added "${item}" to your cart! 🛍️`);
            this.pendingCartAction = null;
          } else {
            this.showToast(`Welcome back to Mayza Mart, ${res.customer.name}! 💕`);
          }
          loginPwInput.value = '';
        } else {
          if (loginFeedback) loginFeedback.textContent = res.message || 'Login failed. Please check credentials.';
          this.sound.playBubblePop(240);
        }
      } catch (err) {
        if (loginFeedback) loginFeedback.textContent = 'Login error: ' + err.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Sign In &amp; Continue</span><span class="btn-arrow">➔</span>';
      }
    });

    // Create Account Form Submit
    formRegister?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = regNameInput.value.trim();
      const email = regEmailInput.value.trim();
      const phone = regPhoneInput.value.trim();
      const password = regPassInput.value;
      const address = regAddressInput.value.trim();
      const submitBtn = document.getElementById('registerSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Creating Account... ⏳</span>';
      if (regFeedback) regFeedback.textContent = '';

      try {
        const res = await window.mayzaSupabase.registerCustomer({ name, email, phone, address, password });
        if (res.success) {
          this.closeCustomerAuthModal();
          this.updateCustomerHeaderUI();
          this.celebrateConfetti();
          this.sound.playSparkleChime();

          if (this.pendingCartAction) {
            const item = this.pendingCartAction.name;
            this.addToCart(item);
            this.showToast(`Account created! Welcome, ${res.customer.name}! Added "${item}" to cart! 🎉`);
            this.pendingCartAction = null;
          } else {
            this.showToast(`Welcome to Mayza Mart Family, ${res.customer.name}! 🌸`);
          }
          regPassInput.value = '';
        } else {
          if (regFeedback) regFeedback.textContent = res.message || 'Registration failed.';
          this.sound.playBubblePop(240);
        }
      } catch (err) {
        if (regFeedback) regFeedback.textContent = 'Registration error: ' + err.message;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Create Account &amp; Continue</span><span class="btn-arrow">➔</span>';
      }
    });

    // Profile update form
    profileForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('profileNameInput').value.trim();
      const phone = document.getElementById('profilePhoneInput').value.trim();
      const address = document.getElementById('profileAddressInput').value.trim();

      const res = await window.mayzaSupabase.updateCustomerProfile({ name, phone, address });
      if (res.success) {
        this.showToast('Profile & shipping details updated! 💾');
        this.updateCustomerHeaderUI();
        this.sound.playSparkleChime();
      } else {
        this.showToast(res.message || 'Failed to update profile');
      }
    });

    // Dashboard Tabs Switching
    const setDashTab = (tab) => {
      [dashTabOrders, dashTabProfile, dashTabWishlist].forEach(b => b?.classList.remove('active'));
      [dashOrdersPanel, dashProfilePanel, dashWishlistPanel].forEach(p => {
        if (p) p.style.display = 'none';
      });

      if (tab === 'profile') {
        dashTabProfile?.classList.add('active');
        if (dashProfilePanel) dashProfilePanel.style.display = 'block';
      } else if (tab === 'wishlist') {
        dashTabWishlist?.classList.add('active');
        if (dashWishlistPanel) dashWishlistPanel.style.display = 'block';
        this.renderCustomerWishlist();
      } else {
        dashTabOrders?.classList.add('active');
        if (dashOrdersPanel) dashOrdersPanel.style.display = 'block';
        this.renderCustomerOrders();
      }
    };

    dashTabOrders?.addEventListener('click', () => setDashTab('orders'));
    dashTabProfile?.addEventListener('click', () => setDashTab('profile'));
    dashTabWishlist?.addEventListener('click', () => setDashTab('wishlist'));

    // Logout
    logoutBtn?.addEventListener('click', () => {
      if (confirm("Are you sure you want to sign out?")) {
        window.mayzaSupabase?.logoutCustomer();
        this.closeCustomerDashboardModal();
        this.updateCustomerHeaderUI();
        this.showToast("You've been signed out. See you soon! 💕");
        this.sound.playBubblePop(440);
      }
    });

    // Listen to custom customer auth change events
    window.addEventListener('mayza:customer-auth-changed', () => {
      this.updateCustomerHeaderUI();
    });

    // Initial check on load
    this.updateCustomerHeaderUI();
  }

  openCustomerAuthModal(noticeText) {
    const modal = document.getElementById('customerAuthModal');
    const notice = document.getElementById('authGateNotice');
    if (notice && noticeText) notice.textContent = noticeText;
    modal?.classList.add('active');
    modal?.setAttribute('aria-hidden', 'false');
    this.sound.playBubblePop(660);
  }

  closeCustomerAuthModal() {
    const modal = document.getElementById('customerAuthModal');
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
  }

  async openCustomerDashboardModal() {
    const modal = document.getElementById('customerDashboardModal');
    const customer = window.mayzaSupabase?.getCurrentCustomer();
    if (!customer) return;

    // Pre-fill header
    const avatar = document.getElementById('dashUserAvatar');
    const nameEl = document.getElementById('dashUserName');
    const emailEl = document.getElementById('dashUserEmail');
    const phoneEl = document.getElementById('dashUserPhone');

    if (avatar) avatar.textContent = (customer.name || 'M').charAt(0).toUpperCase();
    if (nameEl) nameEl.textContent = customer.name || 'Mayza Shopper';
    if (emailEl) emailEl.textContent = customer.email || '';
    if (phoneEl) phoneEl.textContent = customer.phone || 'No phone added';

    // Pre-fill profile form
    const pName = document.getElementById('profileNameInput');
    const pEmail = document.getElementById('profileEmailInput');
    const pPhone = document.getElementById('profilePhoneInput');
    const pAddress = document.getElementById('profileAddressInput');

    if (pName) pName.value = customer.name || '';
    if (pEmail) pEmail.value = customer.email || '';
    if (pPhone) pPhone.value = customer.phone || '';
    if (pAddress) pAddress.value = customer.address || '';

    modal?.classList.add('active');
    modal?.setAttribute('aria-hidden', 'false');
    this.sound.playSparkleChime();

    // Render Orders
    await this.renderCustomerOrders();
  }

  closeCustomerDashboardModal() {
    const modal = document.getElementById('customerDashboardModal');
    modal?.classList.remove('active');
    modal?.setAttribute('aria-hidden', 'true');
  }

  updateCustomerHeaderUI() {
    const customer = window.mayzaSupabase?.getCurrentCustomer();
    const iconWrap = document.getElementById('accountIconWrap');
    const avatar = document.getElementById('accountUserAvatar');
    const namePill = document.getElementById('accountNamePill');
    const accountBtn = document.getElementById('customerAccountBtn');

    if (customer) {
      if (iconWrap) iconWrap.style.display = 'none';
      if (avatar) {
        avatar.style.display = 'flex';
        avatar.textContent = (customer.name || 'M').charAt(0).toUpperCase();
      }
      if (namePill) {
        namePill.style.display = 'inline-block';
        const firstName = customer.name.split(' ')[0] || 'Member';
        namePill.textContent = firstName;
      }
      if (accountBtn) accountBtn.title = `Signed in as ${customer.name} (Click for Dashboard)`;
    } else {
      if (iconWrap) iconWrap.style.display = 'inline-flex';
      if (avatar) avatar.style.display = 'none';
      if (namePill) namePill.style.display = 'none';
      if (accountBtn) accountBtn.title = 'Sign In / My Dashboard';
    }
  }

  async renderCustomerOrders() {
    const customer = window.mayzaSupabase?.getCurrentCustomer();
    const container = document.getElementById('dashOrdersList');
    const countBadge = document.getElementById('dashOrdersCountBadge');
    if (!container || !customer) return;

    container.innerHTML = '<div style="text-align:center; padding: 2rem; color:#8F5E6B;">Loading your orders... ⏳</div>';

    const orders = await window.mayzaSupabase?.getCustomerOrders(customer.email, customer.phone) || [];
    if (countBadge) countBadge.textContent = orders.length;

    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div class="dashboard-empty-orders">
          <div class="dashboard-empty-icon">🛍️</div>
          <h4 style="margin: 0 0 6px; font-size: 1.1rem; color: #38121C;">No Orders Placed Yet</h4>
          <p style="margin: 0; font-size: 0.85rem;">Explore our bestsellers and cute accessories to treat yourself or gift a loved one!</p>
        </div>
      `;
      return;
    }

    const stages = [
      { key: 'New', label: '1. Placed' },
      { key: 'Packed', label: '2. Packed' },
      { key: 'Shipped', label: '3. Shipped' },
      { key: 'Delivered', label: '4. Delivered' }
    ];

    container.innerHTML = orders.map(order => {
      const orderStatus = order.status || 'New';
      const currentIdx = stages.findIndex(s => s.key.toLowerCase() === orderStatus.toLowerCase());
      const activeIdx = currentIdx >= 0 ? currentIdx : 0;

      const stepperHtml = stages.map((s, idx) => {
        let stepClass = 'tracker-step';
        if (idx < activeIdx) stepClass += ' completed';
        else if (idx === activeIdx) stepClass += ' active';

        const dotSymbol = idx < activeIdx ? '✓' : (idx + 1);

        return `
          <div class="${stepClass}">
            <div class="tracker-dot">${dotSymbol}</div>
            <span class="tracker-label">${s.label}</span>
          </div>
        `;
      }).join('');

      const itemsHtml = (order.items || []).map(item => `
        <div class="order-item-row">
          <span>${item.qty || 1}x ${item.name || 'Item'}</span>
          <span>₹${(item.price || 0) * (item.qty || 1)}</span>
        </div>
      `).join('');

      return `
        <div class="customer-order-card">
          <div class="order-card-header">
            <div>
              <span class="order-id-tag">${order.id}</span>
              <div class="order-date-text">📅 ${order.rawDate || 'Recently placed'}</div>
            </div>
            <span class="order-status-badge ${orderStatus.toLowerCase()}">${orderStatus}</span>
          </div>

          <!-- Real-Time Delivery Stepper -->
          <div class="order-tracker-stepper">
            ${stepperHtml}
          </div>

          <div class="order-items-summary">
            ${itemsHtml || '<div class="order-item-row"><span>Custom order package</span></div>'}
            <div class="order-card-total-row">
              <span>Total Amount:</span>
              <span style="color:#D9657B;">₹${order.total || 0}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderCustomerWishlist() {
    const container = document.getElementById('dashWishlistList');
    if (!container) return;
    const activeFavs = document.querySelectorAll('.favorite-heart-btn.active');

    if (!activeFavs || activeFavs.length === 0) {
      container.innerHTML = `
        <div class="dashboard-empty-orders">
          <div class="dashboard-empty-icon">💖</div>
          <h4 style="margin: 0 0 6px; font-size: 1.1rem; color: #38121C;">Your Wishlist is Empty</h4>
          <p style="margin: 0; font-size: 0.85rem;">Tap the ♥ heart icon on any product in the store to save it here for later!</p>
        </div>
      `;
      return;
    }

    const items = [];
    activeFavs.forEach(btn => {
      const card = btn.closest('.product-item-card');
      if (card) {
        const name = card.getAttribute('data-name') || 'Item';
        const price = card.querySelector('.prod-price-text')?.textContent || '₹199';
        const img = card.querySelector('img')?.src || '';
        items.push({ name, price, img });
      }
    });

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem;">
        ${items.map(it => `
          <div style="background:#FFFDFD; border:1.5px solid #FFD1DA; border-radius:16px; padding:12px; text-align:center;">
            <img src="${it.img}" alt="${it.name}" style="width:100%; height:110px; object-fit:cover; border-radius:12px; margin-bottom:8px;">
            <h5 style="margin:0 0 4px; font-size:0.88rem; color:#38121C;">${it.name}</h5>
            <p style="margin:0 0 8px; font-weight:800; color:#D9657B;">${it.price}</p>
            <button class="auth-primary-submit-btn" style="padding:6px 12px; font-size:0.78rem;" onclick="window.mayzaApp?.addToCart('${it.name.replace(/'/g, "\\'")}')">
              Move to Cart 🛒
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  initTravelingMascot() {
    const mascot = document.getElementById('travelingMascot');
    const bubbleText = document.getElementById('mascotBubbleText');
    const speechBubble = document.getElementById('mascotSpeechBubble');
    const trigger = document.getElementById('mascotAvatarTrigger');
    if (!mascot || !bubbleText || !trigger) return;

    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    let currentStage = 'hero';

    // Click Mascot to Fly to Top with Happy Celebration
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.sound.playBubblePop(960);
      mascot.classList.add('fly-top');
      bubbleText.textContent = "Flying to top! ✨";
      speechBubble.classList.remove('bubble-pop');
      void speechBubble.offsetWidth;
      speechBubble.classList.add('bubble-pop');

      // Toss confetti sparkles
      this.celebrateConfetti();

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => mascot.classList.remove('fly-top'), 1000);
    });

    // Scroll Travel Companion Listener
    window.addEventListener('scroll', () => {
      if (!this.storefrontPreview.classList.contains('active')) return;

      const currentY = window.scrollY;
      const isDown = currentY > lastScrollY;
      lastScrollY = currentY;

      // Dynamics: tilt playfully while scrolling
      if (isDown) {
        mascot.classList.add('scrolling-down');
        mascot.classList.remove('scrolling-up');
      } else {
        mascot.classList.add('scrolling-up');
        mascot.classList.remove('scrolling-down');
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        mascot.classList.remove('scrolling-down', 'scrolling-up');
      }, 250);

      // Section check based on scroll offset
      const categorySec = document.getElementById('categoryBarSection');
      const bestsellersSec = document.getElementById('bestsellers');
      const footerSec = document.getElementById('footer');

      const catTop = categorySec ? categorySec.offsetTop - 300 : 500;
      const bestTop = bestsellersSec ? bestsellersSec.offsetTop - 300 : 1100;
      const footerTop = footerSec ? footerSec.offsetTop - 450 : 2000;

      let newStage = 'hero';
      let newText = "Welcome to Mayza! 💖";

      if (currentY >= footerTop) {
        newStage = 'footer';
        newText = "Handcrafted with Love! 🌸";
      } else if (currentY >= bestTop) {
        newStage = 'bestsellers';
        newText = "Best Seller Favorites! ⭐";
      } else if (currentY >= catTop) {
        newStage = 'categories';
        newText = "Explore Cute Finds! 🎀";
      } else {
        newStage = 'hero';
        newText = "Welcome to Mayza! 💖";
      }

      if (newStage !== currentStage) {
        currentStage = newStage;
        bubbleText.textContent = newText;
        speechBubble.classList.remove('bubble-pop');
        void speechBubble.offsetWidth;
        speechBubble.classList.add('bubble-pop');
        this.sound.playBubblePop(760);
      }
    }, { passive: true });
  }

  addToCart(productName) {
    this.cartCount++;
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
      badge.textContent = this.cartCount;
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 350);
    }
    this.sound.playBubblePop(880);
    this.showToast(`Added "${productName}" to cart! 🛍️`);
  }

  showToast(message) {
    const toast = document.getElementById('cartToast');
    const toastText = document.getElementById('toastMessage');
    if (toast && toastText) {
      toastText.textContent = message;
      toast.classList.add('show');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    }
  }

  returnToAnimation() {
    this.isEntered = false;
    this.storefrontPreview.classList.remove('active');
    this.stageContainer.style.display = 'flex';

    setTimeout(() => {
      this.stageContainer.classList.remove('fade-out');
      this.replayAnimation();
    }, 100);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.mayzaApp = new MayzaEntranceApp();
});
