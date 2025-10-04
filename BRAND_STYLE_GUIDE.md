# Behavior School Brand Style Guide

> **Complete design system documentation for consistent brand implementation across all pages**

---

## Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Component Patterns](#component-patterns)
5. [Animation & Motion](#animation--motion)
6. [Accessibility Guidelines](#accessibility-guidelines)

---

## Color System

### Primary Brand Colors

#### Emerald (Primary Brand Color)
- **emerald-50**: `#ecfdf5` - Very light background tints
- **emerald-100**: `#d1fae5` - Light backgrounds
- **emerald-500**: `#10b981` - Accent elements
- **emerald-600**: `#047857` - Primary buttons, links (WCAG AA compliant with white)
- **emerald-700**: `#065f46` - Hover states, dark text (WCAG AAA compliant)
- **emerald-800**: `#022c22` - Very dark accents

**Usage:**
- Primary CTAs: `bg-gradient-to-r from-emerald-600 to-emerald-700`
- Hover: `hover:from-emerald-700 hover:to-emerald-800`
- Links: `text-emerald-700 hover:text-emerald-800`
- Icons: `text-emerald-600`

#### Slate (Text & Neutrals)
- **slate-50**: `#f8fafc` - Very light backgrounds
- **slate-100**: `#f1f5f9` - Light section backgrounds
- **slate-600**: `#475569` - Secondary text
- **slate-700**: `#334155` - Body text
- **slate-800**: `#0f172a` - Dark headings (WCAG AAA)
- **slate-900**: `#020617` - Primary headings

**Usage:**
- H1-H2: `text-slate-900`
- H3-H4: `text-slate-800`
- Body: `text-slate-700`
- Secondary: `text-slate-600`

### Brand-Specific Colors

#### Behavior School Brand
- **bs-primary**: `#1E3A34` - Chalkboard green (specialized use)
- **bs-accent**: `#E3B23C` - Vintage golden (badges, highlights)
- **bs-background**: `#FAF3E0` - Cream paper (body background)
- **bs-section-odd**: `#F8F4E9` - Warm beige (alternating sections)
- **bs-section-even**: `#FFFFFF` - Pure white (alternating sections)

**Usage:**
- Body: `bg-bs-background` or `bg-[var(--bs-background,#FAF3E0)]`
- Alternating sections: `bg-bs-section-odd` / `bg-bs-section-even`

### Supporting Colors

#### Red (Urgency/CTA)
- **red-500**: `#ef4444` - Urgent CTAs
- **red-600**: `#dc2626` - Primary urgent buttons
- **red-700**: `#b91c1c` - Hover states

#### Blue (Trust/Information)
- **blue-500**: `#3b82f6` - Info elements
- **blue-600**: `#2563eb` - Secondary CTAs
- **blue-700**: `#1d4ed8` - Hover states

#### Orange (Warning/Highlight)
- **orange-500**: `#f97316` - Highlight elements
- **orange-600**: `#ea580c` - Warning CTAs

---

## Typography

### Font Families
- **Primary**: System font stack (Inter-like rendering)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto

### Heading Scale

#### Display Headings (Hero sections)
```tsx
className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
// or with gradient:
className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent"
```

#### H1 - Primary Headings
```tsx
className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight"
// Alternative with tighter leading:
className="text-4xl/tight sm:text-5xl/tight md:text-6xl/tight lg:text-7xl/tight font-extrabold text-slate-900 tracking-tight"
```

#### H2 - Section Headings
```tsx
className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
// Secondary variant:
className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-4"
```

#### H3 - Subsection Headings
```tsx
className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4"
// Card headings:
className="text-xl font-bold text-slate-900 mb-3"
```

#### H4 - Component Headings
```tsx
className="text-lg font-semibold text-slate-900 mb-2"
```

### Body Text

#### Large Body
```tsx
className="text-xl text-slate-600 leading-relaxed"
// For emphasis:
className="text-xl sm:text-2xl text-slate-600 leading-relaxed"
```

#### Standard Body
```tsx
className="text-base sm:text-lg text-slate-700 leading-relaxed"
// Compact:
className="text-base text-slate-600"
```

#### Small/Secondary Text
```tsx
className="text-sm text-slate-600"
// Very small:
className="text-xs text-slate-500"
```

### Font Weights
- **font-bold**: 700 - Headings, important text
- **font-semibold**: 600 - Subheadings, emphasis
- **font-medium**: 500 - Buttons, labels
- **font-normal**: 400 - Body text

### Line Heights
- **leading-tight**: 1.25 - Large headings
- **leading-snug**: 1.375 - Medium headings
- **leading-normal**: 1.5 - Standard text
- **leading-relaxed**: 1.625 - Body paragraphs

---

## Spacing & Layout

### Container System

#### Max-Width Container
```tsx
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
// Narrower for content:
className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
// Wide for grids:
className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
```

### Section Spacing

#### Standard Section Padding
```tsx
className="py-16 lg:py-20"
// With background:
className="py-16 lg:py-20 bg-white"
className="py-16 lg:py-20 bg-slate-50"
```

#### Hero Sections
```tsx
className="pt-20 md:pt-28 pb-16"
// or
className="relative py-16 lg:py-24 overflow-hidden"
```

#### Compact Sections
```tsx
className="py-12 sm:py-16"
```

### Responsive Spacing Scale

#### Vertical Spacing
- **mb-2**: 0.5rem (8px)
- **mb-4**: 1rem (16px)
- **mb-6**: 1.5rem (24px)
- **mb-8**: 2rem (32px)
- **mb-12**: 3rem (48px)
- **mb-16**: 4rem (64px)

#### Gap Spacing (Grid/Flex)
```tsx
className="gap-4"      // 1rem - tight spacing
className="gap-6"      // 1.5rem - medium spacing
className="gap-8"      // 2rem - comfortable spacing
className="gap-12"     // 3rem - loose spacing
```

### Grid Patterns

#### Two-Column Responsive Grid
```tsx
className="grid md:grid-cols-2 gap-8 lg:gap-12"
// Hero layout:
className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
```

#### Three-Column Grid
```tsx
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
```

#### Four-Column Grid
```tsx
className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
```

---

## Component Patterns

### Button Styles

#### Primary CTA
```tsx
className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
// With icon:
<ArrowRight className="ml-2 h-5 w-5" />
```

#### Urgent/Limited Time CTA
```tsx
className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
```

#### Secondary Button
```tsx
className="inline-flex items-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
```

#### Outline Button
```tsx
className="inline-flex items-center px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
```

### Card Components

#### Feature Card
```tsx
<div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
  <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
    <Icon className="w-8 h-8 text-emerald-600" />
  </div>
  <h3 className="text-2xl font-semibold text-slate-900 mb-4 text-center">Title</h3>
  <p className="text-slate-600">Description</p>
</div>
```

#### Stats Card
```tsx
<div className="bg-slate-50 rounded-lg p-6 text-center">
  <div className="text-4xl font-bold text-slate-800 mb-2">54%</div>
  <div className="text-slate-600 text-sm font-medium">Label</div>
</div>
```

#### Interactive Card (Hover Effect)
```tsx
<div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
  {/* Content */}
</div>
```

### Badge/Pill Components

#### Primary Badge
```tsx
<span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
  <Star className="w-4 h-4 mr-2" />
  Badge Text
</span>
```

#### Alert/Urgent Badge
```tsx
<div className="bg-red-600 text-white rounded-full px-6 py-2 inline-block font-bold">
  🔥 LIMITED TIME OFFER
</div>
```

#### Status Badge
```tsx
<span className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
  Platform
</span>
```

### Link Styles

#### Standard Link
```tsx
<Link href="/" className="text-emerald-700 hover:text-emerald-800 font-semibold">
  Link Text
</Link>
```

#### Link with Icon
```tsx
<Link href="/" className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-semibold">
  Link Text
  <ArrowRight className="ml-2 h-4 w-4" />
</Link>
```

#### Underlined Link
```tsx
<Link href="/" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">
  Link Text
</Link>
```

---

## Animation & Motion

### Framer Motion Variants

#### Fade In Up
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};
```

#### Stagger Container
```tsx
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};
```

#### Standard Entry Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
>
```

#### Hover Effects
```tsx
<motion.div whileHover={{ y: -5 }}>
  {/* Card content */}
</motion.div>
```

### Transition Classes

#### Standard Transitions
```tsx
className="transition-all duration-300"
className="transition-colors duration-200"
className="transition-shadow duration-300"
```

#### Transform Transitions
```tsx
className="transform hover:-translate-y-1 transition-all duration-300"
className="transform hover:scale-105 transition-all duration-200"
```

---

## Accessibility Guidelines

### Color Contrast
- **Text on white**: Use slate-700 (7:1) or darker
- **Links on white**: Use emerald-700 (#065f46) - 7:1 ratio
- **Primary buttons**: emerald-600 background with white text - 4.5:1 ratio
- **All interactive elements**: Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large text**: Minimum 3:1 contrast ratio

### Focus States
```tsx
className="focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
```

### Touch Targets
- Minimum 44x44px for all interactive elements
```tsx
className="min-h-[44px] min-w-[44px]"
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Include alt text for all images
- Use semantic elements (nav, main, section, article)

### Screen Reader Support
```tsx
<button aria-label="Close popup">
  <X className="w-4 h-4" />
</button>
```

---

## Page Layout Templates

### Standard Page Structure
```tsx
<div className="min-h-screen bg-bs-background">
  {/* Breadcrumbs */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
    <Breadcrumbs items={[...]} />
  </div>

  {/* Hero Section */}
  <section className="relative py-16 lg:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Content */}
    </div>
  </section>

  {/* Alternating Sections */}
  <section className="py-16 lg:py-20 bg-white">...</section>
  <section className="py-16 lg:py-20 bg-slate-50">...</section>

  {/* CTA Section */}
  <section className="py-16 lg:py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">...</section>
</div>
```

---

## Implementation Checklist

### When Creating New Pages:
- [ ] Use `bg-bs-background` or `bg-[var(--bs-background)]` for body
- [ ] Alternate section backgrounds: white → slate-50 → white
- [ ] Use emerald-600/700 for primary CTAs
- [ ] Apply proper heading hierarchy (h1 → h2 → h3)
- [ ] Include responsive text sizing (text-4xl md:text-5xl lg:text-6xl)
- [ ] Add hover states to all interactive elements
- [ ] Ensure 4.5:1 minimum contrast ratio
- [ ] Include focus states with ring-2
- [ ] Use max-w-7xl container with responsive padding
- [ ] Apply consistent section spacing (py-16 lg:py-20)

### Component Reuse:
1. Copy button styles from bcba-exam-prep or transformation-program
2. Use feature card pattern from homepage
3. Apply FAQ accordion from bcba-exam-prep
4. Follow hero layout from transformation-program
5. Use stats display from bcba-study-tools

---

## Quick Reference

### Most Common Patterns

**Hero Heading:**
```tsx
<h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
  <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
    Highlighted Text
  </span>
</h1>
```

**Primary CTA:**
```tsx
<Link href="/signup" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
  Action Text
  <ArrowRight className="ml-2 h-5 w-5" />
</Link>
```

**Section Container:**
```tsx
<section className="py-16 lg:py-20 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

**Feature Grid:**
```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Cards */}
</div>
```

---

## Brand Voice & Messaging

### Tone Guidelines
- **Professional but approachable**: Avoid jargon, explain complex concepts clearly
- **Evidence-based**: Reference BACB data, research, professional standards
- **Action-oriented**: Use strong verbs, clear CTAs, specific outcomes
- **Supportive**: Acknowledge challenges, offer practical solutions

### Common Messaging Patterns
- **Problem-Solution**: "You're stuck in [problem] → We provide [solution]"
- **Data-driven**: Lead with statistics (54% pass rate, 300-500 study hours)
- **Transformation**: "From [current state] → to [desired state]"
- **Specificity**: "16 BACB CEUs" not "continuing education"

---

*Last Updated: October 2025*
*Behavior School LLC - Brand Style Guide v1.0*
