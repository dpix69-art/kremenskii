Looking at your uploaded specifications for the minimal editorial website for an artist, I'll provide comprehensive design guidelines that respect your detailed requirements.

## Design Approach
**Reference-Based Approach**: Drawing inspiration from high-end gallery and artist portfolio sites like those of contemporary art galleries and museum websites, emphasizing clean typography and sophisticated layout systems.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 20 8% 15% (charcoal black for text and headers)
- Secondary: 0 0% 45% (medium gray for body text)
- Background: 0 0% 98% (off-white)
- Accent: 210 15% 85% (subtle blue-gray for links)

**Dark Mode:**
- Primary: 0 0% 95% (off-white for text)
- Secondary: 0 0% 70% (light gray for body text)  
- Background: 20 8% 8% (deep charcoal)
- Accent: 210 20% 60% (muted blue for links)

### B. Typography
- **Primary**: Inter or similar modern sans-serif via Google Fonts
- **Display**: Playfair Display for gallery titles and headers
- **Body**: 16px base, 1.6 line height
- **Headers**: Progressive scale (h1: 2.5rem, h2: 2rem, h3: 1.5rem)

### C. Layout System
**Tailwind Spacing Primitives**: Consistent use of 4, 8, 12, and 16 units
- Micro spacing: p-4, m-4
- Component spacing: p-8, gap-8
- Section spacing: py-12, my-16
- Page margins: px-4 (mobile), px-8 (desktop)

### D. Component Library
**Navigation**: Minimal header with logo/name and hamburger menu, full-screen overlay menu
**Gallery Grid**: Masonry-style layout with 2-3 columns, hover states with subtle opacity changes
**Sound Projects**: Embedded audio players with custom styling, waveform visualizations
**Typography Blocks**: Large quote sections, editorial-style paragraph layouts
**Image Displays**: Full-bleed hero images, lightbox modals for gallery viewing
**Forms**: Minimal contact forms with clean input styling

### E. Visual Treatment
**Minimal Aesthetic**: Abundant whitespace, clean lines, focus on content
**Image Presentation**: High-contrast, full-quality display with subtle shadows
**Interactive Elements**: Subtle hover states, smooth transitions (300ms)
**Grid Systems**: Flexible CSS Grid layouts, responsive breakpoints

## Images Section
**Hero Image**: Large, full-viewport hero image on homepage showcasing primary artwork
**Gallery Images**: High-resolution artwork images in various aspect ratios
**Process Documentation**: Behind-the-scenes studio photography
**Portrait**: Professional artist headshot for about section

**Image Placement**:
- Homepage: Single impactful hero image
- Gallery pages: Grid-based artwork displays
- About page: Artist portrait and studio images
- Individual work pages: Multiple angles and detail shots

**Technical Requirements**: 
- Variant="outline" buttons on hero images with blurred backgrounds
- No custom hover/active states for buttons (built-in states preferred)
- Lazy loading for gallery images
- Progressive image enhancement

## Accessibility & Performance
- Consistent dark mode across all components
- High contrast ratios maintained
- Semantic HTML structure
- Optimized image delivery
- Screen reader friendly navigation

This design system creates a sophisticated, gallery-quality presentation that honors the artistic content while maintaining excellent usability and modern web standards.