# Art Direction — Bloomday Garden App

> This skill is for building garden view components and plant SVGs only.
> Load when working on: garden view, plant components, animations, visual polish.

## Visual Style: Watercolor Hand-Painted

### Color Palette
```
Background:     #FDF8F0 (warm cream paper)
Text primary:   #4A3D2E (warm dark brown)
Text secondary: #8B7E6A (muted olive)
Accent green:   #7A9B4A (stems, leaves)
Light green:    #C0DD97 (leaf highlights)
Water blue:     #85B7EB (watering, rain)
Bloom pink:     #E8A0B4 (rose, flowers)
Sunflower gold: #FAC775 (sunflower, warm accents)
Herb green:     #97C459 (herbs, fresh growth)
Lavender:       #AFA9EC (creative category)
Fern:           #6B8C3F (study category)
Wilt coral:     #D85A30 (overdue tasks)
```

## Plant SVG Rules

### Construction method
- Plants are built from SIMPLE SVG primitives: `<ellipse>`, `<circle>`, `<line>`, `<path>`
- Max 6 path segments per plant part
- Use overlapping semi-transparent shapes for watercolor depth
- All shapes use `opacity="0.4"` to `opacity="0.7"` — never fully opaque
- Stems: `<line>` with `stroke-linecap="round"` and stroke-width 2-3px
- Leaves: `<ellipse>` rotated with `transform="rotate(...)"`
- Flowers: clusters of `<circle>` elements at different opacities

### Plant species (by task category)
| Category | Plant     | Flower color      | Leaf style       |
|----------|-----------|-------------------|------------------|
| Work     | Sunflower | #FAC775 gold      | Wide, bold       |
| Study    | Fern      | #6B8C3F (no bloom)| Long, feathery   |
| Health   | Herb      | #97C459 green     | Small, rounded   |
| Personal | Rose      | #E8A0B4 pink      | Oval, classic    |
| Creative | Lavender  | #AFA9EC purple    | Narrow, upright  |

### Growth stages (3 per species)
1. **Seed** — small mound of dirt + tiny dot
   - Height: ~20px, just a small bump
2. **Sprout** — stem + 1-2 small leaves, no flower
   - Height: ~50px, stem visible, leaves emerging
3. **Bloom** — full stem + leaves + flower/foliage
   - Easy: ~60px, simple flower
   - Medium: ~90px, fuller plant
   - Hard: ~120px, elaborate multi-bloom

### SVG component example (Rose, bloom stage)
```svg
<g class="plant-rose-bloom" transform="translate(0, 0)">
  <!-- Stem -->
  <line x1="0" y1="0" x2="0" y2="80" stroke="#7A9B4A" stroke-width="3" stroke-linecap="round"/>
  <!-- Leaves -->
  <ellipse cx="-8" cy="30" rx="10" ry="14" fill="#8FB85A" opacity="0.6" transform="rotate(-20 -8 30)"/>
  <ellipse cx="8" cy="45" rx="9" ry="12" fill="#A3C76E" opacity="0.5" transform="rotate(15 8 45)"/>
  <!-- Flower petals (overlapping circles) -->
  <circle cx="0" cy="-5" r="11" fill="#E8A0B4" opacity="0.6"/>
  <circle cx="-7" cy="2" r="8" fill="#EDaFBF" opacity="0.5"/>
  <circle cx="7" cy="2" r="8" fill="#E8A0B4" opacity="0.55"/>
  <circle cx="0" cy="-12" r="7" fill="#F4C0D1" opacity="0.45"/>
  <!-- Center -->
  <circle cx="0" cy="-3" r="3" fill="#FAC775" opacity="0.7"/>
</g>
```

### Animation guidelines
- Growth during pomodoro: use Framer Motion to interpolate between stages
  - Stem height: `animate={{ height }}` with spring transition
  - Leaves: `animate={{ scale, opacity }}` with staggered delay
  - Flower: `animate={{ scale: [0, 1.1, 1], opacity: [0, 1] }}`
- Bloom celebration: brief scale overshoot (1.0 → 1.15 → 1.0) + particle burst
- Easing: `transition={{ type: "spring", damping: 12, stiffness: 100 }}`
- Duration: growth over 25min pomodoro mapped to visual progress (not instant)

## Background Assets

### File locations
```
src/assets/
  backgrounds/       ← AI-generated garden backgrounds (PNG/WebP)
    windowsill.webp
    balcony.webp
    backyard.webp
    garden.webp
    estate.webp
    botanical.webp
  textures/           ← Purchased watercolor texture pack
    paper-bg.webp     ← Tileable cream paper (app background)
    wash-01.png       ← Watercolor wash overlays
    wash-02.png
    splatter-01.png   ← Paint splatter accents
  audio/              ← BGM (V1.5, not needed yet)
```

### Background usage
- App background: `paper-bg.webp` tiled via CSS `background-repeat`
- Garden view: level-specific background image, positioned behind SVG plant layer
- Watercolor washes: overlay on cards and panels with `mix-blend-mode: multiply` and low opacity

## Weather Overlays (Mood-based)

All pure SVG/CSS, no images needed:
- **Sunny (mood 4)**: soft yellow radial gradient circle, top-right
- **Rainbow (mood 5)**: SVG arc with 5 color stops, subtle opacity
- **Cloudy (mood 3)**: 2-3 soft gray ellipses drifting slowly (CSS animation)
- **Rainy (mood 2)**: animated SVG lines falling, blue-gray overlay
- **Stormy (mood 1)**: darker overlay + rain + occasional flash (opacity pulse)
