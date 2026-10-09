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

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
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
    this.autoTransitionToStore = true;

    if (this.introOverlay) {
      this.introOverlay.classList.add('dismissed');
      setTimeout(() => {
        this.introOverlay.style.display = 'none';
      }, 350);
    }

    // Play the signature entrance animation from 0s with full sound!
    setTimeout(() => {
      this.mainTimeline.restart();
    }, 200);
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
    if (this.speechBubble) this.speechBubble.classList.remove('show');

    // Build Master GSAP Timeline
    this.mainTimeline = gsap.timeline({
      paused: true,
      onStart: () => {
        if (this.speechBubble) this.speechBubble.classList.remove('show');
        this.animStatus.innerHTML = '<span class="status-indicator"></span><span class="status-text">Playing entrance animation...</span>';
      },
      onComplete: () => {
        this.animStatus.innerHTML = '<span class="status-indicator" style="background:#10B981;"></span><span class="status-text">Your sweetest shopping spree starts now! 🛍️</span>';
        if (this.speechBubble) this.speechBubble.classList.add('show');
        this.startIdleLoops();
        this.celebrateConfetti();

        // Smoothly transition into the Mayza Mart Storefront after celebration!
        if (this.autoTransitionToStore) {
          this.autoTransitionTimer = setTimeout(() => {
            this.enterStore();
          }, 1800);
        }
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
    if (this.autoTransitionTimer) {
      clearTimeout(this.autoTransitionTimer);
      this.autoTransitionTimer = null;
    }
    this.sound.playSparkleChime();
    this.celebrateConfetti();

    if (this.introOverlay) {
      this.introOverlay.classList.add('dismissed');
      this.introOverlay.style.display = 'none';
    }

    if (this.stageContainer) {
      this.stageContainer.classList.add('fade-out');
      setTimeout(() => {
        this.stageContainer.style.display = 'none';
      }, 300);
    }

    if (this.storefrontPreview) {
      this.storefrontPreview.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh live announcement banner, active coupons, categories, and product matrix from Supabase
    this.syncLiveBannersAndCoupons();
    this.syncLiveCategories();
    this.syncLiveProducts();
  }

  initStorefrontInteractions() {
    this.bindProductCardEvents();

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

    // Sync live announcement banner, coupons, categories, and products from Supabase & Admin in real time
    this.syncLiveBannersAndCoupons();
    this.syncLiveCategories();
    this.syncLiveProducts();
  }

  // =========================================================
  // LIVE STORE PRODUCTS REAL-TIME SYNC
  // =========================================================
  async syncLiveProducts() {
    const grid = document.getElementById('bestsellersProductsGrid') || document.querySelector('.bestsellers-products-grid');
    if (!grid) return;

    if (!this.defaultProductsHtml) {
      this.defaultProductsHtml = grid.innerHTML;
    }

    const defaultCatalog = [
      { id: 'def-1', title: 'Cute Hair Clips Set (Pack of 12)', category: 'Hair Accessories', price: 249, rating: '4.8', tag: 'Best Seller', image: 'assets/p-clips.jpg' },
      { id: 'def-2', title: 'Unicorn Return Gift Box (Set of 5)', category: 'Return Gifts', price: 299, rating: '4.7', tag: 'Best Seller', image: 'assets/p-giftbox.jpg' },
      { id: 'def-3', title: 'Mini Handbag (Kids & Teens)', category: 'Handbags & Purses', price: 349, rating: '4.6', tag: 'New', image: 'assets/p-handbag.jpg' },
      { id: 'def-4', title: 'Scented Candle Gift Set', category: 'Home & Lifestyle', price: 499, rating: '4.8', tag: 'Best Seller', image: 'assets/p-candle.jpg' },
      { id: 'def-5', title: 'Designer Scrunchies (Set of 5)', category: 'Hair Accessories', price: 199, rating: '4.7', tag: 'Best Seller', image: 'assets/p-scrunchies.jpg' },
      { id: 'def-6', title: 'Cute Water Bottle (500ml)', category: 'Home & Lifestyle', price: 299, rating: '4.6', tag: 'New', image: 'assets/p-bottle.jpg' },
      { id: 'def-7', title: 'Stationery Set (Unicorn Theme)', category: 'Stationery', price: 349, rating: '4.8', tag: 'Best Seller', image: 'assets/cat-stationery.jpg' },
      { id: 'def-8', title: 'Teddy Bear (Small)', category: 'Toys', price: 399, rating: '4.9', tag: 'Best Seller', image: 'assets/cat-toys.jpg' }
    ];

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));
    };

    const renderProducts = (productsToRender) => {
      if (!productsToRender || productsToRender.length === 0) {
        grid.innerHTML = this.defaultProductsHtml;
        this.bindProductCardEvents();
        return;
      }

      grid.innerHTML = productsToRender.map(p => {
        const tag = p.tag || 'Best Seller';
        const isNew = tag.toLowerCase().includes('new');
        const badgeClass = isNew ? 'prod-badge-pill badge-new' : 'prod-badge-pill';
        const comparePriceHtml = p.comparePrice ? `<span class="prod-compare-price" style="text-decoration:line-through; font-size:0.85em; opacity:0.55; margin-left:6px; font-weight:500;">₹${p.comparePrice}</span>` : '';
        const imgSrc = p.image || 'assets/p-clips.jpg';
        const rating = p.rating || '4.8';

        return `
          <article class="product-item-card" data-name="${escapeHtml(p.title)}" data-id="${escapeHtml(p.id)}" data-category="${escapeHtml(p.category || '')}">
            <div class="prod-card-media">
              <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.onerror=null; this.src='assets/p-clips.jpg';">
              <span class="${badgeClass}">${escapeHtml(tag)}</span>
              <button class="favorite-heart-btn" aria-label="Add to wishlist">♥</button>
            </div>
            <div class="prod-card-info">
              <h3 class="prod-name-title">${escapeHtml(p.title)}</h3>
              <p class="prod-price-text">₹${p.price} ${comparePriceHtml}</p>
              <p class="prod-rating-score">★ ${rating}</p>
              <button class="add-to-cart-action-btn" aria-label="Add to cart" data-name="${escapeHtml(p.title)}" data-price="${p.price}" data-id="${escapeHtml(p.id)}">
                <span>🛒</span> Add to Cart
              </button>
            </div>
          </article>
        `;
      }).join('');

      this.bindProductCardEvents();
    };

    // 1. Initial cached values
    let cachedList = null;
    try {
      const stored = localStorage.getItem('mm_products');
      if (stored) cachedList = JSON.parse(stored);
    } catch (e) {}

    if (Array.isArray(cachedList) && cachedList.length > 0) {
      const customTitles = new Set(cachedList.map(c => (c.title || '').toLowerCase().trim()));
      const remainingDefaults = defaultCatalog.filter(d => !customTitles.has(d.title.toLowerCase().trim()));
      renderProducts([...cachedList, ...remainingDefaults]);
    }

    // 2. Fetch live from Supabase
    if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
      try {
        const cloudProducts = await window.mayzaSupabase.fetchProducts();
        if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
          localStorage.setItem('mm_products', JSON.stringify(cloudProducts));
          const customTitles = new Set(cloudProducts.map(c => (c.title || '').toLowerCase().trim()));
          const remainingDefaults = defaultCatalog.filter(d => !customTitles.has(d.title.toLowerCase().trim()));
          renderProducts([...cloudProducts, ...remainingDefaults]);
        }
      } catch (err) {
        console.warn('[Storefront] syncLiveProducts error:', err);
      }
    }

    // 3. Listen to real-time custom product updates and cross-tab storage
    if (!this.hasProductListeners) {
      this.hasProductListeners = true;
      window.addEventListener('mayza:products-updated', (e) => {
        if (e.detail?.products && Array.isArray(e.detail.products)) {
          const customTitles = new Set(e.detail.products.map(c => (c.title || '').toLowerCase().trim()));
          const remainingDefaults = defaultCatalog.filter(d => !customTitles.has(d.title.toLowerCase().trim()));
          renderProducts([...e.detail.products, ...remainingDefaults]);
        } else {
          this.syncLiveProducts();
        }
      });

      window.addEventListener('storage', (e) => {
        if (e.key === 'mm_products' || e.key === 'mm_products_timestamp') {
          this.syncLiveProducts();
        }
      });
    }
  }

  // =========================================================
  // LIVE STORE CATEGORIES REAL-TIME SYNC
  // =========================================================
  syncLiveCategories() {
    const strip = document.getElementById('storeCategoryStrip') || document.querySelector('.glass-category-strip');
    const grid = document.getElementById('storeCategoryCardsGrid') || document.querySelector('.category-cards-grid');

    const defaultCategories = [
      { name: "Return Gifts", emoji: "🎁", image: "assets/cat-return-gifts.jpg", subtitle: "Make it memorable", colorClass: "bg-sec" },
      { name: "Hair Accessories", emoji: "🎀", image: "assets/cat-hair.jpg", subtitle: "Style in every strand", colorClass: "bg-acc" },
      { name: "Clips & Hair Bands", emoji: "🌸", image: "assets/p-clips.jpg", subtitle: "Cute & trendy", colorClass: "bg-lav" },
      { name: "Handbags & Purses", emoji: "🛍️", image: "assets/cat-bags.jpg", subtitle: "Carry your style", colorClass: "bg-sec" },
      { name: "Toys", emoji: "🧸", image: "assets/cat-toys.jpg", subtitle: "Fun for all ages", colorClass: "bg-sky" },
      { name: "Stationery", emoji: "✏️", image: "assets/cat-stationery.jpg", subtitle: "Write • Create • Dream", colorClass: "bg-lav" },
      { name: "Home & Lifestyle", emoji: "🏠", image: "assets/cat-home.jpg", subtitle: "Make it cozy", colorClass: "bg-pea" },
      { name: "Jewellery & Fashion", emoji: "💎", image: "assets/cat-jewellery.jpg", subtitle: "Accessorize your style", colorClass: "bg-acc" },
      { name: "Party Supplies", emoji: "🎉", image: "assets/cat-party.jpg", subtitle: "Celebrate in style", colorClass: "bg-sec" },
      { name: "Phone Accessories", emoji: "📱", image: "assets/cat-phone.jpg", subtitle: "Stay connected", colorClass: "bg-sky" }
    ];

    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[m]));
    };

    let customCats = [];
    try {
      const stored = localStorage.getItem('mm_custom_categories');
      if (stored) customCats = JSON.parse(stored);
    } catch (e) {}

    const colorCycle = ['bg-sec', 'bg-acc', 'bg-lav', 'bg-sky', 'bg-pea'];
    const formattedCustom = (Array.isArray(customCats) ? customCats : []).map((c, idx) => ({
      name: c.name,
      emoji: c.emoji || "✨",
      image: c.image || "assets/cat-return-gifts.jpg",
      subtitle: c.subtitle || "Handpicked finds",
      colorClass: c.colorClass || colorCycle[idx % colorCycle.length],
      isCustom: true
    }));

    const defaultNames = new Set(defaultCategories.map(d => d.name.toLowerCase().trim()));

    // Apply any admin overrides to default categories (from Manage Categories modal)
    try {
      const overrides = JSON.parse(localStorage.getItem('mm_category_overrides') || '{}');
      if (Object.keys(overrides).length > 0) {
        defaultCategories.forEach(cat => {
          const ov = overrides[cat.name];
          if (ov) {
            if (ov.image) cat.image = ov.image;
            if (ov.subtitle) cat.subtitle = ov.subtitle;
            if (ov.emoji) cat.emoji = ov.emoji;
          }
        });
      }
    } catch(e) {}
    const uniqueCustom = formattedCustom.filter(c => !defaultNames.has((c.name || '').toLowerCase().trim()));
    const allCategories = [...defaultCategories, ...uniqueCustom];

    // 1. Render Category Strip (Horizontal pill bar)
    if (strip) {
      strip.innerHTML = allCategories.map(c => `
        <a href="#bestsellers" class="cat-pill-btn" data-category="${escapeHtml(c.name)}">
          <span class="cat-icon-circle ${c.colorClass || 'bg-sec'}">${escapeHtml(c.emoji || '✨')}</span>
          <span class="cat-label">${escapeHtml(c.name)}</span>
        </a>
      `).join('') + `
        <a href="#bestsellers" class="cat-pill-btn" data-category="all">
          <span class="cat-icon-circle bg-sec">✨</span>
          <span class="cat-label">All Categories</span>
        </a>
      `;
    }

    // 2. Render Category Cards Grid (Explore Our Categories)
    if (grid) {
      grid.innerHTML = allCategories.map(c => {
        const imgSrc = c.image || 'assets/cat-return-gifts.jpg';
        return `
          <a href="#bestsellers" class="cat-product-card" data-category="${escapeHtml(c.name)}">
            <div class="cat-card-media">
              <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(c.name)}" loading="lazy" onerror="this.onerror=null; this.src='assets/cat-return-gifts.jpg';">
              <span class="cat-card-arrow">➔</span>
            </div>
            <div class="cat-card-info">
              <h3>${escapeHtml(c.name)}</h3>
              <p>${escapeHtml(c.subtitle || 'Explore collection')}</p>
            </div>
          </a>
        `;
      }).join('');
    }

    // 3. Bind click events on category links to filter products in bestsellers
    this.bindCategoryFilterClicks();

    // 4. Setup listeners for real-time updates from Admin or another tab
    if (!this.hasCategoryListeners) {
      this.hasCategoryListeners = true;
      window.addEventListener('mayza:categories-updated', () => {
        this.syncLiveCategories();
      });
      window.addEventListener('storage', (e) => {
        if (e.key === 'mm_custom_categories' || e.key === 'mm_categories_timestamp') {
          this.syncLiveCategories();
        }
      });
    }
  }

  bindCategoryFilterClicks() {
    const emojiMap = {
      'hair accessories': '🎀',
      'return gifts': '🎁',
      'clips & hair bands': '🌸',
      'handbags & purses': '🛍️',
      'handbags': '🛍️',
      'toys': '🧸',
      'stationery': '✏️',
      'home & lifestyle': '🏠',
      'home': '🏠',
      'jewellery & fashion': '💎',
      'jewellery': '💎',
      'party supplies': '🎉',
      'phone accessories': '📱',
      'phone charm': '✨',
      'charms': '✨'
    };

    // When ANY category card/pill is clicked → open the full-screen category page
    document.querySelectorAll('.cat-pill-btn, .cat-product-card').forEach(btn => {
      // Remove old listeners cleanly by cloning
      const fresh = btn.cloneNode(true);
      btn.parentNode.replaceChild(fresh, btn);

      fresh.addEventListener('click', (e) => {
        // Extract category name with fallbacks
        const rawCat = fresh.getAttribute('data-category')
          || fresh.querySelector('.cat-label')?.textContent
          || fresh.querySelector('h3')?.textContent
          || fresh.textContent
          || '';
        const cat = rawCat.trim();
        const catLower = cat.toLowerCase();

        // If "more" or "all", scroll smoothly to categories section
        if (catLower === 'more' || catLower === 'all' || catLower === 'view all categories') {
          e.preventDefault();
          const target = document.getElementById('categories') || document.getElementById('bestsellers');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
          return;
        }

        if (!cat) return;
        e.preventDefault();

        // Extract or lookup emoji
        const circleEmoji = fresh.querySelector('.cat-icon-circle')?.textContent.trim();
        const emoji = circleEmoji || emojiMap[catLower] || '✨';

        this.openCategoryPage(cat, emoji);
      });
    });
  }

  // ── CATEGORY PAGE ENGINE ──────────────────────────────────────
  _catPageProducts = [];   // full list for current category
  _catPageSort     = 'featured';
  _catPageSearch   = '';

  openCategoryPage(categoryName, emoji = '✨') {
    const overlay = document.getElementById('categoryPageOverlay');
    if (!overlay) return;

    // Reset state
    this._catPageSort   = 'featured';
    this._catPageSearch = '';

    // Update header
    const emojiEl = document.getElementById('catPageEmoji');
    const titleEl = document.getElementById('catPageTitle');
    const subEl   = document.getElementById('catPageSubtitle');
    if (emojiEl) emojiEl.textContent = emoji;
    if (titleEl) titleEl.textContent = categoryName;
    if (subEl)   subEl.textContent   = 'Loading products...';

    // Reset sort pills
    document.querySelectorAll('.cat-sort-pill').forEach(p => p.classList.remove('active'));
    const featuredPill = document.querySelector('.cat-sort-pill[data-sort="featured"]');
    if (featuredPill) featuredPill.classList.add('active');

    // Reset search
    const searchBar    = document.getElementById('catPageSearchBar');
    const searchInput  = document.getElementById('catPageSearchInput');
    const searchToggle = document.getElementById('catPageSearchToggle');
    if (searchBar) searchBar.classList.remove('open');
    if (searchInput) searchInput.value = '';
    if (searchToggle) searchToggle.classList.remove('active');

    // Gather products from all known sources (localStorage, defaultCatalog, DOM)
    this._catPageProducts = this._gatherCategoryProducts(categoryName);

    // Open overlay with smooth animation
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Push browser history state for seamless native back button experience
    try {
      history.pushState({ mayzaCategoryPage: true, category: categoryName }, '');
    } catch(err) {}

    // Play subtle chime
    try { this.sound?.playSparkleChime(); } catch(err) {}

    // Render products
    this._renderCatPageProducts();

    // Wire events (once)
    if (!overlay._catEventsWired) {
      overlay._catEventsWired = true;
      this._wireCatPageEvents();
    }
  }

  closeCategoryPage() {
    const overlay = document.getElementById('categoryPageOverlay');
    if (!overlay || !overlay.classList.contains('active')) return;

    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    try { this.sound?.playClick(); } catch(err) {}
  }

  _gatherCategoryProducts(categoryName) {
    const rawCat = (categoryName || '').trim();
    const activeCat = rawCat.toLowerCase();
    const products = [];
    const seenTitles = new Set();

    // Source A: localStorage 'mm_products'
    let storedProducts = [];
    try {
      const stored = localStorage.getItem('mm_products');
      if (stored) storedProducts = JSON.parse(stored);
    } catch (e) {}

    // Source B: default catalog
    const defaultCatalog = [
      { id: 'def-1', title: 'Cute Hair Clips Set (Pack of 12)', category: 'Hair Accessories', price: 249, rating: 4.8, tag: 'Best Seller', image: 'assets/p-clips.jpg' },
      { id: 'def-2', title: 'Unicorn Return Gift Box (Set of 5)', category: 'Return Gifts', price: 299, rating: 4.7, tag: 'Best Seller', image: 'assets/p-giftbox.jpg' },
      { id: 'def-3', title: 'Mini Handbag (Kids & Teens)', category: 'Handbags & Purses', price: 349, rating: 4.6, tag: 'New', image: 'assets/p-handbag.jpg' },
      { id: 'def-4', title: 'Scented Candle Gift Set', category: 'Home & Lifestyle', price: 499, rating: 4.8, tag: 'Best Seller', image: 'assets/p-candle.jpg' },
      { id: 'def-5', title: 'Designer Scrunchies (Set of 5)', category: 'Hair Accessories', price: 199, rating: 4.7, tag: 'Best Seller', image: 'assets/p-scrunchies.jpg' },
      { id: 'def-6', title: 'Cute Water Bottle (500ml)', category: 'Home & Lifestyle', price: 299, rating: 4.6, tag: 'New', image: 'assets/p-bottle.jpg' },
      { id: 'def-7', title: 'Stationery Set (Unicorn Theme)', category: 'Stationery', price: 349, rating: 4.8, tag: 'Best Seller', image: 'assets/cat-stationery.jpg' },
      { id: 'def-8', title: 'Teddy Bear (Small)', category: 'Toys', price: 399, rating: 4.9, tag: 'Best Seller', image: 'assets/cat-toys.jpg' }
    ];

    const allCatalog = Array.isArray(storedProducts) && storedProducts.length > 0
      ? [...storedProducts, ...defaultCatalog]
      : defaultCatalog;

    // Helper: fuzzy matching
    const isCatMatch = (prodCat, prodTitle) => {
      const c = (prodCat || '').toLowerCase().trim();
      const t = (prodTitle || '').toLowerCase().trim();
      if (!activeCat) return true;
      if (c === activeCat) return true;
      if (c && (activeCat.includes(c) || c.includes(activeCat))) return true;
      if (t.includes(activeCat)) return true;

      // Match significant keywords (e.g., 'phone', 'charm', 'clips', 'hair', 'handbag', etc.)
      const keywords = activeCat.split(/[\s,&+/]+/).filter(w => w.length > 2);
      for (const w of keywords) {
        if (c.includes(w) || t.includes(w)) return true;
      }
      return false;
    };

    // 1. Process catalog items
    allCatalog.forEach(p => {
      const title = p.title || p.name || 'Product';
      const normTitle = title.toLowerCase().trim();
      if (seenTitles.has(normTitle)) return;

      if (isCatMatch(p.category, title)) {
        seenTitles.add(normTitle);
        const rating = typeof p.rating === 'number' ? p.rating : (parseFloat(p.rating) || 4.7);
        const price = typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 199);
        products.push({
          id: p.id || `prod-${Math.random().toString(36).slice(2, 7)}`,
          title: title,
          price: price,
          rating: rating,
          tag: p.tag || 'Featured',
          img: p.image || p.img || 'assets/p-clips.jpg',
          dataName: title,
          dataPrice: price
        });
      }
    });

    // 2. Also check rendered DOM cards
    const allCards = document.querySelectorAll('#bestsellersProductsGrid .product-item-card');
    allCards.forEach(card => {
      const title = card.getAttribute('data-name') || card.querySelector('.prod-name-title')?.textContent || '';
      const normTitle = title.toLowerCase().trim();
      if (seenTitles.has(normTitle)) return;

      const cardCat = card.getAttribute('data-category') || '';
      if (isCatMatch(cardCat, title)) {
        seenTitles.add(normTitle);
        const id = card.getAttribute('data-id') || `card-${Math.random().toString(36).slice(2, 7)}`;
        const img = card.querySelector('img')?.src || 'assets/p-clips.jpg';
        const priceEl = card.querySelector('.prod-price-text');
        const priceMatch = (priceEl?.textContent || '').match(/\d+/);
        const price = priceMatch ? parseInt(priceMatch[0], 10) : 199;
        const ratingEl = card.querySelector('.prod-rating-score');
        const ratingMatch = (ratingEl?.textContent || '').match(/\d+(\.\d+)?/);
        const rating = ratingMatch ? parseFloat(ratingMatch[0]) : 4.8;
        const tag = card.querySelector('.prod-badge-pill')?.textContent.trim() || 'Best Seller';

        products.push({
          id: id,
          title: title,
          price: price,
          rating: rating,
          tag: tag,
          img: img,
          dataName: title,
          dataPrice: price
        });
      }
    });

    return products;
  }

  _getSortedFilteredProducts() {
    let list = [...this._catPageProducts];

    // Apply search filter
    const q = (this._catPageSearch || '').toLowerCase().trim();
    if (q) {
      list = list.filter(p => p.title.toLowerCase().includes(q));
    }

    // Apply sort
    switch (this._catPageSort) {
      case 'price-low':  list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.reverse(); break;
      default: break; // featured = original order
    }

    return list;
  }

  _renderCatPageProducts() {
    const grid     = document.getElementById('catPageProductsGrid');
    const emptyEl  = document.getElementById('catPageEmpty');
    const subtitle = document.getElementById('catPageSubtitle');
    if (!grid) return;

    const list = this._getSortedFilteredProducts();
    if (subtitle) {
      subtitle.textContent = list.length === 0
        ? 'No products found'
        : `${list.length} product${list.length === 1 ? '' : 's'} available`;
    }

    if (list.length === 0) {
      grid.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'flex';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';

    grid.innerHTML = list.map(p => {
      const tag   = p.tag || 'Featured';
      const isNew = tag.toLowerCase().includes('new');
      const badgeClass = isNew ? 'prod-badge-pill badge-new' : 'prod-badge-pill';

      return `
        <article class="product-item-card" data-name="${escapeHtml(p.title)}" data-id="${escapeHtml(p.id)}">
          <div class="prod-card-media">
            <img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.onerror=null; this.src='assets/p-clips.jpg';">
            <span class="${badgeClass}">${escapeHtml(tag)}</span>
            <button class="favorite-heart-btn" aria-label="Add to wishlist">♥</button>
          </div>
          <div class="prod-card-info">
            <h3 class="prod-name-title">${escapeHtml(p.title)}</h3>
            <p class="prod-price-text">₹${p.price}</p>
            <p class="prod-rating-score">★ ${p.rating.toFixed(1)}</p>
            <button class="add-to-cart-action-btn cat-page-add-btn"
              aria-label="Add to cart"
              data-name="${escapeHtml(p.dataName)}"
              data-price="${p.dataPrice}"
              data-id="${escapeHtml(p.id)}">
              <span>🛒</span> Add to Cart
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Bind add-to-cart for cat page cards
    grid.querySelectorAll('.cat-page-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name  = btn.getAttribute('data-name') || 'Item';
        const price = parseFloat(btn.getAttribute('data-price')) || 0;
        const card  = btn.closest('.product-item-card');
        const img   = card?.querySelector('img')?.src || null;
        this.addToCart(name, price, img);
      });
    });

    // Bind heart/wishlist
    grid.querySelectorAll('.favorite-heart-btn').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.toggle('active'));
    });
  }

  _wireCatPageEvents() {
    // Back button
    document.getElementById('catPageBackBtn')?.addEventListener('click', () => {
      this.closeCategoryPage();
    });

    // Sort pills
    document.querySelectorAll('.cat-sort-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.cat-sort-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this._catPageSort = pill.dataset.sort || 'featured';
        this._renderCatPageProducts();
      });
    });

    // Search toggle
    const searchToggle = document.getElementById('catPageSearchToggle');
    const searchBar    = document.getElementById('catPageSearchBar');
    const searchInput  = document.getElementById('catPageSearchInput');

    searchToggle?.addEventListener('click', () => {
      const isOpen = searchBar?.classList.toggle('open');
      searchToggle.classList.toggle('active', isOpen);
      if (isOpen) setTimeout(() => searchInput?.focus(), 300);
    });

    // Search input
    searchInput?.addEventListener('input', (e) => {
      this._catPageSearch = e.target.value;
      this._renderCatPageProducts();
    });

    // Clear search
    document.getElementById('catSearchClearBtn')?.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; searchInput.focus(); }
      this._catPageSearch = '';
      this._renderCatPageProducts();
    });

    // Empty state clear button
    document.getElementById('catEmptyClearBtn')?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      this._catPageSearch = '';
      this._renderCatPageProducts();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('categoryPageOverlay');
        if (overlay?.classList.contains('active')) {
          this.closeCategoryPage();
        }
      }
    });

    // Close on browser back button (popstate)
    window.addEventListener('popstate', () => {
      const overlay = document.getElementById('categoryPageOverlay');
      if (overlay?.classList.contains('active')) {
        this.closeCategoryPage();
      }
    });
  }



  bindProductCardEvents() {
    // Interactive Add to Cart buttons: instantly add item and open cart modal
    document.querySelectorAll('.add-to-cart-action-btn').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = newBtn.closest('.product-item-card');
        const name = newBtn.getAttribute('data-name') || (card ? card.getAttribute('data-name') : 'Item');
        const price = parseFloat(newBtn.getAttribute('data-price')) || null;
        const img = card ? card.querySelector('img')?.src : null;

        this.addToCart(name, price, img, true);
      });
    });

    // Wishlist Favorite Heart toggle
    document.querySelectorAll('.favorite-heart-btn').forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        newBtn.classList.toggle('active');
        this.sound.playBubblePop(780);
        this.showToast(newBtn.classList.contains('active') ? 'Saved to Wishlist! 💖' : 'Removed from Wishlist');
      });
    });
  }

  // =========================================================
  // LIVE STORE BANNER & COUPON REAL-TIME SYNC
  // =========================================================
  async syncLiveBannersAndCoupons() {
    const updateBannerUI = (text) => {
      if (!text) return;
      const t1 = document.getElementById('liveAnnouncementText1');
      const t2 = document.getElementById('liveAnnouncementText2');
      if (t1) t1.textContent = text;
      if (t2) t2.textContent = text;
    };

    const updateCouponUI = (coupon) => {
      const tag = document.getElementById('sideBannerCouponTag');
      const code = document.getElementById('sideBannerCouponCode');
      if (coupon && coupon.code) {
        if (tag) tag.textContent = `${coupon.discount}% OFF • ${coupon.desc || 'Special Welcome Perk'}`;
        if (code) code.innerHTML = `Use Code: <strong>${coupon.code}</strong>`;
      }
    };

    // 1. Initial cached values
    const cachedBanner = localStorage.getItem('mm_announcement_banner');
    if (cachedBanner) updateBannerUI(cachedBanner);

    // 2. Fetch live from Supabase
    if (window.mayzaSupabase) {
      try {
        const banners = await window.mayzaSupabase.getStoreBanners();
        if (banners && banners.announcement) {
          updateBannerUI(banners.announcement);
        }

        const coupons = await window.mayzaSupabase.fetchCoupons();
        const activeCoupons = Array.isArray(coupons) ? coupons.filter(c => c.active !== false && c.code !== 'STORE_BANNER') : [];
        if (activeCoupons.length > 0) {
          updateCouponUI(activeCoupons[0]);
        }
      } catch (err) {
        console.warn('[Storefront] syncLiveBannersAndCoupons error:', err);
      }
    }

    // 3. Listen to live updates in real time
    window.addEventListener('mayza:banner-updated', (e) => {
      if (e.detail?.announcement) {
        updateBannerUI(e.detail.announcement);
      }
    });

    window.addEventListener('mayza:coupons-updated', async () => {
      if (window.mayzaSupabase) {
        const coupons = await window.mayzaSupabase.fetchCoupons();
        const activeCoupons = Array.isArray(coupons) ? coupons.filter(c => c.active !== false && c.code !== 'STORE_BANNER') : [];
        if (activeCoupons.length > 0) {
          updateCouponUI(activeCoupons[0]);
        }
      }
    });

    // 4. Cross-tab real-time storage listener (Admin in one tab -> Storefront in another tab updates instantly)
    window.addEventListener('storage', (e) => {
      if (e.key === 'mm_announcement_banner' && e.newValue) {
        updateBannerUI(e.newValue);
      }
      if (e.key === 'mm_coupons' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          if (Array.isArray(list) && list.length > 0) {
            updateCouponUI(list[0]);
          }
        } catch (err) {}
      }
    });
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
    const authTabsWrap = document.querySelector('.customer-auth-tabs');
    const formLogin = document.getElementById('customerLoginForm');
    const formRegister = document.getElementById('customerRegisterForm');
    const switchToReg = document.getElementById('switchToRegisterBtn');
    const switchToLog = document.getElementById('switchToLoginBtn');

    // Forgot Password elements
    const openForgotBtn = document.getElementById('openForgotPwBtn');
    const formForgot = document.getElementById('customerForgotForm');
    const backToLoginForgotBtn = document.getElementById('backToLoginFromForgotBtn');
    const switchToLoginFromForgotLink = document.getElementById('switchToLoginFromForgotLink');
    const forgotStep1 = document.getElementById('forgotStep1');
    const forgotStep2 = document.getElementById('forgotStep2');
    const forgotEmailInput = document.getElementById('forgotEmailInput');
    const sendResetCodeBtn = document.getElementById('sendResetCodeBtn');
    const forgotStep1Feedback = document.getElementById('forgotStep1FeedbackMsg');
    const forgotSentEmailDisplay = document.getElementById('forgotSentEmailDisplay');
    const resendResetCodeBtn = document.getElementById('resendResetCodeBtn');
    const forgotOtpInput = document.getElementById('forgotOtpInput');
    const forgotNewPassInput = document.getElementById('forgotNewPassInput');
    const forgotConfirmPassInput = document.getElementById('forgotConfirmPassInput');
    const toggleForgotNewPwBtn = document.getElementById('toggleForgotNewPwBtn');
    const forgotStep2Feedback = document.getElementById('forgotStep2FeedbackMsg');
    const resetPasswordSubmitBtn = document.getElementById('resetPasswordSubmitBtn');

    let recoveryState = {
      activeEmail: '',
      generatedCode: '',
      codeExpiry: 0
    };

    const showForgotStep = (step) => {
      if (forgotStep1Feedback) forgotStep1Feedback.textContent = '';
      if (forgotStep2Feedback) forgotStep2Feedback.textContent = '';
      if (step === 2) {
        if (forgotStep1) forgotStep1.style.display = 'none';
        if (forgotStep2) forgotStep2.style.display = 'block';
        if (forgotSentEmailDisplay) forgotSentEmailDisplay.textContent = recoveryState.activeEmail;
        setTimeout(() => forgotOtpInput?.focus(), 150);
      } else {
        if (forgotStep1) forgotStep1.style.display = 'block';
        if (forgotStep2) forgotStep2.style.display = 'none';
        setTimeout(() => forgotEmailInput?.focus(), 150);
      }
    };

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
      if (loginFeedback) loginFeedback.textContent = '';
      if (regFeedback) regFeedback.textContent = '';
      if (forgotStep1Feedback) forgotStep1Feedback.textContent = '';
      if (forgotStep2Feedback) forgotStep2Feedback.textContent = '';

      if (tab === 'register') {
        if (authTabsWrap) authTabsWrap.style.display = 'flex';
        tabRegister?.classList.add('active');
        tabLogin?.classList.remove('active');
        if (formRegister) formRegister.style.display = 'flex';
        if (formLogin) formLogin.style.display = 'none';
        if (formForgot) formForgot.style.display = 'none';
      } else if (tab === 'forgot') {
        if (authTabsWrap) authTabsWrap.style.display = 'none';
        if (formLogin) formLogin.style.display = 'none';
        if (formRegister) formRegister.style.display = 'none';
        if (formForgot) formForgot.style.display = 'flex';
        if (forgotEmailInput && loginEmailInput?.value) {
          forgotEmailInput.value = loginEmailInput.value.trim();
        }
        showForgotStep(1);
      } else {
        if (authTabsWrap) authTabsWrap.style.display = 'flex';
        tabLogin?.classList.add('active');
        tabRegister?.classList.remove('active');
        if (formLogin) formLogin.style.display = 'flex';
        if (formRegister) formRegister.style.display = 'none';
        if (formForgot) formForgot.style.display = 'none';
      }
    };

    tabLogin?.addEventListener('click', () => setAuthTab('login'));
    tabRegister?.addEventListener('click', () => setAuthTab('register'));
    switchToReg?.addEventListener('click', () => setAuthTab('register'));
    switchToLog?.addEventListener('click', () => setAuthTab('login'));

    openForgotBtn?.addEventListener('click', () => setAuthTab('forgot'));
    backToLoginForgotBtn?.addEventListener('click', () => setAuthTab('login'));
    switchToLoginFromForgotLink?.addEventListener('click', () => setAuthTab('login'));

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

    toggleForgotNewPwBtn?.addEventListener('click', () => {
      if (forgotNewPassInput.type === 'password') {
        forgotNewPassInput.type = 'text';
        toggleForgotNewPwBtn.textContent = '🙈';
      } else {
        forgotNewPassInput.type = 'password';
        toggleForgotNewPwBtn.textContent = '👁️';
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

    // Send Recovery Code (Forgot Password Step 1)
    const handleSendRecoveryCode = async () => {
      const email = (forgotEmailInput?.value || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        if (forgotStep1Feedback) forgotStep1Feedback.textContent = 'Please enter a valid registered email address.';
        this.sound.playBubblePop(240);
        return;
      }

      if (sendResetCodeBtn) {
        sendResetCodeBtn.disabled = true;
        sendResetCodeBtn.innerHTML = '<span>Verifying account... ⏳</span>';
      }
      if (forgotStep1Feedback) forgotStep1Feedback.textContent = '';

      try {
        const check = await window.mayzaSupabase.checkCustomerEmailExists(email);
        if (!check.exists) {
          if (forgotStep1Feedback) forgotStep1Feedback.textContent = check.message || 'No account found with this email.';
          this.sound.playBubblePop(240);
          return;
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        recoveryState = {
          activeEmail: email,
          generatedCode: code,
          codeExpiry: Date.now() + 15 * 60 * 1000 // 15 mins
        };

        showForgotStep(2);
        if (forgotOtpInput) forgotOtpInput.value = code; // Auto-populate for seamless customer experience
        this.sound.playSparkleChime();
        this.showToast(`🔑 Recovery Code: ${code} (Security code generated!)`);
      } catch (err) {
        if (forgotStep1Feedback) forgotStep1Feedback.textContent = 'Error: ' + err.message;
      } finally {
        if (sendResetCodeBtn) {
          sendResetCodeBtn.disabled = false;
          sendResetCodeBtn.innerHTML = '<span>Send Recovery Code</span><span class="btn-arrow">✉️</span>';
        }
      }
    };

    sendResetCodeBtn?.addEventListener('click', handleSendRecoveryCode);
    resendResetCodeBtn?.addEventListener('click', handleSendRecoveryCode);

    // Reset Password Form Submit (Forgot Password Step 2)
    formForgot?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const enteredCode = (forgotOtpInput?.value || '').trim();
      const newPassword = forgotNewPassInput?.value || '';
      const confirmPassword = forgotConfirmPassInput?.value || '';

      if (forgotStep2Feedback) forgotStep2Feedback.textContent = '';

      if (!enteredCode || enteredCode !== recoveryState.generatedCode) {
        if (forgotStep2Feedback) forgotStep2Feedback.textContent = 'Incorrect 6-digit recovery code. Please check again.';
        this.sound.playBubblePop(240);
        return;
      }

      if (Date.now() > recoveryState.codeExpiry) {
        if (forgotStep2Feedback) forgotStep2Feedback.textContent = 'Recovery code has expired. Please click Resend Code.';
        this.sound.playBubblePop(240);
        return;
      }

      if (!newPassword || newPassword.length < 6) {
        if (forgotStep2Feedback) forgotStep2Feedback.textContent = 'New password must be at least 6 characters long.';
        this.sound.playBubblePop(240);
        return;
      }

      if (newPassword !== confirmPassword) {
        if (forgotStep2Feedback) forgotStep2Feedback.textContent = 'Passwords do not match. Please re-enter identical passwords.';
        this.sound.playBubblePop(240);
        return;
      }

      resetPasswordSubmitBtn.disabled = true;
      resetPasswordSubmitBtn.innerHTML = '<span>Saving new password... ⏳</span>';

      try {
        const res = await window.mayzaSupabase.resetCustomerPassword({
          email: recoveryState.activeEmail,
          newPassword: newPassword
        });

        if (res.success) {
          const resetEmail = recoveryState.activeEmail;
          // Clear recovery state
          recoveryState = { activeEmail: '', generatedCode: '', codeExpiry: 0 };
          if (forgotNewPassInput) forgotNewPassInput.value = '';
          if (forgotConfirmPassInput) forgotConfirmPassInput.value = '';
          if (forgotOtpInput) forgotOtpInput.value = '';

          // Transition to Sign In tab with email pre-filled
          setAuthTab('login');
          if (loginEmailInput) {
            loginEmailInput.value = resetEmail;
            loginPwInput?.focus();
          }

          this.celebrateConfetti();
          this.sound.playSparkleChime();
          this.showToast('🎉 Password reset successfully! Please sign in with your new password.');
        } else {
          if (forgotStep2Feedback) forgotStep2Feedback.textContent = res.message || 'Failed to update password.';
          this.sound.playBubblePop(240);
        }
      } catch (err) {
        if (forgotStep2Feedback) forgotStep2Feedback.textContent = 'Error: ' + err.message;
      } finally {
        resetPasswordSubmitBtn.disabled = false;
        resetPasswordSubmitBtn.innerHTML = '<span>Save New Password &amp; Continue</span><span class="btn-arrow">➔</span>';
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
      window.mayzaSupabase?.logoutCustomer();
      this.closeCustomerDashboardModal();
      this.updateCustomerHeaderUI();
      this.showToast("You've been signed out. See you soon! 💕");
      this.sound.playBubblePop(440);
    });

    // Cart Drawer Listeners
    const storeCartBtn = document.getElementById('storeCartBtn');
    const closeCartBtn = document.getElementById('closeStoreCartModalBtn');
    const storeCartModal = document.getElementById('storeCartModal');
    const checkoutForm = document.getElementById('storeCheckoutForm');
    const cartToast = document.getElementById('cartToast');

    storeCartBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openStoreCartModal();
    });

    cartToast?.addEventListener('click', () => {
      this.openStoreCartModal();
    });

    closeCartBtn?.addEventListener('click', () => {
      this.closeStoreCartModal();
    });

    storeCartModal?.addEventListener('click', (e) => {
      if (e.target === storeCartModal) {
        this.closeStoreCartModal();
      }
    });

    checkoutForm?.addEventListener('submit', (e) => {
      this.handleOnlineCheckoutSubmit(e);
    });

    // Delegated click listener on product grid for Add to Cart buttons
    const prodGrid = document.getElementById('bestsellersProductsGrid') || document.querySelector('.bestsellers-products-grid');
    prodGrid?.addEventListener('click', (e) => {
      const btn = e.target.closest('.add-to-cart-action-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const card = btn.closest('.product-item-card');
        const name = btn.getAttribute('data-name') || (card ? card.getAttribute('data-name') : 'Item');
        const price = parseFloat(btn.getAttribute('data-price')) || null;
        const img = card ? card.querySelector('img')?.src : null;
        this.addToCart(name, price, img, true);
      }
    });

    // Initial check on load
    this.updateCustomerHeaderUI();
    this.updateCartBadge();
  }

  openCustomerAuthModal(noticeText) {
    const modal = document.getElementById('customerAuthModal');
    const notice = document.getElementById('authGateNotice');
    if (notice && noticeText) notice.textContent = noticeText;

    // Reset view to Login tab
    const tabLogin = document.getElementById('authTabLogin');
    tabLogin?.click();

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
      { key: 'Dispatched', label: '3. Shipped' },
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

  // =========================================================
  // STOREFRONT CART & LIVE ONLINE CHECKOUT
  // =========================================================
  getCartItems() {
    try {
      return JSON.parse(localStorage.getItem('mm_storefront_cart') || '[]');
    } catch(e) {
      return [];
    }
  }

  saveCartItems(items) {
    try {
      localStorage.setItem('mm_storefront_cart', JSON.stringify(items));
    } catch(e) {}
    this.updateCartBadge();
  }

  updateCartBadge() {
    const items = this.getCartItems();
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    this.cartCount = count;
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
      badge.textContent = count;
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 350);
    }
  }

  addToCart(productName, customPrice = null, customImg = null, autoOpenModal = true) {
    let items = this.getCartItems();
    
    // Find product details if available in card or fallback
    let price = customPrice;
    let img = customImg;
    let sku = `MM-${Date.now().toString().slice(-4)}`;

    if (!price || !img) {
      const cards = document.querySelectorAll('.product-item-card');
      cards.forEach(card => {
        const name = card.getAttribute('data-name');
        if (name && name.toLowerCase().trim() === productName.toLowerCase().trim()) {
          if (!price) {
            const priceText = card.querySelector('.prod-price-text')?.textContent || '';
            const match = priceText.match(/\d+/);
            price = match ? parseInt(match[0], 10) : 199;
          }
          if (!img) {
            img = card.querySelector('img')?.src || 'assets/cat-return-gifts.jpg';
          }
        }
      });
    }

    price = price || 199;
    img = img || 'assets/cat-return-gifts.jpg';

    const existing = items.find(i => i.name.toLowerCase() === productName.toLowerCase());
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: `cart-${Date.now()}-${Math.floor(Math.random()*100)}`,
        name: productName,
        sku: sku,
        price: price,
        img: img,
        qty: 1
      });
    }

    this.saveCartItems(items);
    this.sound.playBubblePop(880);
    this.showToast(`Added "${productName}" to your bag! 🛍️`);

    if (autoOpenModal) {
      this.openStoreCartModal();
    }
  }

  openStoreCartModal() {
    const modal = document.getElementById('storeCartModal');
    if (!modal) return;

    this.renderStoreCartItems();

    // Auto prefill from signed in customer profile if available
    const customer = window.mayzaSupabase?.getCurrentCustomer();
    const nameInput = document.getElementById('checkoutCustName');
    const phoneInput = document.getElementById('checkoutCustPhone');
    const addressInput = document.getElementById('checkoutCustAddress');

    if (customer) {
      if (nameInput && !nameInput.value) nameInput.value = customer.name || '';
      if (phoneInput && !phoneInput.value) phoneInput.value = customer.phone || '';
      if (addressInput && !addressInput.value) addressInput.value = customer.address || '';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    this.sound.playSparkleChime();
  }

  closeStoreCartModal() {
    const modal = document.getElementById('storeCartModal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  renderStoreCartItems() {
    const container = document.getElementById('storeCartItemsList');
    const subtotalEl = document.getElementById('storeCartSubtotal');
    const shippingEl = document.getElementById('storeCartShipping');
    const grandTotalEl = document.getElementById('storeCartGrandTotal');
    if (!container) return;

    const items = this.getCartItems();
    const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = subtotal > 499 || subtotal === 0 ? 0 : 49;
    const grandTotal = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `₹${shipping}`;
    if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px 10px; color: #8F5E6B;">
          <div style="font-size: 2rem; margin-bottom: 6px;">🛍️</div>
          <strong style="font-size: 0.95rem; color: #38121C; display: block; margin-bottom: 4px;">Your bag is empty</strong>
          <span style="font-size: 0.8rem;">Explore our cute bestsellers &amp; accessories to fill your bag!</span>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <div style="display: flex; align-items: center; justify-content: space-between; background: #FFFDFD; border: 1.5px solid #FFD1DA; border-radius: 12px; padding: 8px 12px; gap: 10px;">
        <img src="${item.img}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; background: #eee;">
        <div style="flex: 1; display: flex; flex-direction: column;">
          <strong style="font-size: 0.82rem; color: #38121C; line-height: 1.2;">${item.name}</strong>
          <span style="font-size: 0.74rem; color: #D9657B; font-weight: 700;">₹${item.price} each</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" class="pos-qty-btn" style="width:22px; height:22px; border-radius:6px; border:1px solid #FFD1DA; background:#fff; cursor:pointer;" onclick="window.mayzaApp?.updateCartItemQty('${item.id}', -1)">-</button>
          <span style="font-weight: 800; font-size: 0.82rem; min-width: 16px; text-align: center;">${item.qty}</span>
          <button type="button" class="pos-qty-btn" style="width:22px; height:22px; border-radius:6px; border:1px solid #FFD1DA; background:#fff; cursor:pointer;" onclick="window.mayzaApp?.updateCartItemQty('${item.id}', 1)">+</button>
        </div>
        <span style="font-weight: 800; font-size: 0.88rem; color: #38121C; min-width: 45px; text-align: right;">
          ₹${item.price * item.qty}
        </span>
        <button type="button" style="background: none; border: none; color: #ff4757; font-size: 1rem; cursor: pointer; padding: 0 4px;" onclick="window.mayzaApp?.removeCartItem('${item.id}')" title="Remove item">×</button>
      </div>
    `).join('');
  }

  updateCartItemQty(itemId, delta) {
    let items = this.getCartItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      items = items.filter(i => i.id !== itemId);
    }

    this.saveCartItems(items);
    this.renderStoreCartItems();
    this.sound.playBubblePop(600);
  }

  removeCartItem(itemId) {
    let items = this.getCartItems();
    items = items.filter(i => i.id !== itemId);
    this.saveCartItems(items);
    this.renderStoreCartItems();
    this.sound.playClick();
  }

  async handleOnlineCheckoutSubmit(e) {
    e.preventDefault();

    const items = this.getCartItems();
    if (items.length === 0) {
      this.showToast('Your bag is empty! Please add items before placing order.', 'warning');
      return;
    }

    const name = document.getElementById('checkoutCustName')?.value.trim();
    const phone = document.getElementById('checkoutCustPhone')?.value.trim();
    const address = document.getElementById('checkoutCustAddress')?.value.trim();
    const payment = document.getElementById('checkoutPaymentMode')?.value || 'Cash on Delivery (COD)';
    const feedback = document.getElementById('checkoutFeedbackMsg');

    if (!name || !phone || !address) {
      if (feedback) feedback.textContent = 'Please fill in all shipping details.';
      return;
    }

    const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const shipping = subtotal > 499 ? 0 : 49;
    const grandTotal = subtotal + shipping;
    const orderId = `MM-ONL-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      channel: 'online',
      source: 'Online Storefront',
      customer: {
        name: name,
        phone: phone,
        address: address,
        city: address.split(',').pop().trim() || 'India'
      },
      items: items.map(i => ({
        name: i.name,
        sku: i.sku || 'MM-ONL',
        qty: i.qty,
        price: i.price
      })),
      subtotal: subtotal,
      shipping: shipping,
      total: grandTotal,
      payment: payment,
      status: 'New',
      timestamp: 'Just now',
      rawDate: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    };

    // 1. Save to local storage for instant sync across tabs
    try {
      let orders = JSON.parse(localStorage.getItem('mm_orders') || '[]');
      if (!Array.isArray(orders)) orders = [];
      orders.unshift(newOrder);
      localStorage.setItem('mm_orders', JSON.stringify(orders));
      localStorage.setItem('mm_orders_timestamp', Date.now().toString());
    } catch(err) {}

    // 2. Broadcast event
    window.dispatchEvent(new CustomEvent('mayza:orders-updated', {
      detail: { orders: [newOrder] }
    }));

    // 3. Save to Supabase Cloud if configured
    if (window.mayzaSupabase && window.mayzaSupabase.isConfigured()) {
      window.mayzaSupabase.createOrder(newOrder).catch(console.warn);
    }

    // 4. Clear customer bag
    this.saveCartItems([]);
    this.closeStoreCartModal();

    // 5. Success Celebration!
    this.celebrateConfetti();
    this.sound.playSparkleChime();
    this.showToast(`🎉 Order ${orderId} placed successfully! Thank you ${name}! 💕`);

    // 6. Refresh Customer Dashboard orders if customer is signed in
    if (window.mayzaSupabase?.getCurrentCustomer()) {
      this.renderCustomerOrders();
    }
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
    this.autoTransitionToStore = false; // Stay on animation stage when returning
    if (this.autoTransitionTimer) {
      clearTimeout(this.autoTransitionTimer);
      this.autoTransitionTimer = null;
    }
    if (this.storefrontPreview) {
      this.storefrontPreview.classList.remove('active');
    }
    if (this.stageContainer) {
      this.stageContainer.style.display = 'flex';
      this.stageContainer.classList.remove('fade-out');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      this.replayAnimation();
    }, 120);
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.mayzaApp = new MayzaEntranceApp();
});
