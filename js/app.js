// BIẾN TOÀN CỤC QUẢN LÝ NGÔN NGỮ VÀ SLIDER ẢNH
let currentLang = 'vi';
let currentImages = [];
let currentImageIndex = 0;

// Hàm bổ trợ lấy văn bản theo ngôn ngữ đang chọn
function getLangText(obj) {
    if (!obj) return '';
    if (typeof obj === 'object') {
        return obj[currentLang] || obj.vi || '';
    }
    return obj;
}

// KHỞI TẠO VÀ RENDER KHI TRANG TẢI XONG
document.addEventListener('DOMContentLoaded', () => {
    setLanguage('vi');
});

// Hàm kiểm tra giờ mở cửa thời gian thực
function checkOpenStatus(openH, closeH) {
    const now = new Date();
    const currentHour = now.getHours();
    if (openH === 0 && closeH === 24) return true;
    return currentHour >= openH && currentHour < closeH;
}

// HÀM CHUYỂN ĐỔI NGÔN NGỮ CHÍNH (VIETNAMESE - ENGLISH - CHINESE)
function setLanguage(lang) {
    currentLang = lang;

    // Cập nhật trạng thái hiển thị của bộ nút chọn ngôn ngữ
    ['vi', 'en', 'zh'].forEach(l => {
        const btn = document.getElementById(`lang-btn-${l}`);
        if (btn) {
            if (l === lang) {
                btn.className = "px-2.5 py-1.5 rounded-lg bg-amber-500 text-white shadow-sm transition font-bold";
            } else {
                btn.className = "px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 transition font-bold";
            }
        }
    });

    // Cập nhật các văn bản tĩnh trên giao diện HTML từ uiText
    if (typeof uiText !== 'undefined' && uiText[currentLang]) {
        const t = uiText[currentLang];
        
        const tagline = document.getElementById('header-tagline');
        if (tagline) tagline.innerText = t.headerTagline;

        const navLoc = document.getElementById('nav-tab-locations');
        if (navLoc && navLoc.querySelector('span')) navLoc.querySelector('span').innerText = t.locationsNav;

        const navIt = document.getElementById('nav-tab-itinerary');
        if (navIt && navIt.querySelector('span')) navIt.querySelector('span').innerText = t.itineraryNav;

        const navAb = document.getElementById('nav-tab-about');
        if (navAb && navAb.querySelector('span')) navAb.querySelector('span').innerText = t.aboutNav;

        const searchInp = document.getElementById('search-input');
        if (searchInp) searchInp.placeholder = t.searchPlaceholder;

        const catAll = document.getElementById('cat-btn-all');
        if (catAll) catAll.innerText = t.allCat;

        const catCult = document.getElementById('cat-btn-culture');
        if (catCult) catCult.innerText = t.cultureCat;

        const catFood = document.getElementById('cat-btn-food');
        if (catFood) catFood.innerText = t.foodCat;

        const catNat = document.getElementById('cat-btn-nature');
        if (catNat) catNat.innerText = t.natureCat;

        const itTip = document.getElementById('itinerary-tip-text');
        if (itTip) itTip.innerText = t.itineraryTip;

        const abTitle = document.getElementById('about-title');
        if (abTitle) abTitle.innerHTML = `<i class="fa-solid fa-bullseye text-amber-500 mr-2.5"></i>${t.aboutTitle}`;

        const abDesc = document.getElementById('about-desc');
        if (abDesc) abDesc.innerHTML = `<strong>Cần Thơ Pop Map</strong> ${t.aboutDesc.replace('Cần Thơ Pop Map ', '')}`;

        const f1T = document.getElementById('about-feat1-title');
        if (f1T) f1T.innerText = t.aboutFeat1Title;
        const f1D = document.getElementById('about-feat1-desc');
        if (f1D) f1D.innerText = t.aboutFeat1Desc;

        const f2T = document.getElementById('about-feat2-title');
        if (f2T) f2T.innerText = t.aboutFeat2Title;
        const f2D = document.getElementById('about-feat2-desc');
        if (f2D) f2D.innerText = t.aboutFeat2Desc;

        const f3T = document.getElementById('about-feat3-title');
        if (f3T) f3T.innerText = t.aboutFeat3Title;
        const f3D = document.getElementById('about-feat3-desc');
        if (f3D) f3D.innerText = t.aboutFeat3Desc;

        const disT = document.getElementById('disclaimer-title');
        if (disT) disT.innerHTML = `<i class="fa-solid fa-shield-halved text-amber-600 mr-2"></i>${t.disclaimerTitle}`;

        const disD = document.getElementById('disclaimer-desc');
        if (disD) disD.innerText = t.disclaimerDesc;

        const lblPhoto = document.getElementById('modal-lbl-real-photo');
        if (lblPhoto) lblPhoto.innerText = t.realPhoto;

        const lblTicket = document.getElementById('modal-lbl-ticket');
        if (lblTicket) lblTicket.innerText = t.ticketLabel;

        const lblUpdated = document.getElementById('modal-lbl-updated');
        if (lblUpdated) lblUpdated.innerText = t.updatedLabel;

        const lblDescHeader = document.getElementById('modal-lbl-desc-header');
        if (lblDescHeader) lblDescHeader.innerText = t.descHeader;

        const lblSource = document.getElementById('modal-lbl-source');
        if (lblSource) lblSource.innerText = t.sourceLabel;

        const lblGmaps = document.getElementById('modal-lbl-gmaps-btn');
        if (lblGmaps) lblGmaps.innerText = t.gmapsBtn;
    }

    // Render lại toàn bộ dữ liệu theo ngôn ngữ mới
    renderLocations(locations);
    renderItineraries(itineraries);
}

// Render danh sách địa điểm dạng Lưới (Grid)
function renderLocations(data) {
    const container = document.getElementById('locations-list');
    if (!container) return;
    container.innerHTML = '';

    const t = (typeof uiText !== 'undefined' && uiText[currentLang]) ? uiText[currentLang] : {
        openStatus: "MỞ CỬA",
        closeStatus: "ĐÓNG CỬA",
        viewDetails: "Xem chi tiết"
    };

    if (data.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-slate-400 text-sm">Không tìm thấy địa điểm phù hợp.</div>`;
        return;
    }

    data.forEach(item => {
        const isOpen = checkOpenStatus(item.openHour, item.closeHour);
        const mainImg = item.images && item.images.length > 0 ? item.images[0] : (item.image || '');
        const imgCount = item.images ? item.images.length : 1;

        const itemName = getLangText(item.name);
        const itemCategory = getLangText(item.category);
        const itemAddress = getLangText(item.address);

        const statusBadge = isOpen 
            ? `<span class="bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-md"><span class="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse"></span>${t.openStatus}</span>`
            : `<span class="bg-rose-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-md"><span class="w-2 h-2 bg-white rounded-full mr-1.5"></span>${t.closeStatus}</span>`;

        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between";
        card.onclick = () => openModal(item.id);

        card.innerHTML = `
            <div>
                <div class="relative h-52 overflow-hidden">
                    <img src="${mainImg}" alt="${itemName}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                    <div class="absolute top-3 left-3 right-3 flex justify-between items-center">
                        <span class="text-xs font-bold px-3 py-1 bg-slate-900/60 text-white backdrop-blur-md rounded-lg shadow-sm">${itemCategory}</span>
                        ${statusBadge}
                    </div>
                    ${imgCount > 1 ? `<span class="absolute top-3 right-24 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-md"><i class="fa-solid fa-images mr-1"></i>${imgCount}</span>` : ''}
                    <div class="absolute bottom-3 left-3 right-3 text-white">
                        <h3 class="font-bold text-lg leading-snug drop-shadow-md group-hover:text-amber-300 transition">${itemName}</h3>
                        <p class="text-xs text-slate-200 truncate flex items-center mt-1">
                            <i class="fa-solid fa-location-dot text-amber-400 mr-1.5"></i>${itemAddress}
                        </p>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-white flex items-center justify-between text-xs border-t border-slate-100">
                <div class="text-slate-500 font-medium">
                    <i class="fa-solid fa-clock text-amber-500 mr-1.5"></i>${item.openHour}:00 - ${item.closeHour}:00
                </div>
                <button class="text-amber-600 font-bold group-hover:translate-x-1 transition flex items-center space-x-1">
                    <span>${t.viewDetails}</span>
                    <i class="fa-solid fa-arrow-right text-[11px]"></i>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render Lịch trình mẫu
function renderItineraries(data) {
    const container = document.getElementById('itinerary-list');
    if (!container) return;
    container.innerHTML = '';

    data.forEach(it => {
        const itTitle = getLangText(it.title);
        const itBadge = getLangText(it.badge);
        const itTime = getLangText(it.time);

        let stepsHTML = it.steps.map(s => {
            const stepPlace = getLangText(s.place);
            const stepDetail = getLangText(s.detail);
            return `
                <div class="flex items-start space-x-3 text-xs relative pl-4 border-l-2 border-amber-400 pb-3 last:pb-0">
                    <div class="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white"></div>
                    <div>
                        <span class="font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">${s.time}</span>
                        <h5 class="font-bold text-slate-900 text-xs mt-1">${stepPlace}</h5>
                        <p class="text-slate-600 text-[12px] mt-0.5 leading-relaxed">${stepDetail}</p>
                    </div>
                </div>
            `;
        }).join('');

        const box = document.createElement('div');
        box.className = "bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between";
        box.innerHTML = `
            <div>
                <div class="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                        <span class="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">${itBadge}</span>
                        <h4 class="font-bold text-slate-900 text-base mt-2">${itTitle}</h4>
                    </div>
                    <span class="text-xs text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-full"><i class="fa-regular fa-clock mr-1"></i>${itTime}</span>
                </div>
                <div class="pt-4">
                    ${stepsHTML}
                </div>
            </div>
        `;
        container.appendChild(box);
    });
}

// LOGIC SLIDER HÌNH ẢNH TRONG MODAL
function updateSlider() {
    const imgEl = document.getElementById('modal-img');
    const counterEl = document.getElementById('modal-img-counter');
    const dotsContainer = document.getElementById('modal-slider-dots');

    if (!currentImages || currentImages.length === 0) return;

    imgEl.src = currentImages[currentImageIndex];
    if (counterEl) counterEl.innerText = `${currentImageIndex + 1}/${currentImages.length}`;

    if (currentImages.length > 1) {
        if (dotsContainer) {
            dotsContainer.innerHTML = currentImages.map((_, idx) => `
                <button onclick="setSlide(${idx})" class="h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}"></button>
            `).join('');
        }
        document.getElementById('slider-prev-btn').classList.remove('hidden');
        document.getElementById('slider-next-btn').classList.remove('hidden');
    } else {
        if (dotsContainer) dotsContainer.innerHTML = '';
        document.getElementById('slider-prev-btn').classList.add('hidden');
        document.getElementById('slider-next-btn').classList.add('hidden');
    }
}

function nextSlide() {
    if (!currentImages || currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateSlider();
}

function prevSlide() {
    if (!currentImages || currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateSlider();
}

function setSlide(index) {
    currentImageIndex = index;
    updateSlider();
}

// Mở Modal Chi Tiết Địa Điểm
function openModal(id) {
    const item = locations.find(l => l.id === id);
    if (!item) return;

    const isOpen = checkOpenStatus(item.openHour, item.closeHour);
    const t = (typeof uiText !== 'undefined' && uiText[currentLang]) ? uiText[currentLang] : {
        openStatus: "MỞ CỬA",
        closeStatus: "ĐÓNG CỬA"
    };

    currentImages = item.images && item.images.length > 0 ? item.images : [(item.image || '')];
    currentImageIndex = 0;
    updateSlider();

    document.getElementById('modal-category').innerText = getLangText(item.category);
    document.getElementById('modal-title').innerText = getLangText(item.name);
    document.getElementById('modal-address').querySelector('span').innerText = getLangText(item.address);
    document.getElementById('modal-open-hours').innerText = `${item.openHour}:00 - ${item.closeHour}:00`;
    document.getElementById('modal-ticket').innerText = getLangText(item.ticket);
    document.getElementById('modal-updated').innerText = item.updated;
    document.getElementById('modal-desc').innerText = getLangText(item.desc);
    document.getElementById('modal-source').innerText = item.source;
    document.getElementById('modal-gmaps-link').href = item.gmaps;

    const statusBox = document.getElementById('modal-status-box');
    const statusDot = document.getElementById('modal-status-dot');
    const statusText = document.getElementById('modal-status-text');

    if (isOpen) {
        statusBox.className = "p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-between text-xs sm:text-sm font-semibold";
        statusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
        statusText.innerText = t.openStatus;
    } else {
        statusBox.className = "p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 flex items-center justify-between text-xs sm:text-sm font-semibold";
        statusDot.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
        statusText.innerText = t.closeStatus;
    }

    document.getElementById('location-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('location-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Tìm kiếm & Lọc
function filterLocations() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = locations.filter(item => {
        const nameText = getLangText(item.name).toLowerCase();
        const addressText = getLangText(item.address).toLowerCase();
        return nameText.includes(query) || addressText.includes(query);
    });
    renderLocations(filtered);
}

function filterCategory(cat) {
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.remove('bg-slate-900', 'text-white');
        btn.classList.add('bg-white', 'text-slate-600');
    });
    if (window.event && window.event.target) {
        window.event.target.classList.remove('bg-white', 'text-slate-600');
        window.event.target.classList.add('bg-slate-900', 'text-white');
    }

    if (cat === 'All') {
        renderLocations(locations);
    } else {
        const filtered = locations.filter(item => {
            const rawCatVi = typeof item.category === 'object' ? item.category.vi : item.category;
            return rawCatVi === cat;
        });
        renderLocations(filtered);
    }
}

// Chuyển Tab
function switchTab(tab) {
    ['locations', 'itinerary', 'about'].forEach(t => {
        const el = document.getElementById(`tab-${t}`);
        if (el) el.classList.add('hidden');
        const btn = document.getElementById(`nav-tab-${t}`);
        if (btn) {
            btn.classList.remove('bg-amber-500', 'text-white', 'shadow-md');
            btn.classList.add('text-slate-600', 'hover:bg-slate-100');
        }
    });

    const activeEl = document.getElementById(`tab-${tab}`);
    if (activeEl) activeEl.classList.remove('hidden');
    const activeBtn = document.getElementById(`nav-tab-${tab}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-amber-500', 'text-white', 'shadow-md');
        activeBtn.classList.remove('text-slate-600', 'hover:bg-slate-100');
    }
}