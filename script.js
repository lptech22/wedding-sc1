const WEDDING_DATE = new Date(2026, 3, 15, 8, 0, 0).getTime();
//format (Tahun, Bulan, Tanggal, Jam, Menit, Detik)
const $ = id => document.getElementById(id);
const cover = $('cover'), mainContent = $('main-content'), musicToggle = $('music-toggle');
const bgMusic = $('bg-music'), petalsContainer = $('petals-container'), toast = $('toast');
const daysEl = $('days'), hoursEl = $('hours'), minutesEl = $('minutes'), secondsEl = $('seconds');
let isPlaying = false;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateCountdown() {
    const now = Date.now();
    const distance = WEDDING_DATE - now;
    if (distance < 0) { if(daysEl) daysEl.textContent = '00'; if(hoursEl) hoursEl.textContent = '00'; if(minutesEl) minutesEl.textContent = '00'; if(secondsEl) secondsEl.textContent = '00'; return; }
    const days = Math.floor(distance / 86400000); const hours = Math.floor((distance % 86400000) / 3600000); const minutes = Math.floor((distance % 3600000) / 60000); const seconds = Math.floor((distance % 60000) / 1000);
    if(daysEl) daysEl.textContent = String(days).padStart(2, '0'); if(hoursEl) hoursEl.textContent = String(hours).padStart(2, '0'); if(minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0'); if(secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

function createPetal() {
    if (prefersReducedMotion || !petalsContainer) return;
    const petal = document.createElement('div'); petal.className = 'petal';
    petal.innerHTML = `<svg width="12" height="16" viewBox="0 0 12 16"><ellipse cx="6" cy="8" rx="5" ry="8" fill="${Math.random() > 0.5 ? 'var(--accent)' : 'var(--sage)'}" opacity="0.5"/></svg>`;
    petal.style.left = Math.random() * window.innerWidth + 'px'; petal.style.animationDuration = (12 + Math.random() * 10) + 's';
    petalsContainer.appendChild(petal); setTimeout(() => petal.remove(), 22000);
}

function showToast(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); }

function initReveal(container) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); }); }, { threshold: 0.1, rootMargin: '-30px' });
    container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function saveToCalendar() {
    const pad = n => String(n).padStart(2, '0'); const start = new Date(WEDDING_DATE); const end = new Date(start.getTime() + 25200000);
    const startStr = `${start.getFullYear()}${pad(start.getMonth()+1)}${pad(start.getDate())}T${pad(start.getHours())}${pad(start.getMinutes())}00`;
    const endStr = `${end.getFullYear()}${pad(end.getMonth()+1)}${pad(end.getDate())}T${pad(end.getHours())}${pad(end.getMinutes())}00`;
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Ahmad+Sarah&dates=${startStr}/${endStr}&location=Jakarta&sf=true`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#cover .reveal').forEach((el, i) => setTimeout(() => el.classList.add('active'), i * 120));
    if (!prefersReducedMotion) { setInterval(createPetal, 1200); for(let i=0;i<3;i++) setTimeout(createPetal, i*400); }
    
    musicToggle?.addEventListener('click', () => {
        if (isPlaying) { bgMusic?.pause(); musicToggle.classList.remove('playing'); }
        else { bgMusic?.play().then(() => musicToggle.classList.add('playing')).catch(() => {}); }
        isPlaying = !isPlaying;
    });
    
    $('open-invitation')?.addEventListener('click', () => {
        if (!isPlaying) bgMusic?.play().then(() => { isPlaying = true; musicToggle?.classList.add('playing'); }).catch(() => {});
        cover.style.opacity = '0'; cover.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            cover.style.display = 'none'; mainContent.classList.remove('hidden'); mainContent.style.opacity = '0';
            requestAnimationFrame(() => { mainContent.style.transition = 'opacity 0.5s'; mainContent.style.opacity = '1'; });
            updateCountdown(); setInterval(updateCountdown, 1000); initReveal(mainContent);
        }, 500);
    });
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy;
            navigator.clipboard?.writeText(text).then(() => showToast('Berhasil disalin')).catch(() => {
                const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px';
                document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('Berhasil disalin');
            });
        });
    });
    
    $('save-calendar')?.addEventListener('click', saveToCalendar);
});