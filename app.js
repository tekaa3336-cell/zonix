(() => {
  const $ = (id) => document.getElementById(id);

  const safeUrl = (u) => {
    try {
      const p = new URL(u, location.href);
      return p.protocol === "http:" || p.protocol === "https:" ? p.href : null;
    } catch { return null; }
  };

  const load = async (path) => {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${path} (${res.status})`);
    return res.json();
  };

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  function renderSite(site) {
    if (site.brandName) { $("brandName").textContent = site.brandName; document.title = site.brandName; }
    if (site.logo) $("logo").src = site.logo;
    $("brandBio").textContent = site.bio || "";
    $("footNote").textContent = site.footerNote || "";
    $("footCopy").textContent = site.copyright || "";

    const b = site.banner;
    if (b && b.enabled && (b.text || b.code)) {
      $("promoText").textContent = b.text || "";
      const btn = $("promoCode");
      if (b.code) {
        btn.textContent = b.code;
        btn.addEventListener("click", async () => {
          try { await navigator.clipboard.writeText(b.code); }
          catch {
            const t = document.createElement("textarea");
            t.value = b.code; document.body.appendChild(t); t.select();
            document.execCommand("copy"); t.remove();
          }
          btn.textContent = "Copied";
          btn.classList.add("is-copied");
          setTimeout(() => { btn.textContent = b.code; btn.classList.remove("is-copied"); }, 1600);
        });
      } else { btn.hidden = true; }
      $("promo").hidden = false;
    }
  }

  function card(p) {
    const link = safeUrl(p.link);
    const art = el("article", "card");

    const media = el(link ? "a" : "div", "card__media");
    if (link) { media.href = link; media.target = "_blank"; media.rel = "noopener noreferrer sponsored"; media.setAttribute("aria-label", p.title); }
    if (p.image) {
      const img = new Image();
      img.alt = p.title || "";
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 800; img.height = 1000;
      img.onerror = () => { img.remove(); media.classList.add("is-empty"); };
      img.src = p.image;
      media.appendChild(img);
    } else { media.classList.add("is-empty"); }
    if (p.badge) media.appendChild(el("span", "card__badge", p.badge));
    art.appendChild(media);

    const body = el("div", "card__body");
    body.appendChild(el("h2", "card__title", p.title || "Untitled"));
    if (p.price) body.appendChild(el("p", "card__price", p.price));
    if (link) {
      const a = el("a", "card__btn", p.buttonText || "Shop now");
      a.href = link; a.target = "_blank"; a.rel = "noopener noreferrer sponsored";
      body.appendChild(a);
    }
    art.appendChild(body);
    return art;
  }

  async function init() {
    const status = $("status");
    try {
      const [site, products] = await Promise.all([load("site.json"), load("products.json")]);
      renderSite(site);
      const list = (Array.isArray(products) ? products : products.products || []).filter((p) => p && p.active !== false);
      if (!list.length) { status.textContent = "New products arrive soon."; return; }
      const frag = document.createDocumentFragment();
      list.forEach((p) => frag.appendChild(card(p)));
      $("grid").appendChild(frag);
      status.hidden = true;
    } catch (err) {
      console.error(err);
      status.textContent = "Couldn't load the store. Check that products.json is valid JSON.";
    }
  }
  init();
})();
