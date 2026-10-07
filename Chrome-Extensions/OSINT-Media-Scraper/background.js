// background.js
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzPG0mYDgEVOwDnm1pRsCddRt9BFS3GYNerf1eVVtrd4HoRKFkZwnBMpOJztdYC9Gg/exec";

// ক্যাটাগরি এবং সাব-ক্যাটাগরির ডেটা
const timeEras = [
  { id: "era_all_time", title: "📅 সবসময়ের নিউজ", tbs: "" },
  { id: "era_bnp_past", title: "⏳ বিএনপি ও তত্ত্বাবধায়ক (২০০১-২০১০)", tbs: "cdr:1,cd_min:1/1/2001,cd_max:1/1/2010" },
  { id: "era_league_full_new", title: "⏳ লীগের পুরো আমল (২০০৯-২০২৪)", tbs: "cdr:1,cd_min:1/1/2009,cd_max:8/5/2024" },
  { id: "era_league_24_new", title: "⏳ ২৪ লীগ (২০২৪)", tbs: "cdr:1,cd_min:1/1/2024,cd_max:8/5/2024" },
  { id: "era_quota_1", title: "⏳ কোটা আন্দোলন (জুন-আগস্ট ২০২৪)", tbs: "cdr:1,cd_min:6/1/2024,cd_max:8/31/2024" },
  { id: "era_quota_2", title: "⏳ কোটা আন্দোলনসহ পরবর্তী অস্থিরতা (জুন-ডিসে ২০২৪)", tbs: "cdr:1,cd_min:6/1/2024,cd_max:12/31/2024" },
  { id: "era_interim_new", title: "⏳ ইন্টেরিম (২০২৪-২০২৬)", tbs: "cdr:1,cd_min:8/5/2024,cd_max:2/12/2026" },
  { id: "era_interim_to_present", title: "⏳ ইন্টেরিম থেকে বর্তমান (২০২৪-)", tbs: "cdr:1,cd_min:8/5/2024,cd_max:" },
  { id: "era_bnp_current_new", title: "⏳ বিএনপির বর্তমান আমল (২০২৬-)", tbs: "cdr:1,cd_min:2/12/2026,cd_max:" }
];

const yearlyEras = [
  { id: "era_year_2001", title: "🗓️ ২০০১ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2001,cd_max:12/31/2001" },
  { id: "era_year_2002", title: "🗓️ ২০০২ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2002,cd_max:12/31/2002" },
  { id: "era_year_2003", title: "🗓️ ২০০৩ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2003,cd_max:12/31/2003" },
  { id: "era_year_2004", title: "🗓️ ২০০৪ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2004,cd_max:12/31/2004" },
  { id: "era_year_2005", title: "🗓️ ২০০৫ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2005,cd_max:12/31/2005" },
  { id: "era_year_2006", title: "🗓️ ২০০৬ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2006,cd_max:12/31/2006" },
  { id: "era_year_2007", title: "🗓️ ২০০৭ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2007,cd_max:12/31/2007" },
  { id: "era_year_2008", title: "🗓️ ২০০৮ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2008,cd_max:12/31/2008" },
  { id: "era_year_2009", title: "🗓️ ২০০৯ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2009,cd_max:12/31/2009" },
  { id: "era_year_2010", title: "🗓️ ২০১০ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2010,cd_max:12/31/2010" },
  { id: "era_year_2011", title: "🗓️ ২০১১ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2011,cd_max:12/31/2011" },
  { id: "era_year_2012", title: "🗓️ ২০১২ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2012,cd_max:12/31/2012" },
  { id: "era_year_2013", title: "🗓️ ২০১৩ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2013,cd_max:12/31/2013" },
  { id: "era_year_2014", title: "🗓️ ২০১৪ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2014,cd_max:12/31/2014" },
  { id: "era_year_2015", title: "🗓️ ২০১৫ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2015,cd_max:12/31/2015" },
  { id: "era_year_2016", title: "🗓️ ২০১৬ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2016,cd_max:12/31/2016" },
  { id: "era_year_2017", title: "🗓️ ২০১৭ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2017,cd_max:12/31/2017" },
  { id: "era_year_2018", title: "🗓️ ২০১৮ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2018,cd_max:12/31/2018" },
  { id: "era_year_2019", title: "🗓️ ২০১৯ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2019,cd_max:12/31/2019" },
  { id: "era_year_2020", title: "🗓️ ২০২০ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2020,cd_max:12/31/2020" },
  { id: "era_year_2021", title: "🗓️ ২০২১ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2021,cd_max:12/31/2021" },
  { id: "era_year_2022", title: "🗓️ ২০২২ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2022,cd_max:12/31/2022" },
  { id: "era_year_2023", title: "🗓️ ২০২৩ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2023,cd_max:12/31/2023" },
  { id: "era_year_2024", title: "🗓️ ২০২৪ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2024,cd_max:12/31/2024" },
  { id: "era_year_2025", title: "🗓️ ২০২৫ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2025,cd_max:12/31/2025" },
  { id: "era_year_2026", title: "🗓️ ২০২৬ সালের নিউজ", tbs: "cdr:1,cd_min:1/1/2026,cd_max:12/31/2026" }
];

const monthlyEras2024 = [
  { id: "month_2024_01", title: "🗓️ জানুয়ারি ২০২৪", tbs: "cdr:1,cd_min:1/1/2024,cd_max:1/31/2024" },
  { id: "month_2024_02", title: "🗓️ ফেব্রুয়ারি ২০২৪", tbs: "cdr:1,cd_min:2/1/2024,cd_max:2/29/2024" },
  { id: "month_2024_03", title: "🗓️ মার্চ ২০২৪", tbs: "cdr:1,cd_min:3/1/2024,cd_max:3/31/2024" },
  { id: "month_2024_04", title: "🗓️ এপ্রিল ২০২৪", tbs: "cdr:1,cd_min:4/1/2024,cd_max:4/30/2024" },
  { id: "month_2024_05", title: "🗓️ মে ২০২৪", tbs: "cdr:1,cd_min:5/1/2024,cd_max:5/31/2024" },
  { id: "month_2024_06", title: "🗓️ জুন ২০২৪", tbs: "cdr:1,cd_min:6/1/2024,cd_max:6/30/2024" },
  { id: "month_2024_07", title: "🗓️ জুলাই ২০২৪", tbs: "cdr:1,cd_min:7/1/2024,cd_max:7/31/2024" },
  { id: "month_2024_08", title: "🗓️ আগস্ট ২০২৪", tbs: "cdr:1,cd_min:8/1/2024,cd_max:8/31/2024" },
  { id: "month_2024_09", title: "🗓️ সেপ্টেম্বর ২০২৪", tbs: "cdr:1,cd_min:9/1/2024,cd_max:9/30/2024" },
  { id: "month_2024_10", title: "🗓️ অক্টোবর ২০২৪", tbs: "cdr:1,cd_min:10/1/2024,cd_max:10/31/2024" },
  { id: "month_2024_11", title: "🗓️ নভেম্বর ২০২৪", tbs: "cdr:1,cd_min:11/1/2024,cd_max:11/30/2024" },
  { id: "month_2024_12", title: "🗓️ ডিসেম্বর ২০২৪", tbs: "cdr:1,cd_min:12/1/2024,cd_max:12/31/2024" }
];

const subSearchTypes = [
  { id: "sub_open_all", title: "🚀 সবগুলো একসাথে ওপেন করুন", isOpenAll: true },
  { id: "sub_open_news_web_all", title: "🚀 সব, নিউজ ও ওয়েব একসাথে", isOpenNewsWebAll: true },
  { id: "sub_open_media_all", title: "🚀 ছবি, ভিডিও ও শর্ট একসাথে", isOpenMediaAll: true },
  { id: "sep_1", type: "separator" },
  { id: "fc_google_en", title: "🔎 Google Fact Check (English)", isFactCheckEn: true },
  { id: "fc_google_bn", title: "🔎 Google Fact Check (Bengali)", isFactCheckBn: true },
  { id: "fc_bd_sites", title: "🛡️ BD Fact-Check Sites Search", isBdSites: true },
  { id: "sub_bashundhara", title: "📰 বসুন্ধরা গ্রুপ", isBashundhara: true },
  { id: "sep_2", type: "separator" },
  { id: "sub_all", title: "🌐 সব (Google)", params: "" },
  { id: "sub_img", title: "🖼️ ছবি", params: "&udm=2" },
  { id: "sub_vid", title: "🎥 ভিডিও", params: "&udm=7" },
  { id: "sub_short", title: "📱 শর্ট ভিডিও", params: "&udm=39" },
  { id: "sub_news", title: "📰 নিউজ", params: "&tbm=nws" },
  { id: "sub_web", title: "🕸️ ওয়েব", params: "&udm=web" },
  { id: "sep_3", type: "separator" },
  { id: "sub_fb_direct", title: "🔍 Search in Facebook App", isDirectFb: true },
  { id: "sub_x_direct", title: "✖️ Search in X (Twitter)", isDirectX: true },
  { id: "sub_tiktok_direct", title: "🎵 Search in TikTok", isDirectTiktok: true },
  { id: "sub_fb_google", title: "📘 Search Facebook (via Google)", isSite: "facebook.com" },
  { id: "sub_yt_google", title: "▶️ Search YouTube (via Google)", isSite: "youtube.com" },
  { id: "sub_telegram", title: "✈️ Search Telegram", isSite: "t.me" },
  { id: "sub_insta", title: "📸 Search Instagram", isSite: "instagram.com" },
  { id: "sub_reddit", title: "🤖 Search Reddit", isSite: "reddit.com" }
];

const specificSitesList = [
    { id: "ss_pa", title: "প্রথম আলো", siteQuery: "site:prothomalo.com" },
    { id: "ss_ds", title: "Daily Star", siteQuery: "site:thedailystar.net" },
    { id: "ss_ds_bn", title: "Daily Star বাংলা", siteQuery: "site:bangla.thedailystar.net" },
    { id: "ss_bdnews_bn", title: "বাংলা বিডিনিউজ", siteQuery: "site:bangla.bdnews24.com" },
    { id: "ss_pa_ds", title: "প্রথম আলো + Daily Star", siteQuery: "(site:prothomalo.com OR site:thedailystar.net)" },
    { id: "ss_bashun", title: "বসুন্ধরা গ্রুপ", siteQuery: "(site:kalerkantho.com OR site:bd-pratidin.com OR site:en.bd-pratidin.com OR site:daily-sun.com OR site:bangla.daily-sun.com OR site:banglanews24.com OR site:news24bd.tv)" },
    { id: "ss_fact", title: "ফ্যাক্টচেক সাইটসমূহ", siteQuery: "(site:rumorscanner.com OR site:dismislab.com OR site:factwatch.org OR site:boomlive.in/bd)" },
    { id: "ss_bdnews", title: "বিডিনিউজ", siteQuery: "site:bdnews24.com" },
    { id: "ss_banglanews", title: "Banglanews24", siteQuery: "site:banglanews24.com" },
    { id: "ss_news24", title: "News24", siteQuery: "site:news24bd.tv" },
    { id: "ss_ananda", title: "আনন্দবাজার", siteQuery: "site:anandabazar.com" },
    { id: "ss_ittefaq", title: "ইত্তেফাক", siteQuery: "site:ittefaq.com.bd" },
    { id: "ss_inqilab", title: "ইনকিলাব", siteQuery: "site:dailyinqilab.com" },
    { id: "ss_kaler", title: "কালের কণ্ঠ", siteQuery: "site:kalerkantho.com" },
    { id: "ss_bbc", title: "বিবিসি বাংলা", siteQuery: "site:bbc.com/bengali" },
    { id: "ss_dw", title: "ডয়চে ভেলে", siteQuery: "site:dw.com/bengali" },
    { id: "ss_kalbela", title: "কালবেলা", siteQuery: "site:kalbela.com" },
    { id: "ss_naya", title: "নয়াদিগন্ত", siteQuery: "site:dailynayadiganta.com" },
    { id: "ss_tribune", title: "বাংলাট্রিবিউন", siteQuery: "site:banglatribune.com" },
    { id: "ss_pratidin", title: "বাংলাদেশ প্রতিদিন", siteQuery: "site:bd-pratidin.com" },
    { id: "ss_mzamin", title: "মানবজমিন", siteQuery: "site:mzamin.com" },
    { id: "ss_jugantor", title: "যুগান্তর", siteQuery: "site:jugantor.com" },
    { id: "ss_samakal", title: "সমকাল", siteQuery: "site:samakal.com" },
    { id: "ss_rising", title: "রাইজিংবিডি", siteQuery: "site:risingbd.com" },
    { id: "ss_ajker", title: "আজকের পত্রিকা", siteQuery: "site:ajkerpatrika.com" },
    { id: "ss_indy", title: "ইন্ডিপেনডেন্ট টিভি", siteQuery: "site:independent24.com" },
    { id: "ss_ekattor", title: "একাত্তর টিভি", siteQuery: "site:ekattor.tv" },
    { id: "ss_channeli", title: "চ্যানেল আই", siteQuery: "site:channelionline.com" },
    { id: "ss_channel24", title: "চ্যানেল২৪", siteQuery: "site:channel24bd.tv" },
    { id: "ss_jago", title: "জাগোনিউজ", siteQuery: "site:jagonews24.com" },
    { id: "ss_tbs", title: "টিবিএস (TBS)", siteQuery: "site:tbsnews.net" },
    { id: "ss_dbc", title: "ডিবিসি নিউজ", siteQuery: "site:dbcnews.tv" },
    { id: "ss_dhakatrib", title: "ঢাকাট্রিবিউন", siteQuery: "site:dhakatribune.com" },
    { id: "ss_dhakapost", title: "ঢাকাপোস্ট", siteQuery: "site:dhakapost.com" },
    { id: "ss_jamuna", title: "যমুনা টিভি", siteQuery: "site:jamuna.tv" },
    { id: "ss_somoy", title: "সময় টিভি", siteQuery: "site:somoynews.tv" }
];

const epapers = [
  { id: "epaper_nayadiganta", title: "নয়া দিগন্ত", url: "https://www.enayadiganta.com/" },
  { id: "epaper_newage", title: "নিউ এজ", url: "https://epaper.newagebd.net/" },
  { id: "epaper_samakal", title: "সমকাল", url: "https://epaper.samakal.com/" },
  { id: "epaper_observer", title: "ডেইলি অবজার্ভার", url: "https://epaper.observerbd.com/" },
  { id: "epaper_azadi", title: "দৈনিক আজাদী", url: "https://edainikazadi.net/" },
  { id: "epaper_manobkantha", title: "মানব কণ্ঠ", url: "https://epaperarchive.manobkantha.com.bd/" },
  { id: "epaper_manabzamin", title: "মানবজমিন", url: "https://www.mzamin.com/print" },
  { id: "epaper_amadershomoy", title: "আমাদের সময়", url: "https://epaper.dainikamadershomoy.com/" },
  { id: "epaper_amardesh", title: "আমার দেশ", url: "https://eamardesh.com/" },
  { id: "epaper_jugantor", title: "যুগান্তর", url: "https://epaper.jugantor.com/" },
  { id: "epaper_dailystar", title: "দ্য ডেইলি স্টার", url: "https://epaper.thedailystar.net/" },
  { id: "epaper_alokito", title: "আলোকিত বাংলাদেশ", url: "https://epaper.alokitobangladesh.com/" },
  { id: "epaper_inqilab", title: "দৈনিক ইনকিলাব", url: "https://epaper.dailyinqilab.com/" },
  { id: "epaper_kalerkantho", title: "কালের কণ্ঠ", url: "https://www.kalerkantho.com/epaper/" },
  { id: "epaper_janakantha", title: "দৈনিক জনকণ্ঠ", url: "https://epaper.dailyjanakantha.com/" },
  { id: "epaper_deshrupantor", title: "দেশ রূপান্তর", url: "https://epaper.deshrupantor.com/" },
  { id: "epaper_purbokone", title: "দৈনিক পূর্বকোণ", url: "https://www.edainikpurbokone.net/" },
  { id: "epaper_protidinersangbad", title: "প্রতিদিনের সংবাদ", url: "https://epaper.protidinersangbad.com/" },
  { id: "epaper_prothomalo", title: "প্রথম আলো", url: "https://epaper.prothomalo.com/" },
  { id: "epaper_sangbad", title: "সংবাদ", url: "https://epaper.sangbad.net.bd/" },
  { id: "epaper_ittefaq", title: "ইত্তেফাক", url: "https://epaper.ittefaq.com.bd/" },
  { id: "epaper_bonikbarta", title: "বণিক বার্তা", url: "https://epaper.bonikbarta.com/" }
];

const quickLinks = [
  { id: "ql_img2txt", title: "📝 Image to Text", url: "https://www.imagetotext.info/" },
  { id: "ql_canva", title: "🎨 Canva Design", url: "https://www.canva.com/design/DAHH9yaMNQU/UXpytxTxKaZUsZoYVUQmIg/edit" },
  { id: "ql_gemini", title: "✨ Gemini AI", url: "https://gemini.google.com/" },
  { id: "ql_sheets", title: "📊 Google Sheets", url: "https://docs.google.com/spreadsheets/" },
  { id: "ql_railway", title: "🚆 BD Railway eTicket", url: "https://eticket.railway.gov.bd/" },
  { id: "ql_dissent_fb", title: "📘 The Dissent (Facebook)", url: "https://www.facebook.com/TheDissent" },
  { id: "ql_keep", title: "📒 Google Keep", url: "https://keep.google.com/" },
  { id: "ql_tasks", title: "✅ Google Tasks", url: "https://tasks.google.com/" },
  { id: "ql_notepad", title: "📝 Online Notepad", url: "https://www.rapidtables.com/tools/notepad.html" },
  { id: "ql_notebooklm", title: "🧠 NotebookLM", url: "https://notebooklm.google.com/" },
  { id: "ql_gmail", title: "📧 Gmail", url: "https://mail.google.com/" },
  { id: "ql_yt", title: "▶️ YouTube", url: "https://www.youtube.com/" },
  { id: "ql_fb", title: "🌐 Facebook Home", url: "https://www.facebook.com/" }
];

// Context Menu Custom Target Sheets
const targetSheetsList = ["Sheet 1", "Sheet 2", "BNP Data", "Awami League Data", "Jamaat Data", "Others"];

function safeCreateMenu(options) {
  chrome.contextMenus.create(options, () => {
    if (chrome.runtime.lastError) { /* ignore error */ }
  });
}

function attachSubMenus(era, parentId = null) {
  if (parentId) {
      safeCreateMenu({ id: era.id, parentId: parentId, title: era.title, contexts: ["selection"] });
  } else {
      safeCreateMenu({ id: era.id, title: era.title, contexts: ["selection"] });
  }
  
  subSearchTypes.forEach(type => {
      safeCreateMenu({
          id: `${era.id}:::${type.id}`,
          parentId: era.id,
          type: type.type === "separator" ? "separator" : "normal",
          title: type.title || "",
          contexts: ["selection"]
      });
  });

  const specificSiteRootId = `${era.id}:::specific_sites_root`;
  safeCreateMenu({
      id: specificSiteRootId,
      parentId: era.id,
      title: "📌 নির্দিষ্ট সাইটে খুঁজুন",
      contexts: ["selection"]
  });
  
  specificSitesList.forEach(site => {
      safeCreateMenu({
          id: `${era.id}:::site_search:::${site.id}`,
          parentId: specificSiteRootId,
          title: site.title,
          contexts: ["selection"]
      });
  });
}

function createMenus() {
  chrome.contextMenus.removeAll(() => {
    
    safeCreateMenu({ id: "quick_links_root", title: "🔗 দরকারি লিংকসমূহ (Quick Links)", contexts: ["all"] });
    quickLinks.forEach(link => {
        safeCreateMenu({
            id: `quick_link_:::${link.id}`,
            parentId: "quick_links_root",
            title: link.title,
            contexts: ["all"]
        });
    });

    safeCreateMenu({ id: "epaper_root", title: "📰 ই-পেপার (E-Papers)", contexts: ["all"] });
    epapers.forEach(epaper => {
        safeCreateMenu({
            id: `epaper_:::${epaper.id}`,
            parentId: "epaper_root",
            title: epaper.title,
            contexts: ["all"]
        });
    });

    // 💡 NEW: Send to Different Sheets/Tabs Context Menu
    safeCreateMenu({
      id: "save_root",
      title: "💾 Save Link/Text to Sheet...",
      contexts: ["all"]
    });

    targetSheetsList.forEach((sheetName) => {
      safeCreateMenu({
        id: `save_target_sheet:::${sheetName}`,
        parentId: "save_root",
        title: `📑 Save to '${sheetName}'`,
        contexts: ["all"]
      });
    });

    safeCreateMenu({ id: "Archive_Page", title: "📦 Archive this Page", contexts: ["all"] });
    safeCreateMenu({ id: "Archive_Link", title: "🔗 Archive this Link", contexts: ["link"] });
    safeCreateMenu({ id: "Copy_With_URL", title: "📝 Copy Text with URL", contexts: ["selection"] });

    timeEras.forEach(era => attachSubMenus(era));

    safeCreateMenu({ id: "yearly_search_root", title: "📅 বছরভিত্তিক সার্চ (২০০১-২০২৬)", contexts: ["selection"] });
    yearlyEras.forEach(era => attachSubMenus(era, "yearly_search_root"));

    safeCreateMenu({ id: "monthly_2024_root", title: "📅 ২০২৪ সালের মাসভিত্তিক সার্চ", contexts: ["selection"] });
    monthlyEras2024.forEach(era => attachSubMenus(era, "monthly_2024_root"));

  });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(["enabled"], (result) => {
    const newState = !result.enabled;
    chrome.storage.local.set({ enabled: newState }, () => {
      if (newState) {
        createMenus();
        chrome.action.setBadgeText({ text: "ON" });
        chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
      } else {
        chrome.contextMenus.removeAll();
        chrome.action.setBadgeText({ text: "OFF" });
        chrome.action.setBadgeBackgroundColor({ color: "#F44336" });
      }
    });
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.enabled) {
    const newState = changes.enabled.newValue;
    if (newState) {
      createMenus();
      chrome.action.setBadgeText({ text: "ON" });
      chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
    } else {
      chrome.contextMenus.removeAll();
      chrome.action.setBadgeText({ text: "OFF" });
      chrome.action.setBadgeBackgroundColor({ color: "#F44336" });
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true }, () => {
    createMenus();
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
  });
});

// Helper function to extract platform domain logic inside background
function getPlatform(url) {
    if (url.includes('facebook.com')) return "Facebook";
    if (url.includes('youtube.com') || url.includes('youtu.be')) return "YouTube";
    if (url.includes('twitter.com') || url.includes('x.com')) return "Twitter/X";
    if (url.includes('tiktok.com')) return "TikTok";
    return "News/Web";
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save_root" || info.menuItemId === "yearly_search_root" || info.menuItemId === "epaper_root" || info.menuItemId === "quick_links_root" || info.menuItemId === "monthly_2024_root") return;

  if (typeof info.menuItemId === 'string' && info.menuItemId.startsWith("quick_link_:::")) {
    const qlId = info.menuItemId.split(":::")[1];
    const link = quickLinks.find(l => l.id === qlId);
    if (link) chrome.tabs.create({ url: link.url });
    return;
  }

  if (typeof info.menuItemId === 'string' && info.menuItemId.startsWith("epaper_:::")) {
    const epaperId = info.menuItemId.split(":::")[1];
    const epaper = epapers.find(e => e.id === epaperId);
    if (epaper) chrome.tabs.create({ url: epaper.url });
    return;
  }

  if (info.menuItemId === "Archive_Page" || info.menuItemId === "Archive_Link") {
    const targetUrl = info.linkUrl || tab.url;
    chrome.tabs.create({ url: `https://archive.ph/?run=1&url=${encodeURIComponent(targetUrl)}` });
    return;
  }

  if (info.menuItemId === "Copy_With_URL") {
    const combinedText = `"${info.selectionText}"\nSource: ${tab.url}`;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => { navigator.clipboard.writeText(text); },
      args: [combinedText]
    });
    return;
  }

  // 💡 NEW: Logic for 'Send to Different Sheets/Tabs' via Right Click
  if (info.menuItemId.startsWith("save_target_sheet:::")) {
    const sheetName = info.menuItemId.split(":::")[1];
    const urlToSave = info.linkUrl || tab.url;
    const textToSave = info.selectionText || tab.title || "No Title";
    
    let domainName = "Unknown";
    try { domainName = new URL(urlToSave).hostname; } catch(e) {}
    let platform = getPlatform(urlToSave);

    // Save as marked (Red Dot logic)
    chrome.storage.local.get(['savedLinks'], function(result) {
        let saved = result.savedLinks || [];
        if (!saved.includes(urlToSave)) saved.push(urlToSave);
        chrome.storage.local.set({savedLinks: saved});
    });

    // Formatting it with tabs \t so App Script easily handles Columns A,B,C,D,E...
    const formattedData = `${textToSave}\t${urlToSave}\t${domainName}\t\t${platform}\t`;
    
    const formData = new URLSearchParams();
    formData.append("data", formattedData);
    formData.append("sheet", sheetName); 
    
    fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    }).catch(e => console.log(e));

    return;
  }

  if (typeof info.menuItemId === 'string' && info.menuItemId.includes(":::")) {
    if (info.menuItemId.includes(":::site_search:::")) {
        const parts = info.menuItemId.split(":::");
        const eraId = parts[0];
        const siteId = parts[2];
        const era = timeEras.find(e => e.id === eraId) || yearlyEras.find(e => e.id === eraId) || monthlyEras2024.find(e => e.id === eraId);
        const siteObj = specificSitesList.find(s => s.id === siteId);
        const text = info.selectionText;
        
        if (!text || !era || !siteObj) return;

        const q = `${siteObj.siteQuery} ${text}`;
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}${era.tbs ? `&tbs=${era.tbs}` : ""}`;
        chrome.tabs.create({ url: searchUrl });
        return;
    }

    const [eraId, typeId] = info.menuItemId.split(":::");
    const era = timeEras.find(e => e.id === eraId) || yearlyEras.find(e => e.id === eraId) || monthlyEras2024.find(e => e.id === eraId);
    const text = info.selectionText;
    if (!text || !era) return;
    const encodedText = encodeURIComponent(text);

    const openSearchTab = (type) => {
      let searchUrl = "";
      if (type.isDirectFb) searchUrl = `https://www.facebook.com/search/top/?q=${encodedText}`;
      else if (type.isDirectX) searchUrl = `https://x.com/search?q=${encodedText}`;
      else if (type.isDirectTiktok) searchUrl = `https://www.tiktok.com/search?q=${encodedText}`;
      else if (type.isFactCheckEn) searchUrl = `https://toolbox.google.com/factcheck/explorer/search/${encodedText};hl=en`;
      else if (type.isFactCheckBn) searchUrl = `https://toolbox.google.com/factcheck/explorer/search/${encodedText};hl=bn`;
      else {
        let q = text;
        if (type.isSite) q = `site:${type.isSite} ${text}`;
        else if (type.isBdSites) {
          const bdSites = "site:boombd.com OR site:dismisslab.com OR site:factcheckzone.com OR site:factwatch.org OR site:rumorscanner.com OR site:ajkerpatrika.com OR site:dissentbd.com OR site:dhakastream.com OR site:netra.news OR site:banglafact.com OR site:thedissent.net";
          q = `${bdSites} ${text}`;
        }
        else if (type.isBashundhara) {
          const bashundharaSites = "site:kalerkantho.com OR site:bd-pratidin.com OR site:en.bd-pratidin.com OR site:daily-sun.com OR site:bangla.daily-sun.com OR site:banglanews24.com OR site:news24bd.tv";
          q = `${bashundharaSites} ${text}`;
        }
        searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}${era.tbs ? `&tbs=${era.tbs}` : ""}${type.params || ""}`;
      }
      chrome.tabs.create({ url: searchUrl });
    };

    if (typeId === "sub_open_all") {
      subSearchTypes.forEach(t => { 
        if (!t.isOpenAll && !t.isOpenNewsWebAll && !t.isOpenMediaAll && t.type !== "separator") openSearchTab(t); 
      });
    } else if (typeId === "sub_open_news_web_all") {
      const idsToOpen = ["sub_all", "sub_news", "sub_web"];
      idsToOpen.forEach(id => {
        const t = subSearchTypes.find(x => x.id === id);
        if (t) openSearchTab(t);
      });
    } else if (typeId === "sub_open_media_all") {
      const idsToOpen = ["sub_img", "sub_vid", "sub_short"];
      idsToOpen.forEach(id => {
        const t = subSearchTypes.find(x => x.id === id);
        if (t) openSearchTab(t);
      });
    } else {
      const type = subSearchTypes.find(t => t.id === typeId);
      if (type) openSearchTab(type);
    }
  }
});