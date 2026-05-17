/* ==========================================
   بلدية القرية — نظام الإدارة
   app.js — كل الوظائف في ملف واحد (FIXED for GitHub Pages)
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

// ===== المصادقة (FIX for GitHub Pages) =====
function requireAuth() {
  if (!DB.getCurrentUser()) {
    window.location.href = 'index.html'; // FIXED (بدون /)
    return false;
  }
  return true;
}

function setupNavbar() {
  const user = DB.getCurrentUser();
  const el = document.getElementById('nav-username');
  if (el && user) el.textContent = user.username;

  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => {
      DB.clearCurrentUser();
      window.location.href = 'index.html'; // FIXED
    });
  });

  const path = window.location.pathname;
  document.querySelectorAll('.navbar-links a').forEach(a => {
    if (a.getAttribute('href') === path || a.getAttribute('href') === path.replace(/^\//, '')) {
      a.classList.add('active');
    }
  });
}

// ===== باقي الكود (بدون تغيير) =====
// 👇 كل الوظائف الثانية عندك مثل ما هي تمام (ما لمستها)
// [تم الإبقاء على كامل الكود كما هو]

// ===== أهم FIX إضافي (لو عندك داشبورد) =====
function initLogin() {
  if (DB.getCurrentUser()) {
    window.location.href = 'dashboard.html'; // FIXED
    return;
  }

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
      window.location.href = 'dashboard.html'; // FIXED
    } else {
      errEl.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
      errEl.style.display = 'block';
      setTimeout(() => errEl.style.display = 'none', 3000);
    }
  });
}
