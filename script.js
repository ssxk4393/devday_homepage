// ===== GLOBAL VARIABLES =====
let currentActiveTab = 'tab';
let currentChatMode = 'agent'; // Track current chat mode
let isMenuOpen = false;
let typingTimeouts = new Map(); // Store timeouts for each tab
let isTypingActive = new Map(); // Track active typing animations

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZATION =====
function initializeApp() {
    setupCursorFollow();
    setupNavigation();
    setupFeatureTabs();
    setupChatModes(); // Add chat mode functionality
    setupScrollAnimations();
    setupScrollSpy();
    setupMobileMenu();
    setupSmoothScrolling();
    setupTypingAnimation();
    setupIntersectionObserver();
}

// ===== CURSOR FOLLOW EFFECT =====
function setupCursorFollow() {
    const cursorFollower = document.querySelector('.cursor-follow');
    
    if (!cursorFollower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        const speed = 0.1;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursorFollower.style.left = cursorX + 'px';
        cursorFollower.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursorFollower.style.display = 'none';
    }
}

// ===== NAVIGATION =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navContainer = document.querySelector('.nav-container');
    
    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navContainer.style.background = 'rgba(255, 255, 255, 0.98)';
            navContainer.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navContainer.style.background = 'rgba(255, 255, 255, 0.95)';
            navContainer.style.boxShadow = 'none';
        }
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.nav-container').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== SCROLL SPY =====
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
}

// ===== FEATURE TABS =====
function setupFeatureTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-tab') === targetTab) {
                    content.classList.add('active');
                }
            });
            
            currentActiveTab = targetTab;
            
            // Stop any existing animations for all tabs
            stopAllTypingAnimations();
            
            // Add entrance animation
            const activeContent = document.querySelector(`.tab-content[data-tab="${targetTab}"]`);
            if (activeContent) {
                activeContent.style.animation = 'none';
                setTimeout(() => {
                    activeContent.style.animation = 'fadeIn 0.5s ease-in-out';
                    // Start typing animation for the active tab
                    if (targetTab === 'chat') {
                        startTypingDemo(`chat-${currentChatMode}`);
                    } else {
                        startTypingDemo(targetTab);
                    }
                }, 100);
            }
        });
    });
    
    // Start typing animation for the initially active tab
    setTimeout(() => {
        if (currentActiveTab === 'tab') {
            startTypingDemo('tab');
        }
    }, 1000);
}

// ===== CHAT MODES =====
function setupChatModes() {
    const modeItems = document.querySelectorAll('.mode-item[data-chat-mode]');
    const currentModeDisplay = document.getElementById('current-chat-mode');
    
    if (!modeItems.length) return;

    modeItems.forEach(item => {
        item.addEventListener('click', () => {
            const mode = item.getAttribute('data-chat-mode');
            switchChatMode(mode);
        });
    });
}

function switchChatMode(mode) {
    const modeItems = document.querySelectorAll('.mode-item[data-chat-mode]');
    const currentModeDisplay = document.getElementById('current-chat-mode');
    
    // Update active mode visual state
    modeItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-chat-mode') === mode) {
            item.classList.add('active');
        }
    });
    
    // Update current mode
    currentChatMode = mode;
    
    // Update mode display text
    const modeNames = {
        'agent': 'Agent 모드',
        'ask': 'Ask 모드', 
        'manual': 'Manual 모드'
    };
    
    if (currentModeDisplay) {
        currentModeDisplay.textContent = modeNames[mode] || 'Agent 모드';
    }
    
    // If we're currently on the chat tab, restart the typing animation
    if (currentActiveTab === 'chat') {
        stopAllTypingAnimations();
        setTimeout(() => {
            startTypingDemo(`chat-${mode}`);
        }, 300);
    }
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'white';
            navMenu.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            navMenu.style.padding = '1rem';
            navMenu.style.borderRadius = '0 0 1rem 1rem';
            navToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            navMenu.style.display = 'none';
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            isMenuOpen = false;
            navMenu.style.display = 'none';
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                isMenuOpen = false;
                navMenu.style.display = 'none';
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate cards with delay
                const cards = entry.target.querySelectorAll('.comparison-card, .advanced-card, .practice-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 150);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    // Observe individual cards
    document.querySelectorAll('.comparison-card, .advanced-card, .practice-card').forEach(card => {
        observer.observe(card);
    });
}

// ===== INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for different elements
                if (entry.target.classList.contains('hero-visual')) {
                    animateCodeEditor();
                }
                
                if (entry.target.classList.contains('feature-showcase')) {
                    animateFeatureShowcase(entry.target);
                }
            }
        });
    }, options);
    
    // Observe elements
    document.querySelectorAll('.hero-visual, .feature-showcase, .comparison-card, .advanced-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== CODE EDITOR ANIMATION =====
function animateCodeEditor() {
    const typingLine = document.querySelector('.typing-animation .code');
    if (typingLine) {
        let text = 'function createAwesome() {';
        let index = 0;
        
        typingLine.textContent = '';
        
        function typeCharacter() {
            if (index < text.length) {
                typingLine.textContent += text[index];
                index++;
                setTimeout(typeCharacter, 100);
            }
        }
        
        setTimeout(typeCharacter, 1000);
    }
}

// ===== FEATURE SHOWCASE ANIMATION =====
function animateFeatureShowcase(element) {
    const items = element.querySelectorAll('.highlight-item, .mode-item, .context-item, .mermaid-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateX(0)';
            item.style.opacity = '1';
        }, index * 200);
    });
}

// ===== TYPING ANIMATION =====
function setupTypingAnimation() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-typing');
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        
        let index = 0;
        element.textContent = '';
        
        function type() {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(type, speed);
            }
        }
        
        // Start typing when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(type, 500);
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ===== TYPING DEMO SYSTEM =====
const typingDemoContent = {
    tab: [
        { text: 'def fibonacci(', speed: 80, highlight: false },
        { text: 'n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)', speed: 120, highlight: true },
        { text: '\n\n// JavaScript로 변경해보세요', speed: 60, highlight: false },
        { text: '\nconst users = await fetchUsers();', speed: 100, highlight: false },
        { text: '\nconst activeUsers = users.filter(user => user.isActive);', speed: 100, highlight: false },
        { text: '\nconst userNames = activeUsers.', speed: 80, highlight: false },
        { text: 'map(user => user.name);', speed: 120, highlight: true }
    ],
    'chat-agent': [
        { text: '💬 사용자 인증 시스템을 만들어줘', speed: 80, highlight: false },
        { text: '\nJWT 토큰 사용하고, 로그인/회원가입/로그아웃 기능 필요해', speed: 80, highlight: false },
        { text: '\n\n🤖 Agent 모드 활성화...', speed: 60, highlight: false },
        { text: '\n📋 작업 분석 중...', speed: 80, highlight: false },
        { text: '\n✨ 생성 중: 인증 시스템', speed: 80, highlight: false },
        { text: '\n\n// 1. JWT 미들웨어 생성', speed: 100, highlight: true },
        { text: '\nconst jwt = require(\'jsonwebtoken\');', speed: 120, highlight: true },
        { text: '\n\nconst authMiddleware = (req, res, next) => {', speed: 120, highlight: true },
        { text: '\n  const token = req.header(\'Authorization\');', speed: 120, highlight: true },
        { text: '\n  if (!token) return res.status(401).json({ error: \'No token\' });', speed: 120, highlight: true },
        { text: '\n  // 검증 로직...', speed: 100, highlight: true },
        { text: '\n};', speed: 80, highlight: true },
        { text: '\n\n✅ 인증 시스템 완료!', speed: 60, highlight: false }
    ],
    'chat-ask': [
        { text: '💬 이 코드에서 성능 문제가 있을까요?', speed: 80, highlight: false },
        { text: '\n\n// 현재 코드', speed: 60, highlight: false },
        { text: '\nfunction processUsers(users) {', speed: 100, highlight: false },
        { text: '\n  return users.map(user => {', speed: 100, highlight: false },
        { text: '\n    return fetchUserDetails(user.id);', speed: 100, highlight: false },
        { text: '\n  });', speed: 100, highlight: false },
        { text: '\n}', speed: 100, highlight: false },
        { text: '\n\n🔍 Ask 모드 분석 결과:', speed: 60, highlight: false },
        { text: '\n⚠️ 성능 문제 발견!', speed: 80, highlight: false },
        { text: '\n\n1. N+1 쿼리 문제', speed: 100, highlight: true },
        { text: '\n2. 병렬 처리 없음', speed: 100, highlight: true },
        { text: '\n3. 에러 핸들링 부족', speed: 100, highlight: true },
        { text: '\n\n💡 개선 방안:', speed: 80, highlight: false },
        { text: '\n- Promise.all() 사용', speed: 100, highlight: true },
        { text: '\n- 배치 처리 구현', speed: 100, highlight: true },
        { text: '\n- try/catch 추가', speed: 100, highlight: true }
    ],
    'chat-manual': [
        { text: '💬 React 컴포넌트를 TypeScript로 변환해주세요', speed: 80, highlight: false },
        { text: '\n단계별로 확인하면서 진행하고 싶습니다', speed: 80, highlight: false },
        { text: '\n\n✋ Manual 모드 활성화...', speed: 60, highlight: false },
        { text: '\n📋 1단계: Props 인터페이스 정의', speed: 80, highlight: false },
        { text: '\n\ninterface UserProps {', speed: 100, highlight: true },
        { text: '\n  id: number;', speed: 100, highlight: true },
        { text: '\n  name: string;', speed: 100, highlight: true },
        { text: '\n  email: string;', speed: 100, highlight: true },
        { text: '\n}', speed: 100, highlight: true },
        { text: '\n\n❓ 이 변경사항을 적용하시겠습니까?', speed: 80, highlight: false },
        { text: '\n[✅ 승인] [✏️ 수정] [⏭️ 건너뛰기]', speed: 80, highlight: false },
        { text: '\n\n✅ 승인됨! 다음 단계로...', speed: 80, highlight: false },
        { text: '\n📋 2단계: 컴포넌트 타입 적용', speed: 80, highlight: false },
        { text: '\n\nconst UserCard: React.FC<UserProps> = ({', speed: 100, highlight: true },
        { text: '\n  id, name, email', speed: 100, highlight: true },
        { text: '\n}) => {', speed: 100, highlight: true }
    ],
    chat: [
        { text: '💬 사용자 인증 시스템을 만들어줘', speed: 80, highlight: false },
        { text: '\nJWT 토큰 사용하고, 로그인/회원가입/로그아웃 기능 필요해', speed: 80, highlight: false },
        { text: '\n\n🤖 Agent 모드 활성화...', speed: 60, highlight: false },
        { text: '\n📋 작업 분석 중...', speed: 80, highlight: false },
        { text: '\n✨ 생성 중: 인증 시스템', speed: 80, highlight: false },
        { text: '\n\n// 1. JWT 미들웨어 생성', speed: 100, highlight: true },
        { text: '\nconst jwt = require(\'jsonwebtoken\');', speed: 120, highlight: true },
        { text: '\n\nconst authMiddleware = (req, res, next) => {', speed: 120, highlight: true },
        { text: '\n  const token = req.header(\'Authorization\');', speed: 120, highlight: true },
        { text: '\n  if (!token) return res.status(401).json({ error: \'No token\' });', speed: 120, highlight: true },
        { text: '\n  // 검증 로직...', speed: 100, highlight: true },
        { text: '\n};', speed: 80, highlight: true },
        { text: '\n\n✅ 인증 시스템 완료!', speed: 60, highlight: false }
    ],
    rules: [
        { text: '📝 설정 중: .cursorrules 파일', speed: 80, highlight: false },
        { text: '\n\n# Cursor AI Rules Configuration', speed: 100, highlight: false },
        { text: '\nproject_rules:', speed: 100, highlight: true },
        { text: '\n  language: "TypeScript"', speed: 120, highlight: true },
        { text: '\n  framework: "React"', speed: 120, highlight: true },
        { text: '\n  styling: "styled-components"', speed: 120, highlight: true },
        { text: '\n  naming_convention: "camelCase"', speed: 120, highlight: true },
        { text: '\n\ncode_standards:', speed: 100, highlight: true },
        { text: '\n  - "항상 타입을 명시할 것"', speed: 120, highlight: true },
        { text: '\n  - "함수는 10줄을 넘지 않도록 할 것"', speed: 120, highlight: true },
        { text: '\n  - "컴포넌트는 단일 책임 원칙을 따를 것"', speed: 120, highlight: true },
        { text: '\n\nbest_practices:', speed: 100, highlight: true },
        { text: '\n  - "useCallback, useMemo 적절히 활용"', speed: 120, highlight: true },
        { text: '\n  - "에러 바운더리 구현"', speed: 120, highlight: true },
        { text: '\n\n✅ Rules 적용 완료!', speed: 60, highlight: false },
        { text: '\n🤖 AI가 이제 프로젝트 규칙을 따릅니다', speed: 80, highlight: false }
    ],
    inline: [
        { text: 'function validateEmail(email) {\n    return email.includes(\'@\');\n}', speed: 100, highlight: false, selected: true },
        { text: '\n\n⚡ Cmd+K pressed...', speed: 60, highlight: false },
        { text: '\n🤔 Analyzing code...', speed: 80, highlight: false },
        { text: '\n✨ Generating improvement...', speed: 80, highlight: false },
        { text: '\n\nfunction validateEmail(email) {', speed: 120, highlight: true },
        { text: '\n    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;', speed: 120, highlight: true },
        { text: '\n    return emailRegex.test(email);', speed: 120, highlight: true },
        { text: '\n}', speed: 100, highlight: true }
    ],
    context: [
        { text: '💬 @models/User.js @services/authService.js', speed: 100, highlight: false },
        { text: '\n사용자 권한 확인 함수를 만들어줘', speed: 80, highlight: false },
        { text: '\n\n📁 Loading context files...', speed: 60, highlight: false },
        { text: '\n✅ User.js analyzed', speed: 80, highlight: false },
        { text: '\n✅ authService.js analyzed', speed: 80, highlight: false },
        { text: '\n🧠 Understanding relationships...', speed: 80, highlight: false },
        { text: '\n✨ Generating solution...', speed: 60, highlight: false },
        { text: '\n\nconst checkUserPermission = async (userId, requiredRole) => {', speed: 120, highlight: true },
        { text: '\n  try {', speed: 100, highlight: true },
        { text: '\n    const user = await User.findById(userId);', speed: 120, highlight: true },
        { text: '\n    if (!user) return false;', speed: 100, highlight: true },
        { text: '\n    \n    return authService.hasPermission(user.role, requiredRole);', speed: 120, highlight: true },
        { text: '\n  } catch (error) {', speed: 100, highlight: true },
        { text: '\n    logger.error(\'Permission check failed\', { userId, error });', speed: 120, highlight: true },
        { text: '\n    return false;', speed: 100, highlight: true },
        { text: '\n  }\n};', speed: 80, highlight: true }
    ],
    mcp: [
        { text: '🔧 Configuring MCP Servers...', speed: 80, highlight: false },
        { text: '\n\n{', speed: 60, highlight: false },
        { text: '\n  "mcpServers": {', speed: 100, highlight: true },
        { text: '\n    "github": {', speed: 100, highlight: true },
        { text: '\n      "command": "mcp-server-github",', speed: 120, highlight: true },
        { text: '\n      "args": ["--token", "$GITHUB_TOKEN"]', speed: 120, highlight: true },
        { text: '\n    },', speed: 80, highlight: true },
        { text: '\n    "database": {', speed: 100, highlight: true },
        { text: '\n      "command": "mcp-server-postgres",', speed: 120, highlight: true },
        { text: '\n      "args": ["--connection", "$DB_URL"]', speed: 120, highlight: true },
        { text: '\n    },', speed: 80, highlight: true },
        { text: '\n    "filesystem": {', speed: 100, highlight: true },
        { text: '\n      "command": "mcp-server-filesystem",', speed: 120, highlight: true },
        { text: '\n      "args": ["--root", "./project"]', speed: 120, highlight: true },
        { text: '\n    }', speed: 80, highlight: true },
        { text: '\n  }', speed: 80, highlight: true },
        { text: '\n}', speed: 60, highlight: true },
        { text: '\n\n✅ GitHub connected', speed: 80, highlight: false },
        { text: '\n✅ Database connected', speed: 80, highlight: false },
        { text: '\n✅ Filesystem connected', speed: 80, highlight: false },
        { text: '\n🚀 MCP ready!', speed: 60, highlight: false }
    ],
    mermaid: [
        { text: '📊 Creating authentication flow diagram...', speed: 80, highlight: false },
        { text: '\n\n```mermaid', speed: 100, highlight: false },
        { text: '\nflowchart TD', speed: 120, highlight: true },
        { text: '\n    A[로그인 요청] --> B{이메일 검증}', speed: 120, highlight: true },
        { text: '\n    B -->|유효하지 않음| C[400 Error]', speed: 120, highlight: true },
        { text: '\n    B -->|유효함| D[사용자 조회]', speed: 120, highlight: true },
        { text: '\n    D --> E{사용자 존재?}', speed: 120, highlight: true },
        { text: '\n    E -->|없음| F[401 Error]', speed: 120, highlight: true },
        { text: '\n    E -->|있음| G[비밀번호 검증]', speed: 120, highlight: true },
        { text: '\n    G -->|틀림| H[401 Error]', speed: 120, highlight: true },
        { text: '\n    G -->|맞음| I[JWT 토큰 생성]', speed: 120, highlight: true },
        { text: '\n    I --> J[토큰 반환]', speed: 120, highlight: true },
        { text: '\n```', speed: 100, highlight: false },
        { text: '\n\n🎨 Rendering diagram...', speed: 60, highlight: false },
        { text: '\n✨ Diagram complete!', speed: 80, highlight: false }
    ]
};

function stopAllTypingAnimations() {
    // Clear all existing timeouts
    typingTimeouts.forEach((timeoutId, tabName) => {
        clearTimeout(timeoutId);
    });
    typingTimeouts.clear();
    
    // Mark all animations as inactive
    isTypingActive.clear();
    
    // Clear all code elements
    const allCodeElements = document.querySelectorAll('[id$="-code"]');
    allCodeElements.forEach(element => {
        element.innerHTML = '';
    });
}

function startTypingDemo(tabName) {
    const codeElement = document.getElementById(`${tabName}-code`);
    if (!codeElement || !typingDemoContent[tabName]) return;
    
    // Stop existing animation for this tab
    if (typingTimeouts.has(tabName)) {
        clearTimeout(typingTimeouts.get(tabName));
        typingTimeouts.delete(tabName);
    }
    
    // Mark this animation as active
    isTypingActive.set(tabName, true);
    
    // Clear previous content and set minimum height to prevent jumping
    codeElement.innerHTML = '';
    codeElement.style.minHeight = '200px';
    
    const content = typingDemoContent[tabName];
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    
    function typeNextChar() {
        // Check if this animation should continue
        if (!isTypingActive.get(tabName) || currentActiveTab !== tabName) {
            return;
        }
        
        if (currentLineIndex >= content.length) {
            // Remove cursor and restart after delay
            const existingCursor = codeElement.querySelector('.typing-cursor');
            if (existingCursor) existingCursor.remove();
            
            const restartTimeout = setTimeout(() => {
                if (currentActiveTab === tabName && isTypingActive.get(tabName)) {
                    startTypingDemo(tabName);
                }
            }, 3000);
            
            typingTimeouts.set(tabName, restartTimeout);
            return;
        }
        
        const currentLine = content[currentLineIndex];
        
        if (currentCharIndex >= currentLine.text.length) {
            // Move to next line
            currentLineIndex++;
            currentCharIndex = 0;
            
            const nextLineTimeout = setTimeout(typeNextChar, 100);
            typingTimeouts.set(tabName, nextLineTimeout);
            return;
        }
        
        // Remove existing cursor
        const existingCursor = codeElement.querySelector('.typing-cursor');
        if (existingCursor) existingCursor.remove();
        
        // Add character
        const char = currentLine.text[currentCharIndex];
        
        if (currentCharIndex === 0) {
            // Start of new line - create line element
            const lineElement = document.createElement('span');
            lineElement.setAttribute('data-line', currentLineIndex);
            
            if (currentLine.selected) {
                lineElement.className = 'typing-selected';
                lineElement.textContent = currentLine.text; // Show entire selected text at once
                codeElement.appendChild(lineElement);
                currentCharIndex = currentLine.text.length;
            } else {
                if (currentLine.highlight) {
                    lineElement.className = 'typing-highlight';
                }
                lineElement.textContent = char;
                codeElement.appendChild(lineElement);
                currentCharIndex++;
            }
        } else {
            // Continue current line
            const lineElement = codeElement.querySelector(`[data-line="${currentLineIndex}"]`);
            if (lineElement && !currentLine.selected) {
                lineElement.textContent += char;
                currentCharIndex++;
            }
        }
        
        // Add cursor at the end
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        codeElement.appendChild(cursor);
        
        // Continue typing
        const speed = currentLine.selected ? 500 : currentLine.speed;
        const nextCharTimeout = setTimeout(typeNextChar, speed);
        typingTimeouts.set(tabName, nextCharTimeout);
    }
    
    // Start typing animation
    typeNextChar();
}

// ===== BUTTON INTERACTIONS =====
document.addEventListener('click', (e) => {
    // Primary button click effect
    if (e.target.classList.contains('btn-primary') || e.target.closest('.btn-primary')) {
        const button = e.target.classList.contains('btn-primary') ? e.target : e.target.closest('.btn-primary');
        createRippleEffect(button, e);
    }
    
    // Secondary button click effect
    if (e.target.classList.contains('btn-secondary') || e.target.closest('.btn-secondary')) {
        const button = e.target.classList.contains('btn-secondary') ? e.target : e.target.closest('.btn-secondary');
        createRippleEffect(button, e);
    }
});

function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ===== PARALLAX EFFECT =====
function setupParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// ===== CODE SYNTAX HIGHLIGHTING =====
function setupCodeHighlighting() {
    // Initialize Prism.js for code highlighting
    if (window.Prism) {
        Prism.highlightAll();
    }
    
    // Add copy buttons to code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const wrapper = document.createElement('div');
        wrapper.className = 'code-wrapper';
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = '코드 복사';
        
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                copyButton.style.color = '#2ecc71';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    copyButton.style.color = '';
                }, 2000);
            });
        });
        
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(copyButton);
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let ticking = false;
    
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scroll-dependent functions here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
}

// ===== KEYBOARD SHORTCUTS =====
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape to close mobile menu
        if (e.key === 'Escape' && isMenuOpen) {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            isMenuOpen = false;
            navMenu.style.display = 'none';
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
        
        // Arrow keys for tab navigation
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
            const activeIndex = tabButtons.findIndex(btn => btn.classList.contains('active'));
            
            if (activeIndex !== -1) {
                let nextIndex;
                if (e.key === 'ArrowLeft') {
                    nextIndex = activeIndex > 0 ? activeIndex - 1 : tabButtons.length - 1;
                } else {
                    nextIndex = activeIndex < tabButtons.length - 1 ? activeIndex + 1 : 0;
                }
                
                tabButtons[nextIndex].click();
                tabButtons[nextIndex].focus();
            }
        }
    });
}

// ===== THEME TOGGLE (OPTIONAL) =====
function setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Save preference
        localStorage.setItem('darkTheme', isDark);
    });
    
    // Load saved preference
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// ===== ACCESSIBILITY IMPROVEMENTS =====
function setupAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = '메인 콘텐츠로 건너뛰기';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
    
    // Update ARIA attributes on tab change
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-button')) {
            tabButtons.forEach(btn => {
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });
            e.target.setAttribute('aria-selected', 'true');
            e.target.setAttribute('tabindex', '0');
        }
    });
}

// ===== ERROR HANDLING =====
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        // You could send error reports to analytics here
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
    });
}

// ===== LOAD COMPLETE =====
window.addEventListener('load', () => {
    // Initialize additional features after full load
    setupCodeHighlighting();
    optimizePerformance();
    setupKeyboardShortcuts();
    setupThemeToggle();
    setupAccessibility();
    setupErrorHandling();
    setupParallaxEffect();
    
    // Remove loading state if exists
    document.body.classList.remove('loading');
    
    // Add loaded class for CSS animations
    document.body.classList.add('loaded');
});

// ===== RESIZE HANDLING =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle responsive changes
        const isMobile = window.innerWidth <= 768;
        const cursorFollower = document.querySelector('.cursor-follow');
        
        if (cursorFollower) {
            cursorFollower.style.display = isMobile ? 'none' : 'block';
        }
        
        // Close mobile menu on resize to desktop
        if (!isMobile && isMenuOpen) {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            isMenuOpen = false;
            navMenu.style.display = 'none';
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }, 250);
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        scrollToSection,
        setupFeatureTabs,
        createRippleEffect
    };
}