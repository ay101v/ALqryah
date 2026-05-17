// ========================================
// بلدية القرية — app.js (FIXED VERSION)
// ========================================

// ===== بيانات أولية =====
const SEED_RESIDENTS = [
  {id:'r1',fullName:'أحمد الفهد',age:45,address:'قطاع أ',houseNumber:'12',streetName:'شارع الزيتون',job:'معلم',workplace:'مدرسة القرية',fatherName:'فهد الفهد',nationalId:'1234567890',gender:'male',photoUrl:'',idPhotoUrl:'',linkedVehicleIds:['v1']},
];

const SEED_VEHICLES = [
  {id:'v1',vehicleName:'تويوتا كورولا',plateNumber:'ABC-123',ownerName:'أحمد الفهد',chassisNumber:'CH123456',interiorColor:'بيج',exteriorColor:'أبيض',ownerNationalId:'1234567890',phoneNumber:'0551234567',imageUrl:''},
];

const SEED_EMPLOYEES = [
  {id:'e1',username:'admin',password:'admin123',role:'admin'},
];

// ===== DB =====
const DB = {
  getResidents(){ return JSON.parse(localStorage.getItem('vmms_residents') || 'null') || structuredClone(SEED_RESIDENTS); },
  setResidents(d){ localStorage.setItem('vmms_residents', JSON.stringify(d)); },

  getVehicles(){ return JSON.parse(localStorage.getItem('vmms_vehicles') || 'null') || structuredClone(SEED_VEHICLES); },
  setVehicles(d){ localStorage.setItem('vmms_vehicles', JSON.stringify(d)); },

  getEmployees(){ return JSON.parse(localStorage.getItem('vmms_employees') || 'null') || structuredClone(SEED_EMPLOYEES); },
  setEmployees(d){ localStorage.setItem('vmms_employees', JSON.stringify(d)); },

  getCurrentUser(){ return JSON.parse(localStorage.getItem('vmms_user') || 'null'); },
  setCurrentUser(u){ localStorage.setItem('vmms_user', JSON.stringify(u)); },
  clearCurrentUser(){ localStorage.removeItem('vmms_user'); },
};

// ===== أدوات =====
function generateId(){
  return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
}

function requireAuth(){
  if(!DB.getCurrentUser()){
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ===== NAV =====
function setupNavbar(){
  const user = DB.getCurrentUser();
  const el = document.getElementById('nav-username');
  if(el && user) el.textContent = user.username;

  document.querySelectorAll('.btn-logout').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      DB.clearCurrentUser();
      window.location.href = 'index.html';
    });
  });
}

// ===== MODALS (FIX مهم) =====
function openModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.add('active');
}

function closeModal(id){
  const el = document.getElementById(id);
  if(el) el.classList.remove('active');
}

function setupModalClose(){
  document.querySelectorAll('.modal-overlay').forEach(m=>{
    m.addEventListener('click', (e)=>{
      if(e.target === m) m.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-close').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.closest('.modal-overlay')?.classList.remove('active');
    });
  });
}

// ===== RESIDENTS =====
function initResidents(){
  if(!requireAuth()) return;

  setupNavbar();
  setupModalClose(); // 🔥 مهم جدًا

  renderResidents('');

  document.getElementById('btn-add-resident')?.addEventListener('click', ()=>{
    openModal('add-resident-modal');
  });

  document.getElementById('fab-add-resident')?.addEventListener('click', ()=>{
    openModal('add-resident-modal');
  });
}

function renderResidents(){
  const grid = document.getElementById('residents-grid');
  if(!grid) return;

  const residents = DB.getResidents();

  grid.innerHTML = residents.map(r=>`
    <div class="card">
      <h3>${r.fullName}</h3>
      <p>${r.address}</p>
      <button onclick="openModal('view-resident-modal')">عرض</button>
    </div>
  `).join('');
}

// ===== DASHBOARD =====
function initDashboard(){
  if(!requireAuth()) return;

  setupNavbar();

  const residents = DB.getResidents();

  const el = document.getElementById('stat-total');
  if(el) el.textContent = residents.length;
}

// ===== IMPORTANT FIX =====
// تشغيل بعد تحميل الصفحة 100%
document.addEventListener('DOMContentLoaded', ()=>{
  const path = window.location.pathname;

  if(path.includes('dashboard')) initDashboard();
  if(path.includes('residents')) initResidents();
});
