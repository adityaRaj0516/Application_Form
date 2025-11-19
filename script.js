document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initial Load & Fade In (CRITICAL for visibility)
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');

    // 2. Theme Toggle (Light/Dark Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', () => {
        if (htmlElement.getAttribute('data-theme') === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });


    // 3. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));


    // 4. Lazy Loading Images
    const lazyImages = document.querySelectorAll('.project-image img');
    const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('src');
                img.setAttribute('src', src); 
                img.removeAttribute('loading'); 
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.5 }); 

    lazyImages.forEach(img => lazyLoadObserver.observe(img));


    // 5. Subtle Parallax Effect
    const parallaxVisual = document.querySelector('.hero-visual');
    if (parallaxVisual) {
        const strength = parseFloat(parallaxVisual.dataset.parallax);
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            parallaxVisual.style.transform = `translateY(${scrollPosition * strength}px)`;
        });
    }

    
    // 6. Case Study Modal Functionality
    const modal = document.getElementById('projectModal');
    const modalCloseBtn = modal.querySelector('.modal-close');
    const projectLinks = document.querySelectorAll('.project-link');
    const modalBody = modal.querySelector('.modal-body');

    const projectsData = {
        1: {
            title: "Distributed Task Queue System",
            problem: "Migrated a legacy monolith's task handling logic to a fault-tolerant, horizontally scalable microservice to ensure 99.9% job completion despite node failures.",
            solution: "Designed an idempotent API using Java/Spring Boot and PostgreSQL for state management, implementing a Producer-Consumer model via message queues (conceptual).",
            tech: ["Java", "Spring Boot", "PostgreSQL", "Concurrency", "Docker"],
            result: "Reduced average task processing latency by 85% and eliminated task loss under peak load."
        },
        2: {
            title: "Microservice Authentication Layer (JWT)",
            problem: "Centralized security was required across multiple decoupled services, requiring a performant, standards-based solution that didn't introduce latency.",
            solution: "Developed a dedicated Spring Security service for token generation and validation, enforcing security filters at the API Gateway layer (conceptual).",
            tech: ["Spring Security", "JWT", "REST API", "Microservices", "Security"],
            result: "Achieved sub-10ms validation latency and consolidated security policy management into a single, maintainable module."
        },
        3: {
            title: "Modern Design System Portfolio",
            problem: "Needed a clean, high-performance personal site built with best practices and mature UI/UX, avoiding heavy frameworks.",
            solution: "Implemented a custom design system using pure HTML/CSS/JS with a mobile-first approach, optimizing for Lighthouse scores and accessibility.",
            tech: ["HTML5", "CSS3", "JavaScript", "UI/UX", "Performance"],
            result: "Achieved perfect SEO and accessibility scores, demonstrating proficiency in core web technologies and modern design standards."
        }
    };

    const updateModalContent = (id) => {
        const data = projectsData[id];
        if (!data) return;

        const techTagsHtml = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        
        modalBody.innerHTML = `
            <h3 class="modal-title">${data.title}</h3>
            <div class="case-study-content">
                <h4><i class="fas fa-question-circle"></i> Problem Statement</h4>
                <p>${data.problem}</p>
                
                <h4><i class="fas fa-wrench"></i> Solution & Architecture</h4>
                <p>${data.solution}</p>

                <h4><i class="fas fa-code-branch"></i> Tech Stack & Key Decisions</h4>
                <div class="project-tech">${techTagsHtml}</div>

                <h4><i class="fas fa-chart-line"></i> Measurable Result</h4>
                <p class="modal-result">${data.result}</p>
            </div>
        `;
    };

    const toggleModal = (isOpen) => {
        if (isOpen) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = e.target.dataset.project;
            updateModalContent(projectId);
            toggleModal(true);
        });
    });

    modalCloseBtn.addEventListener('click', () => toggleModal(false));

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleModal(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            toggleModal(false);
        }
    });

    // 7. Contact Form Submission (Placeholder)
    const contactForm = document.querySelector('.contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const messageText = 'Thank you for your inquiry! I will respond within 24 hours.';
        formMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${messageText}`;
        formMessage.style.color = 'var(--color-accent)'; 
        formMessage.style.display = 'block';

        contactForm.reset();

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
});s