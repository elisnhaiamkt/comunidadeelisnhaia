/**
 * variables.js
 * -----------------------------------------------------------------------
 * Constantes de front-end usadas pelo main.js.
 * Diferente de config.json (dados de negócio: preço, links, textos),
 * este arquivo guarda apenas valores técnicos de comportamento/UI:
 * seletores, breakpoints, durações de animação e caminhos.
 *
 * Alterar aqui não muda conteúdo comercial da página, apenas comportamento.
 * -----------------------------------------------------------------------
 */

export const PATHS = {
  config: "config.json",
};

export const SELECTORS = {
  nav: "[data-nav]",
  navToggle: "[data-nav-toggle]",
  navLinks: "[data-nav-link]",
  header: "[data-header]",
  faqList: "[data-faq-list]",
  faqItemTemplate: "[data-faq-item-template]",
  entregaveisList: "[data-entregaveis-list]",
  entregavelTemplate: "[data-entregavel-template]",
  canaisList: "[data-canais-list]",
  canalTemplate: "[data-canal-template]",
  ctaButtons: "[data-cta-button]",
  ctaPrice: "[data-cta-price]",
  ctaPriceParcelado: "[data-cta-price-parcelado]",
  guaranteeText: "[data-guarantee-text]",
  urgencyBanner: "[data-urgency-banner]",
  revealItems: "[data-reveal]",
  yearStamp: "[data-year]",
};

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1100,
};

export const TIMING = {
  scrollRevealThreshold: 0.15,
  faqTransitionMs: 260,
  headerScrollOffset: 40,
};

export const CLASSNAMES = {
  isOpen: "is-open",
  isVisible: "is-visible",
  isScrolled: "is-scrolled",
};
