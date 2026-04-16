(function () {
  const ALL_ITEMS = [
    { id: 1,  src: 'pics/01.jpg', label: 'Výletnická' },
    { id: 2,  src: 'pics/02.jpg', label: 'Chvála bláznovství' },
    { id: 3,  src: 'pics/03.jpg', label: 'Návrat z války' },
    { id: 4,  src: 'pics/04.jpg', label: 'Ukolébavka' },
    { id: 5,  src: 'pics/05.jpg', label: 'Betonový srdce' },
    { id: 6,  src: 'pics/06.jpg', label: 'Prvorození' },
    { id: 7,  src: 'pics/07.jpg', label: 'Lovec' },
    { id: 8,  src: 'pics/08.jpg', label: 'Drak' },
    { id: 9,  src: 'pics/09.jpg', label: 'Nebeský zatáčky' },
    { id: 11, src: 'pics/11.jpg', label: 'Dieta' },
    { id: 12, src: 'pics/12.jpg', label: 'Všeobjímající ruský žal' },
    { id: 13, src: 'pics/13.jpg', label: 'Pachelbelovo odhalení' },
    { id: 14, src: 'pics/14.jpg', label: 'Zima' },
    { id: 15, src: 'pics/15.jpg', label: 'Prachy kámo' },
    { id: 16, src: 'pics/16.jpg', label: 'Rytíř' },
    { id: 17, src: 'pics/17.jpg', label: 'Platonická' },
    { id: 19, src: 'pics/19.jpg', label: 'Skříně nápadů' },
    { id: 20, src: 'pics/20.jpg', label: 'První puška' },
    { id: 21, src: 'pics/21.jpg', label: 'Rozvodová' },
    { id: 22, src: 'pics/22.jpg', label: 'Kmotřička smrt' },
    { id: 23, src: 'pics/23.jpg', label: 'Planeta zem' },
    { id: 24, src: 'pics/24.jpg', label: 'Ajťácká abeceda' },
    { id: 25, src: 'pics/25.jpg', label: 'Andělé' },
    { id: 26, src: 'pics/26.jpg', label: 'Deprese' },
    { id: 28, src: 'pics/28.jpg', label: 'Pohádková' },
    { id: 29, src: 'pics/29.jpg', label: 'Beránci' },
    { id: 30, src: 'pics/30.jpg', label: 'Kacíř' },
    { id: 31, src: 'pics/31.jpg', label: 'Zapomenout' },
    { id: 32, src: 'pics/32.jpg', label: 'Dovolená' },
    { id: 33, src: 'pics/33.jpg', label: 'Charakter' },
    { id: 34, src: 'pics/34.jpg', label: 'Bitva na řece Allia' },
    { id: 35, src: 'pics/35.jpg', label: 'Ambulance' },
    { id: 38, src: 'pics/38.jpg', label: 'Žabák' },
    { id: 39, src: 'pics/39.jpg', label: 'Lodě s kořením' },
    { id: 40, src: 'pics/40.jpg', label: 'Gabriela' },
    { id: 41, src: 'pics/41.jpg', label: 'Celej svět je tvůj' },
    { id: 42, src: 'pics/42.jpg', label: 'Krysař' },
    { id: 43, src: 'pics/43.jpg', label: 'Kavárna Lepší Časy' },
    { id: 47, src: 'pics/47.jpg', label: 'Armáda snílků' },
    { id: 49, src: 'pics/49.jpg', label: 'Vězení' },
    { id: 51, src: 'pics/51.jpg', label: 'Modlitba vděčnosti' },
    { id: 52, src: 'pics/52.jpg', label: 'Vzteklej Ben' },
    { id: 55, src: 'pics/55.jpg', label: 'Co jsme víc' },
    { id: 58, src: 'pics/58.jpg', label: 'Na obláčku' },
  ];

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

  function initGame() {
    selectedLabel = null;
    correctCount  = 0;
    wrongCount    = 0;
    matchedCount  = 0;
    labelsGrid.innerHTML = '';
    imagesGrid.innerHTML = '';
    gameComplete.hidden  = true;
    updateStats();

    const shuffledLabels = shuffle(ALL_ITEMS);
    const shuffledImages = shuffle(ALL_ITEMS);

    shuffledLabels.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className  = 'label-item';
      btn.type       = 'button';
      btn.textContent = item.label;
      btn.dataset.id  = item.id;
      btn.style.animationDelay = (i * 12) + 'ms';

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
      const div = document.createElement('div');
      div.className  = 'image-item';
      div.dataset.id = item.id;
      div.style.animationDelay = (i * 12) + 'ms';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = '';
      div.appendChild(img);

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
