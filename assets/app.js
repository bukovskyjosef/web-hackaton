const WIDGETS = [
  'widgets/widget-koncerty.html',
  'widgets/widget-video.html',
  'widgets/widget-hudba.html',
  'widgets/widget-clenove.html',
  'widgets/widget-fotka.html',
  'widgets/widget-pozvanky.html',
  'widgets/widget-zpevnik.html',
  'widgets/widget-kontakt.html',
  'widgets/widget-organizatori.html',
];
const CONCERTS = [
  'concerts/koncert-2.html',
  'concerts/koncert-3.html',
  'concerts/koncert-4.html',
  'concerts/koncert-5.html',
];
const MEMBERS = [
  'members/member-pepa.html',
  'members/member-adam.html',
  'members/member-vojta.html',
  'members/member-standa.html',
  'members/member-tom.html',
  'members/member-vojt-ch.html',
];

async function fetchFragment(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Fragment ${path} se nepodařilo načíst (${r.status})`);
  return r.text();
}

async function loadFragments() {
  try {
    // 1. Load widgets in order
    const widgetContainer = document.getElementById('widgets-container');
    const widgetHtmls = await Promise.all(WIDGETS.map(fetchFragment));
    widgetHtmls.forEach(html => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      while (tmp.firstChild) widgetContainer.appendChild(tmp.firstChild);
    });

    // 2. Load concerts and members in parallel
    const [concertHtmls, memberHtmls] = await Promise.all([
      Promise.all(CONCERTS.map(fetchFragment)),
      Promise.all(MEMBERS.map(fetchFragment)),
    ]);

  const concertList = document.getElementById('concert-list');
  concertHtmls.forEach(html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const btn = tmp.querySelector('.concert-button');
    if (btn) concertList.appendChild(btn);
    const tmpl = tmp.querySelector('template');
    if (tmpl) document.body.appendChild(tmpl);
  });

  const memberList = document.getElementById('member-list');
  memberHtmls.forEach(html => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const btn = tmp.querySelector('.member-button');
    if (btn) memberList.appendChild(btn);
    const tmpl = tmp.querySelector('template');
    if (tmpl) document.body.appendChild(tmpl);
  });

    init();
  } catch (err) {
    console.error('Chyba při načítání fragmentů:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadFragments);

// Event delegation for concert/member modal buttons (loaded asynchronously)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-modal-target]');
  if (btn) openConcertModal(btn.dataset.modalTarget, btn);
});

let initDone = false;
function init() {
  if (initDone) return;
  initDone = true;
  // Fade observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade').forEach((el) => observer.observe(el));

  // Nav observer
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -50% 0px' });

  navSections.forEach((section) => navObserver.observe(section));

  // Photo widget init
  const randomPhoto = document.getElementById('random-photo');
  const photoWidgetButton = document.getElementById('photo-widget-button');
  const photoPaths = Array.from({ length: 10 }, (_, index) => `/photos/${index + 1}.jpg`);
  let currentPhotoIndex = -1;

  function showRandomPhoto() {
    if (!randomPhoto || !photoPaths.length) return;

    let nextIndex = currentPhotoIndex;
    if (photoPaths.length === 1) {
      nextIndex = 0;
    } else {
      while (nextIndex === currentPhotoIndex) {
        nextIndex = Math.floor(Math.random() * photoPaths.length);
      }
    }

    currentPhotoIndex = nextIndex;
    randomPhoto.src = photoPaths[currentPhotoIndex];
    randomPhoto.alt = `Fotka kapely Hackaton ${currentPhotoIndex + 1}`;
  }

  if (randomPhoto) {
    showRandomPhoto();
  }

  if (photoWidgetButton) {
    photoWidgetButton.addEventListener('click', showRandomPhoto);
  }

  // Concert modal setup (no direct listeners on buttons — handled by event delegation above)
  if (closeButton) closeButton.addEventListener('click', closeConcertModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeConcertModal();
    }
  });

  // Oracle/downloads modal setup
  if (openOracleBtn) openOracleBtn.addEventListener('click', () => openOracle(openOracleBtn));
  if (oracleCard) {
    oracleCard.addEventListener('click', flipOracle);
    oracleCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        flipOracle();
      }
    });
  }
  if (oracleClose) oracleClose.addEventListener('click', closeOracle);
  if (oracleModal) {
    oracleModal.addEventListener('click', (event) => {
      if (event.target === oracleModal) closeOracle();
    });
  }

  if (openDownloadsBtn) openDownloadsBtn.addEventListener('click', () => openDownloads(openDownloadsBtn));
  const openPlayerBtn = document.getElementById('open-player-btn');
  if (openPlayerBtn) openPlayerBtn.addEventListener('click', () => openDownloads(openPlayerBtn));
  if (downloadsCloseBtn) downloadsCloseBtn.addEventListener('click', closeDownloads);
  if (downloadsModal) {
    downloadsModal.addEventListener('click', (event) => {
      if (event.target === downloadsModal) closeDownloads();
    });
  }

  initPlayer();

  // URL param handling
  const initialKoncert = new URL(window.location).searchParams.get('koncert');
  if (initialKoncert) {
    openConcertModal(initialKoncert, null);
  }
}

// Concert modal
const modal = document.getElementById('concert-modal');
const modalTitle = document.getElementById('modal-title');
const modalSubtitle = document.getElementById('modal-subtitle');
const modalContent = document.getElementById('modal-content');
const closeButton = modal.querySelector('.modal-close');
let lastTrigger = null;

function openConcertModal(templateId, trigger) {
  const template = document.getElementById(templateId);
  if (!template) return;

  const firstEl = template.content.firstElementChild;
  if (!firstEl) return;
  const wrapper = firstEl.cloneNode(true);
  modalTitle.textContent = wrapper.dataset.title || 'Koncert';
  modalSubtitle.textContent = wrapper.dataset.subtitle || '';
  wrapper.removeAttribute('data-title');
  wrapper.removeAttribute('data-subtitle');
  modalContent.innerHTML = '';
  modalContent.appendChild(wrapper);

  lastTrigger = trigger || null;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (closeButton) closeButton.focus();

  const url = new URL(window.location);
  url.searchParams.set('koncert', templateId);
  history.pushState({ koncert: templateId }, '', url);
}

function closeConcertModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modalContent.innerHTML = '';
  document.body.style.overflow = '';
  if (lastTrigger) lastTrigger.focus();

  const url = new URL(window.location);
  url.searchParams.delete('koncert');
  history.pushState({}, '', url);
}

window.addEventListener('popstate', () => {
  const id = new URL(window.location).searchParams.get('koncert');
  if (id) {
    openConcertModal(id, null);
  } else if (modal.classList.contains('is-open')) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) {
    closeConcertModal();
  }
  if (event.key === 'Escape' && oracleModal && oracleModal.classList.contains('is-open')) {
    closeOracle();
  }
  if (event.key === 'Escape' && downloadsModal && downloadsModal.classList.contains('is-open')) {
    closeDownloads();
  }
});

// Oracle
const oracleCards = ['A co na to říká tvoje tělo?', 'Nech si namasírovat krk', 'Jen nepřestávej', 'Není chyba jen skrytý záměr?', 'Zkus to okopírovat', 'Kdo žije bez bláznovství, není tak moudrý, jak vypadá', 'Jakou chybu jsi udělal posledně?', 'Hledej důvody, proč to půjde', 'Přistup k tomu s hravou bezstarostnou odevzdaností', 'Jestli nepomáhá rozum, pomůže čas', 'Vzpomeň si na ty tiché večery', 'Jenom kousek, ne všechno.', 'Co by udělal tvůj nejlepší přítel?', 'Přečti o tom nějakou knihu', 'O čem teď doopravdy přemýšlíš?', 'Roztoč to', 'Něco chybí?', 'Jdi ven', 'Nedělej nic tak dlouho, jak jen to je možné', 'Použij starší nápad', 'Už nemluv', 'Vrať se po svých stopách zpět', 'Malý oheň vítr uhasí, velký rozdmýchá.', 'Chtěl by to někdo jiný?', 'Talent? To bývá často hlavně práce na talentu.', 'Nejsou to jen unavené oči, že nevidíš tu svátečnost?', 'Máš terén? Vytvoř křídla. Máš křídla? Vytvoř terén.', 'Prostě si věř.', 'Jdeš nahoru nebo dolů?', 'Buď drzý.', 'Prozkoumej v jakém pořadí věci děláš.', 'Není to jen tvý mylná interpretace?', 'Strach stvořil bohy, odvaha krále.', 'Jdi a něco vytvoř.', 'Z ničeho trochu víc než nic.', 'Čelíš volbě? Udělej obojí.', 'Zeptej se ticha, co si myslí.', 'Zastav se těsně před cílem – a rozhlédni se.', 'Místo odpovědi změň otázku.', 'Mluv s věcmi, které mlčí.', 'Nepospíchej. Nic neuteče, co má zůstat.', 'Ztratit směr může být začátek cesty.', 'Udělej to špatně – ale srdcem.', 'Podívej se na svět jako poprvé.', 'Někdy je třeba jít dál, i když nevíš kam.', 'Zeptej se těla, kde se skrývá tvá mysl.', 'Pusť to, ať tě to samo chytí.', 'Když nevíš, usměj se.', 'Přestaň chtít být lepší a prostě buď.', 'Nech svět chvíli, ať tě předběhne.', 'Zhasni světlo a uvidíš víc.', 'Zkus to říct jinak, nebo vůbec.', 'Buď s tím, co je – ne s tím, co by mělo být.', 'Zatancuj si s problémem místo boje.', 'Nepotřebuješ plán, potřebuješ odvahu.', 'Možná už jsi tam, kam se chceš dostat.'];
const oracleModal = document.getElementById('oracle-modal');
const oracleCard = document.getElementById('oracle-card');
const oracleText = document.getElementById('oracle-text');
const oracleClose = document.getElementById('oracle-close');
const openOracleBtn = document.getElementById('open-oracle-btn');
const downloadsModal = document.getElementById('downloads-modal');
const openDownloadsBtn = document.getElementById('open-downloads-btn');
const downloadsCloseBtn = downloadsModal ? downloadsModal.querySelector('.modal-close') : null;
let lastFooterTrigger = null;
let _onDownloadsOpen = () => {};
let _onDownloadsClose = () => {};

function pickOracleText() {
  const idx = Math.floor(Math.random() * oracleCards.length);
  return oracleCards[idx];
}

function openOracle(trigger) {
  lastFooterTrigger = trigger || null;
  oracleText.textContent = pickOracleText();
  oracleCard.classList.remove('is-flipped');
  oracleModal.classList.remove('revealed');
  oracleModal.classList.add('is-open');
  oracleModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => oracleCard.focus(), 30);
}

function closeOracle() {
  oracleModal.classList.remove('is-open', 'revealed');
  oracleModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFooterTrigger) lastFooterTrigger.focus();
}

function flipOracle() {
  if (!oracleCard.classList.contains('is-flipped')) {
    oracleCard.classList.add('is-flipped');
    oracleModal.classList.add('revealed');
  }
}

function openDownloads(trigger) {
  _onDownloadsOpen();
  lastFooterTrigger = trigger || null;
  downloadsModal.classList.add('is-open');
  downloadsModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (downloadsCloseBtn) downloadsCloseBtn.focus();
}

function closeDownloads() {
  downloadsModal.classList.remove('is-open');
  downloadsModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFooterTrigger) lastFooterTrigger.focus();
  _onDownloadsClose();
}

// Player
function initPlayer() {
  const audio = document.getElementById('player-audio');
  const bar = document.getElementById('player-bar');
  const titleEl = document.getElementById('player-title');
  const progress = document.getElementById('player-progress');
  const playPauseBtn = document.getElementById('player-play-pause');
  const iconPlay = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const prevBtn = document.getElementById('player-prev');
  const nextBtn = document.getElementById('player-next');
  const trackBtns = Array.from(document.querySelectorAll('.play-track-btn'));
  const miniPlayer = document.getElementById('mini-player');
  const miniTitle = document.getElementById('mini-player-title');
  const miniPlayPause = document.getElementById('mini-play-pause');
  const miniIconPlay = document.getElementById('mini-icon-play');
  const miniIconPause = document.getElementById('mini-icon-pause');
  const miniPrev = document.getElementById('mini-prev');
  const miniNext = document.getElementById('mini-next');
  const miniClose = document.getElementById('mini-player-close');
  let currentIndex = -1;

  function setPlayingRow(index) {
    trackBtns.forEach((btn, i) => {
      btn.closest('.download-row')?.classList.toggle('is-playing', i === index);
    });
  }

  function syncPlayIcons(paused) {
    iconPlay.hidden = !paused;
    iconPause.hidden = paused;
    if (miniIconPlay) miniIconPlay.hidden = !paused;
    if (miniIconPause) miniIconPause.hidden = paused;
  }

  function playTrack(index) {
    currentIndex = index;
    const btn = trackBtns[index];
    audio.src = btn.dataset.src;
    audio.play();
    titleEl.textContent = btn.dataset.title;
    if (miniTitle) miniTitle.textContent = btn.dataset.title;
    bar.hidden = false;
    setPlayingRow(index);
    btn.closest('.download-row')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  trackBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => playTrack(i));
  });

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) audio.play(); else audio.pause();
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < trackBtns.length - 1) playTrack(currentIndex + 1);
  });

  audio.addEventListener('play', () => syncPlayIcons(false));
  audio.addEventListener('pause', () => syncPlayIcons(true));

  audio.addEventListener('ended', () => {
    if (currentIndex < trackBtns.length - 1) {
      playTrack(currentIndex + 1);
    } else {
      syncPlayIcons(true);
      setPlayingRow(-1);
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progress.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  progress.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  });

  if (miniPlayPause) miniPlayPause.addEventListener('click', () => {
    if (audio.paused) audio.play(); else audio.pause();
  });
  if (miniPrev) miniPrev.addEventListener('click', () => {
    if (currentIndex > 0) playTrack(currentIndex - 1);
  });
  if (miniNext) miniNext.addEventListener('click', () => {
    if (currentIndex < trackBtns.length - 1) playTrack(currentIndex + 1);
  });
  if (miniClose) miniClose.addEventListener('click', () => {
    audio.pause();
    audio.src = '';
    if (miniPlayer) miniPlayer.hidden = true;
    bar.hidden = true;
    currentIndex = -1;
    setPlayingRow(-1);
  });

  _onDownloadsOpen = () => { if (miniPlayer) miniPlayer.hidden = true; };
  _onDownloadsClose = () => {
    if (miniPlayer && !audio.paused) {
      if (miniTitle) miniTitle.textContent = titleEl.textContent;
      miniPlayer.hidden = false;
    }
  };
}

// Invite form IIFE
(function () {
  // Form setup is deferred until the widget is loaded — listen on document
  document.addEventListener('submit', function (e) {
    const form = e.target.closest('#invite-form');
    if (!form) return;
    e.preventDefault();

    const emailInput = form.querySelector('input[name="EMAIL"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const messageBox = document.getElementById('invite-message');

    const email = emailInput.value.trim();

    messageBox.textContent = '';
    messageBox.className = 'fineprint';

    if (!email) {
      messageBox.textContent = 'Zadej prosím e-mail.';
      messageBox.classList.add('invite-message-error');
      emailInput.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      messageBox.textContent = 'Zadej prosím platný e-mail.';
      messageBox.classList.add('invite-message-error');
      emailInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám…';

    (async () => {
      try {
        const formData = new FormData(form);

        await fetch(form.action, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });

        form.reset();
        messageBox.textContent = 'Díky! Přihlášení proběhlo úspěšně. Mrkni ještě do schránky, jestli nebude potřeba potvrdit odběr.';
        messageBox.classList.add('invite-message-success');
      } catch (error) {
        messageBox.textContent = 'Nepodařilo se odeslat formulář. Zkus to prosím za chvíli znovu.';
        messageBox.classList.add('invite-message-error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Chci pozvánky na koncerty';
      }
    })();
  });
})();
