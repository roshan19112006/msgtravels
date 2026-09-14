/**
 * MSG Travels — Luxury Travel Website Scripts
 * Dynamic interactions, WhatsApp integration, Mobile UX, and UI Polish
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Scroll Effects
  const header = document.querySelector('.site-header');
  const scrollThreshold = 40;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', openDrawer);
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // 3. WhatsApp Booking Form Logic
  const bookingForm = document.getElementById('bookingForm');
  const bookingPhone = '919942928239';

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('custName')?.value.trim() || 'Guest';
      const date = document.getElementById('travelDate')?.value || 'Flexible';
      const vehicle = document.getElementById('vehicleChoice')?.value || 'Maruti Suzuki Dzire (4+1)';
      const passengers = document.getElementById('passengerCount')?.value || '1-4';
      const pickup = document.getElementById('pickupLocation')?.value.trim() || 'Salem';
      const message = document.getElementById('custMessage')?.value.trim();

      // Format date for friendly view if valid
      let formattedDate = date;
      if (date && date !== 'Flexible') {
        try {
          const d = new Date(date);
          formattedDate = d.toLocaleDateString('en-IN', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } catch (err) {
          formattedDate = date;
        }
      }

      let text = `*New Salem ➔ Yercaud Trip Booking Request*\n`;
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `👤 *Name:* ${name}\n`;
      text += `📅 *Travel Date:* ${formattedDate}\n`;
      text += `🚘 *Vehicle Preference:* ${vehicle}\n`;
      text += `👥 *Passengers:* ${passengers} Persons\n`;
      text += `📍 *Pickup Location:* ${pickup}\n`;
      if (message) {
        text += `💬 *Notes / Requests:* ${message}\n`;
      }
      text += `━━━━━━━━━━━━━━━━━━━━━\n`;
      text += `_Please share the trip availability and package fare details._`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${bookingPhone}&text=${encodedText}`;

      // Open in new tab or direct app
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 4. Sightseeing Interactive Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sightCards = document.querySelectorAll('.sightseeing-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      sightCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => other.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 6. Navigation Active State Spy
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 7. Interactive Vehicle Selector & Spotlight Tabs (vehicles.html)
  const vehicleCards = document.querySelectorAll('.vehicle-select-card');
  const vehiclePanels = document.querySelectorAll('.vehicle-detail-panel');
  const vehicleDropdown = document.getElementById('vehicleChoice');

  const activateVehicle = (targetId) => {
    if (!targetId) return;

    // Update Tab Selection States
    vehicleCards.forEach(c => {
      const isTarget = c.getAttribute('data-vehicle-target') === targetId;
      c.classList.toggle('active', isTarget);
      c.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    // Show only target vehicle detail panel
    vehiclePanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
        panel.style.display = 'block';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });

    // Auto-sync booking dropdown if present
    if (vehicleDropdown) {
      if (targetId === 'vehicle-dzire') {
        vehicleDropdown.value = '5 Seater — Maruti Suzuki Dzire (4+1 AC Sedan)';
      } else if (targetId === 'vehicle-innova') {
        vehicleDropdown.value = '7 Seater — Toyota Innova Crysta (6+1 / 7+1 MUV)';
      } else if (targetId === 'vehicle-tempo') {
        vehicleDropdown.value = 'Tempo Traveller (12 - 18 Seater Luxury AC Van)';
      } else if (targetId === 'vehicle-bus') {
        vehicleDropdown.value = 'Tourist Bus / Mini Bus (21 - 35+ Seater Coach)';
      }
    }
  };

  vehicleCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-vehicle-target');
      activateVehicle(targetId);
    });
  });

  // Check URL query param or hash on load to open specific vehicle
  const urlParams = new URLSearchParams(window.location.search);
  const vehicleParam = urlParams.get('vehicle');
  const hashParam = window.location.hash.replace('#', '');
  const selectedVehicle = vehicleParam || (hashParam.startsWith('vehicle-') ? hashParam : null);

  if (selectedVehicle) {
    activateVehicle(selectedVehicle);
  }


  // 8. Vehicle Image Lightbox Modal
  const lightboxModal = document.getElementById('vehicleLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');

  const openLightbox = (src, caption) => {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) {
      lightboxCaption.textContent = caption || 'MSG Travels Fleet';
    }
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
      const caption = trigger.getAttribute('data-caption') || trigger.querySelector('img')?.alt || '';
      if (imgSrc) {
        openLightbox(imgSrc, caption);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', closeLightbox);
  }

  // Keyboard accessibility (ESC to close lightbox)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });
});

