// Language: ?lang=el|en, then the last choice, then the browser's language; English otherwise.
// Each page sets its titles on <html data-title-en data-title-el>. Links marked data-keep-lang carry the choice.
(function () {
  var root = document.documentElement;
  var titles = { en: root.dataset.titleEn, el: root.dataset.titleEl };
  function stored() { try { return localStorage.getItem("pawlog-lang"); } catch (e) { return null; } }
  function remember(l) { try { localStorage.setItem("pawlog-lang", l); } catch (e) {} }
  function apply(l) {
    root.lang = l;
    root.setAttribute("data-lang", l);
    document.title = titles[l];
    document.querySelectorAll(".langs a").forEach(function (a) {
      a.setAttribute("aria-current", a.dataset.set === l ? "true" : "false");
    });
    document.querySelectorAll("a[data-keep-lang]").forEach(function (a) {
      a.href = a.getAttribute("href").split("?")[0] + "?lang=" + l;
    });
  }
  var param = new URLSearchParams(location.search).get("lang");
  var browser = (navigator.language || "").toLowerCase().indexOf("el") === 0 ? "el" : "en";
  var saved = stored();
  apply(titles[param] ? param : (titles[saved] ? saved : browser));
  document.querySelectorAll(".langs a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      apply(a.dataset.set);
      remember(a.dataset.set);
      history.replaceState(null, "", "?lang=" + a.dataset.set);
    });
  });
})();
