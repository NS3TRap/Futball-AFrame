// Получаем элементы блоков и оверлея
const uiOverlay = document.querySelector('.UI_Overlay');
const mainCamera = document.getElementById('scene_cam');
const playerCamera = document.getElementById('camera');

// Функция для скрытия оверлея
function closeOverlay() {
    if (uiOverlay) {
        uiOverlay.classList.add('UI_Overlay__hidden');
    }
}

function showGameResult() {
    const uiOverlay = document.getElementById('end_game');
    const overlayInfoDraw = document.getElementById('Draw');
    const overlayInfoBlue = document.getElementById('BlueWins');
    const overlayInfoRed = document.getElementById('RedWins');
    
    // Получаем строку с текущим счётом
    const scoreText = document.getElementById('score').innerText;

    // Парсим строку (например, "3:2") в массив [3, 2]
    const [scoreRed, scoreBlue] = scoreText.split(':').map(Number);

    // Скрываем все блоки
    overlayInfoDraw.classList.add('UI_Overlay_Info__hidden');
    overlayInfoBlue.classList.add('UI_Overlay_Info__hidden');
    overlayInfoRed.classList.add('UI_Overlay_Info__hidden');

    // Определяем победителя или ничью
    if (scoreRed > scoreBlue) {
        overlayInfoRed.classList.remove('UI_Overlay_Info__hidden');
    } else if (scoreBlue > scoreRed) {
        overlayInfoBlue.classList.remove('UI_Overlay_Info__hidden');
    } else {
        overlayInfoDraw.classList.remove('UI_Overlay_Info__hidden');
    }

    // Отображаем основной оверлей
    uiOverlay.classList.remove('UI_Overlay__hidden');
}
