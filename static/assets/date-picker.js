class DatePicker extends HTMLElement {

  static get observedAttributes() {
    return [
      'value', 'placeholder',
      'months', 'days-short', 'days-long',
      'primary-color', 'secondary-color', 'border', 'border-radius', 'timezone',
    ];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });

    const today = this._getLocalDate();
    this._today = today;
    this._selected = null;
    this._viewYear = today.getFullYear();
    this._viewMonth = today.getMonth();
    this._isOpen = false;
    this._animating = false;

    this._minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this._maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);

    this._MONTHS = this._parseAttr('months', "Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre");
    this._DAYS_SHORT = this._parseAttr('days-short', "Lu,Ma,Mi,Ju,Vi,Sá,Do");
    this._DAYS_LONG = this._parseAttr('days-long', "lunes,martes,miércoles,jueves,viernes,sábado,domingo");
  }

  get _primaryColor() { return this.getAttribute('primary-color') || '#c8d83a'; }
  get _secondaryColor() { return this.getAttribute('secondary-color') || '#3b82f6'; }
  get _showBorder() { return this.hasAttribute('border'); }
  get _borderRadius() {
    const v = this.getAttribute('border-radius');
    if (v === null) return '6px';
    return /^\d+$/.test(v.trim()) ? `${v.trim()}px` : v.trim();
  }

  _darken(hex, amount = 15) {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (n >> 16) - amount);
    const g = Math.max(0, ((n >> 8) & 0xff) - amount);
    const b = Math.max(0, (n & 0xff) - amount);
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  _hexToRgba(hex, alpha) {
    const n = parseInt(hex.replace('#', ''), 16);
    return `rgba(${n >> 16},${(n >> 8) & 0xff},${n & 0xff},${alpha})`;
  }

  _getLocalDate() {
    const tz = this.getAttribute('timezone');
    if (!tz) return new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric', month: 'numeric', day: 'numeric',
    }).formatToParts(new Date());
    const get = (type) => parseInt(parts.find(p => p.type === type).value);
    return new Date(get('year'), get('month') - 1, get('day'));
  }

  connectedCallback() {
    this._render();
    this._bindEvents();
    this._outsideClick = (e) => {
      if (!e.composedPath().includes(this)) this._close();
    };
    document.addEventListener('mousedown', this._outsideClick);

    const t = this._today;
    const todayStr = this.getAttribute('value') ||
      `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;

    if (todayStr) {
      const [y, m, d] = todayStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      if (!isNaN(d)) {
        this._selected = d;
        this._selected = date;
        this._viewYear = date.getFullYear();
        this._viewMonth = date.getMonth();
        this._updateTriggerText();
        this._renderHeader();
        this._renderDays();
        this._updateNavButtons();
      }
    }
  }

  disconnectedCallback() {
    document.removeEventListener('mousedown', this._outsideClick);
  }

  attributeChangedCallback(name, _old, val) {
    if (name === 'months' && val) this._MONTHS = val.split(',').map(s => s.trim());
    if (name === 'days-short' && val) this._DAYS_SHORT = val.split(',').map(s => s.trim());
    if (name === 'days-long' && val) this._DAYS_LONG = val.split(',').map(s => s.trim());

    if (name === 'timezone') {
      const today = this._getLocalDate();
      this._today = today;
      this._minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      this._maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);
      this._viewYear = today.getFullYear();
      this._viewMonth = today.getMonth();
      if (!this._shadow.querySelector('.dp-days')) return;
      this._renderHeader();
      this._renderDays();
      this._updateNavButtons();
      return;
    }

    const themeAttrs = ['primary-color', 'secondary-color', 'border', 'border-radius'];
    if (themeAttrs.includes(name)) {
      if (!this._shadow.querySelector('.dp-days')) return;
      this._updateTheme();
      return;
    }

    if (['months', 'days-short', 'days-long'].includes(name)) {
      if (!this._shadow.querySelector('.dp-days')) return;
      this._renderDayNames();
      this._renderHeader();
      this._renderDays();
      this._updateNavButtons();
      return;
    }

    if (name === 'value' && val) {
      const d = new Date(val);
      if (!isNaN(d)) {
        this._selected = d;
        this._viewYear = d.getFullYear();
        this._viewMonth = d.getMonth();
        if (!this._shadow.querySelector('.dp-days')) return;
        this._updateTriggerText();
        this._renderHeader();
        this._renderDays();
        this._updateNavButtons();
      }
    }
  }

  get value() { return this._selected ? this._selected.toISOString().split('T')[0] : ''; }
  set value(v) { this.setAttribute('value', v); }

  _parseAttr(name, fallback) {
    const val = this.getAttribute(name);
    return val ? val.split(',').map(s => s.trim()) : fallback.split(',');
  }

  _daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  _firstDayOfMonth(y, m) { return (new Date(y, m, 1).getDay() + 6) % 7; }

  _monthHasAvailableDays(y, m) {
    const monthStart = new Date(y, m, 1);
    const monthEnd = new Date(y, m + 1, 0);
    return monthStart <= this._maxDate && monthEnd >= this._minDate;
  }

  _formatDate(date) {
    const d = date.getDate();
    const mon = this._MONTHS[date.getMonth()].toLowerCase();
    const day = this._DAYS_LONG[(date.getDay() + 6) % 7];
    return `${d} de ${mon} (${day})`;
  }

  _isSelected(d) {
    return this._selected &&
      d === this._selected.getDate() &&
      this._viewMonth === this._selected.getMonth() &&
      this._viewYear === this._selected.getFullYear();
  }

  _isToday(d) {
    return d === this._today.getDate() &&
      this._viewMonth === this._today.getMonth() &&
      this._viewYear === this._today.getFullYear();
  }

  _updateTheme() {
    const styleEl = this._shadow.querySelector('style');
    if (styleEl) styleEl.textContent = this._styles();
    const trigger = this._shadow.querySelector('.dp-trigger');
    const cal = this._shadow.querySelector('.dp-calendar');
    if (trigger) trigger.style.cssText = '';
    if (cal) cal.style.cssText = '';
  }

  _render() {
    this._shadow.innerHTML = `
          <style>${this._styles()}</style>
          <div class="dp-wrapper" part="wrapper">
            <button class="dp-trigger" part="trigger" aria-haspopup="true" aria-expanded="false">
              <span class="dp-date-text" part="date-text">
                ${this.getAttribute('placeholder') || 'Selecciona una fecha'}
              </span>
              <span class="dp-arrow" aria-hidden="true">↑</span>
            </button>

            <div class="dp-calendar" part="calendar" role="dialog" aria-label="Calendario">
              <div class="dp-cal-header">
                <span class="dp-month-label"></span>
                <div class="dp-nav-btns">
                  <button class="dp-nav-btn dp-prev" aria-label="Mes anterior">&#8249;</button>
                  <button class="dp-nav-btn dp-next" aria-label="Mes siguiente">&#8250;</button>
                </div>
              </div>
              <div class="dp-grid dp-day-names"></div>
              <div class="dp-grid dp-days"></div>
            </div>
          </div>
        `;

    this._renderDayNames();
    this._renderHeader();
    this._renderDays();
    this._updateNavButtons();
  }

  _renderDayNames() {
    const grid = this._shadow.querySelector('.dp-day-names');
    grid.innerHTML = this._DAYS_SHORT
      .map(n => `<div class="dp-day-name">${n}</div>`)
      .join('');
  }

  _renderHeader() {
    this._shadow.querySelector('.dp-month-label').textContent =
      `${this._MONTHS[this._viewMonth]} ${this._viewYear}`;
  }

  _renderDays(slideDir = 0) {
    const grid = this._shadow.querySelector('.dp-days');
    const total = this._daysInMonth(this._viewYear, this._viewMonth);
    const first = this._firstDayOfMonth(this._viewYear, this._viewMonth);

    if (slideDir !== 0) {
      grid.classList.remove('slide-left', 'slide-right');
      void grid.offsetWidth;
      grid.classList.add(slideDir === 1 ? 'slide-left' : 'slide-right');
    }

    let html = '';
    for (let i = 0; i < first; i++) {
      html += `<button class="dp-day empty" tabindex="-1" disabled></button>`;
    }
    for (let d = 1; d <= total; d++) {
      const date = new Date(this._viewYear, this._viewMonth, d);
      const outOfRange = date < this._minDate || date > this._maxDate;
      const cls = [
        'dp-day',
        this._isSelected(d) ? 'selected' : '',
        this._isToday(d) ? 'today' : '',
        outOfRange ? 'disabled' : '',
      ].filter(Boolean).join(' ');
      html += `<button class="${cls}" data-day="${d}" ${outOfRange ? 'disabled' : ''}>${d}</button>`;
    }

    grid.innerHTML = html;
  }

  _updateNavButtons() {
    const prevBtn = this._shadow.querySelector('.dp-prev');
    const nextBtn = this._shadow.querySelector('.dp-next');
    if (!prevBtn || !nextBtn) return;

    let prevY = this._viewYear, prevM = this._viewMonth - 1;
    if (prevM < 0) { prevM = 11; prevY--; }

    let nextY = this._viewYear, nextM = this._viewMonth + 1;
    if (nextM > 11) { nextM = 0; nextY++; }

    prevBtn.disabled = !this._monthHasAvailableDays(prevY, prevM);
    nextBtn.disabled = !this._monthHasAvailableDays(nextY, nextM);
  }

  _updateTriggerText() {
    const el = this._shadow.querySelector('.dp-date-text');
    if (el) el.textContent = this._selected
      ? this._formatDate(this._selected)
      : (this.getAttribute('placeholder') || 'Selecciona una fecha');
  }

  _selectDay(d) {
    this._selected = new Date(this._viewYear, this._viewMonth, d);
    this._updateTriggerText();
    this._renderDays(0);
    this._close();

    this.dispatchEvent(new CustomEvent('date-change', {
      detail: { date: this._selected, value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  _navigate(dir) {
    if (this._animating) return;

    let newY = this._viewYear, newM = this._viewMonth + dir;
    if (newM < 0) { newM = 11; newY--; }
    if (newM > 11) { newM = 0; newY++; }

    if (!this._monthHasAvailableDays(newY, newM)) return;

    this._animating = true;
    this._viewMonth = newM;
    this._viewYear = newY;
    this._renderHeader();
    this._renderDays(dir);
    this._updateNavButtons();
    setTimeout(() => { this._animating = false; }, 210);
  }

  _show() {
    this._isOpen = true;
    this._shadow.querySelector('.dp-trigger').classList.add('open');
    this._shadow.querySelector('.dp-trigger').setAttribute('aria-expanded', 'true');
    this._shadow.querySelector('.dp-calendar').classList.add('open');
  }

  _close() {
    this._isOpen = false;
    const trigger = this._shadow.querySelector('.dp-trigger');
    if (trigger) {
      trigger.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
    const cal = this._shadow.querySelector('.dp-calendar');
    if (cal) cal.classList.remove('open');
  }

  _toggle() { this._isOpen ? this._close() : this._show(); }

  _bindEvents() {
    const root = this._shadow;
    root.querySelector('.dp-trigger').addEventListener('click', () => this._toggle());
    root.querySelector('.dp-prev').addEventListener('click', () => this._navigate(-1));
    root.querySelector('.dp-next').addEventListener('click', () => this._navigate(1));

    root.querySelector('.dp-days').addEventListener('click', (e) => {
      const btn = e.target.closest('.dp-day:not(.empty):not(.disabled)');
      if (btn) this._selectDay(Number(btn.dataset.day));
    });

    root.host.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._close();
    });
  }

  _styles() {
    const primary = this._primaryColor;
    const secondary = this._secondaryColor;
    const dark = this._darken(primary);
    const hasBorder = this._showBorder;
    const radius = this._borderRadius;

    const primaryRgba10 = this._hexToRgba(primary, 0.10);
    const primaryRgba20 = this._hexToRgba(primary, 0.20);
    const secondaryRgba = this._hexToRgba(secondary, 0.35);

    const triggerBorder = hasBorder ? `2px solid ${primary}` : 'none';
    const triggerShadow = hasBorder ? `0 2px 8px rgba(0,0,0,.06)` : '0 2px 12px rgba(0,0,0,.10)';
    const triggerOpenBorder = hasBorder ? `2px solid ${dark}` : 'none';
    const calBorder = hasBorder ? `2px solid ${primary}` : 'none';
    const calBorderTop = hasBorder ? `1px solid ${primaryRgba10}` : 'none';

    const radiusNum = parseFloat(radius);
    const calRadius = radius;
    const triggerOpenRadius = radius;

    return `
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          .dp-wrapper {
            position: relative;
            width: 420px;
            font-family: system-ui, -apple-system, sans-serif; /* ← sans-serif */
          }

          .dp-trigger {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 28px;
            border: ${triggerBorder};
            border-radius: ${radius};
            background: white;
            cursor: pointer;
            transition: border-color .2s, box-shadow .2s, border-radius .15s;
            box-shadow: ${triggerShadow};
            outline: none;
          }
          .dp-trigger:focus-visible {
            outline: 2px solid ${primary};
            outline-offset: 2px;
          }
          .dp-trigger.open {
            border: ${triggerOpenBorder};
            box-shadow: 0 4px 16px ${primaryRgba20};
            border-radius: ${triggerOpenRadius};
          }

          .dp-date-text {
            font-size: 17px;
            color: #8a9aaa;
            font-style: italic;
            letter-spacing: 0;
          }

          .dp-arrow {
            font-size: 22px;
            color: #8a9aaa;
            transition: transform .25s ease, color .25s;
            display: inline-block;
            transform: rotate(180deg);
            line-height: 1;
            user-select: none;
          }
          .dp-trigger.open .dp-arrow {
            transform: rotate(0deg);
            color: ${primary};
          }

          .dp-calendar {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: none;                            
            border-top: none;
            border-radius: ${radius};                  
            box-shadow: 0 8px 32px rgba(0,0,0,.15); 
            margin-top: 4px;         
            box-shadow: 0 12px 40px rgba(0,0,0,.12);
            padding: 0 16px 16px;
            z-index: 1000;
            transform-origin: top center;
            transition: opacity .2s ease, transform .2s ease;
            opacity: 0;
            transform: scaleY(.92);
            pointer-events: none;
          }
          .dp-calendar.open {
            opacity: 1;
            transform: scaleY(1);
            pointer-events: auto;
          }

          .dp-cal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 4px 12px;
          }
          .dp-month-label {
            font-size: 14px;
            font-weight: 500;           
            color: #3a4a5a;
            text-transform: lowercase; 
          }
          .dp-nav-btns { display: flex; gap: 4px; }
          .dp-nav-btn {
            background: none;
            border: none;
            font-size: 18px;
            color: #aab5bf;
            padding: 2px 6px;
            cursor: pointer;
            border-radius: 4px;
            transition: color .15s, background .15s;
            outline: none;
            line-height: 1;
          }
          .dp-nav-btn:hover:not(:disabled) { color: #3a4a5a; background: #f0f4f8; }
          .dp-nav-btn:disabled { color: #d8dde3; cursor: not-allowed; }

          .dp-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
          }

          .dp-day-name {
            font-size: 12px;
            font-weight: 500;
            color: #aab5bf;
            padding: 4px 0 10px;
            letter-spacing: 0;
            text-transform: uppercase;
          }

          .dp-day {
            border: none;
            background: none;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            margin: 2px auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #3a4a5a;
            cursor: pointer;
            transition: background .15s, color .15s;
            outline: none;
            font-family: system-ui, -apple-system, sans-serif; /* ← sans-serif */
            font-size: 14px;
          }
          .dp-day:hover:not(.empty):not(.selected):not(.disabled) {
            background: #f0f4f8;
            color: #1a2a3a;
          }
          .dp-day.empty    { cursor: default; pointer-events: none; }
          .dp-day.disabled { color: #c8d0d8; cursor: not-allowed; pointer-events: none; }

          .dp-day.today:not(.selected) {
            border: 2px solid ${primary};
            color: ${dark};
            font-weight: 600;
          }
          .dp-day.selected {
            background: ${secondary};
            color: white;
            font-weight: 700;
            box-shadow: 0 4px 12px ${secondaryRgba};
          }
          .dp-day:focus-visible { outline: 2px solid ${primary}; outline-offset: 2px; }

          @keyframes slideLeft {
            from { transform: translateX(20px); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
          @keyframes slideRight {
            from { transform: translateX(-20px); opacity: 0; }
            to   { transform: translateX(0);     opacity: 1; }
          }
          .slide-left  { animation: slideLeft  .2s ease; }
          .slide-right { animation: slideRight .2s ease; }
        `;
  }
}

customElements.define('date-picker', DatePicker);