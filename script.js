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

});
