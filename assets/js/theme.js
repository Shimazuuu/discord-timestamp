let currentTheme = 0, notifTimeout;
const modes = ['light', 'dark'];

const setTheme = (mode) => {
    const theme = mode === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', mode);

    const icon = document.querySelector('.switch-btn i') || document.createElement('i');
    if (!icon.parentElement) document.querySelector('.switch-btn').appendChild(icon);
    icon.className = { light: 'fa-solid fa-sun', dark: 'fa-solid fa-moon', auto: 'fa-solid fa-wand-magic-sparkles' }[mode];

    const themeNotif = document.querySelector('.theme-notif');
    themeNotif.textContent = { light: 'Mode clair', dark: 'Mode sombre'}[mode];
    themeNotif.classList.remove('show', 'hide');
    void themeNotif.offsetWidth;
    themeNotif.classList.add('show');
    clearTimeout(notifTimeout);
    notifTimeout = setTimeout(() => themeNotif.classList.add('hide'), 3000);
};

const applySavedTheme = () => {
    const theme = localStorage.getItem('theme');
    setTheme(theme);
    currentTheme = modes.indexOf(theme);
};


window.addEventListener('load', () => {
    applySavedTheme();
    autoSwitch();
});

window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue) {
        setTheme(event.newValue);
        currentTheme = modes.indexOf(event.newValue);
    }
});

window.addEventListener('keydown', (e) => {
    if ((e.altKey || e.metaKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        currentTheme = (currentTheme + 1) % modes.length;
        setTheme(modes[currentTheme]);
    }
});

document.querySelector('.switch-btn').addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % modes.length;
    setTheme(modes[currentTheme]);
});
