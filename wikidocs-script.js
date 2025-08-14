// ===== WIKIDOCS SCRIPT =====

// ===== TABLE OF CONTENTS =====
function generateTableOfContents() {
    const toc = document.getElementById('toc-list');
    if (!toc) return;
    
    const headings = document.querySelectorAll('h2, h3');
    let tocHTML = '';
    
    headings.forEach((heading, index) => {
        const level = heading.tagName.toLowerCase();
        const text = heading.textContent;
        const id = `section-${index}`;
        heading.id = id;
        
        tocHTML += `
            <li class="toc-${level}">
                <a href="#${id}" class="toc-link">${text}</a>
            </li>
        `;
    });
    
    toc.innerHTML = tocHTML;
    
    // Add click handlers for smooth scrolling
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== CODE COPY FUNCTIONALITY =====
function setupCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
        copyBtn.title = '코드 복사';
        
        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.color = '#10b981';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.color = '';
                }, 2000);
            });
        });
    });
}

// ===== READING PROGRESS BAR =====
function setupProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ===== CHAT MODE TOGGLE =====
function setupChatModeToggle() {
    console.log('🚀 Setting up chat mode toggle...');
    
    // Get all mode elements
    const modeCards = document.querySelectorAll('.mode-card');
    const exampleTabs = document.querySelectorAll('.example-tab');
    const modeTitle = document.getElementById('current-mode-title');
    
    console.log('Found elements:', {
        modeCards: modeCards.length,
        exampleTabs: exampleTabs.length,
        modeTitle: modeTitle ? 'yes' : 'no'
    });
    
    // Mode data for titles and icons
    const modeData = {
        agent: { icon: 'fas fa-robot', title: 'Agent 모드 실사용 예시' },
        ask: { icon: 'fas fa-search', title: 'Ask 모드 실사용 예시' },
        manual: { icon: 'fas fa-hand-paper', title: 'Manual 모드 실사용 예시' }
    };
    
    // Simple switch function
    function switchMode(mode) {
        console.log(`Switching to mode: ${mode}`);
        
        // Update mode cards
        modeCards.forEach(card => {
            if (card.dataset.mode === mode) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
        
        // Update example tabs
        exampleTabs.forEach(tab => {
            if (tab.dataset.mode === mode) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update title
        if (modeTitle && modeData[mode]) {
            modeTitle.innerHTML = `<i class="${modeData[mode].icon}"></i> ${modeData[mode].title}`;
        }
        
        // Hide all content first
        const allContents = document.querySelectorAll('.mode-example-content');
        allContents.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });
        
        // Show selected content
        const activeContent = document.getElementById(`${mode}-content`);
        if (activeContent) {
            activeContent.style.display = 'block';
            activeContent.classList.add('active');
            console.log(`✅ Showing ${mode} content`);
        } else {
            console.error(`❌ Content not found: ${mode}-content`);
        }
    }
    
    // Add click handlers to mode cards
    modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            if (mode) {
                switchMode(mode);
            }
        });
    });
    
    // Add click handlers to example tabs
    exampleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.mode;
            if (mode) {
                switchMode(mode);
            }
        });
    });
    
    // Initialize with agent mode
    setTimeout(() => {
        switchMode('agent');
    }, 100);
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape to scroll to top
        if (e.key === 'Escape') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            window.print();
        }
        
        // Arrow keys for chat mode navigation
        if (e.target.classList.contains('mode-card') || e.target.classList.contains('example-tab')) {
            const modes = ['agent', 'ask', 'manual'];
            const currentMode = e.target.dataset.mode;
            const currentIndex = modes.indexOf(currentMode);
            
            if (e.key === 'ArrowRight' && currentIndex < modes.length - 1) {
                const nextMode = modes[currentIndex + 1];
                const nextElement = document.querySelector(`[data-mode="${nextMode}"]`);
                if (nextElement) nextElement.click();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                const prevMode = modes[currentIndex - 1];
                const prevElement = document.querySelector(`[data-mode="${prevMode}"]`);
                if (prevElement) prevElement.click();
            }
        }
    });
}

// ===== SCROLL SPY =====
function setupScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('h2, h3');
    
    if (!tocLinks.length || !sections.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = document.querySelector(`[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                tocLinks.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    }, {
        rootMargin: '-20% 0% -80% 0%'
    });
    
    sections.forEach(section => observer.observe(section));
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Wikidocs page loaded');
    
    // Initialize all features
    generateTableOfContents();
    setupCodeCopy();
    setupProgressBar();
    setupChatModeToggle();
    setupKeyboardNavigation();
    setupScrollSpy();
    
    console.log('✅ All features initialized');
});