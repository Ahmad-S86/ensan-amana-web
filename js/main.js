/**
 * AL ENSAN AMANA ASSOCIATION - MAIN JAVASCRIPT
 * Handles Sticky Navigation, Mobile Drawer, Lightbox Modal, Contact Form Validation, and Accessibility.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Copyright Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 3. Mobile Navigation Drawer Controls
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileClose = document.getElementById('mobile-drawer-close');

  function openMobileMenu() {
    if (mobileOverlay) {
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (mobileClose) mobileClose.focus();
    }
  }

  function closeMobileMenu() {
    if (mobileOverlay) {
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (mobileToggle) mobileToggle.focus();
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileMenu();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay && mobileOverlay.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // 4. Activity Gallery Lightbox Modal
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || item.querySelector('.gallery-caption')?.textContent || '';
    if (img) {
      galleryData.push({
        src: img.src,
        alt: img.alt,
        caption: caption
      });

      item.addEventListener('click', () => {
        openLightbox(index);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    }
  });

  function openLightbox(index) {
    if (!lightboxModal || galleryData.length === 0) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentGalleryIndex];
    if (item && lightboxImg && lightboxCaption) {
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightboxCaption.textContent = item.caption;
    }
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextImage();
      if (e.key === 'ArrowLeft') showPrevImage();
    }
  });

  // 5. Client-Side Contact Form Validation
  const contactForm = document.getElementById('contact-form');
  const toastSuccess = document.getElementById('toast-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Inputs
      const nameInput = document.getElementById('full-name');
      const emailInput = document.getElementById('email-address');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      // Helper function to show/hide error
      function checkField(input, condition) {
        const parent = input.closest('.form-group');
        if (!condition) {
          if (parent) parent.classList.add('error');
          isValid = false;
        } else {
          if (parent) parent.classList.remove('error');
        }
      }

      // Validate Full Name
      checkField(nameInput, nameInput.value.trim().length >= 2);

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      checkField(emailInput, emailRegex.test(emailInput.value.trim()));

      // Validate Subject
      checkField(subjectInput, subjectInput.value.trim().length >= 3);

      // Validate Message
      checkField(messageInput, messageInput.value.trim().length >= 10);

      if (isValid) {
        // In demo mode: Display success toast notification
        if (toastSuccess) {
          toastSuccess.classList.add('active');
          toastSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        contactForm.reset();

        // Clear error classes if any remain
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
      }
    });
  }

  // 6. Scroll Fade-in Intersection Observer
  const fadeElements = document.querySelectorAll('.fade-in-element');
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    fadeElements.forEach(el => el.classList.add('visible'));
  }
});
