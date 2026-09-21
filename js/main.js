// =========================================================
// Tài liệu Lập trình Multiplayer: Socket, WebSocket & Middleware — script dùng chung
// =========================================================
(function () {
  "use strict";

  // ---------- Theme (sáng / tối) ----------
  var root = document.documentElement;
  var THEME_KEY = "mpdocs-theme";

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    var btn = document.getElementById("themeToggle");
    if (btn) {
      var isDark =
        theme === "dark" ||
        (!theme &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      btn.textContent = isDark ? "☀️" : "🌙";
      btn.setAttribute("aria-label", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
    }
  }

  function currentEffectiveTheme() {
    var stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  try {
    applyTheme(localStorage.getItem(THEME_KEY));
  } catch (e) {
    applyTheme(null);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = currentEffectiveTheme() === "dark" ? "light" : "dark";
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
        applyTheme(next);
        initMermaid(true);
      });
    }

    // ---------- Sidebar mobile toggle ----------
    var sidebar = document.getElementById("sidebar");
    var toggleBtn = document.getElementById("sidebarToggle");
    var backdrop = document.getElementById("sidebarBackdrop");

    function closeSidebar() {
      if (sidebar) sidebar.classList.remove("open");
      if (backdrop) backdrop.classList.remove("open");
    }
    function openSidebar() {
      if (sidebar) sidebar.classList.add("open");
      if (backdrop) backdrop.classList.add("open");
    }
    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        if (sidebar && sidebar.classList.contains("open")) closeSidebar();
        else openSidebar();
      });
    }
    if (backdrop) backdrop.addEventListener("click", closeSidebar);

    // Đóng sidebar khi bấm 1 liên kết trên mobile
    document.querySelectorAll(".sidebar nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.innerWidth <= 900) closeSidebar();
      });
    });

    // ---------- Đánh dấu mục đang xem trong sidebar ----------
    var here = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".sidebar nav a").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var file = href.split("/").pop();
      if (file === here) {
        a.classList.add("active");
        setTimeout(function () {
          a.scrollIntoView({ block: "center" });
        }, 0);
      }
    });

    // ---------- Tìm kiếm nhanh trong sidebar ----------
    var searchBox = document.getElementById("sidebarSearch");
    if (searchBox) {
      searchBox.addEventListener("input", function () {
        var q = searchBox.value.trim().toLowerCase();
        document.querySelectorAll(".sidebar nav li").forEach(function (li) {
          var text = li.textContent.toLowerCase();
          li.classList.toggle("hidden", q.length > 0 && text.indexOf(q) === -1);
        });
        document.querySelectorAll(".sidebar .nav-part").forEach(function (h) {
          var next = h.nextElementSibling;
          if (next && next.tagName === "UL") {
            var anyVisible = Array.prototype.some.call(
              next.querySelectorAll("li"),
              function (li) { return !li.classList.contains("hidden"); }
            );
            h.classList.toggle("hidden", q.length > 0 && !anyVisible);
          }
        });
      });
    }

    // ---------- Syntax highlighting ----------
    if (window.hljs) {
      document.querySelectorAll("pre code").forEach(function (block) {
        window.hljs.highlightElement(block);
      });
    }

    // ---------- Mermaid diagrams ----------
    initMermaid(false);
  });

  function initMermaid(rerender) {
    if (!window.mermaid) return;
    var isDark = currentEffectiveTheme() === "dark";
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "loose",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      });
      var nodes = document.querySelectorAll(".mermaid");
      if (rerender) {
        nodes.forEach(function (n) {
          if (!n.getAttribute("data-raw")) {
            n.setAttribute("data-raw", n.textContent);
          }
          n.removeAttribute("data-processed");
          n.innerHTML = n.getAttribute("data-raw");
        });
      }
      window.mermaid.run({ nodes: nodes });
    } catch (e) {
      /* im lặng bỏ qua nếu mermaid lỗi để không chặn phần còn lại của trang */
      console.warn("Mermaid render lỗi:", e);
    }
  }
})();
