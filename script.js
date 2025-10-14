// Toggle showing login/register forms using classes for animation
const btnLoginPopup = document.querySelector('.btnLogin-popup');
const wrapper = document.querySelector('.wrapper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const forgotLink = document.querySelector('#forgot-link');

// helper: toggle .filled on .input-box when input has value or on focus
function wireFloatingLabels(root=document){
  const inputs = root.querySelectorAll('.input-box input');
  inputs.forEach(input => {
    const box = input.closest('.input-box');
    const setFilled = () => {
      if (!box) return;
      if (input.value && input.value.trim() !== '') box.classList.add('filled');
      else box.classList.remove('filled');
    };
    // initial
    setFilled();
    input.addEventListener('input', setFilled);
    input.addEventListener('focus', () => { if (box) box.classList.add('filled'); });
    input.addEventListener('blur', setFilled);
  });
}

// wire labels on page load
document.addEventListener('DOMContentLoaded', () => {
  wireFloatingLabels(document);
  // update dashboard progress when the page loads (if dashboard is open)
  try { updateDashboardProgressFromLocalStorage(); } catch (err) { /* ignore if not on dashboard */ }
});

function showPopup() {
  if (!wrapper) return;
  wrapper.classList.add('show-popup');
  const loginBox = wrapper.querySelector('.form-box.login');
  const registerBox = wrapper.querySelector('.form-box.register');
  if (loginBox) loginBox.classList.add('active');
  if (registerBox) registerBox.classList.remove('active');
}

function showRegister() {
  if (!wrapper) return;
  wrapper.classList.add('show-popup');
  const loginBox = wrapper.querySelector('.form-box.login');
  const registerBox = wrapper.querySelector('.form-box.register');
  if (loginBox) loginBox.classList.remove('active');
  if (registerBox) registerBox.classList.add('active');
}

function showLogin() {
  if (!wrapper) return;
  wrapper.classList.add('show-popup');
  const loginBox = wrapper.querySelector('.form-box.login');
  const registerBox = wrapper.querySelector('.form-box.register');
  if (registerBox) registerBox.classList.remove('active');
  if (loginBox) loginBox.classList.add('active');
}

if (btnLoginPopup) {
  btnLoginPopup.addEventListener('click', (e) => {
    e.preventDefault();
    showPopup();
  });
}

if (registerLink) {
  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });
}

if (loginLink) {
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
  });
}

if (forgotLink) {
  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    const email = prompt('Enter your email to reset the password:', 'admin');
    if (email) {
      alert('If an account with ' + email + ' exists, a password reset link has been sent.');
    }
  });
}

// Close popup by clicking outside
document.addEventListener('click', (e) => {
  if (!wrapper) return;
  const target = e.target;
  if (!wrapper.classList.contains('show-popup')) return;
  if (btnLoginPopup && (btnLoginPopup === target || btnLoginPopup.contains(target))) return;
  if (wrapper.contains(target)) return;
  wrapper.classList.remove('show-popup');
  const loginBox = wrapper.querySelector('.form-box.login');
  const registerBox = wrapper.querySelector('.form-box.register');
  if (loginBox) loginBox.classList.remove('active');
  if (registerBox) registerBox.classList.remove('active');
});

// Login submit handling: show loading screen and redirect on success
const loginForm = document.querySelector('#login-form');
const loadingScreen = document.querySelector('#loading-screen');

if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    // show loading
    if (loadingScreen) loadingScreen.style.display = 'flex';

    // fake async login
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === 'admin123') {
        // redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        if (loadingScreen) loadingScreen.style.display = 'none';
        alert('Invalid credentials');
      }
    }, 1400);
  });
}

// Update the dashboard sidebar progress using data stored in localStorage (assessmentResults)
function updateDashboardProgressFromLocalStorage(){
  const raw = localStorage.getItem('assessmentResults');
  let pct = 0, answered = 0, total = 0;
  if (raw) {
    try {
      const obj = JSON.parse(raw);
      total = Number(obj.totalQuestions) || 0;
      answered = Number(obj.answered) || 0;
      pct = total > 0 ? Math.round((answered/total)*100) : 0;
    } catch(e){ console.warn('Invalid assessmentResults in localStorage'); }
  }

  // find the Track Recommendation card in the sidebar
  const cards = document.querySelectorAll('.sidebar .card');
  let targetCard = null;
  cards.forEach(card => {
    const h4 = card.querySelector('h4');
    if (h4 && /track recommendation/i.test(h4.innerText)) targetCard = card;
  });
  if (!targetCard) return; // not on dashboard

  const progressFill = targetCard.querySelector('.progress > i');
  const progressText = Array.from(targetCard.querySelectorAll('p.muted')).find(p=>/progress:/i.test(p.innerText)) || targetCard.querySelector('p.muted');
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.innerText = `Progress: ${pct}%`;
}

// listen to storage events so the dashboard updates if assessment finished in another tab/window
window.addEventListener('storage', (e)=>{
  if (e.key === 'assessmentResults') updateDashboardProgressFromLocalStorage();
});
