<script>
/* ВЕРСІЯ-МАРКЕР: для перевірки в консолі, що завантажена нова збірка. */
console.log("%cRohrstöcke theme JS v5 (product-stable)", "color:#b7773d;font-weight:bold;");

/* ========== 1) RS WOOD THEME INIT (клас + анімації) ========== */
(function () {
  if (!document.documentElement.classList.contains("rs-wood")) {
    document.documentElement.classList.add("rs-wood");
  }

  function activateRsAnimations() {
    var els = document.querySelectorAll("[data-rs-animate]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("rs-in-view");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("rs-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", activateRsAnimations);
  } else {
    activateRsAnimations();
  }
})();

/* ========== 2) RS HEADER OVERRIDE (новий хедер + перенос меню/іконок/пошуку + ACRIS Vorschau) ========== */
(function () {
  var LOGO_URL =
    "https://fetisch-hof.de/media/33/5a/69/1767889283/3FD9C9B8-EA1D-4CB5-8FCC-367D17254F65%20(1).png?ts=1767889283";

  // максимум, до якого вважаємо, що це «мобайл» (телефон + планшет)
  var MOBILE_MAX = 1024;

  if (!document.documentElement.classList.contains("rs-wood")) {
    document.documentElement.classList.add("rs-wood");
  }

  function buildHeader() {
    var header = document.querySelector("header.header-main");
    if (!header) {
      return;
    }

    // якщо вже зібраний — не дублюємо
    if (header.querySelector(".rs-header-nav")) {
      document.documentElement.classList.add("rs-header-built");
      return;
    }

    // === ДЖЕРЕЛА: меню, екшени, пошук ===
    var srcList =
      header.querySelector(".nav-main .navbar-nav") ||
      header.querySelector(".main-navigation .main-navigation-menu") ||
      header.querySelector(".main-navigation .tw-main-navigation-menu") ||
      header.querySelector(".tw-main-navigation-menu") ||
      header.querySelector(".nav-main ul") ||
      header.querySelector(".main-navigation ul") ||
      document.querySelector(".tw-main-navigation-menu") ||
      document.querySelector(".main-navigation-menu") ||
      document.querySelector(".nav-main .navbar-nav") ||
      document.querySelector(".nav-main ul");

    var actionsCol =
      header.querySelector(".header-actions-col") ||
      header.querySelector(".header-actions") ||
      document.querySelector(".header-actions-col") ||
      document.querySelector(".header-actions");

    var searchCollapse =
      header.querySelector("#searchCollapse") ||
      document.querySelector("#searchCollapse");

    // === СТВОРЮЄМО НОВУ НАВБАРУ ===
    var navWrapper = document.createElement("div");
    navWrapper.className = "rs-header-nav";
    navWrapper.innerHTML =
      '<div class="rs-header-nav__inner">' +
      '  <div class="rs-header-nav__brand-block">' +
      '    <a href="/" aria-label="Zur Startseite" class="rs-header-nav__brand-logo">' +
      '      <img src="' +
      LOGO_URL +
      '" alt="Rohrstöcke Logo" />' +
      "    </a>" +
      '    <div class="rs-header-nav__brand">' +
      '      <div class="rs-header-nav__brand-main">Rohrstöcke</div>' +
      '      <div class="rs-header-nav__brand-sub">HANDGEFERTIGT IN BERLIN</div>' +
      "    </div>" +
      '    <div class="rs-header-nav__search"></div>' +
      "  </div>" +
      '  <div class="rs-header-nav__search-row"></div>' + // чисто мобільний рядок для пошуку
      '  <nav class="rs-header-nav__nav" aria-label="Hauptnavigation">' +
      '    <ul class="rs-header-nav__list"></ul>' +
      "  </nav>" +
      '  <div class="rs-header-nav__actions">' +
      '    <div class="rs-header-nav__actions-top"></div>' +
      '    <div class="rs-header-nav__actions-bottom"></div>' +
      "  </div>" +
      "</div>";

    header.appendChild(navWrapper);

    // === МЕНЮ (якщо знайдено) ===
    var targetList = navWrapper.querySelector(".rs-header-nav__list");
    if (targetList && srcList) {
      if (srcList.tagName && srcList.tagName.toLowerCase() === "ul") {
        targetList.innerHTML = srcList.innerHTML;
      } else {
        var srcUl = srcList.querySelector("ul");
        if (srcUl) {
          targetList.innerHTML = srcUl.innerHTML;
        }
      }
    }

    // === ЕКШЕН-ІКОНКИ (Wunschzettel / Konto / Warenkorb) ===
    var actionsTop = navWrapper.querySelector(".rs-header-nav__actions-top");
    var actionsBottom = navWrapper.querySelector(".rs-header-nav__actions-bottom");

    if (actionsCol && actionsTop) {
      // ВАЖЛИВО: переносимо (НЕ копіюємо) реальні вузли екшенів.
      // Якщо робити actionsTop.innerHTML = actionsCol.innerHTML, віджет корзини
      // дублюється, Shopware ініціалізує OffCanvasCartPlugin двічі, і один клік
      // «в корзину» шле два POST /checkout/line-item/add (302 + 409, подвоєна к-сть).
      // Переміщення вузлів зберігає один уже ініціалізований екземпляр плагіна.
      while (actionsCol.firstChild) {
        actionsTop.appendChild(actionsCol.firstChild);
      }

      // ВИДАЛЯЄМО кнопку меню та мобільний search-toggle всередині нового хедера
      actionsTop
        .querySelectorAll(
          ".nav-main-toggle-btn, .menu-button, .search-toggle, .twt-search-col"
        )
        .forEach(function (el) {
          if (el && el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });

      // прибираємо можливі наші старі елементи
      var oldStuff = actionsTop.querySelectorAll(
        ".rs-header-service, .rs-header-time, .rs-header-service-block, .rs-header-dot"
      );
      oldStuff.forEach(function (el) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });

      if (actionsBottom) {
        var service = document.createElement("span");
        service.className = "rs-header-service";
        service.textContent = "Service: +49 (0)30-40509713";

        var time = document.createElement("span");
        time.className = "rs-header-time";
        time.textContent = "Mo–Sa 14–18 Uhr";

        actionsBottom.appendChild(service);
        actionsBottom.appendChild(time);
      }

      // старий блок екшенів ховаємо
      actionsCol.style.display = "none";
    } else {
      if (actionsTop) actionsTop.style.display = "none";
      if (actionsBottom) actionsBottom.style.display = "none";
    }

    // === ПОШУК: переносимо searchCollapse в .rs-header-nav__search (десктоп позиція) ===
    var searchTarget = navWrapper.querySelector(
      ".rs-header-nav__brand-block .rs-header-nav__search"
    );
    if (searchCollapse && searchTarget) {
      searchCollapse.classList.remove("my-2", "m-sm-auto");
      searchTarget.appendChild(searchCollapse);
    }

    // === ПОМІТКА, ЩО НОВИЙ ХЕДЕР ГОТОВИЙ (ховаємо старий) ===
    document.documentElement.classList.add("rs-header-built");
  }

  // пересаджуємо блок пошуку між brand-block (десктоп) та search-row (мобайл+планшет)
  function relocateSearch() {
    var inner = document.querySelector(".rs-header-nav__inner");
    if (!inner) return;

    var brandBlock = inner.querySelector(".rs-header-nav__brand-block");
    var searchRow = inner.querySelector(".rs-header-nav__search-row");
    var searchBox = inner.querySelector(".rs-header-nav__search");

    if (!brandBlock || !searchRow || !searchBox) return;

    if (window.innerWidth <= MOBILE_MAX) {
      // мобільна / планшетна версія: переносимо пошук в окремий рядок
      if (searchBox.parentNode !== searchRow) {
        searchRow.appendChild(searchBox);
      }
    } else {
      // десктоп: повертаємо пошук в brand-block
      if (searchBox.parentNode !== brandBlock) {
        brandBlock.appendChild(searchBox);
      }
    }
  }

  function updateMobileClass() {
    if (window.innerWidth <= MOBILE_MAX) {
      document.documentElement.classList.add("rs-mobile");
    } else {
      document.documentElement.classList.remove("rs-mobile");
    }
  }

  function setupMobileSearch() {
    if (window.innerWidth > MOBILE_MAX) return;

    var searchInput = document.querySelector(
      ".rs-header-nav__search .header-search-input"
    );
    var searchContainer = document.querySelector(".rs-header-nav__search");

    if (!searchInput || !searchContainer) return;

    // щоб не дублювати слухачі при resize
    if (searchInput.dataset.rsMobileBound === "1") return;
    searchInput.dataset.rsMobileBound = "1";

    searchInput.addEventListener("focus", function () {
      document.documentElement.classList.add("rs-search-focused");
    });

    searchInput.addEventListener("blur", function () {
      if (!searchInput.value) {
        document.documentElement.classList.remove("rs-search-focused");
      }
    });

    if (!document.__rsMobileSearchClickBound) {
      document.__rsMobileSearchClickBound = true;
      document.addEventListener("click", function (e) {
        if (!searchContainer.contains(e.target) && e.target !== searchInput) {
          if (!searchInput.value) {
            document.documentElement.classList.remove("rs-search-focused");
          }
        }
      });
    }
  }

  /* === ACRIS SEARCH SUGGEST – MOVE TO OUR HEADER === */
  function ensureSearchSuggestInHeader(node) {
    if (!node) return;

    var suggest =
      node.closest && node.closest(".search-suggest.js-search-result")
        ? node.closest(".search-suggest.js-search-result")
        : (node.matches &&
           node.matches(".search-suggest.js-search-result")
           ? node
           : null);

    if (!suggest) return;

    var headerInner = document.querySelector(".rs-header-nav__inner");
    if (!headerInner) return;

    var searchRow =
      headerInner.querySelector(".rs-header-nav__search-row") ||
      headerInner.querySelector(".rs-header-nav__brand-block") ||
      headerInner;

    if (suggest.parentNode !== searchRow) {
      searchRow.appendChild(suggest);

      // базове позиціонування під пошуком по всій ширині
      suggest.style.position = "absolute";
      suggest.style.left = "0";
      suggest.style.right = "0";
      suggest.style.width = "100%";
      suggest.style.top = "100%";
      suggest.style.zIndex = "99999";
    }
  }

  function startSearchSuggestObserver() {
    // якщо вже є блок – одразу переносимо
    var existing = document.querySelector(".search-suggest.js-search-result");
    if (existing) {
      ensureSearchSuggestInHeader(existing);
    }

    if (!("MutationObserver" in window)) return;

    var obs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;

          if (
            node.matches(".search-suggest.js-search-result") ||
            node.matches(".search-suggest-container") ||
            node.matches(".search-suggest") ||
            node.classList.contains("js-search-result")
          ) {
            ensureSearchSuggestInHeader(node);
          } else {
            var inner = node.querySelector &&
              node.querySelector(".search-suggest.js-search-result");
            if (inner) {
              ensureSearchSuggestInHeader(inner);
            }
          }
        });
      });
    });

    obs.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function initMobile() {
    updateMobileClass();
    relocateSearch();
    setupMobileSearch();
  }

  // Ініціалізація
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      buildHeader();
      initMobile();
      startSearchSuggestObserver();
    });
  } else {
    buildHeader();
    initMobile();
    startSearchSuggestObserver();
  }

  // Оновлюємо класи при зміні розміру вікна
  window.addEventListener("resize", function () {
    updateMobileClass();
    relocateSearch();
    setupMobileSearch();
  });
})();

/* ========== 3) RS PRODUCT DETAIL ENHANCEMENTS (variant pills + анімація блоків) ========== */
(function () {
  if (!document.documentElement.classList.contains("rs-wood")) return;

  // УВАГА: у Shopware/ThemeWare клас is-ctl-product сидить на <body>, а не на <html>.
  // Перевіряємо обидва (і робимо це під час init, коли body вже існує).
  function rsIsProductPage() {
    var html = document.documentElement;
    var body = document.body;
    return (
      html.classList.contains("is-ctl-product") ||
      (body && body.classList.contains("is-ctl-product"))
    );
  }

  // Анімації блоків товару та конвертацію варіантів у pill ВИМКНЕНО:
  //  - data-rs-animate ставив opacity:0 і ховав контент (спостерігач rs-in-view
  //    встигав відпрацювати раніше, ніж блоки отримували атрибут);
  //  - варіанти лишаємо рідним випадаючим списком Shopware (<select>),
  //    стилізованим у секції 7.5 CSS — як у первинній версії.
  // IIFE лишаємо як точку входу для майбутніх product-енхансментів.

  /* ===== RS GALLERY AUTO-HEIGHT =====
     Фото товару всі різного розміру, а tns-слайдер тримає висоту "вікна"
     по найвищому слайду → для нижчих фото зверху/знизу порожнеча.
     Тут на кожне перемикання слайда виставляємо висоту видимого вікна
     (.tns-ovh) рівно під АКТИВНЕ фото. CSS (секція 11.3) уже зняв жорсткі
     height/min-height з контейнерів і обмежив фото max-height:72vh. */
  function rsFitGallery() {
    var galleries = document.querySelectorAll(
      ".product-detail-media .gallery-slider"
    );
    galleries.forEach(function (g) {
      var ovh = g.querySelector(".tns-ovh");
      if (!ovh) return;
      // активне фото (перший видимий активний слайд); фолбек — перше фото
      var img = null;
      var actives = g.querySelectorAll(".tns-slide-active img");
      for (var i = 0; i < actives.length; i++) {
        if (actives[i].getBoundingClientRect().width > 0) {
          img = actives[i];
          break;
        }
      }
      if (!img) img = g.querySelector(".gallery-slider-item img");
      if (!img) return;

      var apply = function () {
        var h = Math.round(img.getBoundingClientRect().height);
        if (h > 10) ovh.style.setProperty("height", h + "px", "important");
      };
      if (img.complete && img.naturalHeight) apply();
      else img.addEventListener("load", apply, { once: true });
    });
  }

  /* Стрілки гортання тема ховає через opacity:0 на .gallery-slider-controls
     (показ лише на hover) правилом із крос-origin CSS, яке не перебити
     селектором. Тому робимо їх постійно видимими тут (inline !important). */
  function rsRevealArrows() {
    document
      .querySelectorAll(".product-detail-media .gallery-slider-controls")
      .forEach(function (c) {
        c.style.setProperty("opacity", "1", "important");
        c.style.setProperty("visibility", "visible", "important");
      });
  }

  function rsSetupGalleryAutoHeight() {
    if (!document.querySelector(".product-detail-media")) return;

    rsFitGallery();
    rsRevealArrows();
    // tns ініціалізується асинхронно — перерахунок ще кілька разів
    setTimeout(function () { rsFitGallery(); rsRevealArrows(); }, 250);
    setTimeout(function () { rsFitGallery(); rsRevealArrows(); }, 700);
    setTimeout(function () { rsFitGallery(); rsRevealArrows(); }, 1500);

    // реагуємо на зміну активного слайда (tns перемикає клас tns-slide-active)
    document
      .querySelectorAll(".product-detail-media .gallery-slider")
      .forEach(function (g) {
        if (g.__rsAhBound) return;
        g.__rsAhBound = true;
        if (!("MutationObserver" in window)) return;
        var obs = new MutationObserver(function () {
          clearTimeout(g.__rsAhT);
          g.__rsAhT = setTimeout(rsFitGallery, 30);
        });
        obs.observe(g, {
          subtree: true,
          attributes: true,
          attributeFilter: ["class"]
        });
      });

    // ресайз вікна
    if (!window.__rsAhResize) {
      window.__rsAhResize = true;
      window.addEventListener("resize", function () {
        clearTimeout(window.__rsAhRT);
        window.__rsAhRT = setTimeout(rsFitGallery, 120);
      });
    }
  }

  function initProductDetail() {
    if (!rsIsProductPage()) return;
    rsSetupGalleryAutoHeight();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductDetail);
  } else {
    initProductDetail();
  }
})();
</script>
