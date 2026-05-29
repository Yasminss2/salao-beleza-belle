# TODO - Ajustes no Carrossel

- [x] Atualizar `js/carosel.js` para:
  - [x] inicializar de forma segura (sem quebrar se houver menos slides/dots)
  - [x] melhorar animação (usar classes/opacity ao invés de só `display`)
  - [x] pausar autoplay em hover/focus
  - [x] evitar múltiplos timers
- [x] Atualizar `css/estilo.css` para:
  - [x] garantir que o carrossel fique abaixo do menu (ajuste de margens/altura)
  - [x] corrigir altura/`height` e responsividade das imagens
- [x] Atualizar `html/index.html` para acessibilidade:
  - [x] adicionar role/tabindex/aria em setas e dots mantendo onclick inline para compatibilidade
  - [ ] remover `onclick` inline se possível (será feito numa próxima iteração; por enquanto mantido para não quebrar)
- [ ] Testar manualmente no navegador:
  - [ ] clique em setas e dots
  - [ ] autoplay
  - [ ] navegação por teclado (Tab + Enter/Espaço)
  - [ ] mobile (abaixo do menu)


