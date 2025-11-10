// 导航栏响应式菜单
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// 语言切换器 - 页面切换方式
const languageBtn = document.getElementById('languageBtn');
const languageDropdown = document.getElementById('languageDropdown');
const languageSwitcher = document.querySelector('.language-switcher');
const langOptions = document.querySelectorAll('.lang-option');

// 获取当前页面语言
function getCurrentLanguage() {
    const currentPath = window.location.pathname;
    if (currentPath.includes('index-en.html') || currentPath.includes('en')) {
        return 'en';
    }
    return 'zh';
}

// 切换语言页面
function switchLanguage(targetLang) {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    if (targetLang === 'zh') {
        // 切换到中文页面
        if (currentPath.includes('index-en.html')) {
            window.location.href = 'index.html' + currentHash;
        }
    } else if (targetLang === 'en') {
        // 切换到英文页面
        if (!currentPath.includes('index-en.html')) {
            window.location.href = 'index-en.html' + currentHash;
        }
    }
}

if (languageBtn && languageDropdown) {
    // 设置当前语言显示
    const currentLang = getCurrentLanguage();
    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang === 'zh' ? '中文' : 'English';
    }
    
    // 设置活动状态
    langOptions.forEach(option => {
        const lang = option.getAttribute('data-lang');
        if (lang === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });

    // 点击按钮切换下拉菜单
    languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageSwitcher.classList.toggle('active');
    });

    // 点击语言选项
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedLang = option.getAttribute('data-lang');
            
            // 如果选择的是当前语言，不执行切换
            if (selectedLang === currentLang) {
                languageSwitcher.classList.remove('active');
                return;
            }
            
            // 关闭下拉菜单
            languageSwitcher.classList.remove('active');
            
            // 切换页面
            switchLanguage(selectedLang);
        });
    });

    // 点击外部关闭下拉菜单
    document.addEventListener('click', (e) => {
        if (!languageSwitcher.contains(e.target)) {
            languageSwitcher.classList.remove('active');
        }
    });
}

// 平滑滚动 - 移动端优化
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // 移动端导航栏高度调整
            const isMobile = window.innerWidth <= 768;
            const offsetTop = target.offsetTop - (isMobile ? 60 : 80);
            
            // 使用平滑滚动，如果不支持则使用scrollIntoView
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // 降级方案
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                window.scrollBy(0, -(isMobile ? 60 : 80));
            }
            
            // 关闭移动端菜单
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// 导航栏滚动效果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// 视频背景自动播放确保
window.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.getElementById('heroBgVideo');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.log('视频自动播放失败:', error);
        });
    }
});

// 导航栏高亮当前部分
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu .nav-link');

function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// 表单提交处理
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // 这里可以添加实际的表单提交逻辑
        // 例如：发送到服务器、发送邮件等
        console.log('表单数据:', formData);
        
        // 显示成功消息
        alert('感谢您的咨询！我们会尽快与您联系。');
        
        // 重置表单
        contactForm.reset();
    });
}

// 数字动画效果
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number, .stat-number-large');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        const isNumber = /^\d+/.test(target);
        
        if (isNumber) {
            const number = parseInt(target);
            const duration = 2000;
            const increment = number / (duration / 16);
            let current = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= number) {
                                stat.textContent = target;
                                clearInterval(timer);
                            } else {
                                stat.textContent = Math.floor(current) + (target.includes('%') ? '%' : '') + 
                                                  (target.includes('MW') ? 'MW' : '') +
                                                  (target.includes('+') ? '+' : '');
                            }
                        }, 16);
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(stat);
        }
    });
}

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    animateNumbers();
    
    // 添加淡入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察所有卡片和区块
    document.querySelectorAll('.advantage-card, .detail-section, .risk-card, .exit-card, .resource-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 点击外部关闭移动端菜单
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// 触摸事件优化 - 移动端菜单关闭
document.addEventListener('touchstart', (e) => {
    if (navMenu && navToggle && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    }
}, { passive: true });

// 窗口大小改变时关闭移动端菜单
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    }, 250);
});

// 移动端滚动优化 - 防止滚动穿透
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        touchStartY = e.touches[0].clientY;
    }
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
        const touchY = e.touches[0].clientY;
        const menu = navMenu;
        const scrollTop = menu.scrollTop;
        const scrollHeight = menu.scrollHeight;
        const clientHeight = menu.clientHeight;
        
        // 如果菜单可以滚动，允许滚动
        if (scrollHeight > clientHeight) {
            const isScrollingUp = touchY > touchStartY;
            const isScrollingDown = touchY < touchStartY;
            
            // 如果滚动到顶部或底部，阻止默认行为
            if ((scrollTop === 0 && isScrollingUp) || 
                (scrollTop + clientHeight >= scrollHeight && isScrollingDown)) {
                e.preventDefault();
            }
        }
    }
}, { passive: false });

