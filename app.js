/* ==========================================
   بلدية القرية — نظام الإدارة
   app.js — كل الوظائف في ملف واحد
   ========================================== */

// ===== بيانات أولية =====
const SEED_RESIDENTS = [
  {id:'r1',fullName:'أحمد الفهد',age:45,address:'قطاع أ',houseNumber:'12',streetName:'شارع الزيتون',job:'معلم',workplace:'مدرسة القرية',fatherName:'فهد الفهد',nationalId:'1234567890',gender:'male',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:['v1']},
  {id:'r2',fullName:'فاطمة نور',age:38,address:'قطاع أ',houseNumber:'12',streetName:'شارع الزيتون',job:'ممرضة',workplace:'عيادة القرية',fatherName:'حسن نور',nationalId:'0987654321',gender:'female',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:[]},
  {id:'r3',fullName:'عمر الفهد',age:12,address:'قطاع أ',houseNumber:'12',streetName:'شارع الزيتون',job:'طالب',workplace:'لا يوجد',fatherName:'أحمد الفهد',nationalId:'1122334455',gender:'child',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:[]},
  {id:'r4',fullName:'خالد سالم',age:50,address:'قطاع ج',houseNumber:'45',streetName:'شارع النخيل',job:'مزارع',workplace:'حقول الجنوب',fatherName:'سالم سالم',nationalId:'2233445566',gender:'male',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:['v2','v3']},
  {id:'r5',fullName:'زينب علي',age:48,address:'قطاع ج',houseNumber:'45',streetName:'شارع النخيل',job:'خبازة',workplace:'المنزل',fatherName:'علي',nationalId:'3344556677',gender:'female',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:[]},
  {id:'r6',fullName:'سارة سالم',age:16,address:'قطاع ج',houseNumber:'45',streetName:'شارع النخيل',job:'طالبة',workplace:'لا يوجد',fatherName:'خالد سالم',nationalId:'4455667788',gender:'child',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:[]},
  {id:'r7',fullName:'طارق محمود',age:29,address:'قطاع ب',houseNumber:'8',streetName:'شارع النهر',job:'ميكانيكي',workplace:'كراج طارق',fatherName:'محمود طارق',nationalId:'5566778899',gender:'male',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:['v4']},
  {id:'r8',fullName:'ليلى حسن',age:26,address:'قطاع ب',houseNumber:'8',streetName:'شارع النهر',job:'موظفة',workplace:'البلدية',fatherName:'حسن',nationalId:'6677889900',gender:'female',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:[]},
];
const SEED_VEHICLES = [
  {id:'v1',vehicleName:'تويوتا كورولا',plateNumber:'ABC-123',ownerName:'أحمد الفهد',chassisNumber:'CH123456',interiorColor:'بيج',exteriorColor:'أبيض',ownerNationalId:'1234567890',phoneNumber:'0551234567',imageUrl:''},
  {id:'v2',vehicleName:'نيسان هايلكس',plateNumber:'XYZ-987',ownerName:'خالد سالم',chassisNumber:'CH987654',interiorColor:'أسود',exteriorColor:'فضي',ownerNationalId:'2233445566',phoneNumber:'0559876543',imageUrl:''},
  {id:'v3',vehicleName:'هوندا سيفيك',plateNumber:'DEF-456',ownerName:'خالد سالم',chassisNumber:'CH246810',interiorColor:'رمادي',exteriorColor:'أزرق',ownerNationalId:'2233445566',phoneNumber:'0559876543',imageUrl:''},
  {id:'v4',vehicleName:'فورد رينجر',plateNumber:'LMN-321',ownerName:'طارق محمود',chassisNumber:'CH135792',interiorColor:'أسود',exteriorColor:'أحمر',ownerNationalId:'5566778899',phoneNumber:'0551122334',imageUrl:''},
  {id:'v5',vehicleName:'مازدا 6',plateNumber:'PQR-654',ownerName:'غير معروف',chassisNumber:'CH998877',interiorColor:'أبيض',exteriorColor:'أسود',ownerNationalId:'9988776655',phoneNumber:'0500000000',imageUrl:''},
];
const SEED_EMPLOYEES = [
  {id:'e1',username:'admin',password:'admin123',role:'admin'},
  {id:'e2',username:'clerk',password:'clerk123',role:'clerk'},
];

// ===== قاعدة البيانات (localStorage) =====
const DB = {
  getResidents(){ return JSON.parse(localStorage.getItem('vmms_residents') || 'null') || JSON.parse(JSON.stringify(SEED_RESIDENTS)); },
  setResidents(d){ localStorage.setItem('vmms_residents', JSON.stringify(d)); },
  getVehicles(){ return JSON.parse(localStorage.getItem('vmms_vehicles') || 'null') || JSON.parse(JSON.stringify(SEED_VEHICLES)); },
  setVehicles(d){ localStorage.setItem('vmms_vehicles', JSON.stringify(d)); },
  getEmployees(){ return JSON.parse(localStorage.getItem('vmms_employees') || 'null') || JSON.parse(JSON.stringify(SEED_EMPLOYEES)); },
  setEmployees(d){ localStorage.setItem('vmms_employees', JSON.stringify(d)); },
  getCurrentUser(){ return JSON.parse(localStorage.getItem('vmms_user') || 'null'); },
  setCurrentUser(u){ localStorage.setItem('vmms_user', JSON.stringify(u)); },
  clearCurrentUser(){ localStorage.removeItem('vmms_user'); },
};

// ===== المصادقة =====
function requireAuth() {
  if (!DB.getCurrentUser()) { window.location.href = '/'; return false; }
  return true;
}
function setupNavbar() {
  const user = DB.getCurrentUser();
  const el = document.getElementById('nav-username');
  if (el && user) el.textContent = user.username;
  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => {
      DB.clearCurrentUser();
      window.location.href = '/';
    });
  });
  const path = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(a => {
    if (a.getAttribute('href') === path || a.getAttribute('href') === path.replace(/^\//, '')) {
      a.classList.add('active');
    }
  });
}

// ===== مساعدات =====
function generateId() { return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }

function genderLabel(g) { return g === 'male' ? 'ذكر' : g === 'female' ? 'أنثى' : 'طفل'; }
function genderBadge(g) { return `<span class="badge badge-${g}">${genderLabel(g)}</span>`; }

function showToast(msg, type='success') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function avatarInitials(name) {
  return name ? name.charAt(0) : '؟';
}

// ===== تغيير الحجم للصور =====
function resizeImage(file, maxW=400, maxH=400, quality=0.75) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
        if (h > maxH) { w = Math.round(w * maxH / h); h = maxH; }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ===== المودال =====
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}
function setupModalClose() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });
}

// ===== إعداد رفع الصورة =====
function setupImageUpload(inputId, previewId, isAvatar=false) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;

  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    const maxW = isAvatar ? 300 : 600;
    const b64 = await resizeImage(file, maxW, maxW);
    preview.src = b64;
    preview.style.display = 'block';
  });
}

// ========================================
// ===== صفحة تسجيل الدخول =====
// ========================================
function initLogin() {
  if (DB.getCurrentUser()) { window.location.href = '/dashboard.html'; return; }

  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errEl = document.getElementById('login-error');

    const employees = DB.getEmployees();
    const user = employees.find(emp => emp.username === username && emp.password === password);

    if (user) {
      DB.setCurrentUser({ id: user.id, username: user.username, role: user.role });
      window.location.href = '/dashboard.html';
    } else {
      errEl.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
      errEl.style.display = 'block';
      setTimeout(() => errEl.style.display = 'none', 3000);
    }
  });
}

// ========================================
// ===== لوحة التحكم =====
// ========================================
function initDashboard() {
  if (!requireAuth()) return;
  setupNavbar();

  const residents = DB.getResidents();
  const vehicles = DB.getVehicles();
  const employees = DB.getEmployees();

  const males = residents.filter(r => r.gender === 'male').length;
  const females = residents.filter(r => r.gender === 'female').length;
  const children = residents.filter(r => r.gender === 'child').length;

  const stats = [
    { id:'stat-total', val: residents.length },
    { id:'stat-male', val: males },
    { id:'stat-female', val: females },
    { id:'stat-child', val: children },
    { id:'stat-vehicles', val: vehicles.length },
    { id:'stat-employees', val: employees.length },
  ];
  stats.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) el.textContent = s.val;
  });

  const recentEl = document.getElementById('recent-residents');
  if (recentEl) {
    const recent = [...residents].reverse().slice(0, 5);
    if (recent.length === 0) {
      recentEl.innerHTML = '<div class="empty-state"><div class="empty-state-icon">👥</div><p>لا يوجد سكان حتى الآن</p></div>';
      return;
    }
    recentEl.innerHTML = recent.map(r => `
      <div class="recent-row">
        <div class="recent-avatar">${r.photoUrl ? `<img src="${r.photoUrl}" alt="">` : `<span>${avatarInitials(r.fullName)}</span>`}</div>
        <div class="recent-info">
          <div class="recent-name">${r.fullName}</div>
          <div class="recent-sub">${r.address} · منزل ${r.houseNumber}</div>
        </div>
        <div class="recent-meta">
          <div class="recent-job">${r.job}</div>
          <div class="recent-age">العمر: ${r.age}</div>
        </div>
      </div>
    `).join('');
  }
}

// ========================================
// ===== السكان =====
// ========================================
let editingResidentId = null;
let residentPhotoB64 = '';
let residentIdPhotoB64 = '';

function initResidents() {
  if (!requireAuth()) return;
  setupNavbar();
  renderResidents('');

  const searchEl = document.getElementById('resident-search');
  if (searchEl) searchEl.addEventListener('input', e => renderResidents(e.target.value));

  document.getElementById('btn-add-resident')?.addEventListener('click', () => openAddResidentModal(null));
  document.getElementById('fab-add-resident')?.addEventListener('click', () => openAddResidentModal(null));

  document.getElementById('resident-form')?.addEventListener('submit', saveResident);

  setupImageUpload('photo-input', 'photo-preview', true);
  setupImageUpload('id-photo-input', 'id-photo-preview', false);

  document.getElementById('photo-input')?.addEventListener('change', async () => {
    const f = document.getElementById('photo-input').files[0];
    if (f) residentPhotoB64 = await resizeImage(f, 300, 300);
  });
  document.getElementById('id-photo-input')?.addEventListener('change', async () => {
    const f = document.getElementById('id-photo-input').files[0];
    if (f) residentIdPhotoB64 = await resizeImage(f, 600, 400);
  });

  setupModalClose();
}

function renderResidents(search) {
  const residents = DB.getResidents();
  const q = (search || '').toLowerCase();
  const filtered = q ? residents.filter(r =>
    r.fullName.toLowerCase().includes(q) ||
    r.nationalId.includes(q) ||
    r.address.toLowerCase().includes(q)
  ) : residents;

  const container = document.getElementById('residents-grid');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">🔍</div>
      <h3>لا يوجد نتائج</h3>
      <p>جرّب تعديل كلمة البحث</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(r => `
    <div class="resident-card card" onclick="openViewResidentModal('${r.id}')">
      <div class="rc-avatar">
        ${r.photoUrl ? `<img src="${r.photoUrl}" alt="${r.fullName}">` : `<div class="rc-initials">${avatarInitials(r.fullName)}</div>`}
      </div>
      <div class="rc-body">
        <div class="rc-name">${r.fullName}</div>
        <div class="rc-sub">${r.age} سنة · ${genderLabel(r.gender)}</div>
        <div class="rc-meta">
          <span>📍 ${r.address}، م ${r.houseNumber}</span>
          <span>💼 ${r.job}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openAddResidentModal(id) {
  editingResidentId = id;
  residentPhotoB64 = '';
  residentIdPhotoB64 = '';

  const form = document.getElementById('resident-form');
  if (!form) return;
  form.reset();

  const photoP = document.getElementById('photo-preview');
  const idPhotoP = document.getElementById('id-photo-preview');
  if (photoP) photoP.style.display = 'none';
  if (idPhotoP) idPhotoP.style.display = 'none';

  const titleEl = document.getElementById('resident-modal-title');

  if (id) {
    const r = DB.getResidents().find(x => x.id === id);
    if (!r) return;
    if (titleEl) titleEl.textContent = 'تعديل بيانات الساكن';
    document.getElementById('r-fullName').value = r.fullName;
    document.getElementById('r-age').value = r.age;
    document.getElementById('r-gender').value = r.gender;
    document.getElementById('r-nationalId').value = r.nationalId;
    document.getElementById('r-fatherName').value = r.fatherName;
    document.getElementById('r-address').value = r.address;
    document.getElementById('r-streetName').value = r.streetName;
    document.getElementById('r-houseNumber').value = r.houseNumber;
    document.getElementById('r-job').value = r.job;
    document.getElementById('r-workplace').value = r.workplace;

    residentPhotoB64 = r.photoUrl || '';
    residentIdPhotoB64 = r.idPhotoUrl || '';
    if (r.photoUrl && photoP) { photoP.src = r.photoUrl; photoP.style.display = 'block'; }
    if (r.idPhotoUrl && idPhotoP) { idPhotoP.src = r.idPhotoUrl; idPhotoP.style.display = 'block'; }
  } else {
    if (titleEl) titleEl.textContent = 'تسجيل ساكن جديد';
  }

  closeModal('view-resident-modal');
  openModal('add-resident-modal');
}

function saveResident(e) {
  e.preventDefault();
  const residents = DB.getResidents();

  const data = {
    fullName: document.getElementById('r-fullName').value.trim(),
    age: parseInt(document.getElementById('r-age').value) || 0,
    gender: document.getElementById('r-gender').value,
    nationalId: document.getElementById('r-nationalId').value.trim(),
    fatherName: document.getElementById('r-fatherName').value.trim(),
    address: document.getElementById('r-address').value.trim(),
    streetName: document.getElementById('r-streetName').value.trim(),
    houseNumber: document.getElementById('r-houseNumber').value.trim(),
    job: document.getElementById('r-job').value.trim(),
    workplace: document.getElementById('r-workplace').value.trim(),
    photoUrl: residentPhotoB64,
    idPhotoUrl: residentIdPhotoB64,
  };

  if (editingResidentId) {
    const idx = residents.findIndex(r => r.id === editingResidentId);
    if (idx > -1) {
      residents[idx] = { ...residents[idx], ...data };
    }
    DB.setResidents(residents);
    showToast('تم تحديث بيانات الساكن', 'success');
  } else {
    data.id = generateId();
    data.linkedVehicleIds = [];
    residents.unshift(data);
    DB.setResidents(residents);
    showToast('تم تسجيل الساكن بنجاح', 'success');
  }

  closeModal('add-resident-modal');
  renderResidents(document.getElementById('resident-search')?.value || '');
}

function openViewResidentModal(id) {
  const residents = DB.getResidents();
  const vehicles = DB.getVehicles();
  const r = residents.find(x => x.id === id);
  if (!r) return;

  const linkedVehicles = vehicles.filter(v => r.linkedVehicleIds.includes(v.id));

  document.getElementById('view-resident-content').innerHTML = `
    <div class="view-resident-header">
      <div class="view-avatar">
        ${r.photoUrl ? `<img src="${r.photoUrl}" alt="${r.fullName}">` : `<div class="view-initials">${avatarInitials(r.fullName)}</div>`}
      </div>
      <div>
        <h2 class="view-name">${r.fullName}</h2>
        <div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap">
          ${genderBadge(r.gender)}
          <span class="badge badge-secondary">العمر: ${r.age}</span>
        </div>
      </div>
      <div style="margin-right:auto">
        <button class="btn btn-outline" onclick="openAddResidentModal('${r.id}')">✏️ تعديل</button>
      </div>
    </div>

    <div class="grid-2" style="margin-top:20px">
      <div>
        <div class="detail-section">
          <div class="detail-section-title">📋 بيانات الهوية</div>
          <div class="detail-box">
            <div class="detail-row"><span class="detail-label">رقم الهوية</span><span class="detail-value">${r.nationalId}</span></div>
            <div class="detail-row"><span class="detail-label">اسم الأب</span><span class="detail-value">${r.fatherName}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">📍 العنوان</div>
          <div class="detail-box">
            <div class="detail-row"><span class="detail-label">المنطقة</span><span class="detail-value">${r.address}</span></div>
            <div class="detail-row"><span class="detail-label">الشارع</span><span class="detail-value">${r.streetName}</span></div>
            <div class="detail-row"><span class="detail-label">رقم المنزل</span><span class="detail-value">#${r.houseNumber}</span></div>
          </div>
        </div>
        ${r.idPhotoUrl ? `
        <div class="detail-section">
          <div class="detail-section-title">🪪 صورة الهوية</div>
          <img src="${r.idPhotoUrl}" style="width:100%;border-radius:8px;border:1px solid var(--border)">
        </div>` : ''}
      </div>
      <div>
        <div class="detail-section">
          <div class="detail-section-title">💼 المهنة</div>
          <div class="detail-box">
            <div class="detail-row"><span class="detail-label">الوظيفة</span><span class="detail-value">${r.job}</span></div>
            <div class="detail-row"><span class="detail-label">جهة العمل</span><span class="detail-value">${r.workplace}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="detail-section-title">🚗 المركبات المرتبطة (${linkedVehicles.length})</div>
          <div class="detail-box">
            ${linkedVehicles.length === 0
              ? '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:8px">لا توجد مركبات مسجلة</p>'
              : linkedVehicles.map(v => `
                <div class="detail-row">
                  <span class="detail-label">${v.vehicleName}</span>
                  <span class="badge badge-primary" style="font-family:monospace">${v.plateNumber}</span>
                </div>`).join('')
            }
          </div>
        </div>
      </div>
    </div>
  `;

  openModal('view-resident-modal');
}

// ========================================
// ===== المركبات =====
// ========================================
let vehicleImageB64 = '';

function initVehicles() {
  if (!requireAuth()) return;
  setupNavbar();
  renderVehicles('');

  const searchEl = document.getElementById('vehicle-search');
  if (searchEl) searchEl.addEventListener('input', e => renderVehicles(e.target.value));

  document.getElementById('btn-add-vehicle')?.addEventListener('click', () => {
    openAddVehicleModal();
  });
  document.getElementById('fab-add-vehicle')?.addEventListener('click', () => {
    openAddVehicleModal();
  });

  document.getElementById('vehicle-form')?.addEventListener('submit', saveVehicle);

  setupImageUpload('vehicle-img-input', 'vehicle-img-preview', false);
  document.getElementById('vehicle-img-input')?.addEventListener('change', async () => {
    const f = document.getElementById('vehicle-img-input').files[0];
    if (f) vehicleImageB64 = await resizeImage(f, 600, 400);
  });

  setupModalClose();
}

function renderVehicles(search) {
  const vehicles = DB.getVehicles();
  const q = (search || '').toLowerCase();
  const filtered = q ? vehicles.filter(v =>
    v.vehicleName.toLowerCase().includes(q) ||
    v.plateNumber.toLowerCase().includes(q) ||
    v.ownerName.toLowerCase().includes(q)
  ) : vehicles;

  const container = document.getElementById('vehicles-grid');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">🔍</div>
      <h3>لا يوجد نتائج</h3>
      <p>جرّب تعديل كلمة البحث</p>
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(v => `
    <div class="vehicle-card card" onclick="openViewVehicleModal('${v.id}')">
      ${v.imageUrl ? `<img class="vc-image" src="${v.imageUrl}" alt="${v.vehicleName}">` : `<div class="vc-image-placeholder">🚗</div>`}
      <div class="vc-body">
        <div class="vc-header">
          <div>
            <div class="vc-name">${v.vehicleName}</div>
            <span class="badge badge-primary" style="font-family:monospace;margin-top:4px">${v.plateNumber}</span>
          </div>
          <div class="vc-color" style="background:${v.exteriorColor.toLowerCase()}" title="${v.exteriorColor}"></div>
        </div>
        <div class="vc-meta">
          <span>👤 ${v.ownerName}</span>
          <span>#️⃣ ${v.chassisNumber}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function openAddVehicleModal() {
  vehicleImageB64 = '';
  const form = document.getElementById('vehicle-form');
  if (form) form.reset();
  const prev = document.getElementById('vehicle-img-preview');
  if (prev) prev.style.display = 'none';
  openModal('add-vehicle-modal');
}

function saveVehicle(e) {
  e.preventDefault();
  const vehicles = DB.getVehicles();

  const ownerNationalId = document.getElementById('v-ownerNationalId').value.trim();
  const data = {
    id: generateId(),
    vehicleName: document.getElementById('v-vehicleName').value.trim(),
    plateNumber: document.getElementById('v-plateNumber').value.trim(),
    chassisNumber: document.getElementById('v-chassisNumber').value.trim(),
    exteriorColor: document.getElementById('v-exteriorColor').value.trim(),
    interiorColor: document.getElementById('v-interiorColor').value.trim(),
    ownerName: document.getElementById('v-ownerName').value.trim(),
    ownerNationalId,
    phoneNumber: document.getElementById('v-phoneNumber').value.trim(),
    imageUrl: vehicleImageB64,
  };

  vehicles.unshift(data);
  DB.setVehicles(vehicles);

  // ربط تلقائي بالساكن عبر رقم الهوية
  const residents = DB.getResidents();
  const ownerResident = residents.find(r => r.nationalId === ownerNationalId);
  if (ownerResident) {
    if (!ownerResident.linkedVehicleIds.includes(data.id)) {
      ownerResident.linkedVehicleIds.push(data.id);
    }
    DB.setResidents(residents);
    showToast(`تم تسجيل المركبة وربطها بـ ${ownerResident.fullName}`, 'success');
  } else {
    showToast('تم تسجيل المركبة بنجاح', 'success');
  }

  closeModal('add-vehicle-modal');
  renderVehicles(document.getElementById('vehicle-search')?.value || '');
}

function openViewVehicleModal(id) {
  const vehicles = DB.getVehicles();
  const v = vehicles.find(x => x.id === id);
  if (!v) return;

  document.getElementById('view-vehicle-content').innerHTML = `
    <div class="view-vehicle-header">
      ${v.imageUrl
        ? `<img src="${v.imageUrl}" class="vehicle-detail-img" alt="${v.vehicleName}">`
        : `<div class="vehicle-detail-placeholder">🚗</div>`}
      <div class="view-vehicle-title">
        <h2>${v.vehicleName}</h2>
        <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
          <span class="badge badge-primary" style="font-family:monospace">${v.plateNumber}</span>
          <span class="vc-color-big" style="background:${v.exteriorColor.toLowerCase()}" title="${v.exteriorColor}"></span>
          <span style="font-size:13px;color:var(--text-muted)">${v.exteriorColor}</span>
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top:20px">
      <div class="detail-section">
        <div class="detail-section-title">🚗 بيانات المركبة</div>
        <div class="detail-box">
          <div class="detail-row"><span class="detail-label">رقم الهيكل</span><span class="detail-value" style="font-family:monospace">${v.chassisNumber}</span></div>
          <div class="detail-row"><span class="detail-label">اللون الخارجي</span><span class="detail-value">${v.exteriorColor}</span></div>
          <div class="detail-row"><span class="detail-label">اللون الداخلي</span><span class="detail-value">${v.interiorColor}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <div class="detail-section-title">👤 بيانات المالك</div>
        <div class="detail-box">
          <div class="detail-row"><span class="detail-label">الاسم</span><span class="detail-value">${v.ownerName}</span></div>
          <div class="detail-row"><span class="detail-label">رقم الهوية</span><span class="detail-value" style="font-family:monospace">${v.ownerNationalId}</span></div>
          <div class="detail-row"><span class="detail-label">الجوال</span><span class="detail-value" style="font-family:monospace">${v.phoneNumber}</span></div>
        </div>
      </div>
    </div>
  `;

  openModal('view-vehicle-modal');
}

// ========================================
// ===== الموظفون =====
// ========================================
function initEmployees() {
  if (!requireAuth()) return;
  setupNavbar();
  renderEmployees();

  document.getElementById('btn-add-employee')?.addEventListener('click', () => openModal('add-employee-modal'));
  document.getElementById('employee-form')?.addEventListener('submit', saveEmployee);
  setupModalClose();
}

function renderEmployees() {
  const employees = DB.getEmployees();
  const currentUser = DB.getCurrentUser();
  const container = document.getElementById('employees-list');
  if (!container) return;

  if (employees.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">👤</div><h3>لا يوجد موظفون</h3></div>`;
    return;
  }

  container.innerHTML = employees.map(emp => `
    <div class="employee-card card">
      <div class="emp-icon ${emp.role === 'admin' ? 'emp-admin' : 'emp-clerk'}">
        ${emp.role === 'admin' ? '🛡️' : '👤'}
      </div>
      <div class="emp-info">
        <div class="emp-name">${emp.username}</div>
        <div class="emp-sub">حساب النظام</div>
      </div>
      <div class="emp-actions">
        <span class="badge badge-${emp.role}">${emp.role === 'admin' ? 'مسؤول' : 'موظف'}</span>
        ${emp.username !== currentUser?.username ? `
          <button class="btn-icon" onclick="deleteEmployee('${emp.id}', '${emp.username}')" title="حذف">🗑️</button>
        ` : '<span style="font-size:12px;color:var(--text-muted)">(أنت)</span>'}
      </div>
    </div>
  `).join('');
}

function saveEmployee(e) {
  e.preventDefault();
  const username = document.getElementById('e-username').value.trim();
  const password = document.getElementById('e-password').value.trim();
  const role = document.getElementById('e-role').value;

  const employees = DB.getEmployees();
  if (employees.some(emp => emp.username === username)) {
    showToast('اسم المستخدم موجود مسبقاً', 'error');
    return;
  }

  employees.push({ id: generateId(), username, password, role });
  DB.setEmployees(employees);
  showToast('تم إضافة الموظف بنجاح', 'success');
  document.getElementById('employee-form').reset();
  closeModal('add-employee-modal');
  renderEmployees();
}

function deleteEmployee(id, username) {
  const currentUser = DB.getCurrentUser();
  if (username === currentUser?.username) {
    showToast('لا يمكنك حذف حسابك الخاص', 'error');
    return;
  }
  const employees = DB.getEmployees().filter(e => e.id !== id);
  DB.setEmployees(employees);
  showToast(`تم حذف الموظف "${username}"`, 'success');
  renderEmployees();
}
