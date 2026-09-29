// Google Agenda Card for Home Assistant
// Dark Mode, Month & Week views (Monday first), Local French units & names
// Supports continuous multi-day spanning event bars across weeks (Google Calendar style)
// Strict 7-column percentage locking (calc(100% / 7)) to prevent long-text overflow
// Palette extracted from user screenshot + harmonious muted tones for Mealie

(function() {
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatLocalDate(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatDescription(desc) {
    if (!desc) return '';
    const escaped = escapeHtml(desc);
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    return escaped.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #8ab4f8; text-decoration: underline; word-break: break-all;">$1</a>');
  }

  const I18N = {
    fr: {
      months: [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ],
      monthsShort: [
        'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
      ],
      daysShort: ['LUN.', 'MAR.', 'MER.', 'JEU.', 'VEN.', 'SAM.', 'DIM.'],
      dayInitials: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      today: "Aujourd'hui",
      monthView: "Mois",
      weekView: "Semaine",
      mainMenu: "Menu principal",
      prevPeriod: "Période précédente",
      nextPeriod: "Période suivante",
      prevMonth: "Mois précédent",
      nextMonth: "Mois suivant",
      classicMonthView: "Vue mois classique",
      centerMonthView: "Centrer la vue du mois sur la semaine actuelle",
      switchToLight: "Passer en mode clair",
      switchToDark: "Passer en mode sombre",
      enterFullscreen: "Passer en plein écran",
      exitFullscreen: "Quitter le plein écran",
      allDay: "Toute la journée",
      allDayHeader: "Journée",
      moreEvents: "en plus",
      untitled: "Sans titre",
      defaultGroup: "Agendas",
      noEventsDay: "Aucun événement ce jour.",
      close: "Fermer",
      description: "Description"
    },
    en: {
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthsShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ],
      daysShort: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      dayInitials: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      today: "Today",
      monthView: "Month",
      weekView: "Week",
      mainMenu: "Main menu",
      prevPeriod: "Previous period",
      nextPeriod: "Next period",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      classicMonthView: "Classic month view",
      centerMonthView: "Center month view on current week",
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
      enterFullscreen: "Enter fullscreen",
      exitFullscreen: "Exit fullscreen",
      allDay: "All day",
      allDayHeader: "All-day",
      moreEvents: "more",
      untitled: "Untitled",
      defaultGroup: "Calendars",
      noEventsDay: "No events this day.",
      close: "Close",
      description: "Description"
    }
  };

  const HOUR_HEIGHT = 48;

  const SUN_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  const MOON_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

  const EXPAND_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`;

  const COMPRESS_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`;

  const CENTER_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><circle cx="12" cy="12" r="3"></circle><line x1="3" y1="12" x2="7" y2="12"></line><line x1="17" y1="12" x2="21" y2="12"></line><line x1="12" y1="3" x2="12" y2="7"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`;

  class GoogleAgendaCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.currentDate = new Date();
      this.miniCalDate = new Date();
      this.viewMode = 'month'; // 'month' | 'week'
      this.selectedCalendars = new Set();
      this.events = [];
      this.isLoading = false;
      this.selectedEvent = null;
      this.dayModalDate = null;
      this.sidebarOpen = true;
      this._fetchSeq = 0;
      this._boundOnKey = this._onKeyDown.bind(this);
      this.themeMode = 'auto'; // 'auto' | 'light' | 'dark'
      this._lastIsDark = undefined;
      this.isFullscreen = false;
      this.fitScreen = true;
      this.showFullscreenButton = true;
      this.isCenteredMonth = false;
      this._domObserver = null;
      this._themeObserver = null;
      this._mediaQueryListener = null;
      this._mediaQuery = null;
    }

    get lang() {
      if (this.config && this.config.language && this.config.language !== 'auto') {
        const custom = String(this.config.language).toLowerCase();
        return custom.startsWith('fr') ? 'fr' : 'en';
      }
      const haLang = (this._hass && (this._hass.language || (this._hass.locale && this._hass.locale.language))) ||
                     (navigator.language || 'en');
      return haLang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }

    get locale() {
      return this.lang === 'fr' ? 'fr-FR' : 'en-US';
    }

    t(key) {
      const l = this.lang;
      return (I18N[l] && I18N[l][key] !== undefined) ? I18N[l][key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
    }

    get firstDayOfWeek() {
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday. Default is 1 (Monday).
      const raw = this.config ? (this.config.first_day_of_week ?? this.config.first_day ?? this.config.start_day) : undefined;
      if (raw !== undefined && raw !== null) {
        if (typeof raw === 'number') {
          return ((raw % 7) + 7) % 7;
        }
        const str = String(raw).trim().toLowerCase();
        const map = {
          '0': 0, 'sun': 0, 'sunday': 0, 'dim': 0, 'dimanche': 0,
          '1': 1, 'mon': 1, 'monday': 1, 'lun': 1, 'lundi': 1,
          '2': 2, 'tue': 2, 'tuesday': 2, 'mar': 2, 'mardi': 2,
          '3': 3, 'wed': 3, 'wednesday': 3, 'mer': 3, 'mercredi': 3,
          '4': 4, 'thu': 4, 'thursday': 4, 'jeu': 4, 'jeudi': 4,
          '5': 5, 'fri': 5, 'friday': 5, 'ven': 5, 'vendredi': 5,
          '6': 6, 'sat': 6, 'saturday': 6, 'sam': 6, 'samedi': 6
        };
        if (map[str] !== undefined) return map[str];
        const parsed = parseInt(str, 10);
        if (!isNaN(parsed)) return ((parsed % 7) + 7) % 7;
      }
      return 1; // Default Monday
    }

    getDayOffset(date) {
      // Returns index 0..6 relative to configured firstDayOfWeek
      return (date.getDay() - this.firstDayOfWeek + 7) % 7;
    }

    get daysShort() {
      const base = this.t('daysShort'); // [Mon, Tue, Wed, Thu, Fri, Sat, Sun] (starts Monday)
      const shift = (this.firstDayOfWeek - 1 + 7) % 7;
      return base.slice(shift).concat(base.slice(0, shift));
    }

    get dayInitials() {
      const base = this.t('dayInitials'); // [M, T, W, T, F, S, S] (starts Monday)
      const shift = (this.firstDayOfWeek - 1 + 7) % 7;
      return base.slice(shift).concat(base.slice(0, shift));
    }

    get isDarkTheme() {
      if (this.themeMode === 'dark') return true;
      if (this.themeMode === 'light') return false;

      // In 'auto' mode, detect Home Assistant theme state:
      if (this._hass && this._hass.themes && typeof this._hass.themes.darkMode === 'boolean') {
        return this._hass.themes.darkMode;
      }

      try {
        const ha = document.querySelector('home-assistant');
        if (ha && ha.hass && ha.hass.themes && typeof ha.hass.themes.darkMode === 'boolean') {
          return ha.hass.themes.darkMode;
        }
      } catch (e) {}

      try {
        const docTheme = document.documentElement.getAttribute('data-theme') || 
                         document.body.getAttribute('data-theme');
        if (docTheme === 'dark') return true;
        if (docTheme === 'light') return false;
      } catch (e) {}

      try {
        const primaryBg = getComputedStyle(document.body).getPropertyValue('--primary-background-color').trim();
        if (primaryBg.startsWith('#') && (primaryBg.length === 7 || primaryBg.length === 4)) {
          let r, g, b;
          if (primaryBg.length === 7) {
            r = parseInt(primaryBg.slice(1, 3), 16);
            g = parseInt(primaryBg.slice(3, 5), 16);
            b = parseInt(primaryBg.slice(5, 7), 16);
          } else {
            r = parseInt(primaryBg[1] + primaryBg[1], 16);
            g = parseInt(primaryBg[2] + primaryBg[2], 16);
            b = parseInt(primaryBg[3] + primaryBg[3], 16);
          }
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          return luma < 128;
        }
      } catch (e) {}

      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    toggleTheme() {
      this.themeMode = this.isDarkTheme ? 'light' : 'dark';
      this._lastIsDark = this.isDarkTheme;
      this.render();
    }

    connectedCallback() {
      window.addEventListener('keydown', this._boundOnKey);
      if (this.isFullscreen) {
        this.classList.add('fullscreen-host');
      }

      // Auto theme observer: detect HA switching theme on <html> or <body>
      if (!this._themeObserver) {
        this._themeObserver = new MutationObserver(() => {
          if (this.themeMode === 'auto') {
            const nowDark = this.isDarkTheme;
            if (this._lastIsDark !== undefined && nowDark !== this._lastIsDark) {
              this._lastIsDark = nowDark;
              this.render();
            }
          }
        });
        try {
          this._themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
          this._themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
        } catch (e) {}
      }

      // System color scheme change
      if (!this._mediaQueryListener && window.matchMedia) {
        this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this._mediaQueryListener = () => {
          if (this.themeMode === 'auto') {
            const nowDark = this.isDarkTheme;
            if (this._lastIsDark !== undefined && nowDark !== this._lastIsDark) {
              this._lastIsDark = nowDark;
              this.render();
            }
          }
        };
        try {
          this._mediaQuery.addEventListener('change', this._mediaQueryListener);
        } catch (e) {
          try { this._mediaQuery.addListener(this._mediaQueryListener); } catch (e2) {}
        }
      }
    }

    disconnectedCallback() {
      window.removeEventListener('keydown', this._boundOnKey);
      if (this.isFullscreen) {
        try {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        } catch (e) {}
      }
      if (this._themeObserver) {
        this._themeObserver.disconnect();
        this._themeObserver = null;
      }
      if (this._mediaQuery && this._mediaQueryListener) {
        try {
          this._mediaQuery.removeEventListener('change', this._mediaQueryListener);
        } catch (e) {
          try { this._mediaQuery.removeListener(this._mediaQueryListener); } catch (e2) {}
        }
        this._mediaQueryListener = null;
      }
    }

    _onKeyDown(e) {
      if (e.key === 'Escape') {
        if (this.selectedEvent || this.dayModalDate) {
          this.selectedEvent = null;
          this.dayModalDate = null;
          this.render();
        } else if (this.isFullscreen) {
          this.toggleFullscreen(false);
        }
      }
    }

    toggleFullscreen(forceState) {
      this.isFullscreen = typeof forceState === 'boolean' ? forceState : !this.isFullscreen;
      try {
        localStorage.setItem('gcal_card_fullscreen_pref', this.isFullscreen ? 'true' : 'false');
      } catch (e) {}

      if (this.isFullscreen) {
        this.classList.add('fullscreen-host');
        try {
          document.documentElement.style.overflow = 'hidden';
          document.body.style.overflow = 'hidden';
        } catch (e) {}
      } else {
        this.classList.remove('fullscreen-host');
        try {
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        } catch (e) {}
      }
      this.render();
    }

    toggleCenteredMonth(forceState) {
      this.isCenteredMonth = typeof forceState === 'boolean' ? forceState : !this.isCenteredMonth;
      try {
        localStorage.setItem('gcal_card_centered_pref', this.isCenteredMonth ? 'true' : 'false');
      } catch (e) {}
      this.fetchEvents();
    }

    setConfig(config) {
      this.config = Object.assign({
        language: 'auto',
        first_day_of_week: 1,
        theme_mode: 'auto',
        fullscreen: false,
        fit_screen: true,
        show_fullscreen_button: true,
        centered_month: false,
        center_current_week: false,
        card_height: '',
        calendars: [
          { id: 'calendar.personnel', name: 'Personnel', color: '#668be1', group: 'Mes agendas', default: true },
          { id: 'calendar.travail', name: 'Travail', color: '#4285f4', group: 'Mes agendas', default: true },
          { id: 'calendar.famille', name: 'Famille', color: '#e3683e', group: 'Mes agendas', default: true },
          { id: 'calendar.anniversaires', name: 'Anniversaires', color: '#d8be5e', group: 'Autres agendas', default: true },
          { id: 'calendar.jours_feries_en_france', name: 'Jours fériés', color: '#489160', group: 'Autres agendas', default: true }
        ]
      }, config || {});

      this.themeMode = this.config.theme_mode || 'auto';
      this.fitScreen = this.config.fit_screen !== false;
      this.showFullscreenButton = this.config.show_fullscreen_button !== false;

      // Centered Month preference: explicit config takes precedence, otherwise localStorage
      const cfgCentered = (typeof this.config.centered_month === 'boolean') ? this.config.centered_month :
                          (typeof this.config.center_current_week === 'boolean') ? this.config.center_current_week :
                          (typeof this.config.centered === 'boolean') ? this.config.centered : null;
      if (cfgCentered !== null) {
        this.isCenteredMonth = cfgCentered;
      } else {
        try {
          const saved = localStorage.getItem('gcal_card_centered_pref');
          if (saved !== null) {
            this.isCenteredMonth = (saved === 'true');
          }
        } catch (e) {}
      }

      // Fullscreen preference: explicit config takes precedence, otherwise localStorage
      if (typeof this.config.fullscreen === 'boolean') {
        this.isFullscreen = this.config.fullscreen;
      } else {
        try {
          const saved = localStorage.getItem('gcal_card_fullscreen_pref');
          if (saved !== null) {
            this.isFullscreen = (saved === 'true');
          }
        } catch (e) {}
      }

      if (this.isFullscreen) {
        this.classList.add('fullscreen-host');
      } else {
        this.classList.remove('fullscreen-host');
      }

      if (this.selectedCalendars.size === 0) {
        this.config.calendars.forEach(c => {
          if (c.default !== false) this.selectedCalendars.add(c.id);
        });
      }
      if (this._hass) {
        this.fetchEvents();
      }
    }

    set hass(hass) {
      const wasDark = this._lastIsDark;
      const prevLang = this._lastLang;
      this._hass = hass;
      const nowDark = this.isDarkTheme;
      const currentLang = this.lang;
      this._lastIsDark = nowDark;
      this._lastLang = currentLang;

      if (!this._initialFetched && this.config) {
        this._initialFetched = true;
        this.fetchEvents();
      } else if (
        (this.themeMode === 'auto' && wasDark !== undefined && wasDark !== nowDark) ||
        (prevLang !== undefined && prevLang !== currentLang)
      ) {
        this.render();
      }
    }

    getStartEndRange() {
      const y = this.currentDate.getFullYear();
      const m = this.currentDate.getMonth();
      let start, end;

      if (this.viewMode === 'month') {
        if (this.isCenteredMonth) {
          // Centered Month View: 5 weeks total, row 3 (middle row) is the current anchor week!
          const dayOffset = this.getDayOffset(this.currentDate);
          const anchorStart = new Date(this.currentDate);
          anchorStart.setDate(this.currentDate.getDate() - dayOffset);
          anchorStart.setHours(0, 0, 0, 0);

          // 2 weeks before anchor start day
          start = new Date(anchorStart);
          start.setDate(anchorStart.getDate() - 14);

          // 2 weeks after anchor start day (+14 days to week 5 start, +6 days to end of week = +20 days)
          end = new Date(anchorStart);
          end.setDate(anchorStart.getDate() + 20);
          end.setHours(23, 59, 59, 999);
        } else {
          const firstOfMonth = new Date(y, m, 1);
          const dayOffset = this.getDayOffset(firstOfMonth);
          start = new Date(y, m, 1 - dayOffset, 0, 0, 0);

          const lastOfMonth = new Date(y, m + 1, 0);
          const endDayOffset = this.getDayOffset(lastOfMonth);
          end = new Date(y, m + 1, 6 - endDayOffset, 23, 59, 59);
        }
      } else {
        const dayOffset = this.getDayOffset(this.currentDate);
        start = new Date(this.currentDate);
        start.setDate(this.currentDate.getDate() - dayOffset);
        start.setHours(0, 0, 0, 0);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      }
      return { start, end };
    }

    async fetchEvents() {
      if (!this._hass) return;
      this.isLoading = true;
      this._fetchSeq++;
      const currentSeq = this._fetchSeq;

      const { start, end } = this.getStartEndRange();
      const startStr = start.toISOString();
      const endStr = end.toISOString();
      const allEvents = [];

      const calMap = {};
      this.config.calendars.forEach(c => { calMap[c.id] = c; });

      const activeIds = Array.from(this.selectedCalendars);

      await Promise.all(activeIds.map(async (calId) => {
        const meta = calMap[calId] || { name: calId, color: '#8ab4f8' };
        try {
          let events = [];
          if (this._hass.callApi) {
            const res = await this._hass.callApi('GET', `calendars/${calId}?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}`);
            if (Array.isArray(res)) events = res;
            else if (res && Array.isArray(res.events)) events = res.events;
          } else {
            const res = await this._hass.callWS({
              type: 'calendar/event_list',
              entity_id: calId,
              start: startStr,
              end: endStr
            });
            events = (res && res.events) || [];
          }

          events.forEach(ev => {
            let customStart = ev.start;
            let customEnd = ev.end;
            const isOriginalAllDay = !ev.start.dateTime;

            // Support fixed_time option (e.g. Mealie lunch at 12:00, dinner at 20:00)
            if (meta.fixed_time && isOriginalAllDay && ev.start.date) {
              const dateStr = ev.start.date;
              const [h, m] = meta.fixed_time.split(':').map(Number);
              const durMins = meta.duration_minutes || 60;
              const sIso = `${dateStr}T${String(h).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`;
              const endMinutes = (h * 60) + (m || 0) + durMins;
              const endH = Math.floor(endMinutes / 60) % 24;
              const endM = endMinutes % 60;
              const eIso = `${dateStr}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
              customStart = { dateTime: sIso };
              customEnd = { dateTime: eIso };
            }

            allEvents.push({
              ...ev,
              start: customStart,
              end: customEnd,
              calendarId: calId,
              calendarName: meta.name,
              color: meta.color
            });
          });
        } catch (err) {
          console.warn(`[GoogleAgendaCard] Error fetching ${calId}:`, err);
        }
      }));

      if (currentSeq !== this._fetchSeq) return;

      // Sort all fetched events chronologically
      allEvents.sort((a, b) => {
        const dateA = a.start.dateTime ? formatLocalDate(new Date(a.start.dateTime)) : (a.start.date || '');
        const dateB = b.start.dateTime ? formatLocalDate(new Date(b.start.dateTime)) : (b.start.date || '');
        if (dateA !== dateB) return dateA.localeCompare(dateB);

        const isAllDayA = !a.start.dateTime;
        const isAllDayB = !b.start.dateTime;
        if (isAllDayA && !isAllDayB) return -1;
        if (!isAllDayA && isAllDayB) return 1;

        if (isAllDayA && isAllDayB) {
          const endA = a.end?.date || dateA;
          const endB = b.end?.date || dateB;
          if (endA !== endB) return endB.localeCompare(endA);
          return (a.summary || '').localeCompare(b.summary || '');
        }

        const tA = new Date(a.start.dateTime).getTime();
        const tB = new Date(b.start.dateTime).getTime();
        if (tA !== tB) return tA - tB;

        const etA = new Date(a.end?.dateTime || a.start.dateTime).getTime();
        const etB = new Date(b.end?.dateTime || b.start.dateTime).getTime();
        if (etA !== etB) return etA - etB;

        return (a.summary || '').localeCompare(b.summary || '');
      });

      allEvents.forEach((ev, idx) => { ev._uid = idx; });

      this.events = allEvents;
      this.isLoading = false;
      this.render();
    }

    prev() {
      if (this.viewMode === 'month') {
        if (this.isCenteredMonth) {
          this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate());
        } else {
          this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        }
      } else {
        this.currentDate = new Date(this.currentDate.getTime() - 7 * 86400000);
      }
      this.miniCalDate = new Date(this.currentDate);
      this.fetchEvents();
    }

    next() {
      if (this.viewMode === 'month') {
        if (this.isCenteredMonth) {
          this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, this.currentDate.getDate());
        } else {
          this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        }
      } else {
        this.currentDate = new Date(this.currentDate.getTime() + 7 * 86400000);
      }
      this.miniCalDate = new Date(this.currentDate);
      this.fetchEvents();
    }

    today() {
      this.currentDate = new Date();
      this.miniCalDate = new Date();
      this.fetchEvents();
    }

    toggleCal(id) {
      if (this.selectedCalendars.has(id)) {
        this.selectedCalendars.delete(id);
      } else {
        this.selectedCalendars.add(id);
      }
      this.fetchEvents();
    }

    switchView(mode) {
      if (this.viewMode === mode) return;
      this.viewMode = mode;
      this.fetchEvents();
    }

    getHeaderTitle() {
      const y = this.currentDate.getFullYear();
      const months = this.t('months');
      const monthsShort = this.t('monthsShort');
      if (this.viewMode === 'month') {
        if (this.isCenteredMonth) {
          const dayOffset = this.getDayOffset(this.currentDate);
          const anchorStart = new Date(this.currentDate);
          anchorStart.setDate(this.currentDate.getDate() - dayOffset);
          const midWeek = new Date(anchorStart);
          midWeek.setDate(anchorStart.getDate() + 3);
          return `${months[midWeek.getMonth()]} ${midWeek.getFullYear()}`;
        }
        return `${months[this.currentDate.getMonth()]} ${y}`;
      } else {
        const { start, end } = this.getStartEndRange();
        const mStart = monthsShort[start.getMonth()];
        const mEnd = monthsShort[end.getMonth()];
        if (start.getMonth() === end.getMonth()) {
          return `${start.getDate()} – ${end.getDate()} ${mStart} ${y}`;
        } else {
          return `${start.getDate()} ${mStart} – ${end.getDate()} ${mEnd} ${y}`;
        }
      }
    }

    getEventDates(ev) {
      const isAllDay = !ev.start.dateTime;
      let sDateStr = '';
      let eDateStr = '';

      if (isAllDay) {
        sDateStr = ev.start.date || '';
        eDateStr = ev.end?.date || sDateStr;
      } else {
        sDateStr = formatLocalDate(new Date(ev.start.dateTime));
        eDateStr = formatLocalDate(new Date(ev.end?.dateTime || ev.start.dateTime));
      }
      return { sDateStr, eDateStr, isAllDay };
    }

    getLastIncludedDateStr(ev) {
      const { sDateStr, eDateStr, isAllDay } = this.getEventDates(ev);
      if (!sDateStr) return '';
      if (isAllDay) {
        // RFC 5545: DTEND for DATE is exclusive!
        if (eDateStr > sDateStr) {
          const [y, m, d] = eDateStr.split('-').map(Number);
          const prev = new Date(y, m - 1, d - 1);
          return formatLocalDate(prev);
        }
        return sDateStr;
      } else {
        // For timed events: if ending at 00:00:00 next day, last day is previous day
        if (ev.end?.dateTime) {
          const eObj = new Date(ev.end.dateTime);
          if (eObj.getHours() === 0 && eObj.getMinutes() === 0 && eDateStr > sDateStr) {
            const [y, m, d] = eDateStr.split('-').map(Number);
            const prev = new Date(y, m - 1, d - 1);
            return formatLocalDate(prev);
          }
        }
        return eDateStr;
      }
    }

    isEventOnDay(ev, dayDateStr) {
      const { sDateStr } = this.getEventDates(ev);
      const lastDateStr = this.getLastIncludedDateStr(ev);
      if (!sDateStr || !lastDateStr) return false;
      return dayDateStr >= sDateStr && dayDateStr <= lastDateStr;
    }

    renderMonthGrid() {
      const { start, end } = this.getStartEndRange();
      const today = new Date();
      const todayStr = formatLocalDate(today);
      const targetMonth = this.isCenteredMonth ? (() => {
        const dayOffset = this.getDayOffset(this.currentDate);
        const anchorStart = new Date(this.currentDate);
        anchorStart.setDate(this.currentDate.getDate() - dayOffset);
        const midWeek = new Date(anchorStart);
        midWeek.setDate(anchorStart.getDate() + 3);
        return midWeek.getMonth();
      })() : this.currentDate.getMonth();

      // Divide days into weeks
      const weeks = [];
      let curr = new Date(start);
      while (curr <= end) {
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
          weekDays.push(new Date(curr));
          curr.setDate(curr.getDate() + 1);
        }
        weeks.push(weekDays);
      }

      const daysShort = this.daysShort;
      const monthsShort = this.t('monthsShort');
      const untitledText = this.t('untitled');
      const moreText = this.t('moreEvents');
      const locale = this.locale;

      let html = `<div class="month-grid">
        <div class="day-headers">
          ${daysShort.map(h => `<div class="day-header-cell">${h}</div>`).join('')}
        </div>
        <div class="month-weeks">`;

      weeks.forEach((weekDays) => {
        const weekStartStr = formatLocalDate(weekDays[0]);
        const weekEndStr = formatLocalDate(weekDays[6]);

        // Find all events touching this week
        const weekEvents = this.events.filter(ev => {
          const { sDateStr } = this.getEventDates(ev);
          const lastDateStr = this.getLastIncludedDateStr(ev);
          if (!sDateStr || !lastDateStr) return false;
          return sDateStr <= weekEndStr && lastDateStr >= weekStartStr;
        });

        // Compute layout items for this week
        const weekItems = [];

        weekEvents.forEach(ev => {
          const { sDateStr, isAllDay } = this.getEventDates(ev);
          const lastDateStr = this.getLastIncludedDateStr(ev);

          // Calculate startCol and endCol (1..7)
          let startCol = 1;
          let isCapLeft = true;
          if (sDateStr < weekStartStr) {
            startCol = 1;
            isCapLeft = false; // Continues from previous week
          } else {
            const idx = weekDays.findIndex(d => formatLocalDate(d) === sDateStr);
            startCol = idx >= 0 ? idx + 1 : 1;
          }

          let endCol = 7;
          let isCapRight = true;
          if (lastDateStr > weekEndStr) {
            endCol = 7;
            isCapRight = false; // Continues to next week
          } else {
            const idx = weekDays.findIndex(d => formatLocalDate(d) === lastDateStr);
            endCol = idx >= 0 ? idx + 1 : 7;
          }

          if (endCol < startCol) endCol = startCol;
          const colSpan = endCol - startCol + 1;
          const isBar = isAllDay || sDateStr !== lastDateStr || colSpan > 1;

          weekItems.push({
            ev,
            isBar,
            startCol,
            endCol,
            colSpan,
            isCapLeft,
            isCapRight,
            sDateStr,
            lastDateStr,
            slot: 0
          });
        });

        // Sort items for week slot packing:
        // Multi-day bars first (larger span first), then all-day, then timed events
        weekItems.sort((a, b) => {
          if (a.isBar && !b.isBar) return -1;
          if (!a.isBar && b.isBar) return 1;
          if (a.colSpan !== b.colSpan) return b.colSpan - a.colSpan;
          if (a.startCol !== b.startCol) return a.startCol - b.startCol;
          const tA = new Date(a.ev.start.dateTime || (a.ev.start.date + 'T00:00:00')).getTime();
          const tB = new Date(b.ev.start.dateTime || (b.ev.start.date + 'T00:00:00')).getTime();
          if (tA !== tB) return tA - tB;
          const endA = new Date(a.ev.end?.dateTime || (a.ev.end?.date ? a.ev.end.date + 'T23:59:59' : '') || 0).getTime();
          const endB = new Date(b.ev.end?.dateTime || (b.ev.end?.date ? b.ev.end.date + 'T23:59:59' : '') || 0).getTime();
          if (endA !== endB) return endA - endB;
          return (a.ev.summary || '').localeCompare(b.ev.summary || '');
        });

        // Slot packing (tracks)
        const tracks = [];
        weekItems.forEach(item => {
          let slot = 0;
          while (true) {
            if (!tracks[slot]) tracks[slot] = new Array(8).fill(false);
            let fits = true;
            for (let c = item.startCol; c <= item.endCol; c++) {
              if (tracks[slot][c]) {
                fits = false;
                break;
              }
            }
            if (fits) break;
            slot++;
          }
          for (let c = item.startCol; c <= item.endCol; c++) {
            tracks[slot][c] = true;
          }
          item.slot = slot;
        });

        const numWeeks = weeks.length;
        const MAX_VISIBLE_SLOTS = this.isFullscreen ? (numWeeks >= 6 ? 3 : 4) : (numWeeks >= 6 ? 2 : 3);
        const visibleItems = weekItems.filter(item => item.slot < MAX_VISIBLE_SLOTS);

        // Count overflows per day column
        const overflowByCol = new Array(8).fill(0);
        weekItems.forEach(item => {
          if (item.slot >= MAX_VISIBLE_SLOTS) {
            for (let c = item.startCol; c <= item.endCol; c++) {
              overflowByCol[c]++;
            }
          }
        });

        html += `<div class="week-row">
          <!-- Background day cells with numbers -->
          <div class="week-bg-grid">
            ${weekDays.map(d => {
              const dStr = formatLocalDate(d);
              const isOther = d.getMonth() !== targetMonth;
              const isToday = dStr === todayStr;
              return `<div class="day-cell-bg ${isOther ? 'other-month' : ''} ${isToday ? 'today-cell' : ''}" data-day="${dStr}">
                <div class="cell-top">
                  <span class="day-number ${isToday ? 'today-badge' : ''}">${d.getDate()}${d.getDate() === 1 ? ' ' + monthsShort[d.getMonth()] : ''}</span>
                </div>
              </div>`;
            }).join('')}
          </div>

          <!-- Events layer (spanning multi-day bars & chips) -->
          <div class="week-events-grid">
            ${visibleItems.map(item => {
              const { ev, isBar, startCol, colSpan, slot, isCapLeft, isCapRight } = item;
              const safeSummary = escapeHtml(ev.summary || untitledText);
              const gridColStyle = `grid-column: ${startCol} / span ${colSpan}; grid-row: ${slot + 1};`;

              if (isBar) {
                // Determine text color based on background brightness (e.g. yellow anniversary uses dark text)
                const isBright = ev.color === '#d8be5e' || ev.color === '#fbbc04';
                const textColor = isBright ? '#1f1f20' : '#ffffff';
                const leftRadius = isCapLeft ? '4px' : '0px';
                const rightRadius = isCapRight ? '4px' : '0px';

                return `<div class="gcal-bar" style="${gridColStyle} background: ${ev.color}; color: ${textColor}; border-top-left-radius: ${leftRadius}; border-bottom-left-radius: ${leftRadius}; border-top-right-radius: ${rightRadius}; border-bottom-right-radius: ${rightRadius};" data-uid="${ev._uid}" title="${safeSummary}">
                  <span class="bar-title">${safeSummary}</span>
                </div>`;
              } else {
                const timeStr = ev.start.dateTime ? new Date(ev.start.dateTime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }) : '';
                return `<div class="gcal-chip" style="${gridColStyle}" data-uid="${ev._uid}" title="${safeSummary}">
                  <span class="chip-bullet" style="background:${ev.color}"></span>
                  ${timeStr ? `<span class="chip-time">${timeStr}</span>` : ''}
                  <span class="chip-title">${safeSummary}</span>
                </div>`;
              }
            }).join('')}

            <!-- Overflow +X en plus -->
            ${weekDays.map((d, idx) => {
              const col = idx + 1;
              const count = overflowByCol[col];
              if (count <= 0) return '';
              const dStr = formatLocalDate(d);
              return `<div class="more-pill" style="grid-column: ${col} / span 1; grid-row: ${MAX_VISIBLE_SLOTS + 1};" data-day="${dStr}">
                +${count} ${moreText}
              </div>`;
            }).join('')}
          </div>
        </div>`;
      });

      html += `</div></div>`;
      return html;
    }

    layoutWeekEvents(events) {
      if (!events.length) return [];
      const items = events.map(ev => {
        const s = new Date(ev.start.dateTime);
        const e = new Date(ev.end?.dateTime || ev.start.dateTime);
        const startMins = Math.max(0, Math.min(1439, s.getHours() * 60 + s.getMinutes()));
        let durMins = Math.max(20, Math.min(1440, (e.getTime() - s.getTime()) / 60000));
        if (isNaN(durMins) || durMins <= 0) durMins = 30;
        return {
          ev,
          s,
          e,
          startMins,
          endMins: startMins + durMins,
          colIndex: 0,
          totalCols: 1
        };
      });

      items.sort((a, b) => a.startMins - b.startMins);

      // Overlap clustering
      for (let i = 0; i < items.length; i++) {
        const a = items[i];
        const overlaps = [a];
        for (let j = 0; j < items.length; j++) {
          if (i === j) continue;
          const b = items[j];
          if (a.startMins < b.endMins && b.startMins < a.endMins) {
            overlaps.push(b);
          }
        }
        if (overlaps.length > 1) {
          overlaps.sort((x, y) => x.startMins - y.startMins);
          const colsCount = Math.min(overlaps.length, 3);
          overlaps.forEach((item, idx) => {
            item.colIndex = Math.min(idx, colsCount - 1);
            item.totalCols = colsCount;
          });
        }
      }

      return items;
    }

    renderWeekGrid() {
      const { start } = this.getStartEndRange();
      const days = [];
      const today = new Date();
      const todayStr = formatLocalDate(today);

      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
      }

      const hours = [];
      for (let h = 0; h < 24; h++) {
        hours.push(h);
      }

      // Identify all-day events for each day
      const allDayEventsByDay = days.map(d => {
        const dateStr = formatLocalDate(d);
        return this.events.filter(ev => !ev.start.dateTime && this.isEventOnDay(ev, dateStr));
      });
      const hasAnyAllDay = allDayEventsByDay.some(arr => arr.length > 0);

      // Current time line
      const currentMins = today.getHours() * 60 + today.getMinutes();
      const currentIndicatorTop = (currentMins / 60) * HOUR_HEIGHT;

      let html = `<div class="week-grid">
        <!-- Week Days Header -->
        <div class="week-header-row">
          <div class="time-col-header">
            <span style="font-size: 0.70rem; color: var(--gc-text-muted);">GMT</span>
          </div>
          <div class="week-day-headers">
            ${days.map((d, i) => {
              const dateStr = formatLocalDate(d);
              const isToday = dateStr === todayStr;
              return `<div class="week-day-header ${isToday ? 'today-col' : ''}">
                <div class="w-day-name ${isToday ? 'today-text' : ''}">${this.daysShort[i]}</div>
                <div class="w-day-num ${isToday ? 'today-badge' : ''}">${d.getDate()}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- All Day Events Row -->
        ${hasAnyAllDay ? `
          <div class="week-all-day-row">
            <div class="time-col-header" style="font-size: 0.68rem; color: var(--gc-text-muted); padding-right: 4px; text-align: right;">${this.t('allDayHeader')}</div>
            <div class="week-all-day-cells">
              ${days.map((d, i) => `
                <div class="all-day-day-cell">
                  ${allDayEventsByDay[i].map(ev => {
                    const safeSummary = escapeHtml(ev.summary || this.t('untitled'));
                    const isBright = ev.color === '#d8be5e' || ev.color === '#fbbc04';
                    const textColor = isBright ? '#1f1f20' : '#ffffff';
                    return `
                      <div class="all-day-pill" style="background: ${ev.color}; color: ${textColor};" data-uid="${ev._uid}" title="${safeSummary}">
                        ${safeSummary}
                      </div>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 24-Hour Week Hourly Body -->
        <div class="week-body" id="weekBody">
          <div class="time-col">
            ${hours.map(h => `<div class="time-cell">${String(h).padStart(2, '0')}:00</div>`).join('')}
          </div>
          <div class="week-columns">
            ${days.map((d) => {
              const dateStr = formatLocalDate(d);
              const isToday = dateStr === todayStr;
              const dEvents = this.events.filter(ev => {
                if (!ev.start.dateTime) return false;
                const evStart = formatLocalDate(new Date(ev.start.dateTime));
                return evStart === dateStr;
              });

              const laidOut = this.layoutWeekEvents(dEvents);

              return `<div class="week-day-column ${isToday ? 'today-col' : ''}" data-date="${dateStr}">
                ${hours.map(() => `<div class="hour-slot"></div>`).join('')}
                ${isToday ? `
                  <div class="now-indicator" style="top: ${currentIndicatorTop}px;">
                    <div class="now-circle"></div>
                    <div class="now-line"></div>
                  </div>
                ` : ''}
                ${laidOut.map(item => {
                  const { ev, s, e, startMins, endMins, colIndex, totalCols } = item;
                  const durMins = endMins - startMins;
                  const top = (startMins / 60) * HOUR_HEIGHT;
                  const height = Math.max(22, (durMins / 60) * HOUR_HEIGHT - 2);

                  const colWidth = 100 / totalCols;
                  const leftPercent = colIndex * colWidth;
                  const safeSummary = escapeHtml(ev.summary || this.t('untitled'));
                  const timeStr = `${s.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })} - ${e.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })}`;
                  const isCompact = height < 32;
                  const isBright = ev.color === '#d8be5e' || ev.color === '#fbbc04';
                  const textColor = isBright ? '#1f1f20' : '#ffffff';

                  return `<div class="week-event-card ${isCompact ? 'compact' : ''}" style="top: ${top}px; height: ${height}px; width: calc(${colWidth}% - 3px); left: calc(${leftPercent}% + 1px); background: ${ev.color}; color: ${textColor};" data-uid="${ev._uid}" title="${safeSummary} (${timeStr})">
                    <div class="we-title">${safeSummary}</div>
                    ${!isCompact ? `<div class="we-time">${timeStr}</div>` : ''}
                  </div>`;
                }).join('')}
              </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;

      return html;
    }

    renderMiniCalendar() {
      const y = this.miniCalDate.getFullYear();
      const m = this.miniCalDate.getMonth();
      const today = new Date();
      const todayStr = formatLocalDate(today);
      const currStr = formatLocalDate(this.currentDate);

      const firstOfMonth = new Date(y, m, 1);
      const dayOffset = this.getDayOffset(firstOfMonth);
      const start = new Date(y, m, 1 - dayOffset);

      const days = [];
      const curr = new Date(start);
      for (let i = 0; i < 42; i++) {
        days.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }

      const months = this.t('months');
      const dayInitials = this.dayInitials;

      return `
        <div class="mini-cal">
          <div class="mini-cal-header">
            <span class="mini-cal-title">${months[m]} ${y}</span>
            <div class="mini-nav">
              <button class="mini-nav-btn mini-prev" title="${this.t('prevMonth')}">&#10094;</button>
              <button class="mini-nav-btn mini-next" title="${this.t('nextMonth')}">&#10095;</button>
            </div>
          </div>
          <div class="mini-day-headers">
            ${dayInitials.map(d => `<span>${d}</span>`).join('')}
          </div>
          <div class="mini-days-grid">
            ${days.map(d => {
              const dStr = formatLocalDate(d);
              const isOther = d.getMonth() !== m;
              const isToday = dStr === todayStr;
              const isSelected = dStr === currStr;
              return `<div class="mini-day-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dStr}">
                ${d.getDate()}
              </div>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    renderSidebar() {
      const groups = {};
      const defaultGroup = this.t('defaultGroup');
      this.config.calendars.forEach(c => {
        const g = c.group || defaultGroup;
        if (!groups[g]) groups[g] = [];
        groups[g].push(c);
      });

      let html = `<div class="sidebar ${this.sidebarOpen ? '' : 'collapsed'}">
        ${this.renderMiniCalendar()}
        <div class="sidebar-groups">
          ${Object.keys(groups).map(grp => `
            <div class="cal-group">
              <div class="cal-group-title">${escapeHtml(grp)}</div>
              ${groups[grp].map(cal => {
                const isChecked = this.selectedCalendars.has(cal.id);
                const safeName = escapeHtml(cal.name);
                const isBright = cal.color === '#d8be5e' || cal.color === '#fbbc04';
                const checkMarkColor = isBright ? '#1f1f20' : '#ffffff';
                return `<div class="cal-item" data-cal-id="${cal.id}">
                  <div class="custom-checkbox ${isChecked ? 'checked' : ''}" style="--check-color: ${cal.color};">
                    ${isChecked ? `<svg viewBox="0 0 24 24" width="13" height="13"><path fill="${checkMarkColor}" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>` : ''}
                  </div>
                  <span class="cal-label" title="${safeName}">${safeName}</span>
                </div>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>`;

      return html;
    }

    sortEventsForDay(events, dayStr) {
      if (!Array.isArray(events)) return [];
      return [...events].sort((a, b) => {
        const isAllDayA = !a.start || !a.start.dateTime;
        const isAllDayB = !b.start || !b.start.dateTime;

        // 1. All-day / multi-day events come first
        if (isAllDayA && !isAllDayB) return -1;
        if (!isAllDayA && isAllDayB) return 1;

        if (isAllDayA && isAllDayB) {
          // Both all-day: earlier start date first
          const sA = (a.start && a.start.date) || '';
          const sB = (b.start && b.start.date) || '';
          if (sA !== sB) return sA.localeCompare(sB);

          // Longer events first (later end date)
          const eA = (a.end && a.end.date) || sA;
          const eB = (b.end && b.end.date) || sB;
          if (eA !== eB) return eB.localeCompare(eA);

          return (a.summary || '').localeCompare(b.summary || '');
        }

        // Both are timed events:
        const dateA = new Date(a.start.dateTime);
        const dateB = new Date(b.start.dateTime);

        // Effective start minutes on dayStr (events started on previous days start at 00:00)
        const sDateStrA = formatLocalDate(dateA);
        const sDateStrB = formatLocalDate(dateB);
        const minsA = sDateStrA < dayStr ? 0 : (dateA.getHours() * 60 + dateA.getMinutes());
        const minsB = sDateStrB < dayStr ? 0 : (dateB.getHours() * 60 + dateB.getMinutes());

        if (minsA !== minsB) return minsA - minsB;

        // Same start time: compare end time (earlier end first)
        const eDateA = new Date((a.end && a.end.dateTime) || a.start.dateTime);
        const eDateB = new Date((b.end && b.end.dateTime) || b.start.dateTime);
        const eDateStrA = formatLocalDate(eDateA);
        const eDateStrB = formatLocalDate(eDateB);
        const endMinsA = eDateStrA > dayStr ? 1440 : (eDateA.getHours() * 60 + eDateA.getMinutes());
        const endMinsB = eDateStrB > dayStr ? 1440 : (eDateB.getHours() * 60 + eDateB.getMinutes());

        if (endMinsA !== endMinsB) return endMinsA - endMinsB;

        // Same times: compare summary, then calendar name
        const sumComp = (a.summary || '').localeCompare(b.summary || '');
        if (sumComp !== 0) return sumComp;
        return (a.calendarName || '').localeCompare(b.calendarName || '');
      });
    }

    renderDayModal() {
      if (!this.dayModalDate) return '';
      const dayDate = new Date(this.dayModalDate + 'T12:00:00');
      const dayStr = this.dayModalDate;
      const rawDayEvents = this.events.filter(ev => this.isEventOnDay(ev, dayStr));
      const dayEvents = this.sortEventsForDay(rawDayEvents, dayStr);
      const formattedDate = dayDate.toLocaleDateString(this.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const themeClass = this.isDarkTheme ? 'dark-theme' : 'light-theme';
      const noEventsText = this.t('noEventsDay');
      const allDayText = this.t('allDay');
      const untitledText = this.t('untitled');
      const closeText = this.t('close');

      return `
        <div class="modal-backdrop modal-day-backdrop ${themeClass}">
          <div class="modal-content">
            <div class="modal-title" style="text-transform: capitalize;">
              📅 ${escapeHtml(formattedDate)}
            </div>
            <div class="day-modal-events-list">
              ${dayEvents.length === 0 ? `<div style="color: var(--gc-text-muted); padding: 12px 0;">${noEventsText}</div>` : dayEvents.map(ev => {
                const isAllDay = !ev.start.dateTime;
                const timeStr = isAllDay ? allDayText : `${new Date(ev.start.dateTime).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })} - ${new Date(ev.end?.dateTime || ev.start.dateTime).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })}`;
                const safeSummary = escapeHtml(ev.summary || untitledText);
                const safeCalName = escapeHtml(ev.calendarName);
                return `
                  <div class="day-modal-event-item" data-uid="${ev._uid}" style="border-left: 4px solid ${ev.color};">
                    <div class="day-modal-event-title" style="font-size: 0.95rem; word-break: break-word;">${safeSummary}</div>
                    <div class="day-modal-event-sub" style="font-size: 0.82rem; margin-top: 2px;">${timeStr} • <span style="color: ${ev.color}; font-weight: 500;">${safeCalName}</span></div>
                  </div>
                `;
              }).join('')}
            </div>
            <button class="modal-close-btn modal-day-close-btn">${closeText}</button>
          </div>
        </div>
      `;
    }

    render() {
      const today = new Date();
      const title = this.getHeaderTitle();
      const isDark = this.isDarkTheme;
      const themeClass = isDark ? "dark-theme" : "light-theme";

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: var(--ha-card-font-family, Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
            box-sizing: border-box;
            width: 100%;
          }
          :host(.fullscreen-host) {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            height: -webkit-fill-available !important;
            z-index: 999999 !important;
            background: var(--gc-bg) !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          * { box-sizing: border-box; }

          /* Light Theme (pure Google Calendar Light Mode) */
          .gcal-card.light-theme {
            --gc-bg: #ffffff;
            --gc-header-bg: #ffffff;
            --gc-sidebar-bg: #ffffff;
            --gc-border: #dadce0;
            --gc-text: #3c4043;
            --gc-text-muted: #70757a;
            --gc-day-header-bg: #ffffff;
            --gc-hover-bg: rgba(60, 64, 67, 0.08);
            --gc-today-col-bg: rgba(26, 115, 232, 0.06);
            --gc-card-shadow: 0 1px 3px rgba(60,64,67,0.15), 0 4px 12px rgba(60,64,67,0.08);
            --gc-btn-border: #dadce0;
            --gc-btn-text: #3c4043;
            --gc-switcher-bg: #f1f3f4;
            --gc-switcher-active-bg: #ffffff;
            --gc-switcher-active-text: #1a73e8;
            --gc-modal-bg: #ffffff;
            --gc-modal-shadow: 0 12px 32px rgba(60,64,67,0.25);
            --gc-cell-other-bg: transparent;
            --gc-other-month-num: #80868b;
            --gc-more-pill-text: #1a73e8;
          }

          /* Dark Theme (pure Google Calendar Dark Mode) */
          .gcal-card.dark-theme {
            --gc-bg: #1f1f20;
            --gc-header-bg: #1f1f20;
            --gc-sidebar-bg: #18191a;
            --gc-border: #3c4043;
            --gc-text: #e8eaed;
            --gc-text-muted: #9aa0a6;
            --gc-day-header-bg: #18191a;
            --gc-hover-bg: rgba(255, 255, 255, 0.08);
            --gc-today-col-bg: rgba(138, 180, 248, 0.06);
            --gc-card-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
            --gc-btn-border: #5f6368;
            --gc-btn-text: #e8eaed;
            --gc-switcher-bg: #282a2d;
            --gc-switcher-active-bg: #3c4043;
            --gc-switcher-active-text: #8ab4f8;
            --gc-modal-bg: #28292a;
            --gc-modal-shadow: 0 8px 28px rgba(0,0,0,0.6);
            --gc-cell-other-bg: transparent;
            --gc-other-month-num: #5f6368;
            --gc-more-pill-text: #8ab4f8;
          }

          .gcal-card {
            background: var(--gc-bg);
            color: var(--gc-text);
            border-radius: 16px;
            border: 1px solid var(--gc-border);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: var(--gc-card-shadow);
            width: 100%;
            min-width: 0;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
            height: var(--gcal-card-height, calc(100vh - 215px));
            min-height: 480px;
            box-sizing: border-box;
          }

          .gcal-card.fullscreen-mode {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            height: -webkit-fill-available !important;
            z-index: 999999 !important;
            border-radius: 0 !important;
            border: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          /* Header */
          .gcal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            border-bottom: 1px solid var(--gc-border);
            background: var(--gc-header-bg);
            user-select: none;
            gap: 10px;
            flex-wrap: nowrap;
            height: 52px;
            flex-shrink: 0;
            box-sizing: border-box;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
            flex: 1;
            overflow: hidden;
          }
          .header-left > * {
            margin-right: 8px;
          }
          .header-left > *:last-child {
            margin-right: 0;
          }
          .btn-toggle-sidebar {
            background: transparent;
            border: none;
            color: var(--gc-text);
            cursor: pointer;
            padding: 6px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.15rem;
          }
          .btn-toggle-sidebar:hover {
            background: var(--gc-hover-bg);
          }
          .brand-badge {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .brand-badge > * {
            margin-right: 8px;
          }
          .brand-badge > *:last-child {
            margin-right: 0;
          }
          .app-icon {
            width: 36px;
            height: 36px;
            background: #1a73e8;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.15rem;
            color: #fff;
            box-shadow: 0 2px 6px rgba(26,115,232,0.4);
            flex-shrink: 0;
          }
          .app-title {
            font-size: 1.3rem;
            font-weight: 500;
            color: var(--gc-text);
            letter-spacing: -0.2px;
          }
          .btn-today {
            padding: 6px 16px;
            border-radius: 6px;
            border: 1px solid var(--gc-btn-border);
            background: transparent;
            color: var(--gc-btn-text);
            font-size: 0.88rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
            white-space: nowrap;
          }
          .btn-today:hover {
            background: var(--gc-hover-bg);
          }
          .nav-arrows {
            display: flex;
            gap: 3px;
          }
          .nav-arrows > * {
            margin-right: 3px;
          }
          .nav-arrows > *:last-child {
            margin-right: 0;
          }
          .btn-nav {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: none;
            background: transparent;
            color: var(--gc-text);
            font-size: 1.05rem;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.15s;
          }
          .btn-nav:hover {
            background: var(--gc-hover-bg);
          }
          .period-title {
            font-size: 1.25rem;
            font-weight: 500;
            color: var(--gc-text);
            margin-left: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
          }

          /* View Switcher */
          .header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
          }
          .header-right > * {
            margin-left: 6px;
          }
          .header-right > *:first-child {
            margin-left: 0;
          }
          .view-switcher {
            display: flex;
            background: var(--gc-switcher-bg);
            border-radius: 8px;
            padding: 3px;
            border: 1px solid var(--gc-border);
          }
          .view-btn {
            padding: 6px 15px;
            border-radius: 6px;
            border: none;
            background: transparent;
            color: var(--gc-text-muted);
            font-size: 0.88rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s;
            white-space: nowrap;
          }
          .view-btn.active {
            background: var(--gc-switcher-active-bg);
            color: var(--gc-switcher-active-text);
            font-weight: 600;
            box-shadow: 0 1px 3px rgba(0,0,0,0.18);
          }
          .btn-theme-toggle,
          .btn-center-toggle,
          .btn-fullscreen-toggle {
            width: 34px;
            height: 34px;
            padding: 0;
            border-radius: 8px;
            border: 1px solid var(--gc-border);
            background: transparent;
            color: var(--gc-text);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s;
          }
          .btn-theme-toggle:hover,
          .btn-center-toggle:hover,
          .btn-fullscreen-toggle:hover {
            background: var(--gc-hover-bg);
          }
          .btn-center-toggle.active {
            color: #1a73e8 !important;
            border-color: #1a73e8 !important;
            background: var(--gc-hover-bg) !important;
          }
          .btn-fullscreen-toggle:hover {
            background: var(--gc-hover-bg);
          }
          .btn-fullscreen-toggle:active {
            transform: scale(0.95);
          }

          /* Layout */
          .gcal-body {
            display: flex;
            flex: 1 1 0;
            min-height: 0;
            height: calc(100% - 52px);
            min-width: 0;
            width: 100%;
            overflow: hidden;
          }

          /* Sidebar */
          .sidebar {
            width: 220px;
            flex-shrink: 0;
            border-right: 1px solid var(--gc-border);
            padding: 10px 10px;
            background: var(--gc-sidebar-bg);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100%;
            box-sizing: border-box;
            transition: margin-left 0.25s ease;
          }
          .sidebar.collapsed {
            display: none;
          }

          /* Mini Calendar */
          .mini-cal {
            user-select: none;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--gc-border);
            flex-shrink: 0;
          }
          .mini-cal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
            padding: 0 4px;
          }
          .mini-cal-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--gc-text);
          }
          .mini-nav {
            display: flex;
            gap: 2px;
          }
          .mini-nav > * {
            margin-right: 2px;
          }
          .mini-nav > *:last-child {
            margin-right: 0;
          }
          .mini-nav-btn {
            background: transparent;
            border: none;
            color: var(--gc-text-muted);
            cursor: pointer;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
          }
          .mini-nav-btn:hover {
            background: var(--gc-hover-bg);
            color: var(--gc-text);
          }
          .mini-day-headers {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            font-size: 0.70rem;
            color: var(--gc-text-muted);
            font-weight: 600;
            margin-bottom: 4px;
          }
          .mini-days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
          }
          .mini-day-cell {
            width: 22px;
            height: 22px;
            min-width: 22px;
            min-height: 22px;
            line-height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.72rem;
            border-radius: 50%;
            cursor: pointer;
            color: var(--gc-text);
            margin: 1px auto;
          }
          .mini-day-cell:hover {
            background: var(--gc-hover-bg);
          }
          .mini-day-cell.other-month {
            color: var(--gc-other-month-num);
            opacity: 0.45;
          }
          .mini-day-cell.today {
            background: #1a73e8;
            color: #fff;
            font-weight: 700;
          }
          .mini-day-cell.selected {
            background: var(--gc-switcher-active-bg);
            color: var(--gc-switcher-active-text);
            border: 1.5px solid var(--gc-switcher-active-text);
            font-weight: 700;
          }

          /* Calendars Selection List */
          .sidebar-groups {
            flex: 1 1 0;
            min-height: 0;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding-top: 8px;
          }
          .cal-group {
            margin-bottom: 10px;
          }
          .cal-group-title {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--gc-text-muted);
            margin-bottom: 4px;
            padding-left: 4px;
          }
          .cal-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 6px;
            border-radius: 6px;
            cursor: pointer;
            user-select: none;
            transition: background 0.15s;
            min-width: 0;
          }
          .cal-item > * {
            margin-right: 8px;
          }
          .cal-item > *:last-child {
            margin-right: 0;
          }
          .cal-item:hover {
            background: var(--gc-hover-bg);
          }
          .custom-checkbox {
            width: 17px;
            height: 17px;
            border-radius: 4px;
            border: 2px solid var(--check-color);
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            flex-shrink: 0;
            transition: all 0.15s;
          }
          .custom-checkbox.checked {
            background: var(--check-color);
            border-color: var(--check-color);
          }
          .cal-label {
            font-size: 0.84rem;
            color: var(--gc-text);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
            flex: 1;
          }

          /* Main View Container */
          .main-view {
            flex: 1;
            min-width: 0;
            background: var(--gc-bg);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          /* Month View - Multi-Day Continuous Bars across 7 equal columns */
          .month-grid {
            display: flex;
            flex-direction: column;
            flex: 1 1 0;
            min-height: 0;
            height: 100%;
            min-width: 0;
            width: 100%;
            overflow: hidden;
          }
          .day-headers {
            display: grid;
            grid-template-columns: repeat(7, calc(100% / 7));
            width: 100%;
            border-bottom: 1px solid var(--gc-border);
            background: var(--gc-day-header-bg);
            box-sizing: border-box;
            height: 28px;
            flex-shrink: 0;
          }
          .day-header-cell {
            padding: 6px 2px;
            text-align: center;
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--gc-text-muted);
            letter-spacing: 0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
            box-sizing: border-box;
            line-height: 16px;
          }
          .month-weeks {
            display: flex;
            flex-direction: column;
            flex: 1 1 0;
            min-height: 0;
            height: calc(100% - 28px);
            width: 100%;
            min-width: 0;
          }
          .week-row {
            position: relative;
            flex: 1 1 0;
            min-height: 0;
            border-bottom: 1px solid var(--gc-border);
            display: flex;
            flex-direction: column;
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }
          .week-row:last-child {
            border-bottom: none;
          }

          /* Background Day Cells Layer */
          .week-bg-grid {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: grid;
            grid-template-columns: repeat(7, calc(100% / 7));
            pointer-events: none;
            width: 100%;
            height: 100%;
          }
          .day-cell-bg {
            border-right: 1px solid var(--gc-border);
            padding: 3px;
            min-width: 0;
            box-sizing: border-box;
            background: var(--gc-bg);
          }
          .day-cell-bg:last-child {
            border-right: none;
          }
          .day-cell-bg.other-month {
            background: var(--gc-cell-other-bg);
          }
          .day-cell-bg.other-month .day-number {
            color: var(--gc-other-month-num);
            opacity: 0.55;
          }
          .day-cell-bg.today-cell {
            background: var(--gc-today-col-bg);
          }
          .cell-top {
            display: flex;
            justify-content: center;
            margin-bottom: 1px;
          }
          .day-number {
            font-size: 0.78rem;
            font-weight: 500;
            color: var(--gc-text-muted);
            padding: 1px 4px;
            line-height: 1.2;
          }
          .today-badge {
            background: #1a73e8;
            color: #fff !important;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.75rem;
          }

          /* Week Events Grid (CSS Grid spanning across columns!) */
          .week-events-grid {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(7, calc(100% / 7));
            grid-auto-rows: minmax(18px, 20px);
            gap: 2px 0;
            padding-top: 22px; /* leave space for day numbers */
            padding-bottom: 2px;
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
            overflow: hidden;
          }

          /* Continuous Multi-Day Bar (Google Agenda style) */
          .gcal-bar {
            display: flex;
            align-items: center;
            height: 19px;
            margin: 1px 2px;
            cursor: pointer;
            overflow: hidden;
            min-width: 0;
            user-select: none;
            box-sizing: border-box;
            box-shadow: 0 1px 2px rgba(0,0,0,0.18);
            transition: filter 0.15s;
          }
          .gcal-bar:hover {
            filter: brightness(1.12);
          }
          .bar-title {
            font-size: 0.72rem;
            font-weight: 500;
            padding: 0 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
            flex: 1;
            line-height: 19px;
          }

          /* Single-Day Timed Chip */
          .gcal-chip {
            display: flex;
            align-items: center;
            gap: 3px;
            height: 19px;
            margin: 1px 3px;
            padding: 0 2px;
            cursor: pointer;
            overflow: hidden;
            min-width: 0;
            border-radius: 4px;
            user-select: none;
            box-sizing: border-box;
            transition: background 0.15s;
          }
          .gcal-chip:hover {
            filter: brightness(1.1);
            background: var(--gc-hover-bg);
          }
          .chip-bullet {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
          }
          .chip-time {
            font-size: 0.70rem;
            font-weight: 600;
            color: var(--gc-text-muted);
            flex-shrink: 0;
            font-variant-numeric: tabular-nums;
            white-space: nowrap;
          }
          .chip-title {
            font-size: 0.72rem;
            color: var(--gc-text);
            width: 0;
            min-width: 0;
            flex: 1 1 0%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .more-pill {
            font-size: 0.68rem;
            font-weight: 600;
            color: var(--gc-more-pill-text);
            padding: 0 4px;
            margin: 1px 3px;
            height: 16px;
            line-height: 16px;
            display: flex;
            align-items: center;
            cursor: pointer;
            border-radius: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: none;
          }
          .more-pill:hover {
            background: var(--gc-hover-bg);
          }

          /* Week View - Strict 7 Columns via Fixed Percentages */
          .week-grid {
            display: flex;
            flex-direction: column;
            flex: 1 1 0;
            min-height: 0;
            height: 100%;
            min-width: 0;
            width: 100%;
            overflow: hidden;
          }
          .week-header-row {
            display: flex;
            width: 100%;
            border-bottom: 1px solid var(--gc-border);
            background: var(--gc-day-header-bg);
            box-sizing: border-box;
            flex-shrink: 0;
          }
          .time-col-header {
            width: 58px;
            flex-shrink: 0;
            border-right: 1px solid var(--gc-border);
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
          }
          .week-day-headers {
            display: flex;
            flex: 1;
            min-width: 0;
            width: calc(100% - 58px);
          }
          .week-day-header {
            flex: 1 1 0;
            width: calc(100% / 7);
            text-align: center;
            padding: 6px 2px;
            border-right: 1px solid var(--gc-border);
            min-width: 0;
            overflow: hidden;
            box-sizing: border-box;
          }
          .week-day-header:last-child {
            border-right: none;
          }
          .w-day-name {
            font-size: 0.72rem;
            color: var(--gc-text-muted);
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .w-day-name.today-text {
            color: #1a73e8;
          }
          .w-day-num {
            font-size: 1.15rem;
            font-weight: 600;
            color: var(--gc-text);
            margin-top: 1px;
          }

          /* Week All Day Row */
          .week-all-day-row {
            display: flex;
            width: 100%;
            border-bottom: 1px solid var(--gc-border);
            background: var(--gc-header-bg);
            min-height: 26px;
            max-height: 60px;
            overflow-y: auto;
            flex-shrink: 0;
            box-sizing: border-box;
          }
          .week-all-day-cells {
            display: flex;
            flex: 1;
            min-width: 0;
            width: calc(100% - 58px);
          }
          .all-day-day-cell {
            flex: 1 1 0;
            width: calc(100% / 7);
            border-right: 1px solid var(--gc-border);
            padding: 2px 2px;
            display: flex;
            flex-direction: column;
            gap: 2px;
            min-width: 0;
            overflow: hidden;
            box-sizing: border-box;
          }
          .all-day-day-cell:last-child {
            border-right: none;
          }
          .all-day-pill {
            padding: 1px 4px;
            border-radius: 4px;
            font-size: 0.70rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            min-width: 0;
            max-width: 100%;
            width: 100%;
            display: block;
            box-sizing: border-box;
          }

          /* Week Hourly Body */
          .week-body {
            display: flex;
            width: 100%;
            flex: 1 1 0;
            min-height: 0;
            height: 100%;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            position: relative;
            box-sizing: border-box;
          }
          .time-col {
            width: 58px;
            flex-shrink: 0;
            border-right: 1px solid var(--gc-border);
            background: var(--gc-bg);
            box-sizing: border-box;
          }
          .time-cell {
            height: 48px;
            font-size: 0.72rem;
            color: var(--gc-text-muted);
            padding-right: 6px;
            text-align: right;
            transform: translateY(-7px);
            box-sizing: border-box;
          }
          .week-columns {
            display: flex;
            flex: 1;
            min-width: 0;
            width: calc(100% - 58px);
            position: relative;
            box-sizing: border-box;
          }
          .week-day-column {
            flex: 1 1 0;
            width: calc(100% / 7);
            border-right: 1px solid var(--gc-border);
            position: relative;
            height: 1152px; /* 24 hours * 48px */
            min-width: 0;
            box-sizing: border-box;
          }
          .week-day-column:last-child {
            border-right: none;
          }
          .week-day-column.today-col {
            background: var(--gc-today-col-bg);
          }
          .hour-slot {
            height: 48px;
            border-bottom: 1px solid var(--gc-border);
            box-sizing: border-box;
          }

          /* Current time line */
          .now-indicator {
            position: absolute;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            z-index: 10;
            pointer-events: none;
          }
          .now-circle {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ea4335;
            margin-left: -5px;
            flex-shrink: 0;
          }
          .now-line {
            flex: 1;
            height: 2px;
            background: #ea4335;
          }

          .week-event-card {
            position: absolute;
            border-radius: 5px;
            padding: 3px 5px;
            overflow: hidden;
            font-size: 0.75rem;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0,0,0,0.2);
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: 0;
            box-sizing: border-box;
          }
          .week-event-card.compact {
            padding: 1px 4px;
            justify-content: center;
          }
          .week-event-card:hover {
            filter: brightness(1.15);
            z-index: 6;
          }
          .we-title {
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
            max-width: 100%;
            display: block;
            line-height: 1.25;
          }
          .we-time {
            font-size: 0.70rem;
            opacity: 0.9;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0;
            line-height: 1.2;
          }

          /* Modals */
          .modal-backdrop {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            padding: 16px;
            box-sizing: border-box;
          }
          .modal-content {
            border-radius: 14px;
            padding: 22px;
            width: 100%;
            max-width: 480px;
            position: relative;
            max-height: 85vh;
            overflow-y: auto;
            box-sizing: border-box;
          }
          .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            word-break: break-word;
          }
          .modal-cal-dot {
            width: 14px;
            height: 14px;
            border-radius: 3px;
            flex-shrink: 0;
            margin-top: 5px;
          }
          .modal-time {
            font-size: 0.92rem;
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .modal-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.82rem;
            font-weight: 600;
            margin-top: 4px;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .modal-meta-row {
            font-size: 0.88rem;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            word-break: break-word;
          }
          .modal-desc-container {
            margin-top: 14px;
          }
          .modal-desc-label {
            font-size: 0.78rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .modal-desc {
            font-size: 0.88rem;
            line-height: 1.5;
            white-space: pre-wrap;
            word-break: break-word;
            overflow-wrap: anywhere;
            padding: 10px 12px;
            border-radius: 8px;
            max-height: 220px;
            overflow-y: auto;
          }
          .modal-close-btn {
            margin-top: 18px;
            padding: 8px 22px;
            background: #1a73e8;
            color: #fff;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 0.9rem;
            cursor: pointer;
            float: right;
            transition: background 0.15s;
          }
          .modal-close-btn:hover {
            background: #1765cc;
          }

          .day-modal-events-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 14px 0;
            max-height: 380px;
            overflow-y: auto;
          }
          .day-modal-event-item {
            padding: 10px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s;
          }

          /* Light theme modal styling (Solid & crisp contrast) */
          .modal-backdrop.light-theme .modal-content {
            background: #ffffff !important;
            color: #202124 !important;
            border: 1px solid #dadce0 !important;
            box-shadow: 0 12px 32px rgba(60,64,67,0.28) !important;
          }
          .modal-backdrop.light-theme .modal-title,
          .modal-backdrop.light-theme .day-modal-event-title {
            color: #202124 !important;
          }
          .modal-backdrop.light-theme .modal-time,
          .modal-backdrop.light-theme .modal-meta-row,
          .modal-backdrop.light-theme .modal-desc-label,
          .modal-backdrop.light-theme .day-modal-event-sub {
            color: #5f6368 !important;
          }
          .modal-backdrop.light-theme .day-modal-event-item {
            background: #f8f9fa !important;
            border: 1px solid #e8eaed !important;
          }
          .modal-backdrop.light-theme .day-modal-event-item:hover {
            background: #eef2f6 !important;
          }
          .modal-backdrop.light-theme .modal-desc {
            background: #f8f9fa !important;
            border: 1px solid #dadce0 !important;
            color: #202124 !important;
          }

          /* Dark theme modal styling (Solid Google Dark style) */
          .modal-backdrop.dark-theme .modal-content {
            background: #28292a !important;
            color: #e8eaed !important;
            border: 1px solid #3c4043 !important;
            box-shadow: 0 12px 36px rgba(0,0,0,0.65) !important;
          }
          .modal-backdrop.dark-theme .modal-title,
          .modal-backdrop.dark-theme .day-modal-event-title {
            color: #e8eaed !important;
          }
          .modal-backdrop.dark-theme .modal-time,
          .modal-backdrop.dark-theme .modal-meta-row,
          .modal-backdrop.dark-theme .modal-desc-label,
          .modal-backdrop.dark-theme .day-modal-event-sub {
            color: #9aa0a6 !important;
          }
          .modal-backdrop.dark-theme .day-modal-event-item {
            background: #1f1f20 !important;
            border: 1px solid #3c4043 !important;
          }
          .modal-backdrop.dark-theme .day-modal-event-item:hover {
            background: #333538 !important;
          }
          .modal-backdrop.dark-theme .modal-desc {
            background: #1f1f20 !important;
            border: 1px solid #3c4043 !important;
            color: #e8eaed !important;
          }

          /* Responsive adjustments */
          @media (max-width: 800px) {
            .period-title { font-size: 1.1rem; }
            .app-title { display: none; }
            .time-col, .time-col-header { width: 48px; }
            .sidebar { width: 200px; }
          }
        </style>

        <div class="gcal-card ${themeClass} ${this.isFullscreen ? 'fullscreen-mode' : ''}" style="${this.isFullscreen ? '' : (this.fitScreen ? `height: ${this.config.card_height || 'calc(100vh - 215px)'};` : 'min-height: 580px;')}">
          <!-- Top Google Agenda Navigation Bar -->
          <div class="gcal-header">
            <div class="header-left">
              <button class="btn-toggle-sidebar" title="${this.t('mainMenu')}">☰</button>
              <div class="brand-badge">
                <div class="app-icon">${today.getDate()}</div>
                <div class="app-title">Agenda</div>
              </div>
              <button class="btn-today">${this.t('today')}</button>
              <div class="nav-arrows">
                <button class="btn-nav btn-prev" title="${this.t('prevPeriod')}">❮</button>
                <button class="btn-nav btn-next" title="${this.t('nextPeriod')}">❯</button>
              </div>
              <div class="period-title">${title}</div>
            </div>
            <div class="header-right">
              <div class="view-switcher">
                <button class="view-btn ${this.viewMode === 'month' ? 'active' : ''}" data-view="month">${this.t('monthView')}</button>
                <button class="view-btn ${this.viewMode === 'week' ? 'active' : ''}" data-view="week">${this.t('weekView')}</button>
              </div>
              ${this.viewMode === 'month' ? `
                <button class="btn-center-toggle ${this.isCenteredMonth ? 'active' : ''}" id="centerToggleBtn" title="${this.isCenteredMonth ? this.t('classicMonthView') : this.t('centerMonthView')}">
                  ${CENTER_SVG}
                </button>
              ` : ''}
              <button class="btn-theme-toggle" title="${isDark ? this.t('switchToLight') : this.t('switchToDark')}">
                ${isDark ? SUN_SVG : MOON_SVG}
              </button>
              ${this.showFullscreenButton ? `
                <button class="btn-fullscreen-toggle" title="${this.isFullscreen ? this.t('exitFullscreen') : this.t('enterFullscreen')}">
                  ${this.isFullscreen ? COMPRESS_SVG : EXPAND_SVG}
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Main Body -->
          <div class="gcal-body">
            ${this.renderSidebar()}
            <div class="main-view">
              ${this.viewMode === 'month' ? this.renderMonthGrid() : this.renderWeekGrid()}
            </div>
          </div>
        </div>

        <!-- Event Details Modal -->
        ${this.selectedEvent ? `
          <div class="modal-backdrop modal-event-backdrop ${themeClass}">
            <div class="modal-content">
              <div class="modal-title">
                <span class="modal-cal-dot" style="background:${this.selectedEvent.color}"></span>
                <span>${escapeHtml(this.selectedEvent.summary || this.t('untitled'))}</span>
              </div>
              <div class="modal-time">
                <div>📅 ${new Date(this.selectedEvent.start.dateTime || this.selectedEvent.start.date + 'T12:00:00').toLocaleDateString(this.locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                ${this.selectedEvent.start.dateTime ? `<div>⏱ ${new Date(this.selectedEvent.start.dateTime).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })} - ${new Date(this.selectedEvent.end?.dateTime || this.selectedEvent.start.dateTime).toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit' })}</div>` : `<div>⏱ (${this.t('allDay')})</div>`}
              </div>
              <div>
                <span class="modal-badge" style="background: ${this.selectedEvent.color}22; color: ${this.selectedEvent.color}; border: 1px solid ${this.selectedEvent.color}55;">
                  ${escapeHtml(this.selectedEvent.calendarName)}
                </span>
              </div>
              ${this.selectedEvent.location ? `<div class="modal-meta-row">📍 <span>${escapeHtml(this.selectedEvent.location)}</span></div>` : ''}
              ${this.selectedEvent.description ? `
                <div class="modal-desc-container">
                  <div class="modal-desc-label">${this.t('description')}</div>
                  <div class="modal-desc">${formatDescription(this.selectedEvent.description)}</div>
                </div>
              ` : ''}
              <button class="modal-close-btn modal-event-close-btn">${this.t('close')}</button>
            </div>
          </div>
        ` : ''}

        <!-- Day Events Full Modal (+X en plus) -->
        ${this.renderDayModal()}
      `;

      this.bindEvents();

      // In week view, auto-scroll to current hour or 07:00
      if (this.viewMode === 'week') {
        requestAnimationFrame(() => {
          const weekBody = this.shadowRoot.querySelector('#weekBody');
          if (weekBody) {
            const now = new Date();
            const targetHour = Math.max(0, Math.min(20, now.getHours() - 1));
            weekBody.scrollTop = targetHour * HOUR_HEIGHT;
          }
        });
      }
    }

    bindEvents() {
      const root = this.shadowRoot;

      // Header buttons
      root.querySelector('.btn-today')?.addEventListener('click', () => this.today());
      root.querySelector('.btn-prev')?.addEventListener('click', () => this.prev());
      root.querySelector('.btn-next')?.addEventListener('click', () => this.next());
      root.querySelector('.btn-toggle-sidebar')?.addEventListener('click', () => {
        this.sidebarOpen = !this.sidebarOpen;
        this.render();
      });

      // View Switcher
      root.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const v = btn.getAttribute('data-view');
          this.switchView(v);
        });
      });

      // Mini Calendar Navigation
      root.querySelector('.mini-prev')?.addEventListener('click', () => {
        this.miniCalDate = new Date(this.miniCalDate.getFullYear(), this.miniCalDate.getMonth() - 1, 1);
        this.render();
      });
      root.querySelector('.mini-next')?.addEventListener('click', () => {
        this.miniCalDate = new Date(this.miniCalDate.getFullYear(), this.miniCalDate.getMonth() + 1, 1);
        this.render();
      });
      root.querySelectorAll('.mini-day-cell').forEach(cell => {
        cell.addEventListener('click', () => {
          const dStr = cell.getAttribute('data-date');
          if (dStr) {
            this.currentDate = new Date(dStr + 'T12:00:00');
            this.miniCalDate = new Date(this.currentDate);
            this.fetchEvents();
          }
        });
      });

      // Sidebar Calendars Toggles
      root.querySelectorAll('.cal-item').forEach(item => {
        item.addEventListener('click', () => {
          const id = item.getAttribute('data-cal-id');
          this.toggleCal(id);
        });
      });

      // Event chips & multi-day bars click (Event Modal)
      root.querySelectorAll('.gcal-bar, .gcal-chip, .week-event-card, .all-day-pill').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          const uid = parseInt(chip.getAttribute('data-uid'), 10);
          const ev = this.events.find(x => x._uid === uid);
          if (ev) {
            this.selectedEvent = ev;
            this.render();
          }
        });
      });

      // More events (+X en plus)
      root.querySelectorAll('.more-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const dayCell = btn.closest('[data-day]');
          const dayStr = btn.getAttribute('data-day') || dayCell?.getAttribute('data-day');
          if (dayStr) {
            this.dayModalDate = dayStr;
            this.render();
          }
        });
      });

      // Day modal items click
      root.querySelectorAll('.day-modal-event-item').forEach(item => {
        item.addEventListener('click', () => {
          const uid = parseInt(item.getAttribute('data-uid'), 10);
          const ev = this.events.find(x => x._uid === uid);
          if (ev) {
            this.dayModalDate = null;
            this.selectedEvent = ev;
            this.render();
          }
        });
      });

      // Modal Close
      root.querySelector('.modal-event-close-btn')?.addEventListener('click', () => {
        this.selectedEvent = null;
        this.render();
      });
      root.querySelector('.modal-day-close-btn')?.addEventListener('click', () => {
        this.dayModalDate = null;
        this.render();
      });
      root.querySelector('.modal-event-backdrop')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-event-backdrop')) {
          this.selectedEvent = null;
          this.render();
        }
      });
      root.querySelector('.modal-day-backdrop')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-day-backdrop')) {
          this.dayModalDate = null;
          this.render();
        }
      });

      root.querySelector('#centerToggleBtn')?.addEventListener('click', () => {
        this.toggleCenteredMonth();
      });
      root.querySelector('.btn-theme-toggle')?.addEventListener('click', () => {
        this.toggleTheme();
      });
      root.querySelector('.btn-fullscreen-toggle')?.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
  }

  if (!customElements.get('google-agenda-card')) {
    customElements.define('google-agenda-card', GoogleAgendaCard);
  }

  window.customCards = window.customCards || [];
  if (!window.customCards.some(c => c.type === 'google-agenda-card')) {
    window.customCards.push({
      type: 'google-agenda-card',
      name: 'Google Agenda Card',
      description: 'Interface Google Agenda complète en mode sombre pour Home Assistant'
    });
  }
})();
