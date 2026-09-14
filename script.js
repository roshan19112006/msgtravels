/**
 * MSG Travels — Luxury Travel Website Scripts
 * Dynamic 3-Slide Hero, Floating Booking Engine, WhatsApp Generator, and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Scroll Effects
  const header = document.querySelector('.site-header, .site-header-floating');
  const scrollThreshold = 40;

  const handleScroll = () => {
    if (!header) return;
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

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 3. Automated 3-Slide Hero Slider with Progress Timer
  const heroBgs = document.querySelectorAll('.hero-slide-bg');
  const heroContents = document.querySelectorAll('.hero-slide-content');
  const sliderBars = document.querySelectorAll('.slider-bar-btn');
  const sliderCounter = document.querySelector('.slider-counter');

  let currentSlide = 0;
  const totalSlides = heroBgs.length || 3;
  let slideInterval = null;
  const slideDuration = 5000; // 5 seconds per slide

  const showSlide = (index) => {
    currentSlide = (index + totalSlides) % totalSlides;

    // Update backgrounds
    heroBgs.forEach((bg, i) => {
      bg.classList.toggle('active', i === currentSlide);
    });

    // Update content blocks
    heroContents.forEach((content, i) => {
      content.classList.toggle('active', i === currentSlide);
    });

    // Update progress bars
    sliderBars.forEach((bar, i) => {
      bar.classList.toggle('active', i === currentSlide);
      const fill = bar.querySelector('.slider-bar-fill');
      if (fill) {
        fill.style.animation = 'none';
        bar.offsetHeight; // trigger reflow
        if (i === currentSlide) {
          fill.style.animation = `slideTimerFill ${slideDuration}ms linear forwards`;
        }
      }
    });

    // Update counter
    if (sliderCounter) {
      sliderCounter.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
    }
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startSlideTimer = () => {
    stopSlideTimer();
    if (totalSlides > 1) {
      slideInterval = setInterval(nextSlide, slideDuration);
    }
  };

  const stopSlideTimer = () => {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  };

  // Click on progress bar to jump to slide
  sliderBars.forEach((bar, idx) => {
    bar.addEventListener('click', () => {
      showSlide(idx);
      startSlideTimer();
    });
  });

  if (heroBgs.length > 0) {
    showSlide(0);
    startSlideTimer();
  }

  // 4. Overlapping Modern Booking Card Logic
  const bookTabs = document.querySelectorAll('.booking-tab-btn');
  const cabItems = document.querySelectorAll('.cab-picker-item');
  const bookForm = document.getElementById('modernBookForm');
  let selectedCab = 'SEDAN (Dzire)';
  let selectedTab = 'Outstation';

  bookTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      bookTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedTab = tab.getAttribute('data-tab') || tab.textContent.trim();

      const fromInput = document.getElementById('bookFrom');
      const toInput = document.getElementById('bookTo');

      if (selectedTab.toLowerCase().includes('yercaud')) {
        if (fromInput) fromInput.value = 'Salem City / Railway Station';
        if (toInput) toInput.value = 'Yercaud Hill Station (Sightseeing)';
      } else if (selectedTab.toLowerCase().includes('airport')) {
        if (fromInput) fromInput.value = 'Salem';
        if (toInput) toInput.value = 'Coimbatore / Bangalore Airport';
      }
    });
  });

  cabItems.forEach(cab => {
    cab.addEventListener('click', () => {
      cabItems.forEach(c => c.classList.remove('active'));
      cab.classList.add('active');
      selectedCab = cab.getAttribute('data-cab') || cab.querySelector('.cab-name-badge')?.textContent.trim() || 'Cab';
    });
  });

  if (bookForm) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName')?.value.trim() || 'Guest';
      const phone = document.getElementById('bookPhone')?.value.trim() || 'Not specified';
      const fromLoc = document.getElementById('bookFrom')?.value.trim() || 'Salem';
      const toLoc = document.getElementById('bookTo')?.value.trim() || 'Yercaud';
      const date = document.getElementById('bookDate')?.value || 'Today / Flexible';
      const time = document.getElementById('bookTime')?.value || 'Flexible';
      const tripType = document.querySelector('input[name="tripType"]:checked')?.value || 'One Way';

      let text = `*New Trip Booking Request — MSG Travels*
`;
      text += `━━━━━━━━━━━━━━━━━━━━━
`;
      text += `🚖 *Service Type:* ${selectedTab} (${tripType})
`;
      text += `🚘 *Selected Cab:* ${selectedCab}
`;
      text += `👤 *Customer Name:* ${name}
`;
      text += `📞 *Phone Number:* ${phone}
`;
      text += `🟢 *From:* ${fromLoc}
`;
      text += `🔴 *To:* ${toLoc}
`;
      text += `📅 *Date:* ${date}  ⏰ *Time:* ${time}
`;
      text += `━━━━━━━━━━━━━━━━━━━━━
`;
      text += `_Please confirm vehicle availability and send the best transparent fare estimate._`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=919942928239&text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // 5. Sightseeing Interactive Filter
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

  // 6. Navigation Active Spy
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 7. Interactive Vehicle Selector (vehicles.html)
  const vehicleCards = document.querySelectorAll('.vehicle-select-card');
  const vehiclePanels = document.querySelectorAll('.vehicle-detail-panel');

  const activateVehicle = (targetId) => {
    if (!targetId) return;

    vehicleCards.forEach(c => {
      const isTarget = c.getAttribute('data-vehicle-target') === targetId;
      c.classList.toggle('active', isTarget);
      c.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    vehiclePanels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
        panel.style.display = 'block';
      } else {
        panel.classList.remove('active');
        panel.style.display = 'none';
      }
    });
  };

  vehicleCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-vehicle-target');
      activateVehicle(targetId);
    });
  });

  // 8. Vehicle Lightbox Modal
  const lightboxModal = document.getElementById('vehicleLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  const openLightbox = (src, caption) => {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption || 'Vehicle Inspection View';
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  lightboxTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-img-src');
      const caption = btn.getAttribute('data-caption');
      openLightbox(src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });
});
