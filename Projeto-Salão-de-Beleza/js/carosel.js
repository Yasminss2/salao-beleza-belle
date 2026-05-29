(() => {
  let slideIndex = 1;

  const slides = Array.from(document.getElementsByClassName("slide"));
  const dots   = Array.from(document.getElementsByClassName("dot"));

  // evita múltiplos timers caso o script seja carregado mais de uma vez
  let timerId = null;
  const autoplayIntervalMs = 5000;

  function clampIndex(n) {
    const count = slides.length;
    if (count === 0) return 1;
    if (n > count)  return 1;
    if (n < 1)      return count;
    return n;
  }

  function render() {
    const count = slides.length;
    if (count === 0) return;

    slideIndex = clampIndex(slideIndex);

    slides.forEach((slide, i) => {
      const isActive = i === slideIndex - 1;
      // Usa apenas classe — NÃO define display inline para permitir animação CSS
      slide.classList.toggle("is-active", isActive);
    });

    // Atualiza dots
    const activeDotIndex = dots.length ? (slideIndex - 1) % dots.length : -1;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === activeDotIndex);
    });
  }

  function plusSlides(n) {
    slideIndex += n;
    render();
    restartAutoplay();
  }

  function currentSlide(n) {
    slideIndex = n;
    render();
    restartAutoplay();
  }

  function startAutoplay() {
    if (timerId) return;
    timerId = setInterval(() => {
      slideIndex++;
      render();
    }, autoplayIntervalMs);
  }

  function stopAutoplay() {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = null;
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Pausa ao interagir (hover/focus) — melhora UX e evita "pulos"
  const carousel = document.querySelector(".carousel-container");
  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin",    stopAutoplay);
    carousel.addEventListener("focusout",   startAutoplay);
  }

  // Suporte a teclado nos botões de navegação
  document.querySelectorAll(".prev, .next").forEach(btn => {
    btn.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Suporte a teclado nos dots
  dots.forEach((dot, i) => {
    dot.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        currentSlide(i + 1);
      }
    });
  });

  // Expõe funções globais para manter compatibilidade com onclick inline do HTML
  window.plusSlides    = plusSlides;
  window.currentSlide  = currentSlide;

  render();
  startAutoplay();
})();
