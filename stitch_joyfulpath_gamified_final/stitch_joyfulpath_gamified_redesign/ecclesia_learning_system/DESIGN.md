---
name: Ecclesia Learning System
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e3'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2fd'
  surface-container: '#ededf7'
  surface-container-high: '#e8e7f2'
  surface-container-highest: '#e2e1ec'
  on-surface: '#1a1b23'
  on-surface-variant: '#434654'
  inverse-surface: '#2f3038'
  inverse-on-surface: '#f0f0fa'
  outline: '#747685'
  outline-variant: '#c4c5d6'
  surface-tint: '#2854cc'
  primary: '#214fc7'
  on-primary: '#ffffff'
  primary-container: '#4169e1'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b6c4ff'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#006732'
  on-tertiary: '#ffffff'
  tertiary-container: '#008342'
  on-tertiary-container: '#e2ffe3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#003baf'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#83fba5'
  tertiary-fixed-dim: '#66dd8b'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005227'
  background: '#faf8ff'
  on-background: '#1a1b23'
  surface-variant: '#e2e1ec'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  student-hero:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '900'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  student-gap: 32px
  admin-gap: 12px
---

## Brand & Style
The design system bridges the gap between ancient spiritual heritage and modern educational technology. It serves a multi-generational Coptic Orthodox community, requiring a visual language that scales from playful engagement to executive solemnity.

The aesthetic is **Modern-Ecclesial**, a blend of **Glassmorphism** and **Corporate Modern** styles. 
- **Student Role:** High-vibrancy, tactile surfaces with exaggerated roundedness and "squishy" interactive feedback.
- **Parent/Instructor Role:** Balanced, clean, and organized, focusing on clarity and supportive guidance.
- **Admin/Clergy Role:** Professional and refined, utilizing structured grids, subtle depth, and sophisticated data density.

## Colors
The palette centers on **Royal Blue** (Authority/Heavenly) and **Gold** (Divinity/Value). 
- **Primary (Royal Blue):** Used for navigation, primary actions, and branding.
- **Secondary (Gold):** Reserved for achievements, rewards, and highlighting sacred content.
- **Semantic Accents:** 
  - **Emerald Green:** Growth, completion, and positive progress.
  - **Sky Blue:** Informational and secondary student-path elements.
  - **Warm Orange:** Warnings and high-energy student CTAs.
  - **Deep Purple:** Clerical insights and advanced theological modules.
- **Surfaces:** Utilize `surface_off_white` for background depth. Glassmorphic overlays should use a 60% opacity white fill with a 20px background blur.

## Typography
**Be Vietnam Pro** is the sole typeface, ensuring a consistent modern voice across all roles. 
- **Students:** Use `display-lg` and `student-hero` for gamified headers. Bold weights are preferred for all interactive labels.
- **Instructors:** Utilize `headline-md` for clear sectioning and `body-lg` for instructional text to reduce eye strain.
- **Admin/Clergy:** Focus on `body-md` for data density and `label-caps` for table headers and metadata categorization.

## Layout & Spacing
The system uses an 8px base grid.
- **Student Layout:** Spacious and fluid. Use `student-gap` (32px) between modules to prevent visual clutter and accommodate touch targets.
- **Admin Layout:** Compact and efficient. Use `admin-gap` (12px) for data-heavy views.
- **Grid:** A 12-column grid for desktop. On mobile, transition to a single-column layout with 16px margins. 
- **Glass Containers:** Use wide padding (24px-32px) for glassmorphic cards to emphasize the "floating" effect.

## Elevation & Depth
This design system uses a mix of **Tonal Layers** and **Ambient Shadows** to define hierarchy.

- **Level 1 (Base):** Off-white background.
- **Level 2 (Cards):** White surfaces with a soft, 4% opacity Royal Blue tinted shadow (0px 4px 20px).
- **Level 3 (Interactive/Modals):** Glassmorphic layers with a 1px white inner-border to simulate light-catching edges.
- **Student Elements:** Use a "bottom-heavy" shadow (0px 6px 0px) in a darker shade of the component's color to create a 3D "button" look common in gaming UIs.
- **Admin Elements:** Use flat surfaces with low-contrast 1px outlines (#E0E0E0) to maintain a professional, organized feel.

## Shapes
Shape language is the primary differentiator between roles:
- **Student UI:** Force `rounded-xl` (1.5rem/24px) for cards and `rounded-full` for buttons and progress bars to maximize the "friendly" feel.
- **Instructor UI:** Standard `rounded-lg` (1rem/16px) provides a balance of modern style and professional structure.
- **Admin UI:** Precision `rounded-sm` (0.25rem/4px) or `rounded-md` (0.5rem/8px) for data inputs and table containers to maximize screen real estate.

## Components

### Student Hero Cards
Large-format containers with vibrant gradients (e.g., Royal Blue to Sky Blue). Features a prominent SVG character/icon on the right, `student-hero` typography on the left, and a "Bouncy" primary button that scales 5% on hover.

### Executive KPI Widgets (Admin)
Clean, white containers with a 1px border. Displays a single high-level metric (e.g., "94% Attendance") using `headline-md` in Royal Blue, paired with a small Sparkline trend graph in Emerald Green.

### Modern Data Tables
Admin-focused. No vertical borders. Header row uses `label-caps` with a light grey background tint. Rows feature a subtle Royal Blue hover state (5% opacity).

### Interactive Progress & XP
- **XP Bar:** Thick, rounded track with a Gold (#FFD700) fill. Includes a "shimmer" animation that passes through the fill every 3 seconds.
- **Progress Rings:** Used for Parent dashboards. Uses a dual-track system: a light grey background circle and a Primary Blue stroke for progress.

### Forms & Inputs
Floating labels are used for all roles. 
- **Student Inputs:** Thick 2px borders that turn Royal Blue on focus.
- **Admin Inputs:** 1px borders with a subtle background fill (#F2F2F2).

### Illustration Style
Custom SVGs should use thick, rounded strokes and a limited palette derived from the brand colors. Avoid harsh blacks; use Deep Purple or Navy for outlines. Characters should have friendly, expressive features with Coptic stylistic nods (e.g., patterns found in Coptic textiles) integrated into clothing or borders.