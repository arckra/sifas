/* =============================================
   AUTH.JS — Login, Logout, Session
   SiFas / Campus Fix
   ============================================= */

let currentUser = null;
let selectedRole = 'mahasiswa';

// Tab toggle on login page
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRole = btn.dataset.role;

    // Auto-fill hint credentials
    const idEl = document.getElementById('loginId');
    const pwEl = document.getElementById('loginPw');
    if (selectedRole === 'mahasiswa') {
      idEl.placeholder = 'Contoh: 2021001234';
    } else {
      idEl.placeholder = 'Contoh: NIP Anda';
    }
    idEl.value = '';
    pwEl.value = '';
  });
});

function togglePw() {
  const input = document.getElementById('loginPw');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function handleLogin() {
  const inputId = document.getElementById('loginId').value.trim();
  const inputPw = document.getElementById('loginPw').value.trim();
  const errorEl = document.getElementById('login-error');

  errorEl.classList.add('hidden');

  // Match against USERS
  const user = USERS.find(u => {
    if (selectedRole === 'mahasiswa') {
      return u.role === 'mahasiswa' && inputId === u.id && inputPw === u.password;
    } else {
      return u.role === 'admin' && inputId === u.id && inputPw === u.password;
    }
  });

  if (!user) {
    errorEl.classList.remove('hidden');
    // Shake the card
    const card = document.querySelector('.login-form-card');
    card.style.animation = 'none';
    void card.offsetWidth;
    card.style.animation = 'shake .4s ease';
    return;
  }

  currentUser = user;
  initApp();
}

// Allow pressing Enter to login
document.getElementById('loginPw').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});
document.getElementById('loginId').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function handleLogout() {
  currentUser = null;
  document.getElementById('page-login').classList.add('active');
  document.getElementById('page-login').classList.remove('hidden');
  document.getElementById('page-app').classList.add('hidden');
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('loginId').value = '';
  document.getElementById('loginPw').value = '';
  document.getElementById('login-error').classList.add('hidden');
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(6px); }
}
`;
document.head.appendChild(shakeStyle);