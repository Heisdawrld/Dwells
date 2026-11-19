(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const STORAGE = 'dwell-stay-v3';
  const defaults = () => ({ checkin: '', checkout: '', guests: '2', name: '', notes: '' });
  let draft = null, saved = false, storageWorks = true, clearedDraft = null;
  try {
    const data = JSON.parse(sessionStorage.getItem(STORAGE) || 'null');
    saved = data?.saved === true;
    if (data?.draft && typeof data.draft === 'object') {
      draft = defaults();
      for (const key of Object.keys(draft)) if (typeof data.draft[key] === 'string') draft[key] = data.draft[key].slice(0, key === 'notes' ? 700 : 80);
    }
  } catch { storageWorks = false; }
  const form = $('#enquiry'), booking = $('#booking'), detail = $('#detail-screen');
  const checkin = $('#checkin'), checkout = $('#checkout'), guestInput = $('#guests');
  let currentScreen = 'explore', returnScreen = 'explore', step = 0, enquiryText = '';
  let slideIndex = 0, photoIndex = 0, toastTimer;
  const photos = [
    ['assets/1-hotel-miami-beach-may-2015-41-1920.jpg', 'Interior inspiration · sample photo'],
    ['assets/canopy-bed-of-khan-pool-suite-in-amantaka-luxury-resort-hote-1920.jpg', 'Bedroom inspiration · sample photo'],
    ['assets/lobby-lounge-of-amantaka-suite-amantaka-luxury-resort-hotel--1920.jpg', 'Living inspiration · sample photo']
  ];

  function localDate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function today() { return localDate(new Date()); }
  function isDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const d = new Date(value + 'T12:00:00');
    return !isNaN(d) && localDate(d) === value;
  }
  function nights(d) { return isDate(d?.checkin) && isDate(d?.checkout) ? Math.round((Date.parse(d.checkout) - Date.parse(d.checkin)) / 86400000) : 0; }
  function validStay(d) { return d && isDate(d.checkin) && isDate(d.checkout) && d.checkin >= today() && nights(d) > 0 && Number.isSafeInteger(Number(d.guests)) && Number(d.guests) >= 1; }
  function complete(d) { return validStay(d) && !!d.name.trim(); }
  function pretty(date) { return isDate(date) ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date + 'T12:00:00')) : 'Choose a date'; }
  function nightLabel(d) { const n = nights(d); return n > 0 ? `${n} night${n === 1 ? '' : 's'}` : 'Dates to be completed'; }
  function notify(message) { const t = $('#toast'); t.textContent = message; t.style.display = 'block'; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.style.display = 'none', 3000); }

  function persist() {
    try { sessionStorage.setItem(STORAGE, JSON.stringify({ saved, draft })); storageWorks = true; }
    catch { storageWorks = false; }
    renderState();
  }
  function captureDraft() {
    draft = Object.fromEntries(Object.keys(defaults()).map(key => [key, form.elements[key].value]));
    persist();
  }
  function fillForm() { const data = draft || defaults(); for (const key of Object.keys(data)) form.elements[key].value = data[key]; updateDateSummary(); }
  function renderState() {
    $('#save').setAttribute('aria-pressed', String(saved));
    $('#save').setAttribute('aria-label', saved ? 'Remove saved apartment' : 'Save apartment');
    $('#saved-empty').hidden = saved;
    $('#saved-card').hidden = !saved;
    $('#enquiry-empty').hidden = !!draft;
    $('#enquiry-draft').hidden = !draft;
    $('.draft-dot').hidden = !draft;
    if (draft) {
      $('#draft-in').textContent = pretty(draft.checkin);
      $('#draft-out').textContent = pretty(draft.checkout);
      $('#draft-nights').textContent = nightLabel(draft);
      $('#draft-guests').textContent = `${draft.guests || '—'} guest${draft.guests === '1' ? '' : 's'} requested`;
      $('#draft-name').textContent = draft.name.trim() ? `Prepared for ${draft.name.trim()}` : 'Add your name to complete your enquiry.';
      $('#resume-enquiry').textContent = complete(draft) ? 'Review & share enquiry' : 'Continue enquiry';
      $('.draft-disclosure').textContent = `${storageWorks ? 'Saved in this browser tab.' : 'Saved for this visit only; reloading may clear it.'} This is not a reservation, and the website has not sent a message.`;
    }
    const ready = validStay(draft);
    $('#plan-prompt').textContent = ready ? `${pretty(draft.checkin)} – ${pretty(draft.checkout)}` : 'When would you like to stay?';
    $('#plan-caption').textContent = ready ? `${nightLabel(draft)} · ${draft.guests} guest${draft.guests === '1' ? '' : 's'} · Edit your plans` : 'Choose dates & guests · Enquire directly';
    $('.date-action').textContent = ready ? 'Edit dates' : 'Plan a stay';
  }

  function navigate(view) {
    if (location.hash === '#' + view) renderRoute();
    else location.hash = view;
  }
  function renderRoute() {
    const view = location.hash.slice(1);
    const showDetail = view === 'apartment';
    currentScreen = ['explore', 'saved', 'enquiry', 'contact'].includes(view) ? view : (showDetail ? returnScreen : 'explore');
    detail.hidden = !showDetail;
    ['explore', 'saved', 'enquiry', 'contact'].forEach(n => { const el = $(`#${n}-screen`); el.hidden = n !== currentScreen; el.inert = showDetail; });
    $('.app-header').inert = showDetail;
    $('.bottom-nav').inert = showDetail;
    $$('.bottom-nav>button').forEach(b => {
      const active = b.hasAttribute('data-' + currentScreen);
      b.classList.toggle('active', active);
      if (active) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    document.title = showDetail ? 'The Yaba apartment — Dwell' : ({ explore: 'Explore', saved: 'Saved', enquiry: 'My enquiry', contact: 'Contact' }[currentScreen] + ' — Dwell');
    if (showDetail) {
      detail.scrollTop = 0; $('.detail-body').scrollTop = 0;
      $('#detail-back').focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0 });
      const heading = $(`#${currentScreen}-screen h1`);
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
    }
    renderState();
  }
  function openDetail(section) {
    if (location.hash !== '#apartment') returnScreen = currentScreen;
    navigate('apartment');
    if (section === 'amenities' || section === 'location') requestAnimationFrame(() => requestAnimationFrame(() => {
      $(section === 'amenities' ? '#amenity-section' : '#detail-location').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }));
  }
  window.addEventListener('hashchange', renderRoute);
  ['explore', 'saved', 'enquiry', 'contact'].forEach(view => $$(`[data-${view}]`).forEach(b => b.addEventListener('click', () => navigate(view))));
  $('.brand').onclick = e => { e.preventDefault(); navigate('explore'); };
  $$('[data-detail]').forEach(b => b.onclick = () => openDetail(b.dataset.detail));
  $('#detail-back').onclick = () => navigate(returnScreen);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('dialog[open]') && !detail.hidden) navigate(returnScreen); });
  $('#save').onclick = () => { saved = !saved; persist(); notify(saved ? 'Apartment saved in this tab.' : 'Apartment removed from saved.'); };

  function updateDateSummary() {
    checkin.min = today(); checkout.min = today();
    checkin.setCustomValidity(''); checkout.setCustomValidity('');
    if (isDate(checkin.value)) { const next = new Date(checkin.value + 'T12:00:00'); next.setDate(next.getDate() + 1); checkout.min = localDate(next); }
    if (checkin.value && checkin.value < today()) checkin.setCustomValidity('Choose today or a future check-in date.');
    if (checkin.value && checkout.value && checkout.value <= checkin.value) checkout.setCustomValidity('Check-out must be after check-in.');
    const n = nights({ checkin: checkin.value, checkout: checkout.value });
    $('#night-summary').textContent = n > 0 ? `${n} night${n === 1 ? '' : 's'} to make yourself at home.` : 'Choose your preferred dates.';
    $('#guest-minus').disabled = Number(guestInput.value) <= 1;
  }
  function validateStep(index) {
    updateDateSummary();
    const fields = index === 0 ? [checkin, checkout, guestInput] : [form.elements.name];
    if (index === 1) form.elements.name.setCustomValidity(form.elements.name.value.trim() ? '' : 'Please enter your name.');
    if (index === 0) guestInput.setCustomValidity(Number.isSafeInteger(Number(guestInput.value)) && Number(guestInput.value) >= 1 ? '' : 'Enter a whole number of guests, starting from 1.');
    for (const field of fields) if (!field.reportValidity()) return false;
    return true;
  }
  function setStep(next, focus = true) {
    step = next;
    form.hidden = next === 2;
    $$('[data-step]').forEach(el => el.hidden = Number(el.dataset.step) !== next);
    $$('[data-step-indicator]').forEach(el => {
      const n = Number(el.dataset.stepIndicator); el.classList.toggle('active', n === next); el.classList.toggle('done', n < next);
      if (n === next) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    if (next === 2) buildReview();
    $('#planner-status').textContent = draft ? (storageWorks ? 'Draft saved in this tab.' : 'Draft kept for this visit only.') : '';
    booking.scrollTop = 0;
    if (focus) { const h = $(`[data-step="${next}"] h3`); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  function openPlanner(preferred = 0) {
    fillForm();
    let next = preferred;
    if (!validStay(draft)) next = 0;
    else if (next === 2 && !complete(draft)) next = 1;
    if (!booking.open) booking.showModal();
    setStep(next);
  }
  $$('[data-book]').forEach(b => b.onclick = () => openPlanner(0));
  $('#resume-enquiry').onclick = () => openPlanner(complete(draft) ? 2 : validStay(draft) ? 1 : 0);
  $('#edit-draft-dates').onclick = () => openPlanner(0);
  form.addEventListener('input', e => { e.target.setCustomValidity?.(''); updateDateSummary(); captureDraft(); $('#planner-status').textContent = storageWorks ? 'Draft saved in this tab.' : 'Draft kept for this visit only.'; });
  form.addEventListener('change', () => { updateDateSummary(); captureDraft(); });
  $('#guest-minus').onclick = () => { guestInput.value = String(Math.max(1, (Number(guestInput.value) || 1) - 1)); updateDateSummary(); captureDraft(); };
  $('#guest-plus').onclick = () => { const n = Number(guestInput.value) || 1; if (Number.isSafeInteger(n) && n < Number.MAX_SAFE_INTEGER) guestInput.value = String(n + 1); updateDateSummary(); captureDraft(); };
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateStep(step)) return;
    if (step === 1 && !validateStep(0)) { setStep(0); return; }
    captureDraft();
    setStep(step + 1);
  });
  $$('[data-back-step]').forEach(b => b.onclick = () => setStep(Math.max(0, step - 1)));
  $('#edit').onclick = () => setStep(0);
  function buildReview() {
    const d = draft;
    $('#review-dates').textContent = `${pretty(d.checkin)} – ${pretty(d.checkout)} · ${nightLabel(d)}`;
    $('#review-guests').textContent = `${d.guests} requested · capacity to be confirmed`;
    $('#review-name').textContent = d.name.trim();
    $('#review-notes-row').hidden = !d.notes.trim();
    $('#review-notes').textContent = d.notes.trim();
    enquiryText = `Hello Dwell Spaces Hospitality,\n\nMy name is ${d.name.trim()}. I'd like to enquire about your two-bedroom apartment at 16 Morroco Road, Yaba, Lagos.\n\nCheck-in: ${pretty(d.checkin)}\nCheck-out: ${pretty(d.checkout)}\nLength of stay: ${nightLabel(d)}\nGuests: ${d.guests}\n${d.notes.trim() ? '\nSpecial requests: ' + d.notes.trim() + '\n' : ''}\nPlease confirm availability, guest capacity, the total price including any fees or deposit, and booking/cancellation terms. Thank you.`;
    $('#message').textContent = enquiryText;
    $('#whatsapp').href = 'https://wa.me/2348163899175?text=' + encodeURIComponent(enquiryText);
    $('#copy-status').textContent = '';
  }
  $('#finish-later').onclick = () => { booking.close(); navigate('enquiry'); notify('Your enquiry draft is ready when you are.'); };
  $('#whatsapp').addEventListener('click', e => {
    if (!complete(draft)) { e.preventDefault(); setStep(0); notify('Please review your dates before continuing.'); return; }
    $('#planner-status').textContent = 'Send your message in WhatsApp. Your draft remains here; no booking is confirmed.';
  });
  $('#copy').onclick = async () => {
    try { await navigator.clipboard.writeText(enquiryText); $('#copy-status').textContent = 'Message copied.'; }
    catch { $('#copy-status').textContent = 'Copy is unavailable here. Select and copy the message above.'; }
  };
  $('#clear-draft').onclick = () => {
    clearedDraft = draft; draft = null; persist(); form.reset(); $('#undo-clear').hidden = false;
    $('#enquiry-empty').append($('#undo-clear')); notify('Draft cleared. You can restore it below.');
  };
  $('#undo-clear').onclick = () => { if (clearedDraft) { draft = clearedDraft; clearedDraft = null; persist(); $('#undo-clear').hidden = true; notify('Draft restored.'); } };
  $$('[data-close]').forEach(b => b.onclick = () => b.closest('dialog').close());
  $$('dialog').forEach(d => d.addEventListener('click', e => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  }));

  function showPhoto() {
    const [src, caption] = photos[photoIndex]; $('#gallery-image').src = src; $('#gallery-image').alt = caption;
    $('#gallery-caption').textContent = `${photoIndex + 1} / ${photos.length} — ${caption}`;
  }
  $$('[data-gallery]').forEach(b => b.onclick = () => { photoIndex = Number(b.dataset.gallery); showPhoto(); $('#gallery').showModal(); });
  $('#prev').onclick = () => { photoIndex = (photoIndex + photos.length - 1) % photos.length; showPhoto(); };
  $('#next').onclick = () => { photoIndex = (photoIndex + 1) % photos.length; showPhoto(); };
  $('#gallery').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') $('#prev').click(); if (e.key === 'ArrowRight') $('#next').click(); });
  function setSlide(n) {
    slideIndex = (n + photos.length) % photos.length;
    $('#featured-img').src = photos[slideIndex][0]; $('#featured-img').alt = photos[slideIndex][1];
    $('#detail-image').src = photos[slideIndex][0]; $('#detail-image').alt = photos[slideIndex][1];
    $$('[data-slide]').forEach(b => { const active = Number(b.dataset.slide) === slideIndex; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    $$('[data-category]').forEach(b => { const active = Number(b.dataset.category) === slideIndex; b.classList.toggle('selected', active); b.setAttribute('aria-pressed', String(active)); });
  }
  $$('[data-slide]').forEach(b => b.onclick = () => setSlide(Number(b.dataset.slide)));
  $$('[data-category]').forEach(b => b.onclick = () => setSlide(Number(b.dataset.category)));
  $('#slide-prev').onclick = () => setSlide(slideIndex - 1); $('#slide-next').onclick = () => setSlide(slideIndex + 1);
  let startX = 0, startY = 0, swipeTime = 0;
  const card = $('.featured-card');
  card.addEventListener('touchstart', e => { startX = e.changedTouches[0].clientX; startY = e.changedTouches[0].clientY; }, { passive: true });
  card.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swipeTime = Date.now(); setSlide(slideIndex + (dx < 0 ? 1 : -1)); } }, { passive: true });
  card.addEventListener('click', e => { if (Date.now() - swipeTime < 350) { e.stopPropagation(); e.preventDefault(); } }, true);
  $('#show-amenities').setAttribute('aria-expanded', 'false');
  $('#show-amenities').onclick = function () { const all = $('#all-amenities'); all.hidden = !all.hidden; this.textContent = all.hidden ? 'Show all 14 amenities' : 'Show fewer amenities'; this.setAttribute('aria-expanded', String(!all.hidden)); };
  setSlide(0); renderRoute();
})();
