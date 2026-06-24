---
name: Vibrant Faith Explorer
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424754'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#006947'
  on-tertiary: '#ffffff'
  tertiary-container: '#00855b'
  on-tertiary-container: '#f5fff6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  button-text:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
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
  margin-desktop: 40px
  container-max: 1200px
---

## Brand & Style

The design system is centered on "Joyful Exploration." It transforms a traditional Sunday School curriculum into a gamified journey that feels like a modern mobile game rather than a textbook. The brand personality is encouraging, energetic, and safe, aiming to foster a sense of accomplishment in children aged 10-12 while providing instructors with a structured, reliable environment.

The style is **Playful Modernism**. It borrows the clean, functional layouts of high-end SaaS but injects "squishy" tactile elements, high-energy colors, and character-driven cues. Every interaction is designed to feel like a reward, using soft depth and friendly geometry to reduce the friction of learning.

## Colors

The palette is rooted in high-chroma, "actionable" colors that signal different types of progress and feedback:

*   **Primary (Blue):** Navigation, core actions, and trust-building elements.
*   **Secondary (Gold):** Achievements, XP, "streak" indicators, and premium rewards.
*   **Tertiary (Green):** Correct answers, completion states, and "Go" actions.
*   **Accent (Orange):** Alerts, active lessons, and urgent notifications.

The background uses a soft neutral tint (`#F8FAFC`) to prevent screen fatigue and allow the vibrant card components to pop. Surface colors should remain white (`#FFFFFF`) to maintain high contrast for legibility.

## Typography

This design system utilizes **Inter** exclusively to ensure maximum readability and a clean, systematic feel. To inject personality, the system relies on extreme weight contrast. 

Headlines are always **Bold** or **Extra Bold** to create a sense of fun and impact. Body text uses Medium weights to ensure it stands out against colorful backgrounds. All "Label" roles use uppercase with slight tracking to provide a professional, organized structure for instructors while remaining legible for children.

## Layout & Spacing

The layout uses a **Fluid-Fixed Hybrid** model. For children, content is delivered in a single-column "Feed" or "Path" style (similar to a game map). For instructors, a 12-column grid is used for data-heavy management screens.

*   **Rhythm:** An 8px base grid ensures consistent alignment.
*   **Safe Areas:** Large internal padding (minimum 24px) within cards prevents the UI from feeling cramped.
*   **Adaptive Behavior:** On mobile, margins shrink to 16px, and multi-column card layouts reflow into a vertical stack to keep touch targets large.

## Elevation & Depth

To achieve the "tactile" feel requested, this design system avoids harsh, flat shapes in favor of **Ambient Soft Shadows** and **Tonal Offsets**.

1.  **Level 0 (Background):** Solid neutral hex.
2.  **Level 1 (Cards):** White surfaces with a soft, 12% opacity shadow (Y: 4px, Blur: 12px) tinted with the Primary Blue color.
3.  **Level 2 (Interactive):** Elements like buttons use a "2.5D" effect—a thicker bottom border (4px) in a darker shade of the button's color to simulate a physical push-button.
4.  **Transitions:** When hovered or pressed, elements should "sink" by reducing the bottom border thickness and shifting 2px downward.

## Shapes

The shape language is defined by **Extreme Roundedness**. Standard containers use a `1rem` (16px) radius, while featured "Lesson Cards" and "Action Buttons" use `1.5rem` (24px) or `rounded-2xl`. 

This lack of sharp corners removes visual "aggression" and makes the interface feel safe and approachable. Progress bars and badges should always use fully rounded (pill-shaped) ends.

## Components

### Buttons & Inputs
*   **Action Buttons:** Large (min height 56px), bold typography, with a 4px "3D" bottom shadow. Primary actions are Blue; "Finish" actions are Green.
*   **Input Fields:** Thick 2px borders in a soft neutral-gray, turning Primary Blue on focus. Labels are always positioned above the field for clarity.

### Progress & Gamification
*   **XP Bars:** Thick, pill-shaped tracks with a light gray background. The fill should be a gradient of the Primary or Secondary color, featuring a subtle "shine" overlay.
*   **Badge Icons:** Circular containers with a Gold (#F59E0B) border and a centered illustrative icon.

### Cards & Lists
*   **Lesson Cards:** Large white surfaces with 24px padding. They must include a "Header" area for a playful illustration or icon.
*   **Task Lists:** Interactive rows with large checkboxes. Completion of a row should trigger a strike-through and a change in row background to light green.

### Character Bubbles
*   Use "speech bubble" containers for instructor tips or character-led encouragement, featuring a small triangle pointer at the bottom left or right.