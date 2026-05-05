// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Three.js Hero Background removed in favor of video background

// GSAP Animations
const initAnimations = () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Reveal
    const heroTl = gsap.timeline();
    heroTl.from('.hero-sub', { y: 20, opacity: 0, duration: 1, ease: 'power4.out' })
          .from('.hero-headline', { y: 40, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.8')
          .from('.hero-text', { y: 20, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8')
          .from('.hero-btns', { y: 20, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8');

    // Section Title Reveals
    document.querySelectorAll('.reveal-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Horizontal Pinned Scroll with Dynamic Background Highlight
    const servicesSection = document.querySelector('.services');
    const gridServices = document.querySelector('.grid-services');
    
    if (servicesSection && gridServices) {
        const cards = gsap.utils.toArray('.service-card');
        
        // Setup Services Section for Dynamic Background
        servicesSection.style.position = 'relative';
        servicesSection.style.backgroundColor = 'var(--charcoal)'; // fallback background
        
        // Container for backgrounds
        const bgContainer = document.createElement('div');
        bgContainer.style.position = 'absolute';
        bgContainer.style.inset = '0';
        bgContainer.style.zIndex = '0';
        bgContainer.style.pointerEvents = 'none';
        servicesSection.insertBefore(bgContainer, servicesSection.firstChild);
        
        // Ensure content stays above backgrounds
        const servicesContainer = servicesSection.querySelector('.container');
        if(servicesContainer) {
            servicesContainer.style.position = 'relative';
            servicesContainer.style.zIndex = '2';
        }
        
        // Dark Overlay so text is readable
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.inset = '0';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)'; // Dark overlay
        overlay.style.zIndex = '1';
        bgContainer.appendChild(overlay);

        // 1. Horizontal Scroll Animation
        const scrollTween = gsap.to(gridServices, {
            x: () => -(gridServices.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: servicesSection,
                pin: true,
                scrub: 1,
                // The duration of the pin corresponds to the width of the scrolling content
                end: () => "+=" + (gridServices.scrollWidth - window.innerWidth)
            }
        });

        // 2. Center Highlight & Background Crossfade Animation
        cards.forEach((card) => {
            // Create a specific background image for this card
            const imgSrc = card.querySelector('img').src;
            const bgImg = document.createElement('div');
            bgImg.style.position = 'absolute';
            bgImg.style.inset = '0';
            bgImg.style.backgroundImage = `url(${imgSrc})`;
            bgImg.style.backgroundSize = 'cover';
            bgImg.style.backgroundPosition = 'center';
            bgImg.style.opacity = '0'; 
            bgImg.style.transition = 'opacity 0.6s ease-in-out';
            bgImg.style.zIndex = '0';
            bgContainer.insertBefore(bgImg, overlay); // Behind overlay
            
            // Set initial un-highlighted card state
            gsap.set(card, { scale: 0.85, opacity: 0.4, filter: "brightness(0.5)" });
            
            // Animate to highlighted state when in center
            gsap.to(card, {
                scale: 1.1,
                opacity: 1,
                filter: "brightness(1)",
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: scrollTween,
                    start: "center 65%", // Activates before center
                    end: "center 35%",   // Deactivates after center
                    scrub: 1,
                    onToggle: (self) => {
                        if(self.isActive) {
                            bgImg.style.opacity = '0.4'; // Show background
                            // Also highlight text section if light mode is used
                            servicesSection.style.color = '#fff';
                            const title = servicesSection.querySelector('.section-title');
                            if(title) title.style.color = '#fff';
                        } else {
                            bgImg.style.opacity = '0'; // Hide background
                        }
                    }
                }
            });
        });
    }
    // 3D "Layer Stack" Reveal
    const stackTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.layer-stack-container',
            start: 'top 70%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    stackTl.fromTo('.layer-top', 
        { z: 500, x: -300, opacity: 0 },
        { z: 100, x: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
    .fromTo('.layer-core', 
        { z: 300, x: 300, opacity: 0 },
        { z: 50, x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.7"
    )
    .fromTo('.layer-base', 
        { z: 0, y: 300, opacity: 0 },
        { z: 0, y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        "-=0.7"
    );



    // 3D Flooring Perspective Switcher (Swiper Carousel)
    if(typeof Swiper !== 'undefined') {
        new Swiper('.portfolio-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            coverflowEffect: {
                rotate: 30,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            }
        });
    }

    // Contact Section Entrance Animation
    const contactBox = document.querySelector('.contact-box');
    if (contactBox) {
        gsap.from(contactBox, {
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 80%',
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    }

    // Initialize Product Exploder (Three.js)
    new ProductExploder();
};

// Antigravity-compatible Product Exploder
class ProductExploder {
    constructor() {
        this.container = document.getElementById('canvas-container');
        if (!this.container || typeof THREE === 'undefined') return;

        this.initThree();
        this.createMeshes();
        this.setupLighting();
        this.setupScrollTrigger();
        this.bindEvents();
        
        this.targetCameraY = 4;
        this.currentCameraY = 4;
        
        this.animate();
    }

    initThree() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.04);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(6, 4, 6);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.container.appendChild(this.renderer.domElement);
    }

    createMeshes() {
        this.matGroup = new THREE.Group();
        this.layers = [];
        
        // Attempt to load the user's 3D asset via GLTFLoader
        const loader = new THREE.GLTFLoader();
        loader.load(
            '/static/models/flooring_mat.glb', // Placeholder path for the asset
            (gltf) => {
                const model = gltf.scene;
                this.matGroup.add(model);
                
                // Extract specific meshes based on the user's prompt
                const textureSurface = model.getObjectByName('Texture_Surface');
                const coreSupport = model.getObjectByName('Core_Support');
                const baseLayer = model.getObjectByName('Base_Layer');
                
                if (textureSurface && coreSupport && baseLayer) {
                    this.layers = [
                        { mesh: textureSurface, base: textureSurface.position.y, explodeOffset: 2 },
                        { mesh: coreSupport, base: coreSupport.position.y, explodeOffset: 0 },
                        { mesh: baseLayer, base: baseLayer.position.y, explodeOffset: -2 }
                    ];
                } else {
                    console.warn("GLTF loaded, but required mesh names not found. Ensure meshes are named 'Texture_Surface', 'Core_Support', and 'Base_Layer'.");
                }
            },
            undefined,
            (error) => {
                console.log("No custom GLTF model found, falling back to procedural mock meshes.");
                this.createProceduralFallback();
            }
        );
        
        this.matGroup.position.x = window.innerWidth > 768 ? 2 : 0;
        this.scene.add(this.matGroup);
    }

    createProceduralFallback() {
        // Procedural fallback to ensure the page doesn't break without the GLB
        const baseGeom = new THREE.BoxGeometry(3, 0.2, 3);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
        const baseLayer = new THREE.Mesh(baseGeom, baseMat);
        baseLayer.name = 'Base_Layer';
        baseLayer.position.y = -0.3;
        baseLayer.castShadow = true;
        baseLayer.receiveShadow = true;

        const coreGeom = new THREE.BoxGeometry(2.9, 0.4, 2.9);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 });
        const coreSupport = new THREE.Mesh(coreGeom, coreMat);
        coreSupport.name = 'Core_Support';
        coreSupport.position.y = 0;
        coreSupport.castShadow = true;
        coreSupport.receiveShadow = true;

        const surfaceGeom = new THREE.BoxGeometry(3, 0.1, 3);
        const surfaceMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, wireframe: true });
        const textureSurface = new THREE.Mesh(surfaceGeom, surfaceMat);
        textureSurface.name = 'Texture_Surface';
        textureSurface.position.y = 0.25;
        textureSurface.castShadow = true;

        this.matGroup.add(baseLayer);
        this.matGroup.add(coreSupport);
        this.matGroup.add(textureSurface);
        
        this.layers = [
            { mesh: textureSurface, base: 0.25, explodeOffset: 2 },
            { mesh: coreSupport, base: 0, explodeOffset: 0 },
            { mesh: baseLayer, base: -0.3, explodeOffset: -2 }
        ];
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 5);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        const spotLight = new THREE.SpotLight(0x2e7d32, 2);
        spotLight.position.set(-5, 5, -5);
        spotLight.angle = Math.PI / 4;
        this.scene.add(spotLight);
    }

    setupScrollTrigger() {
        const section = document.querySelector('#solutions-section');
        if (!section) return;

        ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "+=150%",
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                
                this.layers.forEach(layer => {
                    // Spread apart by a factor of 1.5 mapped to scroll progress
                    const targetY = layer.base + (layer.explodeOffset * progress * 1.5);
                    layer.mesh.position.y = targetY;
                });
                
                this.matGroup.rotation.y = progress * Math.PI;
                this.targetCameraY = 4 + (progress * 2); // Lerp target
            }
        });
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.matGroup.position.x = window.innerWidth > 768 ? 2 : 0;
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Smooth lerp for the camera movement
        this.currentCameraY += (this.targetCameraY - this.currentCameraY) * 0.05;
        this.camera.position.y = this.currentCameraY;
        this.camera.lookAt(this.matGroup.position);
        
        if (this.matGroup) {
            this.matGroup.rotation.y += 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                gsap.to(loader, {
                    opacity: 0,
                    duration: 1,
                    onComplete: () => {
                        loader.style.display = 'none';
                        initAnimations();
                    }
                });
            }, 500);
        }
        loaderBar.style.width = progress + '%';
    }, 100);
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
}

// Close menu when clicking links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// Review Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const openReviewBtn = document.getElementById('openReviewModal');
    const closeReviewBtn = document.getElementById('closeReviewModal');
    const reviewModal = document.getElementById('reviewModal');
    const starSelects = document.querySelectorAll('.star-select');
    const ratingInput = document.getElementById('selectedRating');
    const reviewForm = document.getElementById('submitReviewForm');

    if(openReviewBtn && reviewModal) {
        openReviewBtn.addEventListener('click', () => {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeReviewBtn.addEventListener('click', () => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close on outside click
        reviewModal.addEventListener('click', (e) => {
            if(e.target === reviewModal) {
                reviewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Star Rating Logic
    starSelects.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            // Update UI
            starSelects.forEach(s => {
                if(s.getAttribute('data-rating') <= rating) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                    s.style.fontWeight = '900';
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                    s.style.fontWeight = '400';
                }
            });
        });
    });

    if(reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if(!ratingInput.value) {
                alert("Please select a star rating!");
                return;
            }
            
            const reviewProduct = document.getElementById('reviewProduct').value;
            const reviewName = document.getElementById('reviewName').value;
            const reviewCompany = document.getElementById('reviewCompany').value || "Verified Customer";
            const reviewText = document.getElementById('reviewText').value;
            const rating = parseInt(ratingInput.value);

            let starsHtml = '';
            for(let i = 1; i <= 5; i++) {
                if(i <= rating) {
                    starsHtml += '<i class="fas fa-star"></i>';
                } else {
                    starsHtml += '<i class="far fa-star"></i>';
                }
            }

            // Get initials
            const initials = reviewName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'SB';

            const reviewHtml = `
            <div class="review-card" style="background: var(--charcoal-light); padding: 2.5rem; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); position: relative; animation: fadeUp 0.5s ease forwards;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                    <div class="stars" style="color: #FFD700; font-size: 1.1rem;">
                        ${starsHtml}
                    </div>
                    <span style="font-size: 0.75rem; background: rgba(46, 125, 50, 0.2); color: var(--green-bright); padding: 5px 10px; border-radius: 20px;">${reviewProduct}</span>
                </div>
                <p style="font-size: 1.1rem; font-style: italic; margin-bottom: 2rem; color: #ddd; line-height: 1.6;">"${reviewText}"</p>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 45px; height: 45px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem;">${initials}</div>
                    <div>
                        <div style="font-weight: 700; color: var(--white);">${reviewName}</div>
                        <div style="font-size: 0.8rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px;">${reviewCompany}</div>
                    </div>
                </div>
            </div>`;

            const reviewsGrid = document.querySelector('.reviews-grid');
            if(reviewsGrid) {
                reviewsGrid.insertAdjacentHTML('afterbegin', reviewHtml);
            }

            alert("Thank you for your review! It has been published successfully.");
            reviewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            reviewForm.reset();
            
            // Reset stars
            starSelects.forEach(s => {
                s.classList.remove('fas');
                s.classList.add('far');
                s.style.fontWeight = '400';
            });
            ratingInput.value = '';
        });
    }
});

// AI Assistant Widget Logic
document.addEventListener('DOMContentLoaded', () => {
    const triggerBtn = document.getElementById('aiTriggerBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiCloseBtn');
    const sendBtn = document.getElementById('aiSendBtn');
    const inputField = document.getElementById('aiInput');
    const chatBody = document.getElementById('aiChatBody');

    if (!triggerBtn || !chatWindow) return;

    // Toggle Chat Window
    triggerBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            inputField.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });

    // Handle Messages
    const sendMessage = () => {
        const text = inputField.value.trim();
        if (!text) return;

        // User Message
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message ai-sent';
        userMsg.style.alignSelf = 'flex-end';
        userMsg.style.background = 'var(--green-bright)';
        userMsg.style.color = 'white';
        userMsg.style.padding = '15px';
        userMsg.style.borderRadius = '15px 0 15px 15px';
        userMsg.style.marginBottom = '15px';
        userMsg.style.maxWidth = '85%';
        userMsg.innerText = text;
        
        chatBody.appendChild(userMsg);
        inputField.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // Show typing indicator
        const aiMsgContainer = document.createElement('div');
        aiMsgContainer.className = 'ai-message ai-received';
        
        const aiAvatar = document.createElement('div');
        aiAvatar.className = 'ai-avatar';
        aiAvatar.innerHTML = '<i class="fas fa-robot"></i>';
        
        const aiBubble = document.createElement('div');
        aiBubble.className = 'ai-bubble';
        aiBubble.innerHTML = '<i class="fas fa-ellipsis-h fa-fade"></i> Thinking...';
        
        aiMsgContainer.appendChild(aiAvatar);
        aiMsgContainer.appendChild(aiBubble);
        
        chatBody.appendChild(aiMsgContainer);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Fetch Response from Django Backend
        fetch('/ai-chat/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: text })
        })
        .then(response => response.json())
        .then(data => {
            aiBubble.innerHTML = data.reply;
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            aiBubble.innerHTML = "Sorry, my systems are currently offline. Please try again later!";
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    };

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});


