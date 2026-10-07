// popup.js
document.addEventListener("DOMContentLoaded", function () {
    const extToggle = document.getElementById("extToggle");
    
    chrome.storage.local.get(["enabled"], (result) => {
        extToggle.checked = result.enabled !== false; 
    });

    extToggle.addEventListener("change", (e) => {
        chrome.storage.local.set({ enabled: e.target.checked });
    });

    const allPortals = [
        "prothomalo.com", "jugantor.com", "kalerkantho.com", "bd-pratidin.com", "bd24live.com", "banglanews24.com", "24livenewspaper.com", "bdnews24.com", "priyo.com", "ntvbd.com", "thedailystar.net", "samakal.com", "ittefaq.com.bd", "dailyinqilab.com", "amadershomoy.com", "dailynayadiganta.com", "jagonews24.com", "risingbd.com", "dhakapost.com", "bbc.com/bengali", "banglatribune.com", "dainikshiksha.com", "newsbangla24.com", "jamuna.tv", "channel24bd.tv", "desh.tv", "somoynews.tv", "rtvonline.com", "channelionline.com", "ekattor.tv"
    ];

    const batchSize = 30;

    function generateBatchButtons() {
        const container = document.getElementById('batchContainer');
        const totalBatches = Math.ceil(allPortals.length / batchSize);
        for (let i = 0; i < totalBatches; i++) {
            const btn = document.createElement('button');
            btn.className = 'batch-btn';
            btn.innerText = `ব্যাচ ${i + 1} (${i*batchSize + 1}-${Math.min((i+1)*batchSize, allPortals.length)})`;
            btn.addEventListener('click', function() {
                executeBatchSearch(i);
                this.classList.add('visited');
            });
            container.appendChild(btn);
        }
    }

    function executeBatchSearch(index) {
        const query = document.getElementById('searchTerm').value.trim();
        const time = document.getElementById('dateRange').value;
        if (!query) { alert("অনুগ্রহ করে একটি কিউওয়ার্ড লিখুন!"); return; }
        const start = index * batchSize;
        const end = start + batchSize;
        const batchPortals = allPortals.slice(start, end);
        const siteString = batchPortals.map(site => `site:${site}`).join(" OR ");
        const finalQuery = `"${query}" (${siteString})`;
        let url = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
        if (time) url += `&tbs=${time}`;
        chrome.tabs.create({ url: url });
    }

    const btnSingleSite = document.getElementById('btn-single-site');
    if (btnSingleSite) {
        btnSingleSite.addEventListener('click', function() {
            const query = document.getElementById('searchTerm').value.trim();
            const time = document.getElementById('dateRange').value;
            const siteValue = document.getElementById('singleSiteSelect').value;
            if (!query) { alert("অনুগ্রহ করে একটি কিউওয়ার্ড লিখুন!"); return; }
            if (!siteValue) { alert("অনুগ্রহ করে লিস্ট থেকে একটি পোর্টাল নির্বাচন করুন!"); return; }
            const finalQuery = `"${query}" (${siteValue})`;
            let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`;
            if (time) searchUrl += `&tbs=${time}`;
            chrome.tabs.create({ url: searchUrl });
        });
    }

    function specialSearch(type) {
        const query = document.getElementById('searchTerm').value.trim();
        const time = document.getElementById('dateRange').value;
        if (!query) { alert("কিউওয়ার্ড লিখুন!"); return; }
        let finalQuery = "";
        let baseUrl = "https://www.google.com/search?q=";
        if (type === 'en') {
            const enSites = ["thedailystar.net", "dhakatribune.com", "tbsnews.net", "newagebd.net", "daily-sun.com", "thefinancialexpress.com.bd"];
            finalQuery = `"${query}" (${enSites.map(s => `site:${s}`).join(" OR ")})`;
        } else if (type === 'fact') {
            finalQuery = `"${query}" (site:rumorscanner.com OR site:dismislab.com OR site:factwatch.org OR site:boomlive.in/bengali)`;
        } else if (type === 'pdf') {
            finalQuery = `"${query}" (site:gov.bd OR site:bangladesh.gov.bd) filetype:pdf`;
        } else if (type === 'social') {
            finalQuery = `"${query}" (site:facebook.com OR site:x.com OR site:linkedin.com)`;
        } else if (type === 'video') {
            baseUrl = "https://www.youtube.com/results?search_query=";
            finalQuery = query;
        } else if (type === 'bashundhara') {
            finalQuery = `"${query}" (site:kalerkantho.com OR site:bd-pratidin.com OR site:en.bd-pratidin.com OR site:daily-sun.com OR site:bangla.daily-sun.com OR site:banglanews24.com OR site:news24bd.tv)`;
        }
        let finalUrl = baseUrl + encodeURIComponent(finalQuery);
        if (time && type !== 'video') finalUrl += `&tbs=${time}`;
        chrome.tabs.create({ url: finalUrl });
    }

    function multiTabSearch() {
        const query = document.getElementById('searchTerm').value.trim();
        if (!query) { alert("দয়া করে সার্চ করার জন্য কিছু লিখুন!"); return; }
        const sites = ['site:tiktok.com', 'site:youtube.com', 'site:facebook.com', 'site:x.com'];
        sites.forEach(site => {
            const finalQuery = site + ' ' + query;
            chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}` });
        });
    }

    document.getElementById('searchTerm').addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            if(document.getElementById('singleSiteSelect') && document.getElementById('singleSiteSelect').value) {
                document.getElementById('btn-single-site').click();
            } else {
                executeBatchSearch(0);
            }
        }
    });

    if (document.getElementById('btn-en')) document.getElementById('btn-en').addEventListener('click', () => specialSearch('en'));
    if (document.getElementById('btn-fact')) document.getElementById('btn-fact').addEventListener('click', () => specialSearch('fact'));
    if (document.getElementById('btn-pdf')) document.getElementById('btn-pdf').addEventListener('click', () => specialSearch('pdf'));
    if (document.getElementById('btn-bashundhara')) document.getElementById('btn-bashundhara').addEventListener('click', () => specialSearch('bashundhara'));
    if (document.getElementById('btn-social')) document.getElementById('btn-social').addEventListener('click', () => specialSearch('social'));
    if (document.getElementById('btn-video')) document.getElementById('btn-video').addEventListener('click', () => specialSearch('video'));
    if (document.getElementById('btn-osint')) document.getElementById('btn-osint').addEventListener('click', () => multiTabSearch());

    generateBatchButtons();

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (!tabs || !tabs[0] || !tabs[0].url || !tabs[0].url.startsWith("http")) return;
        const url = new URL(tabs[0].url);
        const domain = url.hostname;
        const toggleBtn = document.getElementById('toggle-btn');
        const extractBtn = document.getElementById('extract-btn');

        if (toggleBtn) {
            chrome.storage.local.get(['disabledDomains'], function(result) {
                let disabled = result.disabledDomains || [];
                if (disabled.includes(domain)) {
                    toggleBtn.textContent = "Enable on this site";
                    toggleBtn.style.backgroundColor = "#28a745"; 
                }
            });

            toggleBtn.addEventListener('click', function() {
                chrome.storage.local.get(['disabledDomains'], function(result) {
                    let disabled = result.disabledDomains || [];
                    disabled.includes(domain) ? (disabled = disabled.filter(d => d !== domain)) : disabled.push(domain);
                    chrome.storage.local.set({disabledDomains: disabled}, () => {
                        chrome.tabs.reload(tabs[0].id);
                        window.close();
                    });
                });
            });
        }

        if (extractBtn) {
            extractBtn.addEventListener('click', () => {
                chrome.tabs.sendMessage(tabs[0].id, {action: "extract_links"});
                window.close();
            });
        }
    });

    function loadBlockedDomains() {
        chrome.storage.local.get(['disabledDomains'], function(result) {
            const disabled = result.disabledDomains || [];
            const list = document.getElementById('blockedList');
            const noMsg = document.getElementById('noBlockedMsg');
            if (!list || !noMsg) return;
            list.innerHTML = '';
            if (disabled.length === 0) {
                noMsg.style.display = 'block';
            } else {
                noMsg.style.display = 'none';
                disabled.forEach(domain => {
                    const li = document.createElement('li');
                    li.className = 'blocked-item';
                    li.innerHTML = `<span>${domain}</span><button class="unblock-btn" data-domain="${domain}">Unblock</button>`;
                    list.appendChild(li);
                });
                document.querySelectorAll('.unblock-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const domainToRemove = this.getAttribute('data-domain');
                        chrome.storage.local.get(['disabledDomains'], function(res) {
                            let currentDisabled = res.disabledDomains || [];
                            currentDisabled = currentDisabled.filter(d => d !== domainToRemove);
                            chrome.storage.local.set({disabledDomains: currentDisabled}, () => { loadBlockedDomains(); });
                        });
                    });
                });
            }
        });
    }
    loadBlockedDomains();
});