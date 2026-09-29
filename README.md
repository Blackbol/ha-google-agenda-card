# Google Agenda Card for Home Assistant 📅

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/default)
[![GitHub release](https://img.shields.io/github/v/release/Blackbol/ha-google-agenda-card?include_prereleases&color=blue)](https://github.com/Blackbol/ha-google-agenda-card)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

🌐 **Language / Langue :** English | [Français](README.fr.md)

---

A custom Lovelace card for **Home Assistant** that faithfully reproduces the complete, fluid and modern **Google Calendar** interface — with full dark/light mode support, 24h week view, centered month view, continuous multi-day event bars, Mealie meal integration, and an ergonomics optimised for tablets and iPads.

---

## 📸 Preview

### Month View (Dark Mode)
*Continuous multi-day bars, calendar-coloured chips, `+X more` badges and collapsible sidebar.*
![Month view dark mode](images/month-view-dark.png)

### Week View (24h Hourly Grid)
*Hour-by-hour detail with a current-time marker and multi-day events in the header.*
![Week view with 24h hourly grid](images/week-view-dark.png)

### Month View (Light Mode)
*Native support for Home Assistant's light theme with optimised contrasts.*
![Month view light mode](images/month-view-light.png)

### Event Detail Modal
*View full event details: time, source calendar, location and description with clickable links.*
![Event detail modal](images/event-modal.png)

---

## ✨ Key Features

- 🗓️ **Authentic Google Calendar experience** — Month and Week (24h) views with configurable start of week.
- ↔️ **Continuous multi-day event bars** — Events spanning multiple days or weeks form a seamless bar, exactly like Google Calendar web/mobile.
- 🎯 **Centred Month View option** — Locks the current week to the **middle row** (row 3 of 5), so you always see 2 past weeks and 2 upcoming weeks. Quick toggle button in the header (🎯 icon).
- 🌓 **Automatic Dark & Light Theme** — Auto-detects the Home Assistant or system theme, with polished colour palettes and solid contrasts. Manual toggle always available.
- 🍽️ **Mealie / Meal integration (`fixed_time`)** — Automatically converts all-day meal events to timed events (e.g. Lunch at `12:00`, Dinner at `20:00`) without modifying the source data.
- 📱 **Optimised for Tablets & iPads** — Responsive `panel: true` rendering, columns locked to strict percentages to prevent text overflow, and a built-in **Full Screen** button.
- 🔍 **Interactive, well-ordered modals**:
  - Click `+X more` → opens a day summary modal with strict chronological sorting (all-day → midday → evening).
  - Click an event → shows its full detail card (time, source calendar, location, description with clickable links).
- 🎨 **Customisable grouping & colours** — Organise calendars by category in the collapsible sidebar (e.g. *My calendars*, *Other calendars*, *Meals*).
- 🌍 **Multi-language** — Follows your Home Assistant profile language (`auto`), or force `en` / `fr` via the `language` option.
- 📅 **Configurable first day of week** — Monday by default; set any day from Sunday to Saturday.

---

## 📦 Installation

### Method 1: Via HACS (Recommended)

1. Open **HACS** in your Home Assistant interface.
2. Click the **three vertical dots** in the top-right corner, then **Custom repositories**.
3. Add the repository URL:
   - **URL**: `https://github.com/Blackbol/ha-google-agenda-card`
   - **Type**: `Dashboard` (or `Lovelace`)
4. Click **Add**.
5. Search for **Google Agenda Card** in HACS and click **Download**.
6. Refresh your browser (Ctrl + F5 or clear cache).

---

### Method 2: Manual Installation

1. Download [`google-agenda-card.js`](google-agenda-card.js).
2. Copy it to the `www` folder of your Home Assistant configuration (e.g. `/config/www/google-agenda-card.js`).
3. In Home Assistant, go to **Settings** → **Dashboards** → **Resources** (three dots in the top-right).
4. Click **Add resource**:
   - **URL**: `/local/google-agenda-card.js`
   - **Resource type**: `JavaScript module`
5. Refresh your dashboard.

---

## ⚙️ YAML Configuration

### Full example (matching the screenshots)

```yaml
type: custom:google-agenda-card
language: auto            # 'auto' (follows HA language), 'en' or 'fr'
first_day_of_week: 1      # 1 = Monday (default), 0 = Sunday (or 'monday', 'sunday', etc.)
theme_mode: auto          # 'auto', 'dark' or 'light'
centered_month: true      # Enable centred month view (current week in the middle row)
fit_screen: true          # Fit card height to screen
show_fullscreen_button: true

calendars:
  - id: calendar.personal
    name: Personal
    color: '#4285f4'
    group: My calendars
    default: true

  - id: calendar.work_projects
    name: Work & Projects
    color: '#0f9d58'
    group: My calendars
    default: true

  - id: calendar.leisure_events
    name: Leisure & Events
    color: '#f4b400'
    group: My calendars
    default: true

  - id: calendar.family_home
    name: Family & Home
    color: '#db4437'
    group: My calendars
    default: true

  # Optional: Mealie meals with automatic fixed times
  - id: calendar.mealie_lunch
    name: Lunch
    color: '#00acc1'
    group: Meals (Mealie)
    fixed_time: '12:00'
    duration_minutes: 45
    default: true

  - id: calendar.mealie_dinner
    name: Dinner
    color: '#8e24aa'
    group: Meals (Mealie)
    fixed_time: '20:00'
    duration_minutes: 45
    default: true
```

---

## 📋 Options Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Required** | `custom:google-agenda-card` |
| `calendars` | `list` | `[]` | List of Home Assistant calendar entities to display |
| `language` | `string` | `auto` | UI language: `auto` (follows HA profile), `en` (English) or `fr` (French) |
| `first_day_of_week` | `number` / `string` | `1` | First day of the week: `1` or `'monday'` (Monday), `0` or `'sunday'` (Sunday), etc. |
| `theme_mode` | `string` | `auto` | Colour mode: `auto` (follows Home Assistant), `dark` or `light` |
| `centered_month` | `boolean` | `false` | Centres the month view so the current week is on the 3rd (middle) row |
| `fit_screen` | `boolean` | `true` | Adjusts card height to fill the iPad/tablet screen |
| `card_height` | `string` | `calc(100vh - 215px)` | Custom CSS height (e.g. `650px`, `100vh`) |
| `fullscreen` | `boolean` | `false` | Start the card in fullscreen mode |
| `show_fullscreen_button` | `boolean` | `true` | Show the fullscreen toggle icon in the toolbar |

### Per-calendar options (`calendars`)

| Key | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | **Required** — Home Assistant entity ID (e.g. `calendar.personal`) |
| `name` | `string` | Display name in the sidebar and on events |
| `color` | `string` | Hex colour for the chip and event bars (e.g. `#1a73e8`) |
| `group` | `string` | Category name in the collapsible sidebar (e.g. `My calendars`) |
| `fixed_time` | `string` | *(Optional)* Force an all-day event to display at a specific time `HH:MM` (e.g. `12:00`) |
| `duration_minutes` | `number` | *(Optional)* Duration in minutes when using `fixed_time` (default: `60`) |
| `default` | `boolean` | Whether the calendar is checked by default on load (`true`) |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
