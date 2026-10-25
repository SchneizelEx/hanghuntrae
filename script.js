/* ========================================================
   ห้างหันแตร (HANG HUN TRAE) - CYBER MART 2099
   Interactive High-Tech Script
   ======================================================== */

// --- Web Audio Sci-Fi Sound Synthesizer (Zero External Dependencies) ---
let audioEnabled = false;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playCyberSound(type = 'beep') {
  if (!audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.26);
    }
  } catch (e) {
    console.warn('Audio synthesis note:', e);
  }
}

// --- Dynamic Store Status & Live Quantum Clock (05:00 - 04:00) ---
function updateStoreStatus() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Format digital clock
  const pad = (n) => String(n).padStart(2, '0');
  const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ICT`;
  
  const clockEl = document.getElementById('live-quantum-clock');
  if (clockEl) {
    clockEl.textContent = timeString;
  }

  // Opening hours: 05:00 to 04:00 next day (Closed between 04:00 and 04:59:59)
  const isMaintenance = (hours === 4);
  const statusBadge = document.getElementById('store-status-badge');
  const statusDot = document.getElementById('store-status-dot');
  const statusText = document.getElementById('store-status-text');

  if (isMaintenance) {
    if (statusDot) statusDot.className = 'status-dot maintenance';
    if (statusText) {
      const minutesLeft = 60 - minutes;
      statusText.innerHTML = `<strong style="color:var(--cyber-magenta)">SYSTEM RESET & RESTOCK</strong> (ปิดซ่อมบำรุง 04:00-05:00 น. | อีก ${minutesLeft} นาทีเปิด)`;
    }
  } else {
    if (statusDot) statusDot.className = 'status-dot';
    if (statusText) {
      statusText.innerHTML = `<strong>ONLINE</strong> (เปิด 05:00 - 04:00 น. ให้บริการตลอด 23 ชม.)`;
    }
  }
}

// --- Toast Notification System ---
function showToast(message, type = 'info') {
  let toast = document.getElementById('cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.className = 'cyber-toast';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? '⚡' : 'ℹ️';
  toast.innerHTML = `<span style="font-size:1.3rem;">${icon}</span> <span>${message}</span>`;
  toast.classList.add('show');
  playCyberSound(type === 'success' ? 'success' : 'beep');

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// --- Interactive Cart System ---
let cart = [
  { id: 1, name: 'ไส้กรอกอีสานชีสพลาสม่า (แพ็กคู่)', price: 45, qty: 1 }
];

function updateCartUI() {
  const cartCountEl = document.getElementById('cart-count');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
    cartCountEl.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }

  if (cartItemsList) {
    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-dim);">
          <div style="font-size:2.5rem; margin-bottom:0.5rem;">🛸</div>
          <p>ตะกร้าว่างเปล่า</p>
          <p style="font-size:0.8rem;">เลือกสินค้าล้ำยุคเพื่อเริ่มช้อป</p>
        </div>
      `;
    } else {
      cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.price} เครดิต × ${item.qty} ชิ้น = ${(item.price * item.qty)} เครดิต</p>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button onclick="changeCartQty(${item.id}, -1)" class="icon-btn" style="width:28px; height:28px; font-size:0.8rem;">-</button>
            <span style="font-size:0.9rem; font-weight:700;">${item.qty}</span>
            <button onclick="changeCartQty(${item.id}, 1)" class="icon-btn" style="width:28px; height:28px; font-size:0.8rem;">+</button>
            <button onclick="removeCartItem(${item.id})" class="cart-item-remove" title="ลบรายการ">✕</button>
          </div>
        </div>
      `).join('');
    }
  }

  if (cartSubtotalEl) cartSubtotalEl.textContent = `${totalPrice} เครดิต`;
  if (cartTotalEl) cartTotalEl.textContent = `${totalPrice} เครดิต`;
}

function addToCart(id, name, price) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCartUI();
  playCyberSound('beep');
  showToast(`เพิ่ม "${name}" ลงในตะกร้าไซเบอร์แล้ว!`, 'success');
}

function changeCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCartUI();
  playCyberSound('beep');
}

function removeCartItem(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
  playCyberSound('alert');
}

// Drawer Open/Close
function toggleCartDrawer(open = null) {
  const overlay = document.getElementById('cart-modal-overlay');
  if (!overlay) return;
  const isCurrentlyActive = overlay.classList.contains('active');
  const shouldOpen = (open !== null) ? open : !isCurrentlyActive;

  if (shouldOpen) {
    overlay.classList.add('active');
    playCyberSound('beep');
  } else {
    overlay.classList.remove('active');
  }
}

// Checkout simulation
function checkoutCart() {
  if (cart.length === 0) {
    showToast('ไม่มีสินค้าในตะกร้าไซเบอร์', 'info');
    return;
  }
  playCyberSound('success');
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  showToast(`[TRANSACTION CONFIRMED] ชำระเงิน ${total} เครดิต ผ่าน Neural-Pay สำเร็จ! โดรนเริ่มโหลดสินค้า`, 'success');
  cart = [];
  updateCartUI();
  setTimeout(() => {
    toggleCartDrawer(false);
  }, 1200);
}

// --- Branch Switching / Filter Tabs ---
function switchBranchTab(branchKey) {
  playCyberSound('beep');
  const tabBtns = document.querySelectorAll('.branch-tab-btn');
  tabBtns.forEach(btn => {
    if (btn.dataset.branch === branchKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const cards = document.querySelectorAll('.branch-card');
  cards.forEach(card => {
    if (branchKey === 'all' || card.dataset.branch === branchKey) {
      card.style.display = 'flex';
      card.style.animation = 'fadeInUp 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// Copy Coordinates / Location
function copyBranchCoords(text, branchName) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`คัดลอกพิกัดสาขา ${branchName} เรียบร้อยแล้ว: ${text}`, 'success');
  }).catch(() => {
    showToast(`พิกัดสาขา ${branchName}: ${text}`, 'info');
  });
}

// --- Theme Switcher ---
function cycleTheme() {
  const current = document.body.getAttribute('data-theme') || 'cyan';
  let next = 'cyan';
  if (current === 'cyan') next = 'magenta';
  else if (current === 'magenta') next = 'emerald';
  else next = 'cyan';

  document.body.setAttribute('data-theme', next);
  playCyberSound('beep');
  showToast(`สลับธีมสีเป็น: ${next.toUpperCase()}`, 'info');
}

// Audio Toggle Button
function toggleSound() {
  initAudio();
  audioEnabled = !audioEnabled;
  const soundIcon = document.getElementById('sound-icon');
  if (soundIcon) {
    soundIcon.textContent = audioEnabled ? '🔊' : '🔇';
  }
  if (audioEnabled) {
    playCyberSound('success');
    showToast('เปิดระบบเสียง Cyber Sound FX แล้ว', 'success');
  } else {
    showToast('ปิดระบบเสียงไซเบอร์', 'info');
  }
}

// --- Interactive Contact / Hologram Form Submit ---
function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value;
  const branch = document.getElementById('contact-branch').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;

  const submitBtn = document.getElementById('contact-submit-btn');
  const originalHtml = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '⚡ TRANSMITTING QUANTUM PACKET...';
  playCyberSound('beep');

  setTimeout(() => {
    submitBtn.innerHTML = '✔ DATA PACKET RECEIVED';
    playCyberSound('success');
    showToast(`สัญญาณส่งถึงห้างหันแตร สาขา${branch} เรียบร้อยแล้ว! ขอบคุณคุณ ${name}`, 'success');

    setTimeout(() => {
      document.getElementById('cyber-contact-form').reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }, 2000);
  }, 1200);
}

// --- Interactive Matrix / Particle Canvas Background ---
function initCanvasGrid() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = Math.min(Math.floor(width / 25), 60);

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(0, 240, 255, 0.4)' : 'rgba(168, 85, 247, 0.35)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw particle nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect close particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

// --- DOM Ready Hook ---
document.addEventListener('DOMContentLoaded', () => {
  initCanvasGrid();
  updateStoreStatus();
  setInterval(updateStoreStatus, 1000);
  updateCartUI();

  // Category filter for products
  const categoryPills = document.querySelectorAll('.catalog-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playCyberSound('beep');
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const category = pill.dataset.category;
      const products = document.querySelectorAll('.product-card');
      products.forEach(prod => {
        if (category === 'all' || prod.dataset.category === category) {
          prod.style.display = 'flex';
        } else {
          prod.style.display = 'none';
        }
      });
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('site-nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      playCyberSound('beep');
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '72px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'rgba(6, 9, 19, 0.98)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--cyber-cyan)';
      }
    });
  }
});
