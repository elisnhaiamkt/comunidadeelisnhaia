/**
 * main.js
 * -----------------------------------------------------------------------
 * Orquestra a página:
 *  1. Carrega config.json (dados de negócio)
 *  2. Popula o DOM (entregáveis, canais, FAQ, oferta)
 *  3. Liga interações (menu mobile, header ao rolar, acordeão de FAQ,
 *     revelação de seções ao entrar na viewport)
 *
 * Depende de variables.js para seletores/constantes técnicas. Nenhum
 * valor de negócio (preço, textos, links) fica hardcoded aqui.
 * -----------------------------------------------------------------------
 */

import { PATHS, SELECTORS, TIMING, CLASSNAMES } from "./variables.js";

async function loadConfig() {
  try {
    const response = await fetch(PATHS.config);
    if (!response.ok) throw new Error(`Falha ao carregar ${PATHS.config}: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(
      "[Elis Nhaia] Não foi possível carregar config.json. " +
      "Se você abriu o arquivo direto (file://), rode um servidor local. Veja o README.",
      error
    );
    return null;
  }
}

function populateEntregaveis(config) {
  const list = document.querySelector(SELECTORS.entregaveisList);
  const template = document.querySelector(SELECTORS.entregavelTemplate);
  if (!list || !template || !config?.entregaveis) return;

  config.entregaveis.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".card__title").textContent = item.titulo;
    node.querySelector(".card__text").textContent = item.descricao;
    list.appendChild(node);
  });
}

function populateCanais(config) {
  const list = document.querySelector(SELECTORS.canaisList);
  const template = document.querySelector(SELECTORS.canalTemplate);
  if (!list || !template || !config?.canais) return;

  config.canais.forEach((canal) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".canal-card__emoji").textContent = canal.emoji;
    node.querySelector(".canal-card__title").textContent = canal.nome;
    node.querySelector(".canal-card__text").textContent = canal.descricao;
    list.appendChild(node);
  });
}

function populateFaq(config) {
  const list = document.querySelector(SELECTORS.faqList);
  const template = document.querySelector(SELECTORS.faqItemTemplate);
  if (!list || !template || !config?.faq) return;

  config.faq.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".faq-item__question-text").textContent = item.pergunta;
    node.querySelector(".faq-item__answer p").textContent = item.resposta;
    list.appendChild(node);
  });

  bindFaqAccordion(list);
}

function bindFaqAccordion(list) {
  list.querySelectorAll(".faq-item__question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const answer = item.querySelector(".faq-item__answer");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      // Fecha os outros itens abertos (comportamento de acordeão único).
      list.querySelectorAll(".faq-item__question[aria-expanded='true']").forEach((openBtn) => {
        if (openBtn !== button) {
          openBtn.setAttribute("aria-expanded", "false");
          openBtn.closest(".faq-item").querySelector(".faq-item__answer").style.maxHeight = null;
        }
      });

      button.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
  });
}

function populateOferta(config) {
  if (!config?.oferta) return;
  const { preco, precoParcelado, linkCheckout, textoBotaoPrincipal, garantia, vagas } = config.oferta;

  document.querySelectorAll(SELECTORS.ctaPrice).forEach((el) => {
    el.textContent = preco;
  });
  document.querySelectorAll(SELECTORS.ctaPriceParcelado).forEach((el) => {
    el.textContent = precoParcelado || "";
  });
  document.querySelectorAll(SELECTORS.ctaButtons).forEach((el) => {
    if (linkCheckout) el.setAttribute("href", linkCheckout);
    if (textoBotaoPrincipal) el.textContent = textoBotaoPrincipal;
  });

  const guaranteeEl = document.querySelector(SELECTORS.guaranteeText);
  if (guaranteeEl && garantia?.texto) {
    guaranteeEl.textContent = garantia.texto;
  }

  const urgencyEl = document.querySelector(SELECTORS.urgencyBanner);
  if (urgencyEl && vagas?.limitadas && vagas?.textoUrgencia) {
    urgencyEl.textContent = vagas.textoUrgencia;
    urgencyEl.hidden = false;
  }
}

function bindMobileNav() {
  const nav = document.querySelector(SELECTORS.nav);
  const toggle = document.querySelector(SELECTORS.navToggle);
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle(CLASSNAMES.isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove(CLASSNAMES.isOpen);
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function bindHeaderScrollState() {
  const header = document.querySelector(SELECTORS.header);
  if (!header) return;

  const update = () => {
    header.classList.toggle(CLASSNAMES.isScrolled, window.scrollY > TIMING.headerScrollOffset);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function bindScrollReveal() {
  const items = document.querySelectorAll(SELECTORS.revealItems);
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add(CLASSNAMES.isVisible));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(CLASSNAMES.isVisible);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: TIMING.scrollRevealThreshold }
  );

  items.forEach((el) => observer.observe(el));
}

function stampYear() {
  const el = document.querySelector(SELECTORS.yearStamp);
  if (el) el.textContent = new Date().getFullYear();
}

async function init() {
  bindMobileNav();
  bindHeaderScrollState();
  bindScrollReveal();
  stampYear();

  const config = await loadConfig();
  if (!config) return;

  populateEntregaveis(config);
  populateCanais(config);
  populateFaq(config);
  populateOferta(config);
}

document.addEventListener("DOMContentLoaded", init);
