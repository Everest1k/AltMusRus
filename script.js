document.addEventListener('DOMContentLoaded', () => {
  /* ===== Burger menu ===== */
  const burger = document.getElementById('burger-menu');
  const navLinks = document.querySelector('nav ul.nav-links');
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  /* ===== CAPTCHA logic for auth page ===== */
  // Отдельные ответы для входа и регистрации
  let captchaAnswerLogin = null;
  let captchaAnswerRegister = null;
  // Элементы капчи для входа
  const loginCaptchaQuestion = document.getElementById('captcha-question');
  const loginCaptchaInput = document.getElementById('captcha-input');
  // Элементы капчи для регистрации
  const regCaptchaQuestion = document.getElementById('reg-captcha-question');
  const regCaptchaInput = document.getElementById('reg-captcha-input');
  // Формы
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  // Блоки форм для переключения
  const loginSection = document.getElementById('login-section');
  const registerSection = document.getElementById('register-section');
  const toRegisterLink = document.getElementById('to-register');
  const toLoginLink = document.getElementById('to-login');

  function generateCaptchaFor(type) {
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    const sum = num1 + num2;
    if (type === 'login' && loginCaptchaQuestion && loginCaptchaInput) {
      captchaAnswerLogin = sum;
      loginCaptchaQuestion.textContent = `Сколько будет ${num1} + ${num2}?`;
      loginCaptchaInput.value = '';
    }
    if (type === 'register' && regCaptchaQuestion && regCaptchaInput) {
      captchaAnswerRegister = sum;
      regCaptchaQuestion.textContent = `Сколько будет ${num1} + ${num2}?`;
      regCaptchaInput.value = '';
    }
  }
  // При загрузке страницы генерируем капчу для формы входа, если она есть
  if (loginCaptchaQuestion) {
    generateCaptchaFor('login');
  }

  // Переключение между формами входа и регистрации
  if (toRegisterLink && loginSection && registerSection) {
    toRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginSection) loginSection.style.display = 'none';
      if (registerSection) registerSection.style.display = 'block';
      // Сгенерировать новую капчу для регистрации
      generateCaptchaFor('register');
    });
  }
  if (toLoginLink && loginSection && registerSection) {
    toLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (registerSection) registerSection.style.display = 'none';
      if (loginSection) loginSection.style.display = 'block';
      // Сгенерировать новую капчу для входа
      generateCaptchaFor('login');
    });
  }

  // Обработчик формы входа
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userAnswer = parseInt(loginCaptchaInput.value, 10);
      if (captchaAnswerLogin !== null && userAnswer === captchaAnswerLogin) {
        alert('Вход выполнен успешно');
        // Здесь могла бы быть логика авторизации
      } else {
        alert('Неверный ответ на капчу. Попробуйте ещё раз.');
        generateCaptchaFor('login');
      }
    });
  }
  // Обработчик формы регистрации
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userAnswer = parseInt(regCaptchaInput.value, 10);
      if (captchaAnswerRegister !== null && userAnswer === captchaAnswerRegister) {
        alert('Регистрация прошла успешно');
        // После успешной регистрации переключаемся на форму входа
        if (registerSection) registerSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'block';
        generateCaptchaFor('login');
      } else {
        alert('Неверный ответ на капчу. Попробуйте ещё раз.');
        generateCaptchaFor('register');
      }
    });
  }

  // Глобальные функции переключения между формами (используются в атрибутах onclick)
  window.switchToRegister = () => {
    if (loginSection) loginSection.style.display = 'none';
    if (registerSection) registerSection.style.display = 'block';
    generateCaptchaFor('register');
  };
  window.switchToLogin = () => {
    if (registerSection) registerSection.style.display = 'none';
    if (loginSection) loginSection.style.display = 'block';
    generateCaptchaFor('login');
  };

  /* ===== Music player handling ===== */
  const audio = document.getElementById('audio');
  const playlistItems = document.querySelectorAll('#playlist li');
  const currentTitle = document.getElementById('current-title');
  const currentArtist = document.getElementById('current-artist');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progress = document.getElementById('progress');
  const trackCoverImage = document.getElementById('track-cover-image');
  let currentIndex = 0;

  function loadTrack(index) {
    if (!audio || !playlistItems.length) return;
    const item = playlistItems[index];
    if (!item) return;
    currentIndex = index;
    const src = item.dataset.src || '';
    audio.src = src;
    // Обновляем информацию о треке
    currentTitle.textContent = item.dataset.title || '';
    currentArtist.textContent = item.dataset.artist || '';
    // Обновляем обложку
    const cover = item.dataset.cover || '';
    trackCoverImage.src = cover;

    // Обновляем длительность трека
    const duration = item.dataset.duration || '0:00';
    document.getElementById('track-duration').textContent = `0:00 / ${duration}`;

    playlistItems.forEach((li) => li.classList.remove('active'));
    item.classList.add('active');

    if (progress) progress.value = 0;
  }

  // Воспроизведение/Пауза
  playBtn.addEventListener('click', function () {
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸';
    } else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  });

  // Предыдущий трек
  prevBtn.addEventListener('click', function () {
    if (!playlistItems.length) return;
    currentIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
    loadTrack(currentIndex);
  });

  // Следующий трек
  nextBtn.addEventListener('click', function () {
    if (!playlistItems.length) return;
    currentIndex = (currentIndex + 1) % playlistItems.length;
    loadTrack(currentIndex);
  });

  // Обновление прогресса
  audio.addEventListener('timeupdate', function () {
    if (!progress || isNaN(audio.duration)) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.value = percent;

    // Обновляем текст длительности
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);

    document.getElementById('track-duration').textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
  });

  // Перемотка по прогресс-бару
  progress.addEventListener('input', function () {
    if (!audio || isNaN(audio.duration)) return;
    const seekTime = (progress.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  });

  // Обработка смены трека по завершению
  audio.addEventListener('ended', function () {
    currentIndex = (currentIndex + 1) % playlistItems.length; // Переключаемся на следующий трек
    loadTrack(currentIndex); // Загружаем новый трек
  });

  // Регулировка громкости
  const volumeSlider = document.getElementById('volume');
  volumeSlider.addEventListener('input', function () {
    audio.volume = volumeSlider.value;
  });

  // Слушаем клики по плейлисту
  playlistItems.forEach((item, idx) => {
    item.addEventListener('click', function () {
      loadTrack(idx);
    });
  });

  // Загружаем первый трек по умолчанию
  loadTrack(currentIndex);
});
