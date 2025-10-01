const d = document.getElementById('d');
const hm = document.getElementById('hm');
const t = document.getElementById('t');
const code = document.getElementById('code');
const copy = document.getElementById('copy');
const current = document.getElementById('current');
const preview = document.getElementById('preview');

const typeFormats = {
    t: {timeStyle: 'short'},
    T: {timeStyle: 'medium'},
    d: {dateStyle: 'short'},
    D: {dateStyle: 'long'},
    f: {dateStyle: 'long', timeStyle: 'short'},
    F: {dateStyle: 'full', timeStyle: 'short'},
    R: {style: 'long', numeric: 'auto'}
};

const pad = n => String(n).padStart(2, '0');

function setNow() {
    const now = new Date();
    d.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    hm.value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    update();
}

function automaticRelativeDifference(dt) {
    const diff = -Math.floor((Date.now() - dt.getTime()) / 1000);
    const abs = Math.abs(diff);

    if (abs > 86400 * 365 * 10) {
        return {duration: Math.round(diff / (86400 * 365)), unit: 'years'};
    }
    if (abs > 86400 * 30) {
        return {duration: Math.round(diff / (86400 * 30)), unit: 'months'};
    }
    if (abs > 86400) {
        return {duration: Math.round(diff / 86400), unit: 'days'};
    }
    if (abs > 3600) {
        return {duration: Math.round(diff / 3600), unit: 'hours'};
    }
    if (abs > 60) {
        return {duration: Math.round(diff / 60), unit: 'minutes'};
    }

    return {duration: diff, unit: 'seconds'};
}

function update() {
    if (!d.value) return;

    const [y, m, day] = d.value.split('-').map(Number);
    const [hh, mm] = (hm.value || '00:00').split(':').map(Number);
    const sel = new Date(y, m - 1, day, hh, mm);
    const ts = Math.floor(sel.getTime() / 1000);

    code.value = `<t:${ts}:${t.value}>`;

    if (t.value === 'R') {
        const rtf = new Intl.RelativeTimeFormat(navigator.language || 'en', typeFormats.R);
        const f = automaticRelativeDifference(sel);
        preview.textContent = rtf.format(f.duration, f.unit);
    } else {
        const df = new Intl.DateTimeFormat(navigator.language || 'en', typeFormats[t.value] || {});
        preview.textContent = df.format(sel);
    }
}

['input', 'change'].forEach(ev => {
    d.addEventListener(ev, update);
    hm.addEventListener(ev, update);
    t.addEventListener(ev, update);
});

copy.addEventListener('click', async () => {
    update();
    try {
        await navigator.clipboard.writeText(code.value);
        copy.innerHTML = `<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
        </svg> Copié !`;
        setTimeout(() => copy.textContent = 'Copier', 1300);
    } catch {}
});

current.addEventListener('click', setNow);
document.addEventListener('DOMContentLoaded', setNow);