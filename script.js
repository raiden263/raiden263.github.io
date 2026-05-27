// ===== 背景粒子 =====
function createParticles() {
    const container = document.getElementById('particles');
    const colors = ['#f093fb', '#f5576c', '#fda085', '#f6d365', '#ff6b9d', '#c44dff'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 8;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = left + '%';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;

        container.appendChild(particle);
    }
}

createParticles();

// ===== 音乐播放器 =====
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicBtn.addEventListener('click', function() {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
        musicBtn.textContent = '🎵';
        document.querySelector('.music-label').textContent = '点击播放音乐';
    } else {
        // 如果没有音乐文件，至少视觉上切换状态
        if (bgMusic.src && bgMusic.src !== window.location.href) {
            bgMusic.play().catch(() => {
                // 没音乐文件也能切换状态
            });
        }
        musicBtn.classList.add('playing');
        musicBtn.textContent = '🎶';
        document.querySelector('.music-label').textContent = '正在播放...';
    }
    isPlaying = !isPlaying;
});

// ===== 数字滚动动画 =====
function animateNumbers() {
    const nums = document.querySelectorAll('.stat-num');
    nums.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(eased * target);
            num.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                num.textContent = target;
            }
        }

        requestAnimationFrame(update);
    });
}

// 进入页面时触发数字动画
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// ===== 随机来访编号 =====
const visitorNum = document.getElementById('visitorNum');
if (visitorNum) {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    visitorNum.textContent = randomNum;
}

// ===== 联系表单提交 =====
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const inputs = form.querySelectorAll('input, textarea');
        const data = {
            name: inputs[0].value,
            contact: inputs[1].value,
            message: inputs[2].value,
            time: new Date().toLocaleString()
        };

        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '⏳ 发送中...';
        btn.style.background = 'linear-gradient(135deg, #f6d365, #fda085)';

        // 尝试通过服务器发送真实邮件
        let sent = false;
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) sent = true;
        } catch (err) {
            // 服务器未运行，回退到本地存储
            console.log('服务器未运行，消息保存到本地');
        }

        // 始终保存到本地
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messages.push(data);
        localStorage.setItem('contact_messages', JSON.stringify(messages));

        if (sent) {
            btn.textContent = '✅ 发送成功！';
            btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        } else {
            btn.textContent = '✅ 留言已保存！';
            btn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        }

        form.reset();
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2500);
    });
}

// ===== 卡片 hover 光泽效果 =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    });
});
