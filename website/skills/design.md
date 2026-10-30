Build the top of a **design-team showcase site** for a fintech company, recreating the look and feel of ramp.design. Include only three sections: a **3D floating-card carousel hero**, an **"Our work" bento grid** of live micro-demos, and a row of **large showcase tiles** (an illustration and a product launch). Use React or vanilla JS with Three.js (or CSS 3D) for the cards. Make it responsive (mobile → 1440px) and respect `prefers-reduced-motion`. Use a placeholder company name and your own artwork.

## Visual language

- **Feel:** a gallery-white, playful, crafted design-team portfolio. A huge, light-weight grotesk, a single acid-yellow accent, very rounded tiles, and lots of moving 3D and micro-interactions inside the tiles.
- **Colours:**
  - page `#FFFFFF` with a very soft grey radial vignette
  - tiles `#FFFFFF` with a `#EDEDED` hairline, or a soft grey gradient
  - paper `#F2EFE5` / `#E9E5D9`
  - ink `#0C0A08`
  - body text `rgba(12,10,8,.66)`
  - muted wordmark `rgba(0,0,0,.25)`
  - accent "solar" yellow `#E4F222`
  - secondary blue `#5683D2`
  - mint `#DCEBE5`
  - dark tiles `#050008` / `#11130F`
  - lines `rgba(17,19,15,.16)`
- **Font:** "TWK Lausanne" (fallback "Inter Tight" / "Neue Haas Grotesk"), mostly at **weight 300**.
  - Section H2s are huge: 96–102px with line-height about 0.86 and tracking -0.015 to -0.045em.
  - The wordmark is 50px/300 with **letter-spaced characters** ("r a m p . d e s i g n").
  - Body 15px/1.42 with tracking -0.012em; nav 13px.
- **Radii:** tiles **40px**, buttons 999px.
- **Shadows:** none. Depth comes from 3D renders and soft gradients.
- **Spacing:** edge padding `clamp(16px, 3.4vw, 46px)` and a 16px tile gap.

## Section 1 — Hero: floating card carousel

- **Nav** (fixed, transparent):
  - Left: a small black brand glyph (a slanted "ramp" bird mark), then the text links "Home" (active, ink) and "Work", "Fun" and "Philosophy" (13px, 66% ink).
  - Right: a white outlined pill "Blog" (1px `#EDEDED`) and an **acid-yellow pill "Apply now ↗"** (`#E4F222`, ink text, 40px; the large version is 80px tall with 24px text and 35px padding).
- **Card carousel:** a slow, continuous horizontal parade of **photoreal 3D credit cards** floating across the viewport, each tilted in perspective (`rotateY` ±25°, `rotateX` 6°) and passing from right to left. The cards are about 420 × 270px with 24px radius:
  - a **black "infinity tunnel" card**: concentric neon-yellow glowing rectangles receding inward like an infinite mirror, with a gold EMV chip
  - a **frosted ice-blue card** with a silver "RAMP" plate, a giant handwritten black signature, and stickers (a laughing cat with headphones, pink checkered shards, a yellow lightning bolt)
  - a **sky-blue sticker card** with a surfboard, a palm tree, waves and a lemon
  - a **film-photo card** (a grainy greyscale landscape)
- **Interaction:** cards have subtle reflections and tilt toward the cursor, and the parade speeds up slightly on scroll.
- **Wordmark:** bottom-left, "[brand].design" in 32px/300 at 25% ink.

## Section 2 — "Our work" bento grid

- **Heading:** the H2 "Our work" in 102px/300 ink, left-aligned. It scrolls in, then pins briefly while the grid passes.
- **Grid:** a 2-column bento with a 16px gap. Tiles have a 40px radius, a white-to-`#F7F7F7` gradient fill and a 1px hairline. Each tile holds **one live micro-demo, centered**, with lots of empty space:
  - **Card stack:** the hero cards in mini, rotating slowly in 3D.
  - **Dot motion:** an almost empty tile with two black dots that orbit and bounce, like a loading physics toy.
  - **Coin:** a small glossy green coin that spins and flips.
  - **Budget gauge:** a semicircle progress ring (green → lime gradient stroke) reading "68% / Budget consumed", with a tiny annotation "68% of this month's budget has been spent". The ring animates from 0 on enter.
  - **Typography tile:** big "150 / 150" numerals with a yellow blob, a dotted arc, and a woven paper texture block.
  - **Per-diem UI:** stacked rounded cards: "Upcoming travel — Newark → San Francisco · Confirmed · Mon Aug 6 · Round trip", then "San Francisco · Per diem — **$49.56 left** / $100.00/day" (green bar) and "**$14.56 over**" (orange text and bar).
- **Entrance:** tiles fade and scale in (0.96 → 1) as they enter.

## Section 3 — Large showcase tiles

- **Full-width tile** (40px radius, about 560px tall): a dense **isometric pixel-art illustration of a busy open-plan office**, with hundreds of tiny people in dark suits at desks, plants and teal carpet. A giant **acid-yellow numeral "3"** is overlaid in the centre. The illustration slowly pans.
- **Two-up row below:**
  - **Left (40%):** a dark moody photo tile of a person at a desk, overlaid with a frosted card-control UI ("Short Sides Lunch", a progress bar "$12.00 / $125.00 Monthly", buttons "Swap Ramp card" and a green "Confirm").
  - **Right (60%):** a **product-launch poster tile** on a pale lime gradient (`#F7FAD0` → white) with horizontal speed-line streaks. It reads "Introducing" (20px), then a massive "**Stack**" (about 200px/400, ink, tracking -0.05em), then "by [brand] ✓".

## Do / Don't

- **Do:** use a gallery-white page, a huge weight-300 grotesk with tight leading, one acid-yellow accent, 40px rounded tiles, photoreal 3D cards, live micro-demos inside tiles, and playful stickers and illustration.
- **Don't:** use heavy weights, dark-mode chrome, drop shadows, dense text, or multiple accent colours. Keep the copy minimal and let the work fill the tiles.