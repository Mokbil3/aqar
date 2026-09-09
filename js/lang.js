// js/lang.js
// Shared language + RTL support for all Aqar pages.
// Usage: include this script on every page (before your page-specific script),
// then mark translatable elements with data-i18n="key" instead of hardcoded text.
//
// Example:
//   <h1 data-i18n="heroTitle">Find your next home in the UAE</h1>
//   <button id="langToggleBtn" data-i18n="langToggleBtn" onclick="toggleLanguage()">العربية</button>
//
// For placeholder text (inputs) use data-i18n-placeholder="key" instead.

const siteTranslations = {
  en: {
    navHome: "Home",
    navProperties: "Properties",
    langToggleBtn: "العربية",
    heroTitle: "Find your next home in the UAE",
    heroSubtitle: "Browse verified listings for sale and for rent, from Palm Jumeirah villas to Ajman townhouses.",
    optPurpose: "Sale or rent",
    optSale: "For sale",
    optRent: "For rent",
    optCountry: "Country",
    optCity: "City",
    optType: "Property type",
    optVilla: "Villa",
    optApartment: "Apartment",
    optTownhouse: "Townhouse",
    searchBtn: "Search",
    featuredTitle: "Featured properties",
    loadingText: "Loading properties…",
    ctaTitle: "List your property with Aqar",
    ctaSubtitle: "Reach buyers and tenants across the UAE.",
    ctaBtn: "Get started",
    footerText: "© 2026 Aqar. All rights reserved."
  },
  ar: {
    navHome: "الرئيسية",
    navProperties: "العقارات",
    langToggleBtn: "English",
    heroTitle: "اعثر على منزلك القادم في الإمارات",
    heroSubtitle: "تصفح إعلانات موثقة للبيع والإيجار، من فلل نخلة جميرا إلى تاون هاوس عجمان.",
    optPurpose: "بيع أو إيجار",
    optSale: "للبيع",
    optRent: "للإيجار",
    optCountry: "الدولة",
    optCity: "المدينة",
    optType: "نوع العقار",
    optVilla: "فيلا",
    optApartment: "شقة",
    optTownhouse: "تاون هاوس",
    searchBtn: "بحث",
    featuredTitle: "عقارات مميزة",
    loadingText: "جارٍ تحميل العقارات…",
    ctaTitle: "أدرج عقارك مع عقار",
    ctaSubtitle: "تواصل مع المشترين والمستأجرين في جميع أنحاء الإمارات.",
    ctaBtn: "ابدأ الآن",
    footerText: "© 2026 عقار. جميع الحقوق محفوظة."
  }
};

let currentLang = localStorage.getItem("aqar_lang") || "en";

/**
 * Applies the current language to every element on the page that has
 * a data-i18n or data-i18n-placeholder attribute, and flips dir/lang
 * on <html>. Safe to call on any page — pages with no matching elements
 * simply do nothing for those keys.
 */
function applySiteLanguage() {
  const t = siteTranslations[currentLang];
  if (!t) return;

  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key] !== undefined) {
      el.setAttribute("placeholder", t[key]);
    }
  });

  const htmlRoot = document.getElementById("htmlRoot") || document.documentElement;
  htmlRoot.setAttribute("lang", currentLang);
  htmlRoot.setAttribute("dir", currentLang === "ar" ? "rtl" : "ltr");

  // Let page-specific scripts react to a language change if they need to
  // (e.g. re-populating a dropdown's placeholder option).
  document.dispatchEvent(new CustomEvent("aqar:langchange", { detail: { lang: currentLang } }));
}

function toggleLanguage() {
  currentLang = currentLang === "en" ? "ar" : "en";
  localStorage.setItem("aqar_lang", currentLang);
  applySiteLanguage();
}

document.addEventListener("DOMContentLoaded", applySiteLanguage);
