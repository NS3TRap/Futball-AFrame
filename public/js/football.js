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

    // Триггер для голов
    AFRAME.registerComponent('goal-detection', {
      init: function () {
        const goalRED = document.getElementById('goalRed');
        const goalBLUE = document.getElementById('goalBlue');
        const balls = document.querySelectorAll('.ball_tpl');
    
        // Локальные переменные для счёта
        let scoreRed = 0;
        let scoreBlue = 0;
    
        balls.forEach(ball => {
          ball.addEventListener('collide', function (event) {
            if (event.detail.body.el === goalRED) {
              scoreRed++;
              updateScoreUI();
              broadcastScore(scoreRed, scoreBlue);
              resetBallPosition(event);
            } else if (event.detail.body.el === goalBLUE) {
              scoreBlue++;
              updateScoreUI();
              broadcastScore(scoreRed, scoreBlue);
              resetBallPosition(event);
            }
          });
        });
    
        // Функция для обновления UI
        function updateScoreUI() {
          document.getElementById('score').innerText = `${scoreRed}:${scoreBlue}`;
        }
    
        // Отправка данных другим клиентам
        function broadcastScore(red, blue) {
          NAF.connection.broadcastDataGuaranteed('score-update', {
            red: red,
            blue: blue
          });
        }
    
        // Сброс позиции мяча
        function resetBallPosition(event) {
          const ball = event.currentTarget;
          ball.body.position.set(0, 0.5, 0);
          ball.body.velocity.set(0, 0, 0);
          ball.body.angularVelocity.set(0, 0, 0);
        }
    
        // Подписка на обновления счёта от других клиентов
        NAF.connection.subscribeToDataChannel('score-update', (senderId, dataType, data, targetId) => {
          scoreRed = data.red;
          scoreBlue = data.blue;
          updateScoreUI();
        });
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

