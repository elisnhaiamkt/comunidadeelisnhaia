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

  list.innerHTML = "";
  config.entregaveis.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".card__kicker").textContent = item.beneficio || "";
    node.querySelector(".card__title").textContent = item.titulo;
    node.querySelector(".card__text").textContent = item.descricao;
    list.appendChild(node);
  });
}

function populateCanais(config) {
  const list = document.querySelector(SELECTORS.canaisList);
  const template = document.querySelector(SELECTORS.canalTemplate);
  if (!list || !template || !config?.canais) return;

  list.innerHTML = "";
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

  list.innerHTML = "";
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

function buildWhatsAppUrl(phone) {
  if (!phone || phone.startsWith("TODO")) return "#";
  const digits = phone.replace(/\D/g, "");
  const message = encodeURIComponent("Olá, quero tirar uma dúvida sobre a Comunidade Elis Nhaia.");
  return `https://wa.me/${digits}?text=${message}`;
}

function populatePlans(config) {
  const list = document.querySelector(SELECTORS.plansList);
  const template = document.querySelector(SELECTORS.planTemplate);
  const plans = config?.oferta?.planos;
  const included = config?.oferta?.incluso || [];
  if (!list || !template || !plans?.length) return;

  list.innerHTML = "";
  plans.forEach((plan) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".plan-card");
    const badge = node.querySelector(".plan-card__badge");
    const includesList = node.querySelector(".plan-card__includes");

    card.classList.toggle("plan-card--featured", Boolean(plan.destaque));
    badge.textContent = plan.badge || "Acesso completo";
    node.querySelector(".plan-card__name").textContent = plan.nome;
    node.querySelector(".plan-card__price").textContent = plan.preco;
    node.querySelector(".plan-card__detail").textContent = plan.detalhe;
    const cta = node.querySelector(SELECTORS.ctaButtons);
    if (plan.linkCheckout) cta.setAttribute("href", plan.linkCheckout);

    included.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      includesList.appendChild(li);
    });

    list.appendChild(node);
  });
}

function populateOferta(config) {
  if (!config?.oferta) return;
  const { textoBotaoPrincipal, garantia, vagas } = config.oferta;
  const whatsappUrl = buildWhatsAppUrl(config?.contato?.whatsapp);

  document.querySelectorAll(SELECTORS.ctaPrice).forEach((el) => {
    el.textContent = config.oferta.planos?.[0]?.preco || "";
  });
  document.querySelectorAll(SELECTORS.ctaPriceParcelado).forEach((el) => {
    el.textContent = config.oferta.planos?.[0]?.detalhe || "";
  });
  document.querySelectorAll(SELECTORS.ctaButtons).forEach((el) => {
    const hasPlanCheckout = el.closest(".plan-card") && el.getAttribute("href") !== "#";
    if (!hasPlanCheckout) {
      el.setAttribute("href", "#planos");
    }
    if (textoBotaoPrincipal) el.textContent = textoBotaoPrincipal;
  });
  document.querySelectorAll(SELECTORS.whatsappButtons).forEach((el) => {
    el.setAttribute("href", whatsappUrl);
    if (whatsappUrl !== "#") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
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

function bindStickyCtaVisibility() {
  const sticky = document.querySelector(SELECTORS.mobileSticky);
  const hero = document.querySelector(".hero");
  if (!sticky || !hero) return;
  if (!("IntersectionObserver" in window)) {
    sticky.classList.add(CLASSNAMES.isVisible);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      sticky.classList.toggle(CLASSNAMES.isVisible, !entry.isIntersecting);
    },
    { threshold: 0.2 }
  );

  observer.observe(hero);
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
  bindStickyCtaVisibility();
  stampYear();

  const config = await loadConfig();
  if (!config) return;

  populateEntregaveis(config);
  populateCanais(config);
  populateFaq(config);
  populatePlans(config);
  populateOferta(config);
}

document.addEventListener("DOMContentLoaded", init);
