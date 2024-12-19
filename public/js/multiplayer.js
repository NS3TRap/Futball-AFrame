 
  const socket = io("http://localhost:8080");

  let players = {}; // Объект для хранения сущностей игроков
  const scene = document.querySelector('a-scene');
  let myPlayerId = null;

  // Создание локального игрока (только один раз)
  function createLocalPlayer(team) {
    const s = document.querySelector('a-scene');
    // Добавляем камеру игрока
    const camera = document.createElement('a-entity');
    camera.setAttribute('id', 'camera');
    camera.setAttribute('camera', 'active:true');
    camera.setAttribute('look-controls', 'pointerLockEnabled: true');
    camera.setAttribute('position', '-2 1 0');
    s.appendChild(camera);

    // Добавляем тело игрока с управлением
    const playerCollider = document.createElement('a-entity');
    playerCollider.setAttribute('id', 'playerCollider');
    playerCollider.setAttribute('gltf-model', team === 'red' ? 'objects/playerRed.gltf' : 'objects/playerBlue.gltf');
    playerCollider.setAttribute('position', '-2 0.9 0');
    playerCollider.setAttribute('position', '-2 0.9 0');
    playerCollider.setAttribute('wasd-controls', 'acceleration: 40; adInverted: true; wsInverted: true');
    playerCollider.setAttribute('geometry', 'primitive: cylinder; height: 2; radius: 0.5; segmentsRadial: 18');
    playerCollider.setAttribute('scale', '0.7 0.7 0.7');
    playerCollider.setAttribute('collision-check', 'walls: .wall');
    playerCollider.setAttribute('first-person-controls', '');
    s.appendChild(playerCollider);

    console.log(camera.getAttribute('position'))
    console.log(playerCollider.getAttribute('static-body'))
    // Сохраняем ссылку на локальный игрок
    myPlayerId = socket.id;
    players[socket.id] = playerCollider;
  }

  // Создание других игроков
  function addRemotePlayer(player) {
    if (players[player.id]) return; // Игрок уже существует

    const remotePlayer = document.createElement('a-entity');
    remotePlayer.setAttribute('id', player.id);
    remotePlayer.setAttribute('gltf-model', player.team === 'red' ? 'objects/playerRed.gltf' : 'objects/playerBlue.gltf');
    remotePlayer.setAttribute('position', `${player.position.x} ${player.position.y} ${player.position.z}`);
    remotePlayer.setAttribute('geometry', 'primitive: cylinder; height: 2; radius: 0.5; segmentsRadial: 18');
    remotePlayer.setAttribute('static-body', 'shape: auto; mass: 18');
    remotePlayer.setAttribute('scale', '0.7 0.7 0.7');
    scene.appendChild(remotePlayer);
    players[player.id] = remotePlayer;
  }

  // Удаление игрока
  function removePlayer(playerId) {
    const player = document.getElementById(playerId);
    if (player) player.remove();
    delete players[playerId];
  }

  // Обновление позиции других игроков
  function updateRemotePlayer(player) {
    const remotePlayer = players[player.id];
    if (remotePlayer) {
      remotePlayer.setAttribute('position', `${player.position.x} ${player.position.y} ${player.position.z}`);
      remotePlayer.setAttribute('rotation', `${player.rotation.x} ${player.rotation.y} ${player.rotation.z}`);
    }
  }

  // Обновления от сервера
  socket.on('currentPlayers', (serverPlayers) => {
    for (let id in serverPlayers) {
      if (id === socket.id) continue; // Пропускаем локального игрока
      addRemotePlayer(serverPlayers[id]);
    }
  });

  socket.on('newPlayer', (player) => {
    if (player.id !== socket.id) addRemotePlayer(player);
  });

  socket.on('removePlayer', (id) => {
    removePlayer(id);
  });

  socket.on('updatePlayer', (player) => {
    if (player.id !== socket.id) updateRemotePlayer(player);
  });

  socket.on('updatePlayerTeam', (data) => {
    if (players[data.id]) {
      players[data.id].setAttribute('gltf-model', data.team === 'red' ? 'objects/playerRed.gltf' : 'objects/playerBlue.gltf');
    }
  });

  // Обработка выбора команды
  document.getElementById('TeamBlock__Red').addEventListener('click', () => {
    socket.emit('chooseTeam', 'red');
    createLocalPlayer('red');
    closeOverlay();
  });

  document.getElementById('TeamBlock__Blue').addEventListener('click', () => {
    socket.emit('chooseTeam', 'blue');
    createLocalPlayer('blue');
    closeOverlay();
  });

  // Отправка позиции игрока на сервер
  setInterval(() => {
    const playerCollider = document.getElementById('playerCollider');
    if (playerCollider) {
      const position = playerCollider.object3D.position;
      const rotation = playerCollider.object3D.rotation;

      socket.emit('playerMovement', {
        position: { x: position.x, y: position.y, z: position.z },
        rotation: { x: rotation.x, y: rotation.y, z: rotation.z }
      });
    }
  }, 100);