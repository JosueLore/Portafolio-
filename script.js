/**
 * main script.js for Portfolio
 * Handling Intersections, UI Modals, and API form sumbissions.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       SCROLL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        observer.observe(section);
    });

    /* ==========================================================================
       IMAGE MODAL EXPANSION
       ========================================================================== */
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("expandedImg");
    const closeBtn = document.querySelector(".close-modal");
    const galleryImages = document.querySelectorAll(".project-card img");

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = "block";
            modalImg.src = img.src;
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Close on X button
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Restore scroll
    });

    // Close on click outside image
    modal.addEventListener('click', (e) => {
        if (e.target !== modalImg) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto';
        }
    });

    /* ==========================================================================
       SUPABASE CONTACT FORM INTEGRATION
       ========================================================================== */
    // User needs to update these with their actual Supabase project URL and anon Key
    const SUPABASE_URL = 'https://vvlvdymnpwormrfunzfg.supabase.co'; 
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bHZkeW1ucHdvcm1yZnVuemZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NzUxOTgsImV4cCI6MjA5MDE1MTE5OH0.WmVBSpwEHXZbjz9in3f9e2j_IvW4VQ33xJW9sMDGTwg';

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                showStatus('Por favor, completa todos los campos.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            try {
                // Post request to Supabase REST endpoint
                // Expecting a table named 'contacts' with columns: name, email, message
                const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });

                if (response.ok) {
                    showStatus('¡Mensaje enviado con éxito! Me pondré en contacto pronto.', 'success');
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Supabase Error:', errorData);
                    showStatus('Hubo un error al enviar el mensaje. Verifica tu configuración de Supabase.', 'error');
                }
            } catch (error) {
                console.error('Fetch Error:', error);
                
                // Fallback UI indication if user hasn't configured SUPABASE_URL yet
                if (SUPABASE_URL === 'YOUR_SUPABASE_PROJECT_URL') {
                    showStatus('Simulación exitosa: Falta configurar las credenciales reales de Supabase en script.js', 'success');
                } else {
                    showStatus('Error de red. Intenta nuevamente.', 'error');
                }
            } finally {
                submitBtn.textContent = 'Enviar Mensaje';
                submitBtn.disabled = false;
            }
        });
    }

    function showStatus(text, type) {
        formStatus.textContent = text;
        formStatus.style.color = type === 'success' ? '#10b981' : '#ef4444'; // emerald green or red
        formStatus.style.marginTop = '1rem';
        formStatus.style.fontSize = '0.875rem';
        formStatus.style.fontWeight = '500';
    }

    /* ==========================================================================
       GALLERY CAROUSEL NAVIGATION
       ========================================================================== */
    const mainGallery = document.getElementById('main-gallery');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');

    if (mainGallery && galleryPrevBtn && galleryNextBtn) {
        galleryPrevBtn.addEventListener('click', () => {
            const cardWidth = mainGallery.querySelector('.carousel-item').offsetWidth + 24; // var(--space-6) gap
            mainGallery.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        galleryNextBtn.addEventListener('click', () => {
            const cardWidth = mainGallery.querySelector('.carousel-item').offsetWidth + 24;
            mainGallery.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       CINEMATIC VIDEO SHOWCASE INTERACTION (SWAP)
       ========================================================================== */
    const showcaseContainer = document.querySelector('.video-showcase');
    if (showcaseContainer) {
        const showcaseItems = showcaseContainer.querySelectorAll('.showcase-item');
        
        showcaseItems.forEach(item => {
            item.addEventListener('click', () => {
                const currentCenter = showcaseContainer.querySelector('.center');
                
                // Si el video clickeado ya está en el centro, lo ignoramos
                if (item === currentCenter) return;

                // Intercambio estructural usando DOM insertBefore para mantener coherencia en CSS Flexbox
                // 1. Creamos un clon temporal para guardar la posición original
                const tempPlaceholder = document.createElement('div');
                showcaseContainer.insertBefore(tempPlaceholder, item);

                // 2. Movemos el video clickeado a la posición central del DOM
                showcaseContainer.insertBefore(item, currentCenter);
                
                // 3. Movemos el antiguo centro a la posición guardada lateral
                showcaseContainer.insertBefore(currentCenter, tempPlaceholder);
                
                // 4. Borramos la huella temporal
                showcaseContainer.removeChild(tempPlaceholder);

                // Intercambio atómico de Clases CSS para aplicar Vibe Configurations (escalas web y sombras)
                item.classList.remove('side');
                item.classList.add('center');
                
                currentCenter.classList.remove('center');
                currentCenter.classList.add('side');
            });
        });
    }

    /* ==========================================================================
       PARTICLE BACKGROUND SYSTEM
       ========================================================================== */
    function initParticles() {
        const bgContainer = document.getElementById('particles-bg');
        if (!bgContainer) return;

        const particleCount = window.innerWidth < 768 ? 40 : 100; // Menos partículas en móvil
        const particleSize = 4;
        const particleColor = 'rgba(255, 255, 255, 0.2)'; 
        const interactionRadius = 120;

        let mouseX = -1000;
        let mouseY = -1000;

        // Rastreo global del ratón
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Loop de creación
        for (let i = 0; i < particleCount; i++) {
            createParticle(bgContainer, particleSize, particleColor, interactionRadius);
        }

        function createParticle(container, size, color, radius) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.pointerEvents = 'none'; // Evitar bloqueo de UI
            
            // Posición inicial
            particle.style.left = `${Math.random() * window.innerWidth}px`;
            particle.style.top = `${Math.random() * window.innerHeight}px`;
            particle.style.transition = 'transform 0.4s ease-out, left 1.5s linear, top 1.5s linear';

            container.appendChild(particle);

            animateParticle(particle);

            // Interacción: Revisar distancia al ratón constantemente
            setInterval(() => {
                const rect = particle.getBoundingClientRect();
                const pX = rect.left + size / 2;
                const pY = rect.top + size / 2;
                const distance = Math.sqrt(Math.pow(mouseX - pX, 2) + Math.pow(mouseY - pY, 2));

                if (distance < radius) {
                    const angle = Math.atan2(mouseY - pY, mouseX - pX);
                    const force = (radius - distance) / radius;
                    // Repeler (negativo)
                    const moveX = -(Math.cos(angle) * force * radius);
                    const moveY = -(Math.sin(angle) * force * radius);
                    particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.5)`;
                    particle.style.backgroundColor = 'rgba(57, 255, 20, 0.6)'; // Destello Neon Green
                } else {
                    particle.style.transform = 'translate(0, 0) scale(1)';
                    particle.style.backgroundColor = color;
                }
            }, 50);
        }

        function animateParticle(particle) {
            const pX = parseFloat(particle.style.left);
            const pY = parseFloat(particle.style.top);
            
            const randomX = Math.random() * 40 - 20;
            const randomY = Math.random() * 40 - 20;
            
            let newX = pX + randomX;
            let newY = pY + randomY;

            // Envolver a la pantalla
            if(newX > window.innerWidth) newX = 0;
            if(newX < 0) newX = window.innerWidth;
            if(newY > window.innerHeight) newY = 0;
            if(newY < 0) newY = window.innerHeight;

            particle.style.left = `${newX}px`;
            particle.style.top = `${newY}px`;

            setTimeout(() => animateParticle(particle), 1500 + Math.random() * 1000);
        }
    }

    initParticles();

});
