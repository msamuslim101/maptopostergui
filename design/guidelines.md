 MASTER DESIGN BRIEF FOR MAPTOPOSTER WINDOWS DESKTOP APP
Copy this entire prompt and send it to your designer. It contains everything they need.

📋 PROJECT BRIEF
Project Name: MapToPoster Desktop
Deliverable: UI/UX Design for Windows Desktop Application (.exe)
Timeline: [Your timeline]
Designer Role: Create high-fidelity mockups/prototypes for a full-screen Windows desktop app

🎯 WHAT WE'RE BUILDING
Product: A Windows desktop application that generates artistic city map posters from OpenStreetMap data.
Core Function:

User enters a city name (e.g., "Patna, India")
User selects a visual theme (e.g., "Noir", "Blueprint", "Warm Beige")
App generates a high-resolution artistic map poster
User exports as PNG (300 DPI, print-ready)

Current State: Working Python CLI tool (command-line only)
Goal: Wrap it in a beautiful, user-friendly desktop interface

👤 TARGET AUDIENCE

Primary Users: Design enthusiasts, home decorators, gift shoppers
Tech Level: Non-technical (should feel like Canva, not Photoshop)
Age Range: 25-45
Use Case: Creating custom map art for their home, office, or as gifts
Key Need: Simple, fast, beautiful results with minimal learning curve


🎨 DESIGN REQUIREMENTS
1. VISUAL STYLE
Aesthetic Direction:

✅ Minimalist and clean (think Notion, Figma, Linear)
✅ Dark-first design (primary theme should be dark mode)
✅ Modern Windows 11 aesthetic (rounded corners, subtle shadows, glassmorphism)
✅ Premium feel (this creates art, not documents)
❌ No cluttered toolbars or menus
❌ No corporate/enterprise vibes
❌ No colorful/playful aesthetics (keep it sophisticated)

Color Palette:

Background: Deep dark grays (#1a1a1a, #2a2a2a)
Accent: Choose ONE sophisticated accent color (suggest: electric blue, emerald, or warm amber)
Text: High contrast whites/light grays
Cards/Panels: Elevated surfaces with subtle borders

Typography:

Primary: Modern sans-serif (Inter, SF Pro, Segoe UI Variable)
Weights: Regular (400), Medium (500), Semibold (600)
Avoid decorative fonts


2. LAYOUT STRUCTURE
Window Type: Full-screen, frameless (chromeless) window
Required Layout: 3-Column Design
┌────────────────────────────────────────────────────────────┐
│ [CUSTOM TITLE BAR - Draggable Area]      [—] [□] [✕]      │
├─────────────┬──────────────────────┬──────────────────────┤
│             │                      │                      │
│   LEFT      │      CENTER          │      RIGHT           │
│   SIDEBAR   │      CANVAS          │      PANEL           │
│             │                      │                      │
│   260px     │      Flexible        │      320px           │
│             │                      │                      │
└─────────────┴──────────────────────┴──────────────────────┘
Column Breakdown:
LEFT SIDEBAR (260px fixed):

App logo/name at top
City search input
Theme selector (17 themes as cards/tiles)
Additional style options (optional toggles)
Footer with version/help

CENTER CANVAS (flexible width):

Large preview area showing the generated map
Zoom controls (+ / - buttons or slider)
Pan/drag indicators when hovering
Loading state when generating
Empty state when no map loaded

RIGHT PANEL (320px fixed):

Export settings:

Filename input
Resolution selector (dropdown)
Format selector (PNG only for now)
Paper size presets (A4, A3, 18x24", etc.)


"Export Poster" primary button (large, prominent)
Map statistics (city name, area covered, etc.)
Quick actions (save project, share, etc.)


3. KEY SCREENS TO DESIGN
Please provide high-fidelity mockups for these screens:
Screen 1: Empty State (First Launch)

3-column layout visible
Center canvas shows friendly empty state:

Icon (map pin or location marker)
Heading: "Create Your First Map Poster"
Subtext: "Enter a city name to get started"
Visual pointer to the search box on left


Left sidebar: Search input is highlighted/focused
Right panel: Disabled/grayed out export options

Screen 2: Loading State

User has searched for "Patna, India"
Center canvas shows:

Animated loading indicator (spinner or skeleton)
Text: "Generating your map..." or "Fetching map data..."
Optional: Progress indication if possible


Left sidebar: Theme already selected (e.g., "Noir" theme highlighted)
Right panel: Still disabled

Screen 3: Active/Preview State (Primary Screen)

Center canvas: Beautiful map poster preview (use placeholder map image)
Left sidebar: One theme actively selected (highlighted state)
Right panel: All options enabled and interactive
Zoom controls visible on canvas
This is the MAIN screen users will spend time on

Screen 4: Export Modal/Overlay

Triggered when user clicks "Export Poster"
Modal overlay showing:

Export progress (if real-time)
OR success confirmation with:

Checkmark icon
"Poster Exported Successfully!"
File location path
"Open Folder" and "Create Another" buttons





Screen 5 (Optional): Settings/Preferences

If accessed via gear icon in title bar
Simple modal with:

Default resolution
Default save location
Theme preference (dark/light - though we're dark-first)
About section (version, credits, GitHub link)




4. COMPONENT SPECIFICATIONS
Title Bar (Custom)

Height: 40px
Draggable area (user can click and drag to move window)
Left side: App name "MapToPoster" + small logo icon
Right side: Standard Windows controls (— □ ✕)
Background: Same as app background or slightly elevated

Search Input (City)

Width: Full width of left sidebar minus padding
Height: 44px
Placeholder: "Enter city name (e.g., Paris, Tokyo)"
Icon: Search/magnifying glass on left
Style: Rounded corners (8px), subtle border
States: Default, focused (accent color border), error (red border)

Theme Selector Cards

Grid: 2 columns in left sidebar
Each card:

Aspect ratio: 16:9 or square
Shows theme color palette preview (3-5 color swatches)
Theme name below
Hover state: Subtle elevation/glow
Selected state: Border in accent color + checkmark icon


Scrollable if more than 8 themes visible

Export Button (Primary CTA)

Width: Full width of right panel minus padding
Height: 52px
Text: "Export Poster" with export icon
Style: Solid accent color, high contrast text
States:

Default (enabled): Full accent color
Hover: Slightly lighter/elevated
Disabled: Grayed out, low opacity
Loading: Shows spinner inside button



Zoom Controls

Position: Bottom-right of center canvas (floating)
Style: Small circular buttons or vertical pill
Buttons: [−] [Reset] [+]
Semi-transparent background with backdrop blur


5. INTERACTIONS & ANIMATIONS
Please indicate these in your mockups or prototype:

Hover States: All buttons, cards, and clickable elements
Focus States: Form inputs show accent color border
Loading Transitions: Smooth fade between empty → loading → preview states
Theme Selection: Instant visual feedback (scale up slightly + border)
Export Button: Ripple effect or subtle scale animation on click
Modal Animations: Fade in overlay + slide up content (300ms ease-out)

Keep animations: Subtle, fast (200-400ms), and purposeful

6. TECHNICAL CONSTRAINTS
Must Know:

This will be built with React (web technologies) inside a Windows .exe
Window will be chromeless (we control the entire frame)
Minimum window size: 1280x720px
Optimal size: 1440x900px or 1920x1080px
The app runs 100% locally (offline after first launch)
No need for responsive mobile views (desktop only)

Assets Needed:

App icon (.ico for Windows, 256x256px)
Empty state illustrations (SVG preferred)
Loading animations (Lottie JSON or CSS-based)
All icons (use a consistent icon set like Lucide, Heroicons, or Feather)


7. EXISTING THEMES (For Reference)
The app has 17 pre-built color themes. Here are a few examples:

Noir - Black background, white streets
Blueprint - Blue background, white lines (architectural style)
Warm Beige - Cream/beige tones, brown streets
Copper Patina - Green/teal oxidized metal look
Sunset - Warm oranges/purples
Ocean - Deep blues and aqua
Forest - Greens and earth tones

Designer Action: Create theme preview cards that visually represent these palettes (use color swatches or abstract map patterns)

8. INSPIRATION REFERENCES
Apps to Study:

Layout: Mapbox Studio (3-panel workspace), Figma (properties panel)
Aesthetics: Notion (clean, minimal), Linear (dark UI done right)
Export Flow: Canva (simple and friendly)
Theme Selector: VS Code theme picker

Design Galleries:

Dribbble: Search "desktop app dark" or "creative tool UI"
Behance: Search "Windows application design"


9. DELIVERABLES CHECKLIST
Please provide:

 High-fidelity mockups for all 5 screens (Figma, Sketch, or Adobe XD)
 Design system/style guide:

 Color palette (with hex codes)
 Typography scale (font sizes, weights, line heights)
 Spacing system (8px grid recommended)
 Component library (buttons, inputs, cards, etc.)


 Interactive prototype (clickable flows between screens)
 Icon set (exported as SVGs)
 App icon (Windows .ico format)
 Export assets (at 1x, 2x for high-DPI displays)
 Annotations/notes on interactions and micro-animations

File Format: Figma preferred (easiest for developer handoff)

10. OPEN QUESTIONS FOR DESIGNER
Please propose solutions for:

Onboarding: Should we show a quick tutorial on first launch? (Optional)
Themes: Grid view vs. list view? Horizontal scroll vs. vertical?
Advanced Options: If we add style customization later (colors, line widths), where should it live?
Branding: Should we design a logo or use text-only wordmark?
Error States: How should we handle errors (city not found, export failed)?


📞 CONTACT & COLLABORATION
Project Manager: [Your Name]
Questions: [Your Email/Slack/Discord]
Deadline: [Date]
Check-ins: [Weekly? Bi-weekly?]
Preferred Communication:

Share work-in-progress via [Figma links / Screenshots]
Feedback rounds: [How many iterations?]


✅ SUCCESS CRITERIA
This design will be successful if:

✅ A non-technical user can create a map poster in under 2 minutes
✅ The interface feels premium and professional (not like a free tool)
✅ The theme selection is visually clear and inspiring
✅ The export process is dead simple (one button, clear feedback)
✅ The design is developer-friendly (clear specs, organized components)


🎨 DESIGN PHILOSOPHY (TL;DR)

"Make it feel like a professional creative tool (Figma, Notion, Linear) but as simple to use as Canva. Dark, minimal, and beautiful. Every pixel should serve a purpose."


📎 ATTACHMENTS
Please also provide to your designer:

Sample Map Images (screenshots of the CLI output)

Include all 17 theme examples if possible
Use these as placeholders in mockups


GitHub Repository (optional, for technical context)

https://github.com/originalankur/maptoposter


Brand Assets (if you have any)

Logo, colors, fonts you want to keep




🚀 FINAL NOTES

Budget: [Your budget]
Timeline: [Your deadline]
Inspiration Board: [Create a Pinterest/Figma board with references if possible]

Good luck! Excited to see what you create! 🎨

END OF BRIEF