/* ============================================================
   网址导航 — 交互脚本
   数据全部来自 data/sites.js（window.SITES）
   ============================================================ */
(function () {
  "use strict";

  var DATA = window.SITES;
  var ALL = [];
  DATA.categories.forEach(function (cat) {
    cat.items.forEach(function (it) {
      ALL.push({
        title: it.t,
        url: it.u,
        tags: it.g || [],
        catKey: cat.key,
        catName: cat.name,
        hay: (it.t + " " + it.u + " " + (it.g || []).join(" ")).toLowerCase()
      });
    });
  });

  var state = {
    q: "",
    cat: "all",
    tags: [],          // 已选标签（同时满足）
    tagExpanded: false // 标签条是否展开全部
  };

  var el = {
    subtitle: document.getElementById("subtitle"),
    search: document.getElementById("search"),
    clearSearch: document.getElementById("clearSearch"),
    themeToggle: document.getElementById("themeToggle"),
    catList: document.getElementById("catList"),
    tagBar: document.getElementById("tagBar"),
    resultCount: document.getElementById("resultCount"),
    content: document.getElementById("content"),
    emptyState: document.getElementById("emptyState"),
    totalCount: document.getElementById("totalCount"),
    updatedAt: document.getElementById("updatedAt")
  };

  /* ---------- 工具 ---------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // 由域名生成稳定的字母头像与配色
  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); }
    catch (e) { return url.replace(/^https?:\/\//, "").split("/")[0]; }
  }
  function avatarOf(url) {
    var host = hostOf(url);
    var label = host.charAt(0).toUpperCase() || "#";
    var hash = 0;
    for (var i = 0; i < host.length; i++) hash = (hash * 31 + host.charCodeAt(i)) % 360;
    return { label: label, hue: hash };
  }

  function matchQuery(item) {
    if (!state.q) return true;
    return item.hay.indexOf(state.q) !== -1;
  }
  function matchCat(item) {
    return state.cat === "all" || item.catKey === state.cat;
  }
  function matchTags(item) {
    return state.tags.every(function (t) { return item.tags.indexOf(t) !== -1; });
  }
  function visibleItems() {
    return ALL.filter(function (i) { return matchQuery(i) && matchCat(i) && matchTags(i); });
  }

  /* ---------- 渲染 ---------- */
  function renderSidebar() {
    var html = ['<li class="cat-item"><a class="cat-link' + (state.cat === "all" ? " is-active" : "") +
      '" href="#cat=all" data-cat="all">全部<span class="cat-count">' + ALL.length + "</span></a></li>"];
    DATA.categories.forEach(function (c) {
      html.push('<li class="cat-item"><a class="cat-link' + (state.cat === c.key ? " is-active" : "") +
        '" href="#cat=' + c.key + '" data-cat="' + c.key + '">' + escapeHtml(c.name) +
        '<span class="cat-count">' + c.items.length + "</span></a></li>");
    });
    el.catList.innerHTML = html.join("");
  }

  function renderTags() {
    // 标签池：当前分类范围内、且能通过关键词/已选标签匹配的条目
    var pool = ALL.filter(function (i) { return matchCat(i) && matchQuery(i); });
    var counter = {};
    pool.forEach(function (i) {
      i.tags.forEach(function (t) { counter[t] = (counter[t] || 0) + 1; });
    });
    var list = Object.keys(counter).sort(function (a, b) {
      return counter[b] - counter[a] || a.localeCompare(b, "zh");
    });
    if (!list.length) { el.tagBar.innerHTML = ""; return; }

    var LIMIT = 24;
    var shown = state.tagExpanded ? list : list.slice(0, LIMIT);

    var html = shown.map(function (t) {
      var on = state.tags.indexOf(t) !== -1;
      return '<button type="button" class="tag-chip' + (on ? " is-active" : "") +
        '" data-tag="' + escapeHtml(t) + '">' + escapeHtml(t) +
        '<span class="tag-n">' + counter[t] + "</span></button>";
    }).join("");

    if (list.length > LIMIT) {
      html += '<button type="button" class="tag-chip tag-more" data-more="1">' +
        (state.tagExpanded ? "收起" : "更多 " + (list.length - LIMIT) + " 个") + "</button>";
    }
    el.tagBar.innerHTML = html;
  }

  function cardHtml(item) {
    var av = avatarOf(item.url);
    var style = "background:hsl(" + av.hue + ",38%," + (document.documentElement.getAttribute("data-theme") === "light" ? "42%" : "30%") + ")";
    var tags = item.tags.map(function (t) {
      var hit = state.tags.indexOf(t) !== -1 ? " is-hit" : "";
      return '<span class="card-tag' + hit + '">' + escapeHtml(t) + "</span>";
    }).join("");
    return '<a class="card" href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener noreferrer" title="' +
      escapeHtml(item.url) + '">' +
      '<span class="avatar" style="' + style + '">' + escapeHtml(av.label) + "</span>" +
      '<span class="card-body">' +
        '<span class="card-title">' + escapeHtml(item.title) + "</span>" +
        '<span class="card-url">' + escapeHtml(hostOf(item.url)) + "</span>" +
        (tags ? '<span class="card-tags">' + tags + "</span>" : "") +
      "</span></a>";
  }

  function renderContent() {
    var items = visibleItems();
    el.resultCount.textContent = items.length + " / " + ALL.length + " 条";
    el.emptyState.hidden = items.length !== 0;

    if (!items.length) { el.content.innerHTML = ""; return; }

    // 按分类分组（全部视图下分组，单分类视图下只出一个分组）
    var groups = [];
    DATA.categories.forEach(function (c) {
      var list = items.filter(function (i) { return i.catKey === c.key; });
      if (list.length) groups.push({ cat: c, list: list });
    });

    el.content.innerHTML = groups.map(function (g) {
      return '<section class="group">' +
        '<div class="section-head">' +
          '<h2 class="section-title">' + escapeHtml(g.cat.name) +
            '<span class="section-n">' + g.list.length + "</span></h2>" +
          '<p class="section-desc">' + escapeHtml(g.cat.desc) + "</p>" +
        "</div>" +
        '<div class="card-grid">' + g.list.map(cardHtml).join("") + "</div>" +
      "</section>";
    }).join("");
  }

  function render() {
    renderSidebar();
    renderTags();
    renderContent();
    el.clearSearch.hidden = !state.q;
  }

  /* ---------- 状态与 URL 同步 ---------- */
  function readHash() {
    var h = location.hash.replace(/^#/, "");
    if (!h) return false;
    var params = {};
    h.split("&").forEach(function (kv) {
      var p = kv.split("=");
      params[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || "");
    });
    state.cat = params.cat || "all";
    state.q = (params.q || "").toLowerCase();
    state.tags = params.tags ? params.tags.split(",").filter(Boolean) : [];
    state.tagExpanded = false;
    return true;
  }

  function writeHash() {
    var parts = ["cat=" + encodeURIComponent(state.cat)];
    if (state.q) parts.push("q=" + encodeURIComponent(state.q));
    if (state.tags.length) parts.push("tags=" + encodeURIComponent(state.tags.join(",")));
    var next = "#" + parts.join("&");
    if (location.hash !== next) history.replaceState(null, "", next);
  }

  function setState(patch, keepScroll) {
    Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    el.search.value = state.q;
    writeHash();
    render();
    if (!keepScroll) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- 事件 ---------- */
  el.search.addEventListener("input", function () {
    state.q = this.value.trim().toLowerCase();
    writeHash();
    renderTags();
    renderContent();
    el.clearSearch.hidden = !state.q;
  });

  el.clearSearch.addEventListener("click", function () {
    el.search.value = "";
    setState({ q: "" });
    el.search.focus();
  });

  el.catList.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-cat]");
    if (!a) return;
    e.preventDefault();
    setState({ cat: a.getAttribute("data-cat"), tags: [], tagExpanded: false });
  });

  el.tagBar.addEventListener("click", function (e) {
    var more = e.target.closest("button[data-more]");
    if (more) {
      state.tagExpanded = !state.tagExpanded;
      renderTags();
      return;
    }
    var b = e.target.closest("button[data-tag]");
    if (!b) return;
    var tag = b.getAttribute("data-tag");
    var i = state.tags.indexOf(tag);
    if (i === -1) state.tags.push(tag); else state.tags.splice(i, 1);
    state.tagExpanded = false;
    setState({ tags: state.tags.slice() }, true);
  });

  el.themeToggle.addEventListener("click", function () {
    var cur = document.documentElement.getAttribute("data-theme");
    var next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("nav-theme", next); } catch (e) {}
    renderContent();   // 头像配色随主题变化
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== el.search) {
      e.preventDefault();
      el.search.focus();
      el.search.select();
    } else if (e.key === "Escape" && document.activeElement === el.search) {
      el.search.value = "";
      setState({ q: "" });
    }
  });

  window.addEventListener("hashchange", function () {
    readHash();
    el.search.value = state.q;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 启动 ---------- */
  try {
    var saved = localStorage.getItem("nav-theme");
    if (saved) document.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}

  el.subtitle.textContent = DATA.meta.subtitle + " · " + ALL.length + " 条网址 / " + DATA.categories.length + " 个分类";
  el.totalCount.textContent = ALL.length;
  el.updatedAt.textContent = DATA.meta.updated;

  readHash();
  render();
})();
