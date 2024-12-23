  let time = 180; // начальное время (в секундах)
  let connClients = NAF.connection.getConnectedClients();

    // Обновление таймера каждую секунду
    const timerInterval = setInterval(() => {
      if (connClients != NAF.connection.getConnectedClients()){
        connClients = NAF.connection.getConnectedClients();
        time = 180;
      }
      
      if (time > 0) {
        time--;
        let minute = '0' + String(Math.floor(time/60));
        let second = time%60 < 10 ?  '0' + String(time%60)  : String(time%60);
        document.getElementById('timer').innerText = `${minute}:${second}`;
      } else {
        clearInterval(timerInterval);
        showGameResult(); // Показать результат вместо alert
        restartAfterTimeout();
      }
    }, 1000);

        // Функция для рестарта через 10 секунд
    function restartAfterTimeout() {
      // Устанавливаем таймер на 10 секунд
      setTimeout(() => {
        location.reload();  // Перезагружаем страницу
      }, 10000);  // 10000 миллисекунд = 10 секунд
    }

    AFRAME.registerComponent('goal-detection', {
      init: function () {
        const goalRED = document.getElementById('goalRed');
        const goalBLUE = document.getElementById('goalBlue');
        const balls = document.querySelectorAll('.ball_tpl');
    
        // Локальные переменные для счёта
        let scoreRed = 0;
        let scoreBlue = 0;
        let lastGoalTime = 0; // Время последнего засчитанного гола
        const goalCooldown = 1000; // Задержка в миллисекундах (1 секунда)
    
        balls.forEach(ball => {
          ball.addEventListener('collide', function (event) {
            // Получаем текущее время
            const currentTime = Date.now();
    
            // Если прошло достаточно времени с последнего гола
            if (currentTime - lastGoalTime > goalCooldown) {
              if (event.detail.body.el === goalRED) {
                scoreRed++;
                updateScoreUI();
                resetBallPosition(event);
                lastGoalTime = currentTime; // Обновляем время последнего гола
              } else if (event.detail.body.el === goalBLUE) {
                scoreBlue++;
                updateScoreUI();
                resetBallPosition(event);
                lastGoalTime = currentTime; // Обновляем время последнего гола
              }
            }
          });
        });
    
        // Функция для обновления UI
        function updateScoreUI() {
          document.getElementById('score').innerText = `${scoreRed}:${scoreBlue}`;
        }
    
        // Сброс позиции мяча
        function resetBallPosition(event) {
          const ball = event.currentTarget;
          ball.body.position.set(0, 0.5, 0);
          ball.body.velocity.set(0, 0, 0);
          ball.body.angularVelocity.set(0, 0, 0);
        }
      }
    });

    AFRAME.registerComponent('collision-check', {
      schema: {
        walls: { type: 'selectorAll' } // Селекторы всех стен
      },
    
      init: function () {
        this.el.object3D.userData.oldPosition = this.el.object3D.position.clone();
        this.boundingSphere = new THREE.Sphere(); // Сферическая граница
      },
    
      tick: function () {
        const player = this.el.object3D; // Объект игрока
        const oldPosition = player.userData.oldPosition.clone();
    
        // Обновляем сферу игрока с учетом его позиции и масштаба
        this.boundingSphere.center.copy(player.position);
        this.boundingSphere.radius = 0.3; // Радиус сферы
    
        // Проверяем пересечения со стенами
        for (let wall of this.data.walls) {
          const wallBox = new THREE.Box3().setFromObject(wall.object3D);
          if (wallBox.intersectsSphere(this.boundingSphere)) {
            // Если произошло столкновение, возвращаем игрока на предыдущую позицию
            player.position.copy(oldPosition);
            return;
          }
        }
    
        // Обновляем старую позицию
        player.userData.oldPosition.copy(player.position);
      }
    });

// Регистрация компонента для синхронизации состояния мяча
AFRAME.registerComponent('sync-ball', {
  schema: {
    isHost: { type: 'boolean', default: false }, // Является ли текущий клиент "хостом" мяча
  },

  init: function () {
    this.el.addEventListener('ball-interacted', this.handleInteraction.bind(this));
    this.lastUpdateTime = 0; // Для ограничения частоты обновлений

    // Подписка на канал для получения данных о состоянии мяча
    NAF.connection.subscribeToDataChannel('ball-state', this.handleStateUpdate.bind(this));

  },

  tick: function (time, delta) {
    if (this.data.isHost && time - this.lastUpdateTime > 20) { // Обновляем каждые 50 мс
      this.lastUpdateTime = time;
      this.broadcastBallState();
    }
  },

  handleInteraction: function (evt) {
    // Клиент становится хостом после взаимодействия с мячом
    this.data.isHost = true; 
  },

  broadcastBallState: function () {
    // Отправляет позицию и вращение мяча через NAF.connection.broadcastDataGuaranteed
    const position = this.el.object3D.position;
    const rotation = this.el.body.angularVelocity;

    const data = {
      position: { x: position.x, y: position.y, z: position.z },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z }
    };

    // Использование NAF для гарантированной передачи данных
    NAF.connection.broadcastDataGuaranteed('ball-state', data);
  },

  handleStateUpdate: function (senderId, dataType, data) {
    if (dataType === 'ball-state') {
      if (this.data.isHost) {
        // Если клиент был хостом, но получил данные, он перестает быть хостом
        this.data.isHost = false;
      } else {
        // Обновляет позицию и вращение мяча на основании полученных данных
        this.updateBallState(data);
      }
    }
  },

  updateBallState: function (data) {
    this.el.body.position.set(data.position.x, data.position.y, data.position.z);
    this.el.body.angularVelocity.set(data.rotation.x, data.rotation.y, data.rotation.z);
  }
});

// Добавление компонента для обработки столкновений с мячом
AFRAME.registerComponent('ball-hitbox', {
  init: function () {
    this.el.addEventListener('collide', (evt) => {
      const targetEl = evt.detail.body.el; // Получаем объект, с которым произошло столкновение
      if (targetEl && targetEl.classList.contains('player-body')) {
        // Проверяем, что столкновение произошло с объектом, имеющим класс "body"
        this.el.emit('ball-interacted');
      }
    });
  }
});

