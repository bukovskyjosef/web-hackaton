document.addEventListener("DOMContentLoaded", function() {
    const images = [
            {id: 1, src: 'pics/01.jpg', label: 'Výletnická'},
    {id: 2, src: 'pics/02.jpg', label: 'Chvála bláznovstvi'},
    {id: 3, src: 'pics/03.jpg', label: 'Návrat z války'},
    {id: 4, src: 'pics/04.jpg', label: 'Ukolébavka'},
    {id: 5, src: 'pics/05.jpg', label: 'Betonový srdce'},
    {id: 6, src: 'pics/06.jpg', label: 'Prvorození'},
    {id: 7, src: 'pics/07.jpg', label: 'Lovec'},
    {id: 8, src: 'pics/08.jpg', label: 'Drak'},
    {id: 9, src: 'pics/09.jpg', label: 'Nebeský zatáčky'},
    {id: 11, src: 'pics/11.jpg', label: 'Dieta'},
    {id: 12, src: 'pics/12.jpg', label: 'Všeobjímající ruský žal'},
    {id: 13, src: 'pics/13.jpg', label: 'Pachelbelovo odhalení'},
    {id: 14, src: 'pics/14.jpg', label: 'Zima'},
    {id: 15, src: 'pics/15.jpg', label: 'Prachy kámo'},
    {id: 16, src: 'pics/16.jpg', label: 'Rytíř'},
    {id: 17, src: 'pics/17.jpg', label: 'Platonická'},
    {id: 19, src: 'pics/19.jpg', label: 'Skříně nápadů'},
    {id: 20, src: 'pics/20.jpg', label: 'První puška'},
    {id: 21, src: 'pics/21.jpg', label: 'Rozvodová'},
    {id: 22, src: 'pics/22.jpg', label: 'Kmotřička smrt'},
    {id: 23, src: 'pics/23.jpg', label: 'Planeta zem'},
    {id: 24, src: 'pics/24.jpg', label: 'Ajťácká  abeceda'},
    {id: 25, src: 'pics/25.jpg', label: 'Andělé'},
    {id: 26, src: 'pics/26.jpg', label: 'Deprese'},
    {id: 28, src: 'pics/28.jpg', label: 'Pohádková'},
    {id: 29, src: 'pics/29.jpg', label: 'Beránci'},
    {id: 30, src: 'pics/30.jpg', label: 'Kacíř'},
    {id: 31, src: 'pics/31.jpg', label: 'Zapomenout'},
    {id: 32, src: 'pics/32.jpg', label: 'Dovolená'},
    {id: 33, src: 'pics/33.jpg', label: 'Charakter'},
    {id: 34, src: 'pics/34.jpg', label: 'Bitva na rece Allia'},
    {id: 35, src: 'pics/35.jpg', label: 'Ambulance'},
    {id: 38, src: 'pics/38.jpg', label: 'Žabák'},
    {id: 39, src: 'pics/39.jpg', label: 'Lodě s kořením'},
    {id: 40, src: 'pics/40.jpg', label: 'Gabriela'},
    {id: 41, src: 'pics/41.jpg', label: 'Celej svět je tvůj'},
    {id: 42, src: 'pics/42.jpg', label: 'Krysař'},
    {id: 43, src: 'pics/43.jpg', label: 'Kavárna Lepší Časy'},
    {id: 47, src: 'pics/47.jpg', label: 'Armáda snílků'},
    {id: 49, src: 'pics/49.jpg', label: 'Vězení'},
    {id: 51, src: 'pics/51.jpg', label: 'Modlitba vděčnosti'},
    {id: 52, src: 'pics/52.jpg', label: 'Vzteklej Ben'},
    {id: 55, src: 'pics/55.jpg', label: 'Co jsme víc'},
    {id: 58, src: 'pics/58.jpg', label: 'Na obláčku'}
    ];

    const labels = images.map(img => img.label).sort(() => Math.random() - 0.5);

    const imagesContainer = document.querySelector('.images');
    const labelsContainer = document.querySelector('.labels');
    const correctCountElem = document.getElementById('correctCount');
    const wrongCountElem = document.getElementById('wrongCount');

    let correctCount = 0;
    let wrongCount = 0;

    images.forEach(image => {
        const imgElem = document.createElement('div');
        imgElem.classList.add('image-item');
        imgElem.dataset.id = image.id;

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.label;

        imgElem.appendChild(img);
        imagesContainer.appendChild(imgElem);
    });

    labels.forEach(label => {
        const labelElem = document.createElement('div');
        labelElem.classList.add('label-item');
        labelElem.textContent = label;

        labelElem.addEventListener('click', function() {
            const highlighted = document.querySelector('.highlight');
            if (highlighted) {
                highlighted.classList.remove('highlight');
            }
            labelElem.classList.add('highlight');
        });

        labelsContainer.appendChild(labelElem);
    });

    imagesContainer.addEventListener('click', function(e) {
        if (e.target.closest('.image-item')) {
            const imageItem = e.target.closest('.image-item');
            const highlightedLabel = document.querySelector('.highlight');
            if (highlightedLabel) {
                const correctLabel = images.find(img => img.id == imageItem.dataset.id).label;
                if (highlightedLabel.textContent === correctLabel) {
                    alert('Správně!');
                    imageItem.classList.add('correct');
                    highlightedLabel.classList.add('correct');
                    imageItem.style.opacity = '0.5';
                    highlightedLabel.style.opacity = '0.5';
                    highlightedLabel.classList.remove('highlight');
                    correctCount++;
                    correctCountElem.textContent = correctCount;
                } else {
                    alert('Špatně, zkuste to znovu.');
                    wrongCount++;
                    wrongCountElem.textContent = wrongCount;
                }
            } else {
                alert('Vyberte nejprve název.');
            }
        }
    });
});




