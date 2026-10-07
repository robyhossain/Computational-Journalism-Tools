// content.js
const currentDomain = window.location.hostname;
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxGLZVRmH-QZs2P_OsK2F0Lrj-MgveUw-ccUEynf3UGhOQnFxe4ZhaXcLKxV-iSutceVg/exec";

// ==========================================================
// 💡 Visual Duplicate Indicator (Red Dot) Logic
// ==========================================================
function injectRedDots() {
    chrome.storage.local.get(['savedLinks'], function(result) {
        const saved = result.savedLinks || [];
        document.querySelectorAll('a').forEach(a => {
            if (a.href && saved.includes(a.href) && !a.classList.contains('marked-saved')) {
                a.classList.add('marked-saved');
                a.innerHTML += ' <span style="font-size:10px; margin-left:4px;" title="Already Saved">🔴</span>';
                a.style.border = "1px solid #ffcccc";
                a.style.background = "#fff0f0";
            }
        });
    });
}
setInterval(injectRedDots, 2000); 

// ==========================================================
// 💡 Advanced Extraction Helpers
// ==========================================================
function getCleanText(linkElement) {
    let title = linkElement.getAttribute('aria-label') || linkElement.title;
    if (!title || title.includes("...")) {
        const heading = linkElement.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) title = heading.textContent.trim();
        else title = linkElement.textContent.trim() || "";
    }
    return title.replace(/\s*\.{3}$/, '').trim() || linkElement.href;
}

function formatPublishDate(dateStr) {
    if (!dateStr) return "";
    try {
        let d = new Date(dateStr);
        if (isNaN(d)) return "";
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${d.getDate().toString().padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch(e) { return ""; }
}

function getPlatformType(url) {
    if (url.includes('facebook.com')) return "Facebook";
    if (url.includes('youtube.com') || url.includes('youtu.be')) return "YouTube";
    if (url.includes('twitter.com') || url.includes('x.com')) return "Twitter/X";
    if (url.includes('tiktok.com')) return "TikTok";
    return "News/Web";
}

function extractAuthorName(url, element) {
    if (url.includes('facebook.com') || url.includes('youtube.com')) {
        let authorEl = element.closest('div')?.querySelector('.fwb, .ytd-channel-name');
        if(authorEl) return authorEl.innerText.trim();
    }
    return "";
}

function sendToGoogleSheet(actionPayload, sheetName = "Sheet1") {
    const formData = new URLSearchParams();
    if(typeof actionPayload === 'string') {
        formData.append("data", actionPayload); 
    } else {
        formData.append("action", actionPayload.action);
        formData.append("url", actionPayload.url);
    }
    formData.append("sheet", sheetName); 
    fetch(SCRIPT_URL, { method: 'POST', body: formData, mode: 'no-cors' });
}

function registerSavedLink(url) {
    chrome.storage.local.get(['savedLinks'], function(res) {
        let saved = res.savedLinks || [];
        if (!saved.includes(url)) {
            saved.push(url);
            chrome.storage.local.set({savedLinks: saved});
        }
    });
}

// ==========================================================
// PART 1: Facebook Post Link Copier Logic
// ==========================================================
function addCopyButtons() {
    chrome.storage.local.get(["enabled"], (result) => {
        if (result.enabled === false) return; 
        const posts = document.querySelectorAll('div[role="article"]:not(.btn-added)');
        posts.forEach(post => {
            post.classList.add('btn-added'); 
            const btn = document.createElement('button');
            btn.innerText = '🔗 Copy Link';
            btn.className = 'custom-fb-copy-btn';
            btn.onclick = (e) => {
                e.preventDefault();
                const linkElement = post.querySelector('span[id] a[role="link"], a[href*="/posts/"], a[href*="/permalink/"], a[href*="/groups/"]');
                if (linkElement && linkElement.href) {
                    let cleanLink = linkElement.href.split('?')[0]; 
                    navigator.clipboard.writeText(cleanLink).then(() => {
                        btn.innerText = '✅ Copied!';
                        btn.style.background = '#27ae60';
                        setTimeout(() => { btn.innerText = '🔗 Copy Link'; btn.style.background = '#0866ff'; }, 2000);
                    });
                } else {
                    alert('লিংকটি খুঁজে পাওয়া যায়নি। দয়া করে পোস্টের ওপর মাউস রাখুন।');
                }
            };
            post.appendChild(btn);
        });
    });
}
if (currentDomain.includes('facebook.com')) setInterval(addCopyButtons, 2000);

// ==========================================================
// PART 2: Smart Hover
// ==========================================================
if (sessionStorage.getItem('tempHoverDisable_' + currentDomain) !== 'true') {
    chrome.storage.local.get(['disabledDomains'], function(result) {
      const disabled = result.disabledDomains || [];
      if (!disabled.includes(currentDomain)) initializeExtension();
    });
}

function initializeExtension() {
  const container = document.createElement('div');
  container.id = 'hover-copy-container';
  container.innerHTML = `
    <div id="hover-main-view" style="display:flex; gap:6px; align-items:center;">
        <button id="hover-copy-link" class="copy-btn" title="Copy URL only">🔗 Link</button>
        <button id="hover-copy-text" class="copy-btn" title="Copy Text only">📝 Text</button>
        <button id="hover-copy-rich" class="copy-btn" title="Copy as Hyperlink for Google Sheets">🌐 Hyperlink</button>
        <button id="hover-copy-split" class="copy-btn" title="Text in col 1, URL in col 2">📊 Split Columns</button>
        <button id="hover-group-copy" class="copy-btn group-btn" style="display: none;">Copy All</button>
        <button id="hover-disable-init" class="copy-btn" style="background:#dc3545; border-color:#dc3545;" title="Disable on this site">🚫</button>
    </div>
    <div id="hover-disable-view" style="display:none; gap:6px; align-items:center;">
        <span style="color:white; font-size:11px; font-weight:bold; margin-right:4px;">Disable?</span>
        <button id="hover-disable-temp" class="copy-btn" style="background:#ffc107; color:black; border-color:#ffc107;" title="Until tab is closed">Temporary</button>
        <button id="hover-disable-perm" class="copy-btn" style="background:#dc3545; border-color:#dc3545;" title="Forever on this site">Permanent</button>
        <button id="hover-disable-cancel" class="copy-btn" style="background:#6c757d; border-color:#6c757d;">Cancel</button>
    </div>
  `;
  document.body.appendChild(container);

  const mainView = document.getElementById('hover-main-view');
  const disableView = document.getElementById('hover-disable-view');

  const copyLinkBtn = document.getElementById('hover-copy-link');
  const copyTextBtn = document.getElementById('hover-copy-text');
  const copyRichBtn = document.getElementById('hover-copy-rich');
  const copySplitBtn = document.getElementById('hover-copy-split');
  const groupCopyBtn = document.getElementById('hover-group-copy');
  
  const disableInitBtn = document.getElementById('hover-disable-init');
  const disableTempBtn = document.getElementById('hover-disable-temp');
  const disablePermBtn = document.getElementById('hover-disable-perm');
  const disableCancelBtn = document.getElementById('hover-disable-cancel');

  let activeLinkElement = null; 
  let groupLinkElements = [];   
  let activeLink = "";
  let activeText = "";
  let groupLinks = [];
  let hideTimer;

  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.startsWith('javascript')) {
      clearTimeout(hideTimer);
      activeLinkElement = link;
      activeLink = link.href;
      activeText = getCleanText(link);
      const parentBlock = link.parentElement;
      const allLinksInParent = Array.from(parentBlock.querySelectorAll('a')).filter(a => a.href.startsWith('http'));
      groupLinkElements = [];
      groupLinks = [];
      const seenHrefs = new Set();
      allLinksInParent.forEach(a => {
        if (!seenHrefs.has(a.href)) {
          seenHrefs.add(a.href);
          groupLinks.push(a.href);
          groupLinkElements.push(a);
        }
      });
      if (groupLinks.length > 1) {
        groupCopyBtn.textContent = `Copy All (${groupLinks.length})`;
        groupCopyBtn.style.display = 'inline-block';
      } else {
        groupCopyBtn.style.display = 'none';
      }
      const rect = link.getBoundingClientRect();
      container.style.display = 'flex';
      container.style.top = (rect.bottom + window.scrollY + 5) + 'px';
      container.style.left = (rect.left + window.scrollX) + 'px';
    }
  });

  container.addEventListener('mouseover', () => clearTimeout(hideTimer));
  container.addEventListener('mouseout', () => {
    hideTimer = setTimeout(() => { 
        container.style.display = 'none'; 
        mainView.style.display = 'flex';
        disableView.style.display = 'none';
    }, 400);
  });

  function showFeedback(button, originalText, isGroupCopy) {
    button.textContent = "Copied & Sent!";
    if (isGroupCopy) {
      groupLinkElements.forEach(el => {
          if (document.contains(el)) el.classList.add('copied-link');
      });
    } else if (activeLinkElement && document.contains(activeLinkElement)) {
      activeLinkElement.classList.add('copied-link');
    }
    setTimeout(() => { 
      button.textContent = originalText;
      container.style.display = 'none';
      mainView.style.display = 'flex';
      disableView.style.display = 'none';
    }, 1500);
  }

  copyLinkBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(activeLink).then(() => {
      sendToGoogleSheet(activeLink, "Sheet1");
      registerSavedLink(activeLink);
      showFeedback(copyLinkBtn, "🔗 Link", false);
    });
  });

  copyTextBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(activeText).then(() => {
      sendToGoogleSheet(activeText, "Sheet1");
      registerSavedLink(activeLink);
      showFeedback(copyTextBtn, "📝 Text", false);
    });
  });

  copyRichBtn.addEventListener('click', async () => {
    try {
      const html = `<a href="${activeLink}">${activeText}</a>`;
      const blobHtml = new Blob([html], { type: 'text/html' });
      const blobText = new Blob([activeText], { type: 'text/plain' });
      const data = [new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })];
      await navigator.clipboard.write(data);
      const sheetFormula = `=HYPERLINK("${activeLink}", "${activeText.replace(/"/g, '""')}")`;
      sendToGoogleSheet(sheetFormula, "Sheet1");
      registerSavedLink(activeLink);
      showFeedback(copyRichBtn, "🌐 Hyperlink", false);
    } catch (err) {
      navigator.clipboard.writeText(activeLink).then(() => {
        sendToGoogleSheet(activeLink, "Sheet1");
        showFeedback(copyRichBtn, "🌐 Hyperlink", false);
      });
    }
  });

  copySplitBtn.addEventListener('click', () => {
    let domain = new URL(activeLink).hostname;
    let platform = getPlatformType(activeLink);
    const splitText = `${activeText}\t${activeLink}\t${domain}\t\t${platform}\t`;
    navigator.clipboard.writeText(splitText).then(() => {
      sendToGoogleSheet(splitText, "Sheet1");
      registerSavedLink(activeLink);
      showFeedback(copySplitBtn, "📊 Split Columns", false);
    });
  });

  groupCopyBtn.addEventListener('click', () => {
    const allLinksText = groupLinks.join('\n');
    navigator.clipboard.writeText(allLinksText).then(() => {
      sendToGoogleSheet(allLinksText, "Sheet1");
      groupLinks.forEach(url => registerSavedLink(url));
      showFeedback(groupCopyBtn, `Copy All (${groupLinks.length})`, true);
    });
  });

  disableInitBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    mainView.style.display = 'none';
    disableView.style.display = 'flex';
  });

  disableCancelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    disableView.style.display = 'none';
    mainView.style.display = 'flex';
  });

  disableTempBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sessionStorage.setItem('tempHoverDisable_' + currentDomain, 'true');
    container.remove(); 
  });

  disablePermBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.storage.local.get(['disabledDomains'], function(result) {
        let disabled = result.disabledDomains || [];
        if (!disabled.includes(currentDomain)) disabled.push(currentDomain);
        chrome.storage.local.set({disabledDomains: disabled}, () => {
            container.remove(); 
        });
    });
  });
}

// ==========================================================
// 💡 FLOATING BUTTONS DIRECTLY ON GOOGLE SEARCH PAGE
// ==========================================================
const isGoogleSearch = window.location.hostname.includes('google.com') && window.location.pathname === '/search';
let autoExtractRunning = false; // Flag for Smart Hybrid Button

if (isGoogleSearch) {
    // 1. Original Extract Current Page Button (Blue)
    const floatingExtractBtn = document.createElement('button');
    floatingExtractBtn.id = 'google-floating-extract-btn';
    floatingExtractBtn.innerHTML = '📥 Extract Current Page';
    floatingExtractBtn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 2147483647; background: #1a73e8; color: white; border: none;
        padding: 12px 24px; border-radius: 50px; font-family: sans-serif; font-weight: bold; font-size: 14px; cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: background 0.3s, transform 0.2s;
    `;
    floatingExtractBtn.onmouseover = () => { floatingExtractBtn.style.background = '#0d47a1'; floatingExtractBtn.style.transform = 'scale(1.05)'; };
    floatingExtractBtn.onmouseout = () => { floatingExtractBtn.style.background = '#1a73e8'; floatingExtractBtn.style.transform = 'scale(1)'; };
    floatingExtractBtn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        showLinkExtractorModal();
    });

    // 2. Original Extract Pages 1-10 Button (Green)
    let currentBatchStart = 0;
    let globalUniqueHrefs = new Set();
    const floating10PagesBtn = document.createElement('button');
    floating10PagesBtn.id = 'google-floating-extract-10-btn';
    floating10PagesBtn.innerHTML = '📥 Extract Pages 1-10 (100+ Links)';
    floating10PagesBtn.style.cssText = `
        position: fixed; bottom: 85px; right: 30px; z-index: 2147483647; background: #28a745; color: white; border: none;
        padding: 12px 24px; border-radius: 50px; font-family: sans-serif; font-weight: bold; font-size: 14px; cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: background 0.3s, transform 0.2s;
    `;
    floating10PagesBtn.onmouseover = () => { floating10PagesBtn.style.background = '#218838'; floating10PagesBtn.style.transform = 'scale(1.05)'; };
    floating10PagesBtn.onmouseout = () => { floating10PagesBtn.style.background = '#28a745'; floating10PagesBtn.style.transform = 'scale(1)'; };
    floating10PagesBtn.addEventListener('click', async (e) => {
        e.preventDefault(); e.stopPropagation();
        floating10PagesBtn.innerHTML = '⏳ Fetching Data... Please Wait';
        floating10PagesBtn.style.background = '#ffc107'; floating10PagesBtn.style.color = 'black';
        floating10PagesBtn.disabled = true;

        let batchUniqueLinks = [];
        let baseUrl = new URL(window.location.href);
        let startPage = currentBatchStart;
        let endPage = currentBatchStart + 10;

        try {
            for (let i = startPage; i < endPage; i++) {
                floating10PagesBtn.innerHTML = `⏳ Fetching Page ${i + 1}...`;
                baseUrl.searchParams.set('start', i * 10);
                let res = await fetch(baseUrl.toString());
                let text = await res.text();
                let parser = new DOMParser();
                let doc = parser.parseFromString(text, 'text/html');

                let resultNodes = doc.querySelectorAll('a h3, a div[role="heading"]');
                resultNodes.forEach(node => {
                    const a = node.closest('a');
                    if (a && a.href && a.href.startsWith('http') && !globalUniqueHrefs.has(a.href)) {
                        globalUniqueHrefs.add(a.href);
                        batchUniqueLinks.push({ 
                            url: a.href, 
                            text: getCleanText(a), 
                            domain: new URL(a.href).hostname,
                            platform: getPlatformType(a.href),
                            date: "", 
                            author: "",
                            element: a 
                        });
                    }
                });
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        } catch (err) { console.error("Error fetching pages:", err); }

        currentBatchStart = endPage;
        floating10PagesBtn.innerHTML = `📥 Extract Next 10 Pages (${currentBatchStart + 1}-${currentBatchStart + 10})`;
        floating10PagesBtn.style.background = '#28a745'; floating10PagesBtn.style.color = 'white';
        floating10PagesBtn.disabled = false;

        if(batchUniqueLinks.length > 0) { showLinkExtractorModal(batchUniqueLinks); } 
        else { alert("নতুন কোনো লিংক খুঁজে পাওয়া যায়নি বা গুগল লিমিট করে দিয়েছে।"); }
    });

    // 💡 3. UPGRADED: Smart Hybrid Auto-Scroll & Extract Button (Orange/Red)
    const floatingAutoBtn = document.createElement('button');
    floatingAutoBtn.id = 'google-auto-scroll-btn';
    floatingAutoBtn.innerHTML = '🔄 Auto-Scroll & Extract (Target 300)';
    floatingAutoBtn.style.cssText = `
        position: fixed; bottom: 140px; right: 30px; z-index: 2147483647; background: #ff5722; color: white; border: none;
        padding: 12px 24px; border-radius: 50px; font-weight: bold; font-family: sans-serif; cursor: pointer; font-size: 14px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: background 0.3s, transform 0.2s;
    `;
    floatingAutoBtn.onmouseover = () => { floatingAutoBtn.style.background = '#e64a19'; floatingAutoBtn.style.transform = 'scale(1.05)'; };
    floatingAutoBtn.onmouseout = () => { floatingAutoBtn.style.background = '#ff5722'; floatingAutoBtn.style.transform = 'scale(1)'; };
    
    // The new smart logic for dealing with Classic Pagination (1, 2, 3... Next) and Infinite Scroll
    let globalAutoLinks = [];
    floatingAutoBtn.addEventListener('click', async (e) => {
        e.preventDefault(); e.stopPropagation();
        
        if (autoExtractRunning) {
            autoExtractRunning = false; // Stop flag
            return;
        }
        
        autoExtractRunning = true;
        globalAutoLinks = [];
        let autoUniqueHrefs = new Set();
        floatingAutoBtn.innerHTML = '🛑 Extracting... (Click to Stop)';
        
        let currentDoc = document; 

        while (autoExtractRunning && globalAutoLinks.length < 300) {
            // Extract links from current Document
            let resultNodes = currentDoc.querySelectorAll('a h3, a div[role="heading"]');
            resultNodes.forEach(node => {
                const a = node.closest('a');
                if (a && a.href && a.href.startsWith('http') && !autoUniqueHrefs.has(a.href)) {
                    autoUniqueHrefs.add(a.href);
                    let dateFound = "";
                    let snippetParent = a.closest('.g');
                    if(snippetParent) {
                        let timeSpan = snippetParent.querySelector('span > span > span');
                        if(timeSpan && !timeSpan.innerText.includes("—")) {
                            dateFound = formatPublishDate(timeSpan.innerText) || timeSpan.innerText;
                        }
                    }
                    globalAutoLinks.push({
                        url: a.href, text: getCleanText(a), domain: new URL(a.href).hostname,
                        platform: getPlatformType(a.href), author: extractAuthorName(a.href, a),
                        date: dateFound, element: a
                    });
                }
            });

            floatingAutoBtn.innerHTML = `🛑 Stop Extracting (${globalAutoLinks.length} found)`;
            if (globalAutoLinks.length >= 300) break;

            // Check for buttons in the current document
            let moreBtn = currentDoc.querySelector('.RVQsvd'); // Infinite Scroll
            let nextBtn = currentDoc.querySelector('#pnnext'); // Classic Pagination

            if (moreBtn && currentDoc === document) {
                // Scenario 1: Infinite Scroll
                window.scrollTo(0, document.body.scrollHeight);
                moreBtn.click();
                await new Promise(r => setTimeout(r, 1500)); 
            } else if (nextBtn) {
                // Scenario 2: Classic Pagination (Like in your screenshot)
                floatingAutoBtn.innerHTML = `⏳ Fetching Next Page (${globalAutoLinks.length} found)...`;
                try {
                    let res = await fetch(nextBtn.href);
                    let text = await res.text();
                    let parser = new DOMParser();
                    currentDoc = parser.parseFromString(text, 'text/html');
                    await new Promise(r => setTimeout(r, 800)); // Delay to avoid ban
                } catch(err) {
                    console.error("Fetch failed", err);
                    break;
                }
            } else {
                // No more pages
                break;
            }
        }

        autoExtractRunning = false;
        floatingAutoBtn.innerHTML = '🔄 Auto-Scroll & Extract (Target 300)';
        
        if(globalAutoLinks.length > 0) {
            showLinkExtractorModal(globalAutoLinks);
        } else {
            alert("নতুন কোনো লিংক খুঁজে পাওয়া যায়নি।");
        }
    });

    if (!document.getElementById('google-floating-extract-btn')) document.body.appendChild(floatingExtractBtn);
    if (!document.getElementById('google-floating-extract-10-btn')) document.body.appendChild(floating10PagesBtn);
    if (!document.getElementById('google-auto-scroll-btn')) document.body.appendChild(floatingAutoBtn);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extract_links") {
    showLinkExtractorModal();
    sendResponse({status: "done"});
  }
});

// ==========================================================
// MODAL: Link Extractor & CSV & Dedup
// ==========================================================
function showLinkExtractorModal(preFetchedLinks = null) {
  const existingModal = document.getElementById('link-extractor-modal');
  if (existingModal) existingModal.remove();

  let uniqueLinks = [];

  if (preFetchedLinks) {
    uniqueLinks = preFetchedLinks;
  } else if (isGoogleSearch) {
    const resultNodes = document.querySelectorAll('a h3, a div[role="heading"]');
    const uniqueHrefs = new Set();
    resultNodes.forEach(node => {
      const a = node.closest('a');
      if (a && a.href && a.href.startsWith('http') && !uniqueHrefs.has(a.href)) {
        uniqueHrefs.add(a.href);
        let dateFound = "";
        let snippetParent = a.closest('.g');
        if(snippetParent) {
            let timeSpan = snippetParent.querySelector('span > span > span');
            if(timeSpan && !timeSpan.innerText.includes("—")) { 
                dateFound = formatPublishDate(timeSpan.innerText) || timeSpan.innerText;
            }
        }
        uniqueLinks.push({ 
            url: a.href, text: getCleanText(a), domain: new URL(a.href).hostname,
            platform: getPlatformType(a.href), author: extractAuthorName(a.href, a),
            date: dateFound, element: a 
        });
      }
    });
  } else {
    const allPageLinks = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.startsWith('http'));
    const uniqueLinksMap = new Map();
    let pageDateMeta = document.querySelector('meta[property="article:published_time"]');
    let pageDate = formatPublishDate(pageDateMeta ? pageDateMeta.content : null);

    allPageLinks.forEach(a => { if (!uniqueLinksMap.has(a.href)) uniqueLinksMap.set(a.href, a); });
    uniqueLinks = Array.from(uniqueLinksMap.values()).map(a => ({ 
        url: a.href, text: getCleanText(a), domain: new URL(a.href).hostname,
        platform: getPlatformType(a.href), author: "", date: pageDate, element: a 
    }));
  }

  const domains = [...new Set(uniqueLinks.map(l => l.domain))];

  const modal = document.createElement('div');
  modal.id = 'link-extractor-modal';
  
  modal.innerHTML = `
    <div id="link-extractor-header">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
          <h3 id="modal-header-title" style="margin:0;">Extracted Links (${uniqueLinks.length})</h3>
          <button id="close-extractor-btn" class="modal-top-btn">Close</button>
      </div>
      
      <div class="bulk-actions" style="display:flex; gap:8px; flex-wrap:wrap; padding: 10px; background: #e8f0fe; border-radius: 6px; align-items:center;">
          <span style="font-size:12px; font-weight:bold; color:#1a73e8; display:flex; align-items:center;">সবগুলো Sheet2 তে পাঠান:</span>
          <button id="bulk-copy-link" class="bulk-btn">🔗 Bulk Link</button>
          <button id="bulk-copy-text" class="bulk-btn">📝 Bulk Text</button>
          <button id="bulk-copy-hyperlink" class="bulk-btn">🌐 Bulk Hyperlink</button>
          <button id="bulk-copy-split" class="bulk-btn">📊 Bulk Split</button>
      </div>

      <div style="display:flex; gap:10px; margin-top:10px; padding:10px; background:#f1f3f4; border-radius:6px; flex-wrap:wrap; align-items:center;">
          <label style="font-size:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px;">
              <input type="checkbox" id="chk-remove-duplicates"> Remove Duplicates
          </label>
          <span style="border-left: 1px solid #ccc; height: 15px; margin: 0 5px;"></span>
          <label style="font-size:12px; font-weight:bold;">Filter Domain:</label>
          <select id="domain-filter-select" style="padding:4px; border-radius:4px; font-size:12px; border:1px solid #ccc;">
              <option value="ALL">All Domains</option>
              ${domains.map(d => `<option value="${d}">${d}</option>`).join('')}
          </select>
          <button id="btn-export-csv" class="feature-btn" style="background:#28a745; margin-left:auto;">📥 Download CSV</button>
      </div>
    </div>
    <div id="link-extractor-body"></div>
  `;
  document.body.appendChild(modal);

  const body = document.getElementById('link-extractor-body');

  function renderList(listToRender) {
      body.innerHTML = '';
      document.getElementById('modal-header-title').innerText = `Extracted Links (${listToRender.length})`;
      
      listToRender.forEach(linkObj => {
        const item = document.createElement('div');
        item.className = 'extracted-link-item';
        
        item.innerHTML = `
          <div style="display:flex; align-items:center; gap: 8px; flex:1; max-width: 65%;">
              <button class="remove-item-btn" title="Delete from Sheet & List">❌</button>
              <div class="link-info" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; width: 100%;">
                  <a href="${linkObj.url}" target="_blank" style="font-weight:bold; color:#1a73e8; text-decoration:none;">${linkObj.text}</a>
                  <div style="font-size: 11px; color: #555;">${linkObj.domain} | ${linkObj.date || "No Date"} | ${linkObj.platform}</div>
              </div>
          </div>
          <div style="display:flex; gap:5px; flex-shrink:0;">
              <button class="modal-copy-btn split-btn">📊 Split</button>
              <button class="modal-copy-btn hyper-btn">🌐 Hyper</button>
              <button class="modal-copy-btn direct-btn" title="Copy URL Only">🔗 Copy</button>
          </div>
        `;

        item.querySelector('.remove-item-btn').onclick = () => {
            const index = uniqueLinks.findIndex(l => l.url === linkObj.url);
            if (index > -1) uniqueLinks.splice(index, 1);
            item.remove();
            document.getElementById('modal-header-title').innerText = `Extracted Links (${uniqueLinks.length})`;
            sendToGoogleSheet({ action: "delete", url: linkObj.url });
        };

        item.querySelector('.direct-btn').onclick = (e) => {
            navigator.clipboard.writeText(linkObj.url).then(() => {
                sendToGoogleSheet(linkObj.url, "Sheet1");
                registerSavedLink(linkObj.url);
                e.target.textContent = "Sent!"; e.target.style.background = '#28a745'; 
                setTimeout(() => { e.target.textContent = "🔗 Copy"; e.target.style.background = '#6c757d'; }, 1500);
            });
        };

        const fullRowData = `${linkObj.text}\t${linkObj.url}\t${linkObj.domain}\t${linkObj.date}\t${linkObj.platform}\t${linkObj.author}`;

        item.querySelector('.split-btn').onclick = (e) => {
          navigator.clipboard.writeText(fullRowData).then(() => {
            sendToGoogleSheet(fullRowData, "Sheet1");
            registerSavedLink(linkObj.url);
            e.target.textContent = "Sent!"; e.target.style.background = '#28a745';
            setTimeout(() => { e.target.textContent = "📊 Split"; e.target.style.background = '#6c757d'; }, 1500);
          });
        };
        
        item.querySelector('.hyper-btn').onclick = async (e) => {
            const sheetFormula = `=HYPERLINK("${linkObj.url}", "${linkObj.text.replace(/"/g, '""')}")`;
            navigator.clipboard.writeText(sheetFormula);
            sendToGoogleSheet(sheetFormula, "Sheet1");
            registerSavedLink(linkObj.url);
            e.target.textContent = "Sent!"; e.target.style.background = '#28a745';
            setTimeout(() => { e.target.textContent = "🌐 Hyper"; e.target.style.background = '#6c757d'; }, 1500);
        };
        body.appendChild(item);
      });
  }

  renderList(uniqueLinks);

  const handleBulkAction = async (type, btn) => {
    const currentList = Array.from(document.querySelectorAll('.extracted-link-item')).map(item => {
      const a = item.querySelector('.link-info a');
      const text = a.innerText;
      const url = a.href;
      return uniqueLinks.find(l => l.url === url) || { text, url, domain:"", date:"", platform:"", author:"" };
    });

    if(currentList.length === 0) { alert("কোনো লিংক খুঁজে পাওয়া যায়নি!"); return; }

    let textToCopy = "";
    let sheetData = "";

    if (type === 'link') {
        textToCopy = currentList.map(l => l.url).join('\n');
        sheetData = textToCopy;
    } else if (type === 'text') {
        textToCopy = currentList.map(l => l.text).join('\n');
        sheetData = textToCopy;
    } else if (type === 'hyperlink') {
        textToCopy = currentList.map(l => `=HYPERLINK("${l.url}", "${l.text.replace(/"/g, '""')}")`).join('\n');
        sheetData = textToCopy; 
    } else if (type === 'split') {
        textToCopy = currentList.map(l => `${l.text}\t${l.url}\t${l.domain}\t${l.date}\t${l.platform}\t${l.author}`).join('\n');
        sheetData = textToCopy;
    }

    await navigator.clipboard.writeText(textToCopy);
    sendToGoogleSheet(sheetData, "Sheet2"); 
    currentList.forEach(l => registerSavedLink(l.url));

    const originalText = btn.textContent;
    btn.textContent = "✅ Sent to Sheet2!";
    btn.style.background = "#28a745";
    setTimeout(() => { btn.textContent = originalText; btn.style.background = ""; }, 2000);
  };

  document.getElementById('bulk-copy-link').onclick = (e) => handleBulkAction('link', e.target);
  document.getElementById('bulk-copy-text').onclick = (e) => handleBulkAction('text', e.target);
  document.getElementById('bulk-copy-hyperlink').onclick = (e) => handleBulkAction('hyperlink', e.target);
  document.getElementById('bulk-copy-split').onclick = (e) => handleBulkAction('split', e.target);

  document.getElementById('chk-remove-duplicates').onchange = (e) => {
      const selectedDomain = document.getElementById('domain-filter-select').value;
      let baseList = selectedDomain === "ALL" ? uniqueLinks : uniqueLinks.filter(l => l.domain === selectedDomain);

      if (e.target.checked) {
          const seen = new Set();
          renderList(baseList.filter(el => {
              const duplicate = seen.has(el.url); seen.add(el.url); return !duplicate;
          }));
      } else {
          renderList(baseList);
      }
  };

  document.getElementById('domain-filter-select').onchange = (e) => {
      const selected = e.target.value;
      const isDedupChecked = document.getElementById('chk-remove-duplicates').checked;
      let listToFilter = uniqueLinks;

      if (isDedupChecked) {
          const seen = new Set();
          listToFilter = uniqueLinks.filter(el => {
              const duplicate = seen.has(el.url); seen.add(el.url); return !duplicate;
          });
      }

      if(selected === "ALL") renderList(listToFilter);
      else renderList(listToFilter.filter(l => l.domain === selected));
  };

  document.getElementById('btn-export-csv').onclick = () => {
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
      csvContent += "Title,URL,Domain,Date,Platform,Author\n";
      
      const currentListUrls = Array.from(document.querySelectorAll('.extracted-link-item .link-info a')).map(a => a.href);
      if(currentListUrls.length === 0) { alert("No links to download!"); return; }

      currentListUrls.forEach(url => {
          let l = uniqueLinks.find(u => u.url === url);
          if(l) {
              let title = l.text.replace(/"/g, '""'); 
              csvContent += `"${title}","${l.url}","${l.domain}","${l.date}","${l.platform}","${l.author}"\n`;
          }
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "extracted_links.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
  };

  document.getElementById('close-extractor-btn').onclick = () => modal.remove();
}