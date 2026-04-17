(function () {
  // All 78 songs now have images
  const HAS_IMAGE = new Set(Array.from({ length: 78 }, (_, i) => i + 1));

  const ALL_ITEMS = [
    { id: 1,  label: 'Výletnická I.' },
    { id: 2,  label: 'Chvála bláznovství' },
    { id: 3,  label: 'Návrat z války' },
    { id: 4,  label: 'Ukolébavka' },
    { id: 5,  label: 'Betonový srdce' },
    { id: 6,  label: 'Prvorození' },
    { id: 7,  label: 'Lovec' },
    { id: 8,  label: 'Drak' },
    { id: 9,  label: 'Nebeský zatáčky' },
    { id: 10, label: 'Duet' },
    { id: 11, label: 'Dieta' },
    { id: 12, label: 'Všeobjímající ruský žal' },
    { id: 13, label: 'Pachelbelovo odhalení' },
    { id: 14, label: 'Zima' },
    { id: 15, label: 'Prachy, kámo' },
    { id: 16, label: 'Rytíř' },
    { id: 17, label: 'Platonická' },
    { id: 18, label: 'Byla noc' },
    { id: 19, label: 'Skříně nápadů' },
    { id: 20, label: 'První puška' },
    { id: 21, label: 'Rozvodová' },
    { id: 22, label: 'Kmotřička Smrt' },
    { id: 23, label: 'Planeta zem' },
    { id: 24, label: 'Ajťácká abeceda' },
    { id: 25, label: 'Andělé' },
    { id: 26, label: 'Deprese' },
    { id: 27, label: '7531' },
    { id: 28, label: 'Pohádková' },
    { id: 29, label: 'Beránci' },
    { id: 30, label: 'Kacíř' },
    { id: 31, label: 'Zapomenout' },
    { id: 32, label: 'Dovolená' },
    { id: 33, label: 'Charakter' },
    { id: 34, label: 'Bitva na řece Allia' },
    { id: 35, label: 'Ambulance' },
    { id: 36, label: 'Máme doma piáno' },
    { id: 37, label: 'Vláček' },
    { id: 38, label: 'Žabák' },
    { id: 39, label: 'Lodě s kořením' },
    { id: 40, label: 'Gabriela' },
    { id: 41, label: 'Celej svět je tvůj' },
    { id: 42, label: 'Krysař' },
    { id: 43, label: 'Kavárna lepší časy' },
    { id: 44, label: 'Dospělá' },
    { id: 45, label: 'Kariérní' },
    { id: 46, label: 'Zmrzlinář' },
    { id: 47, label: 'Armáda snílků' },
    { id: 48, label: 'Slunce a srdce' },
    { id: 49, label: 'Vězení' },
    { id: 50, label: 'Láska labutí' },
    { id: 51, label: 'Modlitba za vděčnost' },
    { id: 52, label: 'Vzteklej Ben' },
    { id: 53, label: 'Červenická' },
    { id: 54, label: 'Slunečnice' },
    { id: 55, label: 'Co jsme víc' },
    { id: 56, label: 'Kamarádka' },
    { id: 57, label: 'Spadla Hvězda' },
    { id: 58, label: 'Na obláčku' },
    { id: 59, label: 'Jdu hledat klíč' },
    { id: 60, label: 'Buchty s mákem' },
    { id: 61, label: 'Analýza' },
    { id: 62, label: 'Smolař' },
    { id: 63, label: 'O Edgarovi a Lenoře' },
    { id: 64, label: 'Peacenička' },
    { id: 65, label: 'Nová Táša' },
    { id: 66, label: 'Holky nevědí' },
    { id: 67, label: 'Saganův sen o bleděmodré tečce' },
    { id: 68, label: 'Kaufland' },
    { id: 69, label: 'Robinsoni' },
    { id: 70, label: 'Hospodskej týpek' },
    { id: 71, label: 'Skleněnky' },
    { id: 72, label: 'Nehroť' },
    { id: 73, label: 'Srdce jako zvon' },
    { id: 74, label: 'Kdo jsme my' },
    { id: 75, label: 'Kočička' },
    { id: 76, label: 'Koleda' },
    { id: 77, label: 'Ukrajina' },
    { id: 78, label: 'Letní láska' },
  ];

  // Visually unique gradient per ID (no text — maintains game challenge)
  function placeholderStyle(id) {
    const h1 = (id * 47 + 10) % 360;
    const h2 = (h1 + 80) % 360;
    const h3 = (h1 + 160) % 360;
    return {
      background: `radial-gradient(circle at 30% 30%, hsl(${h1},72%,22%) 0%, hsl(${h2},50%,12%) 55%, hsl(${h3},40%,8%) 100%)`,
      accent: `hsl(${h1},80%,55%)`,
    };
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function addTempClass(el, cls, ms) {
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  const correctCountEl = document.getElementById('correctCount');
  const wrongCountEl   = document.getElementById('wrongCount');
  const remainCountEl  = document.getElementById('remainCount');
  const progressBar    = document.getElementById('progress-bar');
  const labelsGrid     = document.getElementById('labels-grid');
  const imagesGrid     = document.getElementById('images-grid');
  const gameComplete   = document.getElementById('game-complete');
  const finalCorrect   = document.getElementById('finalCorrect');
  const finalWrong     = document.getElementById('finalWrong');
  const restartBtn     = document.getElementById('restart-btn');
  const toastEl        = document.getElementById('toast');

  let selectedLabel = null;
  let correctCount  = 0;
  let wrongCount    = 0;
  let matchedCount  = 0;
  let toastTimer    = null;

  function showToast(msg, type) {
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.className = 'toast show toast-' + type;
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
  }

  function updateStats() {
    correctCountEl.textContent = correctCount;
    wrongCountEl.textContent   = wrongCount;
    remainCountEl.textContent  = ALL_ITEMS.length - matchedCount;
    progressBar.style.width    = (matchedCount / ALL_ITEMS.length * 100) + '%';
  }

  function showEndScreen() {
    finalCorrect.textContent = correctCount;
    finalWrong.textContent   = wrongCount;
    gameComplete.hidden = false;
    gameComplete.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function buildImageEl(item) {
    const div = document.createElement('div');
    div.className  = 'image-item';
    div.dataset.id = item.id;

    if (HAS_IMAGE.has(item.id)) {
      const img = document.createElement('img');
      img.src = 'pics/' + String(item.id).padStart(2, '0') + '.jpg';
      img.alt = '';
      div.appendChild(img);
    } else {
      const style = placeholderStyle(item.id);
      div.style.background = style.background;
      const deco = document.createElement('span');
      deco.setAttribute('aria-hidden', 'true');
      deco.style.cssText = [
        'position:absolute', 'inset:0', 'display:grid', 'place-items:center',
        'font-size:42px', 'opacity:.28', 'color:' + style.accent,
        'user-select:none',
      ].join(';');
      deco.textContent = '\u266B'; // ♫ unicode music note, not emoji
      div.appendChild(deco);
    }

    return div;
  }

  function initGame() {
    selectedLabel = null;
    correctCount  = 0;
    wrongCount    = 0;
    matchedCount  = 0;
    labelsGrid.innerHTML = '';
    imagesGrid.innerHTML = '';
    gameComplete.hidden  = true;
    updateStats();

    const shuffledLabels = [...ALL_ITEMS].sort((a, b) => a.label.localeCompare(b.label, 'cs'));
    const shuffledImages = shuffle(ALL_ITEMS);

    shuffledLabels.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className   = 'label-item';
      btn.type        = 'button';
      btn.textContent = item.label;
      btn.dataset.id  = item.id;
      btn.style.animationDelay = (i * 8) + 'ms';

      btn.addEventListener('click', () => {
        if (btn.classList.contains('matched')) return;
        if (selectedLabel === btn) {
          btn.classList.remove('selected');
          selectedLabel = null;
          return;
        }
        if (selectedLabel) selectedLabel.classList.remove('selected');
        selectedLabel = btn;
        btn.classList.add('selected');
      });

      labelsGrid.appendChild(btn);
    });

    shuffledImages.forEach((item, i) => {
      const div = buildImageEl(item);
      div.style.animationDelay = (i * 8) + 'ms';

      div.addEventListener('click', () => {
        if (div.classList.contains('matched')) return;
        if (!selectedLabel) {
          showToast('Nejdřív vyber název.', 'info');
          addTempClass(div, 'is-wrong', 400);
          return;
        }

        const correct = ALL_ITEMS.find(x => x.id == div.dataset.id);
        if (selectedLabel.textContent === correct.label) {
          correctCount++;
          matchedCount++;
          selectedLabel.classList.remove('selected');
          selectedLabel.classList.add('matched');
          div.classList.add('matched');
          addTempClass(div, 'is-correct', 350);
          selectedLabel = null;
          showToast('Správně!', 'correct');
          updateStats();
          if (matchedCount === ALL_ITEMS.length) setTimeout(showEndScreen, 700);
        } else {
          wrongCount++;
          addTempClass(div, 'is-wrong', 400);
          addTempClass(selectedLabel, 'is-wrong', 400);
          showToast('Špatně, zkus to znovu.', 'wrong');
          updateStats();
        }
      });

      imagesGrid.appendChild(div);
    });
  }

  restartBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(initGame, 300);
  });

  initGame();
})();
