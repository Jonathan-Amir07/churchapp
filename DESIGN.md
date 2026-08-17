---
name: JoyfulPath
colors:
  surface: '#f8f9ff'
  surface-dim: '#d6dae5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff3fe'
  surface-container: '#eaeef9'
  surface-container-high: '#e4e8f3'
  surface-container-highest: '#dee2ed'
  on-surface: '#171c23'
  on-surface-variant: '#434654'
  inverse-surface: '#2c3139'
  inverse-on-surface: '#edf1fc'
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
  background: '#f8f9ff'
  on-background: '#171c23'
  surface-variant: '#dee2ed'
typography:
  headline-xl:
    fontFamily: Be Vietnam Pro
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  headline-xl-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 30px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 20px
  lg: 32px
  xl: 48px
  container-margin: 24px
  gutter: 16px
---

## Brand & Style

The design system is engineered to feel like a premium digital playground, blending the spiritual heritage of Coptic Orthodoxy with the high-energy engagement of modern gaming. The target audience—children aged 10–12—requires an interface that feels "cool" yet approachable, moving away from "babyish" aesthetics toward the polished look of popular mobile games.

The visual style is a hybrid of **Glassmorphism** and **Tactile Playfulness**. It utilizes thick, volumetric shapes inspired by the "bouncy" UI of top-tier mobile games, paired with frosted glass overlays that provide depth and a modern edge. The identity is reinforced through the strategic use of Coptic-inspired geometric patterns (stars and crosses) used as subtle background textures or decorative "stickers" within the UI. Every interaction should feel responsive and springy, evoking an emotional response of wonder and achievement.

## Colors

The palette is vibrant and celebratory. The **Royal Blue** serves as the anchor, representing the heavens and authority, while **Gold** provides a "win-state" feel for rewards and high-priority interactions. 

**Functional Color Strategy:**
- **Backgrounds:** Use soft, multi-stop gradients instead of flat colors. A common "Stage" background might blend Sky Blue into a soft Lavender.
- **Glassmorphism:** Use semi-transparent White (#FFFFFFBA) with a heavy backdrop blur (20px+) for cards.
- **State Colors:** Emerald Green for "Correct" answers and Light Red for "Try Again" states, both rendered with high saturation to remain playful.

## Typography

Typography must be bold and highly legible to accommodate Arabic-first (RTL) layouts. For the Arabic implementation, select a typeface with an open counter and harmonious weight to **Be Vietnam Pro**.

**Key Principles:**
- **RTL-First:** All typography levels are optimized for Right-to-Left reading. Ensure line-heights are generous (1.4x+) to prevent Arabic diacritics from overlapping.
- **Emphasis:** Use the ExtraBold weight for headlines to mimic game-title aesthetics. 
- **Scale:** Body text is intentionally larger (18px default) to reduce eye strain and make the interface feel "friendly" and "big."

## Layout & Spacing

This design system uses a **Fluid Content Model** with generous safe zones. 

**Layout Rules:**
- **Mobile (Primary):** A single-column layout with a fixed bottom "Action Bar." Content cards should have horizontal margins of 24px.
- **Desktop (Companion):** A centered container (max-width 1024px) with a persistent sidebar on the right side (following RTL flow).
- **Rhythm:** Use "Bouncy Spacing"—larger vertical gaps between sections (32px+) to give elements room to breathe and appear as distinct "game levels."

## Elevation & Depth

Depth is not achieved through traditional gray shadows, but through **Color-Tinted Glows** and **3D Extrusion**.

- **The "Bouncy" Shadow:** Instead of a centered blur, use a drop shadow with 0px horizontal, 8px vertical offset, 0px blur, and a darker version of the element’s color (e.g., a Royal Blue button has a Dark Blue shadow) to create a 3D "thick button" effect.
- **Glass Layers:** Use a white inner-border (1px, 30% opacity) on glassmorphic cards to create a "shimmer" effect on the edges.
- **Active Elevation:** When pressed, elements should translate 4px downward on the Y-axis, "hiding" their 3D extrusion to simulate a physical press.

## Shapes

The shape language is ultra-rounded and organic.
- **Standard Radius:** 16px (rounded-md).
- **Container Radius:** 24px to 32px (rounded-xl) for main content cards.
- **Interactive Elements:** Use pill-shapes (full rounding) for buttons, progress bars, and chips to maximize the "friendly" and "safe" feel for children.
- **Visual Interest:** Occasionally break the perfect rounding with subtle "squircle" paths for high-level UI containers.

## Components

### Buttons (The "Bouncy" Button)
Primary buttons are high-contrast (Gold or Royal Blue) with a 3-layer stack: a bottom "shadow" layer for 3D depth, a middle color layer, and a top "shine" gradient. On tap, the button shrinks by 5% and moves down.

### Glassmorphic Cards
Used for lesson modules. Background is a white semi-transparent blur. Each card features a glowing 2px border using a brand-colored gradient (e.g., Sky Blue to Emerald).

### XP Progress Bars
The track is a dark, recessed version of the background. The fill is a vibrant gradient (Emerald Green to Lime) with a "bubble" highlight at the lead edge. Animate the fill using a `spring(1, 80, 10)` motion.

### Navigation Bars
- **Mobile Bottom Nav:** Large, floating icons. The active state should feature the icon "jumping" slightly above the bar line with a glowing aura underneath.
- **RTL Orientation:** Ensure the home icon is on the right and the progression/profile is on the left.

### Input Fields
Extra-large touch targets. Focused states use a thick 3px Gold border. Labels are always positioned above the input in bold `label-lg` style.

### Micro-Interactions
Every "success" action (completing a quiz, gaining XP) should trigger a confetti burst or a gentle screen shake to reinforce the game-like nature of the experience.