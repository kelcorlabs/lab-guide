# Anthropic Academy — Platform Reference Document

> Researched April 2026 from anthropic.skilljar.com. This document captures the exact design system, course structure, and UX patterns used by Anthropic's learning platform for reference when building course-style content.

---

## Platform Overview

- **URL:** anthropic.skilljar.com
- **Engine:** Skilljar (commercial LMS), heavily customized with Anthropic branding
- **Courses:** 16 total, all free with certificates of completion
- **Auth:** Email or Google sign-in (no Anthropic account required)

### Course Catalog (16 courses)

| Course | Lessons | Video | Quizzes | Track |
|--------|---------|-------|---------|-------|
| Claude Code in Action | 21 | 1.0 hr | 2 | Developer |
| Building with the Claude API | 84 | 8.1 hrs | 10 | Developer |
| Introduction to MCP | 16 | 1.0 hr | 1 | Developer |
| MCP: Advanced Topics | 15 | 1.1 hrs | 2 | Developer |
| Introduction to Agent Skills | 6 | — | — | Developer |
| Introduction to Subagents | — | — | — | Developer |
| Claude 101 | 14 | — | 1 | AI Fluency |
| AI Fluency: Framework & Foundations | 14 | 1.1 hrs | 1 | AI Fluency |
| AI Fluency for Educators | — | — | — | AI Fluency |
| AI Fluency for Students | — | — | — | AI Fluency |
| AI Fluency for Nonprofits | — | — | — | AI Fluency |
| Teaching AI Fluency | — | — | — | AI Fluency |
| AI Capabilities and Limitations | — | — | — | AI Fluency |
| Introduction to Claude Cowork | — | — | — | AI Fluency |
| Claude with Amazon Bedrock | — | — | — | Cloud |
| Claude with Google Vertex AI | — | — | — | Cloud |

### Three Learning Tracks

1. **AI Fluency** — non-technical, for managers/students/educators
2. **Developer Deep-Dives** — Claude API, Claude Code, MCP, Agent Skills
3. **Cloud & Enterprise** — Bedrock, Vertex AI

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Page background | `#faf9f5` | Warm off-white, entire page |
| Card/section background | `#f0eee6` | Sidebar, cards, section blocks, callouts |
| Hover state | `#e8e5db` | Card hover backgrounds |
| Text primary | `#2c2b25` | Headings, buttons, body (warm near-black) |
| Text body alternate | `#141413` | Footer, some body text |
| Text secondary | `#5e5b4e` | Subtitles, descriptions |
| Text muted | `#7c7968` | Breadcrumbs, meta, timestamps |
| Text light | `#9a9788` | Faint labels |
| Border subtle | `#e5e2d9` | Card borders, dividers |
| Border medium | `#d1cfc5` | Stronger dividers |
| Border FAQ | `#b0aea5` | FAQ separators, progress bar borders |
| Accent blue | `#b4c6d4` | Card top-border accent |
| Accent purple | `#c5bfd9` | Card top-border accent |
| Accent sage | `#b5c5c0` | Card top-border accent |
| Button primary bg | `#2c2b25` | CTA buttons |
| Button hover | opacity 0.85 | All buttons on hover |
| Footer bg | `#141413` | Dark footer |

### Typography

| Role | Font Family | Size | Weight | Spacing |
|------|-------------|------|--------|---------|
| Catalog h1 | Copernicus (Anthropic Serif Display) | 74px | 400 | -1.92px |
| Course page title | Copernicus | 3rem (48px) | 400 | -0.02em |
| Section titles | Copernicus | 2.25rem (36px) | 600 | — |
| Section names | Copernicus | 1.5rem (24px) | 600 | — |
| Course card title | Copernicus | 24px | 500 | -0.54px |
| FAQ question | Styrene A (Anthropic Sans Display) | 24px | 500 | — |
| FAQ heading | Styrene A | 32px | 500 | — |
| Subtitle | Styrene B (Anthropic Sans Text) | 1.125rem (18px) | — | — |
| Body text | Tiempos (Anthropic Serif Text) | 1rem (16px) | 400 | line-height 1.6 |
| FAQ body | Tiempos | 18-20px | 400 | line-height 1.6 |
| Breadcrumb | Styrene B | 0.875rem (14px) | — | — |
| Curriculum lesson | Styrene B | 0.9375rem (15px) | — | — |
| Module title | Styrene B | 1rem (16px) | 600 | — |

**Font Sources:**

| Display Name | Actual File | URL |
|--------------|-------------|-----|
| Anthropic Sans Display | AnthropicSans-Display-Medium-Static.otf | assets.claude.ai/Fonts/ |
| Anthropic Sans Text | AnthropicSans-Text-{Regular,Medium}-Static.otf | assets.claude.ai/Fonts/ |
| Anthropic Serif Display | AnthropicSerif-Display-{Regular,Semibold}-Static.otf | assets.claude.ai/Fonts/ |
| Anthropic Serif Text | AnthropicSerif-Text-{Regular,Medium}-Static.otf | assets.claude.ai/Fonts/ |

**woff2 variants (for web use):**
- `cdn.prod.website-files.com/.../AnthropicSans-Roman-Web.woff2`
- `cdn.prod.website-files.com/.../AnthropicSans-Italic-Web.woff2`
- `cdn.prod.website-files.com/.../AnthropicSerif-Roman-Web.woff2`
- `cdn.prod.website-files.com/.../AnthropicSerif-Italic-Web.woff2`
- `cdn.prod.website-files.com/.../AnthropicMono-Roman-Web.woff2`

### Spacing

| Element | Value |
|---------|-------|
| Hero padding | `4rem 2rem` (mobile: `2rem 1rem`) |
| Main content max-width | `1200px` |
| Main content padding | `3rem 2rem 0 2rem` |
| Section block padding | `2.5rem` (mobile: `1.5rem`) |
| Section block margin-bottom | `2.5rem` |
| Card padding | `2rem` (catalog), `2.5rem` (course sections) |
| Topic grid gap | `2rem` |
| Two-column layout gap | `5rem` |
| FAQ wrapper padding | `0 48px` |
| Curriculum item padding | `0.375rem 0` |

### Border Radius

| Element | Radius |
|---------|--------|
| Course cards (catalog) | `16px` |
| Section blocks | `8px` |
| Enroll button | `8px` |
| Screenshot wrappers | `6px` |
| Instructor avatar | `12px` |
| Ribbon badge | `12.5px` |
| Modal content | `12px` |
| Share buttons | `6px` |
| Free tag | `4px` |

### Button Styles

**Primary (Enroll/CTA):**
```css
background: #2c2b25;
color: white;
padding: 0.875rem 2rem;
border-radius: 8px;
font-weight: 500;
font-family: 'Anthropic Sans Text';
transition: opacity 0.2s ease;
/* hover: opacity 0.85 */
```

**Free tag:**
```css
background: rgba(44, 43, 37, 0.08);
padding: 0.25rem 0.75rem;
border-radius: 4px;
color: #7c7968;
font-size: 0.875rem;
```

**Share buttons:**
```css
border: 1px solid rgba(0, 0, 0, 0.08);
border-radius: 6px;
background: rgba(255, 255, 255, 0.3);
color: #5e5b4e;
padding: 0.375rem 0.75rem;
font-size: 0.875rem;
```

---

## Page Templates

### Course Landing Page Structure

```
HERO SECTION
├── Breadcrumb ("Anthropic Academy / Courses")
├── Title (Copernicus serif, 48px)
├── Subtitle (18px, muted)
├── CTA area
│   ├── "Enroll in Course" button (dark)
│   ├── "FREE" tag
│   └── "Already registered? Sign In" link
├── Share buttons (X, LinkedIn)
└── Right column: Video/image + Stats bar

ABOUT THIS COURSE (beige card, rounded 8px)
├── Description paragraphs
├── "Learning objectives" (bulleted list)
├── "Prerequisites" (bulleted list)
└── Target audience note

COURSE SECTIONS (one card per section)
├── Section name + lesson count
├── Description
└── Preview screenshots (3-column grid)

INSTRUCTOR(S) (if present)
├── Avatar (rounded 12px)
├── Name
└── Bio

FAQ SECTION (accordion, checkbox-based)
├── Section heading
└── FAQ items (border-top separated)
    ├── Question (clickable, plus/minus icon)
    └── Answer (expandable)

FOOTER
├── Anthropic logo
├── © 2025 Anthropic PBC
└── Social icons (YouTube, LinkedIn, X)
```

### Stats Bar Format

```html
<div class="clp__stats-container">
  <span><strong>15</strong> lectures</span>
  <span><strong>1</strong> hour of video</span>
  <span><strong>1</strong> quiz</span>
  <span>✓ Certificate of completion</span>
</div>
```

### Lesson Page Sidebar

```
SIDEBAR (bg #f0eee6, border 1px solid #e5e2d9, radius 8px, padding 2.5rem)
├── Module title (600 weight, 1rem)
└── Lesson items (indent 1rem, padding 0.375rem, color #7c7968)
    ├── [icon] Lesson name
    ├── [icon] Lesson name (active: bold, dark)
    └── [icon] Lesson name
```

**Lesson type icons:**
- Text: `icon-text`
- Video: `icon-video`
- Quiz: `fa-check-square-o`

---

## Course Breakdowns

### Claude Code in Action (21 lessons)

| # | Title | Type |
|---|-------|------|
| 1 | Introduction | Video |
| 2 | What is a coding assistant? | Video |
| 3 | Claude Code in action | Video |
| 4 | Claude Code setup | Text |
| 5 | Project setup | Text |
| 6 | Adding context | Video |
| 7 | Making changes | Video |
| 8 | Course satisfaction survey | Quiz |
| 9 | Controlling context | Video |
| 10 | Custom commands | Video |
| 11 | MCP servers with Claude Code | Video |
| 12 | Github integration | Video |
| 13 | Introducing hooks | Video |
| 14 | Defining hooks | Video |
| 15 | Implementing a hook | Video |
| 16 | Gotchas around hooks | Text |
| 17 | Useful hooks! | Video |
| 18 | Another useful hook | Text |
| 19 | The Claude Code SDK | Video |
| 20 | Quiz on Claude Code | Quiz |
| 21 | Summary and next steps | Video |

**Learning objectives:**
1. Use Claude Code's core tools for file manipulation, command execution, and code analysis
2. Manage context effectively using /init, Claude.md files, and @ mentions
3. Control conversation flow with hotkeys and commands
4. Enable Plan Mode and Thinking Mode for complex tasks
5. Create custom commands for automating repetitive development workflows
6. Extend Claude Code with MCP servers for browser automation
7. Set up GitHub integration for automated PR reviews and issue handling
8. Write hooks to add additional behavior into Claude Code

### Building with the Claude API (84 lessons, 7 sections)

| Section | Title | Lessons |
|---------|-------|---------|
| 1 | Getting started with Claude | 16 |
| 2 | Prompt engineering & evaluation | 16 |
| 3 | Tool use with Claude | 14 |
| 4 | Retrieval augmented generation | 10 |
| 5 | Model Context Protocol (MCP) | 12 |
| 6 | Claude Code & Computer Use | 8 |
| 7 | Agents and workflows | 11 |

### Claude 101 (14 lessons)

| # | Title | Type |
|---|-------|------|
| 1 | What is Claude? | Text |
| 2 | Your first conversation with Claude | Text |
| 3 | Getting better results | Text |
| 4 | Claude desktop app: Chat, Cowork, Code | Text |
| 5 | Introduction to projects | Text |
| 6 | Creating with artifacts | Text |
| 7 | Working with skills | Text |
| 8 | Connecting your tools | Text |
| 9 | Enterprise search | Text |
| 10 | Research mode for deep dives | Text |
| 11 | Claude in action: use-cases by role | Text |
| 12 | Other ways to work with Claude | Text |
| 13 | What's next? | Text |
| 14 | Certificate of completion | Quiz |

### Introduction to Agent Skills (6 lessons)

| # | Title | Type |
|---|-------|------|
| 1 | What are skills? | Text |
| 2 | Creating your first skill | Text |
| 3 | Configuration and multi-file skills | Text |
| 4 | Skills vs. other Claude Code features | Text |
| 5 | Sharing skills | Text |
| 6 | Troubleshooting skills | Text |

### Introduction to MCP (16 lessons, 2 sections)

| Section | Title | Lessons |
|---------|-------|---------|
| 1 | MCP fundamentals & server development | 8 |
| 2 | MCP client implementation & advanced features | 8 |

### MCP: Advanced Topics (15 lessons, 2 sections)

| Section | Title | Lessons |
|---------|-------|---------|
| 1 | Core MCP features | 8 |
| 2 | Transports and communication | 7 |

---

## CCA-F Certification Details

The Claude Certified Architect – Foundations (CCA-F) certification is embedded in the Academy platform:

- **Status:** Early Access for Anthropic partners
- **Proctoring:** ProctorFree
- **Attempts:** 1
- **Cost:** Free for first 5,000 partner employees; $99 after
- **Badge:** LinkedIn-shareable CCA-F badge
- **Support:** academy-support@anthropic.com
- **Recommended prep:** Aim for >900/1000 on practice exam before attempting

**Recommended courses before attempting:**
1. Building with the Claude API
2. Introduction to MCP
3. Claude Code in Action
4. Claude 101

---

## UX Patterns

### FAQ Accordion (checkbox-based, no JS)

```html
<div class="faq-container">
  <input type="checkbox" class="faq-input" id="faq-1">
  <label class="faq-label" for="faq-1">
    <div class="faq-title h4">Question text</div>
    <span class="faq-icon"><!-- plus/minus SVG --></span>
  </label>
  <article class="faq-content">
    <div class="faq-post text-b2">Answer content</div>
  </article>
</div>
```

### Screenshot Lightbox

- Overlay: `rgba(0,0,0,0.9)`, fadeIn 0.3s
- Content: white bg, border-radius 12px, max-width 90vw / 800px
- Navigation: circular buttons (40px), `rgba(0,0,0,0.5)` bg, hover scale(1.05)
- Footer: `#faf9f6` bg, image counter, CTA button

### Responsive Breakpoints

| Width | Behavior |
|-------|----------|
| >1200px | Full desktop layout |
| 968px | 2-col grid, sidebar collapses below content |
| 768px | Single column, reduced padding |
| 640px | Further size reductions |
| 480px | Full mobile: stacked, full-width buttons |

**Font scaling:**
- Title: 3rem → 2.5rem (968px) → 2rem (mobile)
- Hero padding: 4rem → 2rem
- Section padding: 2.5rem → 1.5rem

---

## What Makes It Feel Like a "Course"

1. **Sequential progression** — lessons ordered within modules, "Next" button enforces flow
2. **Enrollment gate** — must click "Enroll" (even though free) creating commitment
3. **Lesson completion indicators** — checkmarks in sidebar
4. **Mixed content types** — alternating video, text, quiz breaks monotony
5. **"Resume" button** — returning feels like picking up, not re-reading
6. **Quizzes as milestones** — distributed assessments create checkpoints
7. **Certificate as reward** — LinkedIn-shareable end goal
8. **Sidebar curriculum** — always-visible outline shows position
9. **Instructor presence** — avatar + bio creates "taught by someone" feeling
10. **Prerequisites** — signals "this is a real course with expectations"
11. **Stats bar** — "15 lectures, 1 hour video, 1 quiz" sets expectations
12. **Track organization** — courses in paths suggest curriculum, not random collection
