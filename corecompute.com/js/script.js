(() => {
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
        // 检查路径中是否包含 /cn/ 或 /en/
        if (currentPath.includes('/cn/')) {
            return 'zh';
        } else if (currentPath.includes('/en/')) {
            return 'en';
        }
        // 兼容旧逻辑
        if (currentPath.includes('index-en.html') || currentPath.includes('/en')) {
            return 'en';
        }
        return 'zh';
    }

    // 切换语言页面
    function switchLanguage(targetLang) {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const currentLang = getCurrentLanguage();

        // 如果选择的是当前语言，不执行切换
        if (targetLang === currentLang) {
            return;
        }

        // 获取根路径（去掉语言目录和文件名）
        let rootPath = currentPath;
        
        // 如果路径包含 /cn/ 或 /en/，提取根路径
        if (currentPath.includes('/cn/')) {
            rootPath = currentPath.substring(0, currentPath.indexOf('/cn/')) + '/';
        } else if (currentPath.includes('/en/')) {
            rootPath = currentPath.substring(0, currentPath.indexOf('/en/')) + '/';
        } else {
            // 兼容旧逻辑：去掉文件名
            if (currentPath.includes('index-en.html')) {
                rootPath = currentPath.replace('index-en.html', '');
            } else if (currentPath.includes('index.html')) {
                rootPath = currentPath.replace('index.html', '');
            } else if (!currentPath.endsWith('/')) {
                rootPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            }
            
            // 确保 rootPath 以 / 结尾
            if (rootPath && !rootPath.endsWith('/')) {
                rootPath += '/';
            }
        }

        // 跳转到对应的语言目录
        if (targetLang === 'zh') {
            // 切换到中文页面：/cn/
            window.location.href = rootPath + 'cn/' + currentHash;
        } else if (targetLang === 'en') {
            // 切换到英文页面：/en/
            window.location.href = rootPath + 'en/' + currentHash;
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
        const hero = document.querySelector('.hero');

        if (heroVideo && hero) {
            // 检查视频是否支持
            const canPlayVideo = heroVideo.canPlayType && heroVideo.canPlayType('video/mp4') !== '';

            // 视频加载失败时确保背景图片显示
            heroVideo.addEventListener('error', () => {
                hero.style.backgroundImage = "url('images/bg.png')";
                heroVideo.style.display = 'none';
            });

            // 视频无法播放时显示背景图片
            heroVideo.addEventListener('loadstart', () => {
                // 设置超时，如果视频在3秒内没有开始播放，显示背景图片
                setTimeout(() => {
                    if (heroVideo.readyState < 2) { // HAVE_CURRENT_DATA
                        hero.style.backgroundImage = "url('images/bg.png')";
                    }
                }, 3000);
            });

            // 视频可以播放时，视频会覆盖背景图片（通过z-index）
            heroVideo.addEventListener('canplay', () => {
                heroVideo.style.display = 'block';
            });

            // 尝试播放视频
            heroVideo.play().catch(error => {
                console.log('视频自动播放失败:', error);
                // 播放失败时确保背景图片显示
                hero.style.backgroundImage = "url('images/bg.png')";
                heroVideo.style.display = 'none';
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
        contactForm.addEventListener('submit', function (e) {
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


    const financeChart = document.getElementById('financeChart');
    const chartOptions = (()=>{
        const result = {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            title: {
                text: ''
            },
            plotOptions: {
                pie: {
                    innerSize: 60,
                    depth: 45
                }
            },
            credits: {
                enabled: false
            },
            series: [{}]
        };
        const lang = financeChart.getAttribute('lang');
        if (lang === 'cn') {
            result.series[0] = {
                data: [
                    ['EB-5资金 40%', 40],
                    ['高级贷款 35%', 35],
                    ['项目方自有资金 25%', 25],
                ]
            };
        }else{
            result.series[0] = {
                data: [
                    ['EB-5 Funds 40%', 40],
                    ['Senior Loan 35%', 35],
                    ['Developer Equity 25%', 25],
                ]
            };
        };
        return result;
    })();

    Highcharts.chart('financeChart', chartOptions);
})();

// 轮播图功能
(function() {
    const carousel = document.getElementById('successCasesCarousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;
    let autoPlayInterval;

    // 显示指定幻灯片
    function showSlide(index) {
        // 移除所有活动状态
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // 添加当前活动状态
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }

        currentSlide = index;
    }

    // 下一张
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    // 上一张
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    // 自动播放
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // 每4秒切换
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    // 事件监听
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    // 指示器点击
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // 鼠标悬停时暂停自动播放
    const carouselContainer = carousel.closest('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化自动播放
    startAutoPlay();
})();