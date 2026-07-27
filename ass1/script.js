/* =========================================================
   NETFLIX CLONE — script.js
   Vanilla JS, no dependencies, no external storage.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- small helpers ---------- */

  const qs = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- toast ---------- */

  const toastEl = qs('#toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ---------- navbar: solid background after scrolling ---------- */

  const navbar = qs('#navbar');

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu toggle ---------- */

  const menuToggle = qs('#menuToggle');
  const navLinks = qs('#navLinks');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------- search box ---------- */

  const searchWrap = qs('#searchWrap');
  const searchToggle = qs('#searchToggle');
  const searchInput = qs('#searchInput');

  searchToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = searchWrap.classList.toggle('open');
    if (isOpen) {
      searchInput.focus();
    } else {
      searchInput.value = '';
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim()) {
      showToast('Searching for "' + searchInput.value.trim() + '"…');
    }
  });

  /* ---------- notification bell ---------- */

  const bellBtn = qs('#bellBtn');

  bellBtn.addEventListener('click', () => {
    const dot = qs('.notif-dot', bellBtn);
    if (dot) dot.style.display = 'none';
    showToast("You're all caught up");
  });

  /* ---------- profile dropdown ---------- */

  const profileToggle = qs('#profileToggle');

  profileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    profileToggle.classList.toggle('open');
  });

  /* ---------- close open UI bits when clicking elsewhere / Escape ---------- */

  document.addEventListener('click', () => {
    profileToggle.classList.remove('open');
    if (searchWrap.classList.contains('open') && !searchInput.value) {
      searchWrap.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      profileToggle.classList.remove('open');
      searchWrap.classList.remove('open');
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      closeModal();
    }
  });

  /* ---------- hero mute toggle ---------- */

  const muteBtn = qs('#muteBtn');
  const muteIcon = qs('#muteIcon');
  let muted = true;

  const iconMuted = '<path d="M16.5 12A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM3 9v6h4l5 5V4L7 9H3zm14.14-2.34l-1.42 1.42A7.97 7.97 0 0 1 18 12c0 1.86-.76 3.54-1.98 4.75l1.42 1.42A9.97 9.97 0 0 0 20 12c0-2.42-.98-4.61-2.86-6.34z"/>';
  const iconUnmuted = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4z"/>';

  muteBtn.addEventListener('click', () => {
    muted = !muted;
    muteIcon.innerHTML = muted ? iconMuted : iconUnmuted;
    muteBtn.setAttribute('aria-pressed', String(!muted));
  });

  /* ---------- hero Play / More Info ---------- */

  const heroPlayBtn = qs('#heroPlayBtn');
  const heroInfoBtn = qs('#heroInfoBtn');
  const heroImgSrc = qs('.hero-bg img').getAttribute('src');

  heroPlayBtn.addEventListener('click', () => {
    showToast('Playing "Shadow Frontier"…');
  });

  heroInfoBtn.addEventListener('click', () => {
    openModal({
      title: heroInfoBtn.dataset.title,
      desc: heroInfoBtn.dataset.desc,
      meta: heroInfoBtn.dataset.meta,
      img: heroImgSrc
    });
  });

  /* ---------- row prev/next arrows (built dynamically for every row) ---------- */

  const prevIcon = '<svg viewBox="0 0 24 24"><path d="M15.4 7.4L14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg>';
  const nextIcon = '<svg viewBox="0 0 24 24"><path d="M8.6 16.6L10 18l6-6-6-6-1.4 1.4L13.2 12z"/></svg>';

  qsa('.row').forEach((row) => {
    const track = qs('.row-track', row);
    if (!track) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = 'row-arrow prev';
    prevBtn.setAttribute('aria-label', 'Scroll left');
    prevBtn.innerHTML = prevIcon;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'row-arrow next';
    nextBtn.setAttribute('aria-label', 'Scroll right');
    nextBtn.innerHTML = nextIcon;

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth * 0.9, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth * 0.9, behavior: 'smooth' });
    });

    row.appendChild(prevBtn);
    row.appendChild(nextBtn);
  });

  /* ---------- cards: play / add to list / like / info / open modal ---------- */

  qsa('.card').forEach((card) => {
    const img = qs('img', card);
    const addBtn = qs('.add-list', card);
    const likeBtn = qs('.like-btn', card);
    const playBtn = qs('.play-mini', card);
    const infoBtn = qs('.more-info', card);

    function openThisModal() {
      openModal({
        title: card.dataset.title,
        desc: card.dataset.desc,
        meta: card.dataset.meta,
        img: img ? img.getAttribute('src') : ''
      });
    }

    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowActive = addBtn.classList.toggle('active');
        showToast(nowActive
          ? '"' + card.dataset.title + '" added to My List'
          : '"' + card.dataset.title + '" removed from My List');
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowActive = likeBtn.classList.toggle('active');
        showToast(nowActive ? 'Thanks for the feedback!' : 'Feedback removed');
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showToast('Playing "' + card.dataset.title + '"…');
      });
    }

    if (infoBtn) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openThisModal();
      });
    }

    card.addEventListener('click', openThisModal);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openThisModal();
      }
    });
  });

  /* ---------- modal ---------- */

  const modalOverlay = qs('#modalOverlay');
  const modalImg = qs('#modalImg');
  const modalTitle = qs('#modalTitle');
  const modalMeta = qs('#modalMeta');
  const modalDesc = qs('#modalDesc');
  const modalClose = qs('#modalClose');
  const modalPlayBtn = qs('#modalPlayBtn');
  const modalAddBtn = qs('#modalAddBtn');
  const modalLikeBtn = qs('#modalLikeBtn');

  function openModal({ title, desc, meta, img }) {
    modalImg.setAttribute('src', img || '');
    modalImg.setAttribute('alt', title || '');
    modalTitle.textContent = title || '';
    modalMeta.textContent = meta || '';
    modalDesc.textContent = desc || '';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  modalPlayBtn.addEventListener('click', () => {
    showToast('Playing "' + modalTitle.textContent + '"…');
  });

  modalAddBtn.addEventListener('click', () => {
    const nowActive = modalAddBtn.classList.toggle('active');
    modalAddBtn.querySelector('svg').style.fill = nowActive ? '#46d369' : '';
    showToast(nowActive ? 'Added to My List' : 'Removed from My List');
  });

  modalLikeBtn.addEventListener('click', () => {
    const nowActive = modalLikeBtn.classList.toggle('active');
    modalLikeBtn.querySelector('svg').style.fill = nowActive ? '#e50914' : '';
    showToast(nowActive ? 'Thanks for the feedback!' : 'Feedback removed');
  });

})();