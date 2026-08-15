/**
 * CYBER-CORE JAVASCRIPT ENGINE
 * Author: Trần Quốc Huy (williamtran207 / quochuyph)
 * Profile: Information Security Student @ HCMUTE
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initCyberTerminal();
  initCopyButtons();
  initModalHandler();
  initBackToTop();
});

/* ==========================================================================
   1. CYBER NETWORK CONSTELLATION CANVAS
   ========================================================================== */
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 140 };

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 35 : 75;
  const maxDistance = isMobile ? 90 : 130;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 245, 212, ' : 'rgba(56, 189, 248, ';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / repel
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
          ctx.lineWidth = 0.75;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[a].x - mouse.x;
        const dy = particles[a].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
}

/* ==========================================================================
   2. INTERACTIVE MINI CYBER TERMINAL
   ========================================================================== */
function initCyberTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalHistory = document.getElementById('terminal-history');
  const terminalBody = document.querySelector('.terminal-body');
  const quickChips = document.querySelectorAll('.quick-chip');
  const clearBtn = document.getElementById('term-clear-btn');

  if (!terminalInput || !terminalHistory) return;

  const commandHistoryList = [];
  let historyIndex = -1;

  const commands = {
    help: () => `Available commands:
  • <span class="cyan">whoami</span>     : Display student profile & identity
  • <span class="cyan">education</span>  : University & major info (HCMUTE)
  • <span class="cyan">skills</span>     : Cybersecurity & technical skill matrix
  • <span class="cyan">projects</span>   : Key projects & security research
  • <span class="cyan">contact</span>    : Social channels & email/phone
  • <span class="cyan">pgp</span>        : Show public security key fingerprint
  • <span class="cyan">matrix</span>     : Run visual matrix stream
  • <span class="cyan">clear</span>      : Clear the terminal screen
  • <span class="cyan">date</span>       : Output current timestamp`,

    whoami: () => `╔════════════════════════════════════════════════════════════╗
║  <span class="cyan">TRẦN QUỐC HUY</span> (williamtran207 / @quochuyph)              ║
╠════════════════════════════════════════════════════════════╣
║  • Role: Information Security Student                      ║
║  • University: HCMUTE (Đại học Sư phạm Kỹ thuật TP.HCM)   ║
║  • Major: An toàn Thông tin (Information Security)         ║
║  • Interests: Web Pentest, Network Defense, CTFs, Crypto   ║
║  • Status: <span class="green">🟢 Active & open for research / collaborations</span>   ║
╚════════════════════════════════════════════════════════════╝`,

    education: () => `🎓 <span class="cyan">ACADEMIC BACKGROUND</span>
--------------------------------------------------
🏛️ <span class="green">Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCMUTE)</span>
🏢 Khoa: Công nghệ Thông tin (Faculty of Information Technology)
🛡️ Chuyên ngành: <span class="cyan">An toàn Thông tin (Information Security)</span>
📚 Trọng tâm: Network Security, Web Application PenTest, Reverse Engineering, Cryptography, Linux Hardening.`,

    skills: () => `⚡ <span class="cyan">CYBERSECURITY & TECH STACK</span>
--------------------------------------------------
[+] <span class="purple">Security & Pentest</span> : Burp Suite, Wireshark, Nmap, Metasploit, OWASP Top 10, Ghidra
[+] <span class="purple">Programming</span>        : Python, C/C++, Bash Shell, JavaScript, SQL
[+] <span class="purple">Systems & Infra</span>    : Linux (Kali, Ubuntu, Arch), Docker, Windows Security, Git
[+] <span class="purple">Domains</span>            : Web Sec, Network Defense, CTF Solving, Threat Analysis`,

    projects: () => `📁 <span class="cyan">PROJECTS & SECURITY RESEARCH STATUS</span>
--------------------------------------------------
[⚡] <span class="amber">TRẠNG THÁI: ĐANG NGHIÊN CỨU & THỰC HIỆN DỰ ÁN</span>
[+] Hiện tại các dự án bảo mật, công cụ an ninh mạng và bài viết CTF writeup đang được tập trung nghiên cứu, phát triển và thử nghiệm.
[+] Các dự án sẽ sớm được công bố mã nguồn mở & demo trên GitHub:
    1. <span class="cyan">Network Packet Sniffer & Analyzer</span> (Scapy/Python)
    2. <span class="cyan">Automated Web Vulnerability Scanner</span> (OWASP Labs)
    3. <span class="cyan">CTF Writeups & Security Labs Repository</span>
    4. <span class="cyan">Reverse Engineering & Binary Analysis Labs</span>
[+] Theo dõi tiến độ tại: <a href="https://github.com/quochuyph" target="_blank" class="green">github.com/quochuyph</a>`,

    contact: () => `📫 <span class="cyan">COMMUNICATION CHANNELS</span>
--------------------------------------------------
• Email    : <a href="mailto:quochuyphbrvt@gmail.com" class="cyan">quochuyphbrvt@gmail.com</a>
• Phone    : <span class="green">0858070207</span>
• GitHub   : <a href="https://github.com/quochuyph" target="_blank" class="cyan">github.com/quochuyph</a>
• LinkedIn : <a href="https://www.linkedin.com/in/williamtran207/" target="_blank" class="cyan">linkedin.com/in/williamtran207</a>
• Facebook : <a href="https://www.facebook.com/quoc.huy.tran.2007/" target="_blank" class="cyan">facebook.com/quoc.huy.tran.2007</a>
• Zalo     : <a href="https://zalo.me/0858070207/" target="_blank" class="cyan">zalo.me/0858070207</a>`,

    pgp: () => `🔑 <span class="cyan">PGP KEY FINGERPRINT</span>
--------------------------------------------------
Fingerprint: 8F2A 4C91 03B7 E12D 9940  72CA 401F 98C1 A23B E709
Algorithm  : RSA 4096 / Curve25519
Status     : Valid & Active`,

    date: () => `🕒 ${new Date().toString()}`,

    sudo: () => `<span class="red">[-] Permission denied: Incident logged to /var/log/audit.log 🛡️</span>`,

    matrix: () => {
      triggerMatrixEffect();
      return `<span class="green">Initializing Matrix simulation protocol... [OK]</span>`;
    },

    banner: () => `
██╗  ██╗██╗   ██╗██╗   ██╗    ███████╗███████╗ ██████╗
██║  ██║██║   ██║╚██╗ ██╔╝    ██╔════╝██╔════╝██╔════╝
███████║██║   ██║ ╚████╔╝     ███████╗█████╗  ██║     
██╔══██║██║   ██║  ╚██╔╝      ╚════██║██╔══╝  ██║     
██║  ██║╚██████╔╝   ██║       ███████║███████╗╚██████╗
╚═╝  ╚═╝ ╚═════╝    ╚═╝       ╚══════╝╚══════╝ ╚═════╝
    `
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    commandHistoryList.push(rawCmd);
    historyIndex = commandHistoryList.length;

    // Line entry
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';

    const promptSpan = document.createElement('div');
    promptSpan.innerHTML = `<span class="terminal-prompt-user">visitor</span><span class="muted">@</span><span class="terminal-prompt-path">quochuy-sec:~$</span> ${escapeHtml(rawCmd)}`;
    lineEl.appendChild(promptSpan);

    if (cmd === 'clear') {
      terminalHistory.innerHTML = '';
      terminalInput.value = '';
      return;
    }

    const outputEl = document.createElement('div');
    outputEl.className = 'terminal-output';

    if (commands[cmd]) {
      outputEl.innerHTML = commands[cmd]();
    } else {
      outputEl.innerHTML = `<span class="red">Command not found: "${escapeHtml(cmd)}". Type '<span class="cyan">help</span>' for available commands.</span>`;
    }

    lineEl.appendChild(outputEl);
    terminalHistory.appendChild(lineEl);
    terminalInput.value = '';

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistoryList[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistoryList.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistoryList[historyIndex] || '';
      } else {
        historyIndex = commandHistoryList.length;
        terminalInput.value = '';
      }
    }
  });

  // Quick chips click
  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd') || chip.textContent.trim();
      executeCommand(cmd);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalHistory.innerHTML = '';
    });
  }

  function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

/* ==========================================================================
   3. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
function showToast(message, icon = 'fa-solid fa-circle-check') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="${icon} toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* ==========================================================================
   4. CLIPBOARD COPY UTILITIES
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-copy-label') || 'Thông tin';

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Đã sao chép ${label}: "${text}" vào clipboard!`);
        }).catch(() => {
          fallbackCopy(text, label);
        });
      } else {
        fallbackCopy(text, label);
      }
    });
  });

  function fallbackCopy(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Đã sao chép ${label}: "${text}"!`);
    } catch (err) {
      showToast(`Không thể sao chép tự động: ${text}`, 'fa-solid fa-triangle-exclamation');
    }
    document.body.removeChild(textArea);
  }
}

/* ==========================================================================
   5. MODAL MANAGEMENT (PGP / SECURITY DETAILS)
   ========================================================================== */
function initModalHandler() {
  const openBtns = document.querySelectorAll('[data-modal-target]');
  const closeBtns = document.querySelectorAll('[data-modal-close]');
  const overlays = document.querySelectorAll('.modal-overlay');

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  overlays.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach((modal) => {
        if (modal.classList.contains('active')) closeModal(modal);
      });
    }
  });
}

/* ==========================================================================
   6. BACK TO TOP & SMOOTH SCROLL
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   7. MATRIX RAIN EFFECT (EASTER EGG)
   ========================================================================== */
function triggerMatrixEffect() {
  showToast('Đang khởi chạy giao thức bảo mật Matrix...', 'fa-solid fa-terminal');
  const overlay = document.createElement('canvas');
  overlay.id = 'matrix-easter-egg';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '9998';
  overlay.style.pointerEvents = 'none';
  overlay.style.opacity = '0.75';
  document.body.appendChild(overlay);

  const ctx = overlay.getContext('2d');
  overlay.width = window.innerWidth;
  overlay.height = window.innerHeight;

  const letters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+{}[]:;<>,.?/~';
  const fontSize = 14;
  const columns = Math.floor(overlay.width / fontSize);
  const drops = Array(columns).fill(1);

  let iterations = 0;
  const maxIterations = 180; // ~6 seconds

  const matrixInterval = setInterval(() => {
    ctx.fillStyle = 'rgba(6, 9, 17, 0.08)';
    ctx.fillRect(0, 0, overlay.width, overlay.height);

    ctx.fillStyle = '#00f5d4';
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > overlay.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    iterations++;
    if (iterations >= maxIterations) {
      clearInterval(matrixInterval);
      overlay.style.transition = 'opacity 1s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        if (overlay.parentNode) document.body.removeChild(overlay);
      }, 1000);
    }
  }, 33);
}
