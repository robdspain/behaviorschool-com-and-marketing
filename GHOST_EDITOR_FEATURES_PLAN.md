# Ghost Editor Features Implementation Plan

## Current Status ✅
- [x] Rich text editing (Bold, Italic, Headings, Lists, Quotes)
- [x] Links and Images
- [x] Undo/Redo
- [x] CTA Buttons
- [x] Contact Button
- [x] Visual/HTML toggle

## Features to Implement 🎯

### 1. Content Cards/Blocks (HIGH PRIORITY)
Ghost uses a card-based system for rich content:
- [ ] **Image Card** - Enhanced image with caption, alt text, size options
- [ ] **Gallery Card** - Multiple images in a gallery layout
- [ ] **Embed Card** - YouTube, Twitter, Instagram, etc.
- [ ] **Markdown Card** - For code snippets and markdown
- [ ] **HTML Card** - Raw HTML insertion
- [ ] **Divider Card** - Visual separators
- [ ] **Button Card** - CTA buttons (already have basic version)
- [ ] **Bookmark Card** - Rich link previews
- [ ] **Callout Card** - Highlighted boxes (info, warning, success)
- [ ] **Toggle Card** - Expandable/collapsible content
- [ ] **File Card** - Downloadable file attachments
- [ ] **Video Card** - Upload or embed videos
- [ ] **Audio Card** - Audio player embeds
- [ ] **Product Card** - Product showcases with pricing
- [ ] **Email CTA Card** - Newsletter signup forms

### 2. Markdown Shortcuts (HIGH PRIORITY)
- [ ] `##` for H2, `###` for H3
- [ ] `*` or `-` for bullet lists
- [ ] `1.` for numbered lists
- [ ] `>` for blockquotes
- [ ] `**text**` for bold
- [ ] `*text*` for italic
- [ ] `---` for horizontal divider
- [ ] `` `code` `` for inline code
- [ ] ` ``` ` for code blocks

### 3. Internal Linking (MEDIUM PRIORITY)
- [ ] Type `@` to search and link to:
  - Existing posts
  - Pages
  - Tags
  - Authors
- [ ] Autocomplete dropdown
- [ ] Quick preview on hover

### 4. Image Features (MEDIUM PRIORITY)
- [ ] **Native image editing**:
  - Crop
  - Resize
  - Rotate
  - Adjust brightness/contrast
- [ ] **Image options**:
  - Caption field
  - Alt text for SEO
  - Size options (small, medium, large, full-width)
  - Alignment (left, center, right)
- [ ] **Multiple image upload**
- [ ] **Drag and drop** from desktop
- [ ] **Unsplash integration** (optional)

### 5. Content Snippets (MEDIUM PRIORITY)
- [ ] Save reusable content blocks
- [ ] Quick insert from library
- [ ] Categories for snippets:
  - Author bios
  - Disclaimers
  - CTAs
  - Common paragraphs
  - Code snippets

### 6. Enhanced SEO Panel (HIGH PRIORITY)
Currently have basic meta fields. Add:
- [ ] **URL slug** customization
- [ ] **Focus keyword** analysis
- [ ] **Readability score**
- [ ] **Word count** display
- [ ] **Reading time** estimate
- [ ] **SEO preview** (Google/Facebook/Twitter)
- [ ] **Social share image** upload
- [ ] **Canonical URL** field

### 7. Publishing Options (HIGH PRIORITY)
Currently have basic scheduling. Add:
- [ ] **Featured toggle** - Mark as featured post
- [ ] **Access control**:
  - Public
  - Members only
  - Paid members only
- [ ] **Custom excerpt** override
- [ ] **Author selection** (if multiple authors)
- [ ] **Send newsletter** toggle
- [ ] **Email-only post** option
- [ ] **Pin to top** option

### 8. Editor Settings Sidebar (MEDIUM PRIORITY)
- [ ] **Post settings panel**:
  - URL preview and edit
  - Publish date/time
  - Tags management (enhanced)
  - Featured toggle
  - Access level
  - Custom template selection
- [ ] **SEO panel**
- [ ] **Social panel**
- [ ] **Code injection** (head/foot)

### 9. Keyboard Shortcuts (LOW PRIORITY)
- [ ] `Ctrl/Cmd + B` - Bold
- [ ] `Ctrl/Cmd + I` - Italic
- [ ] `Ctrl/Cmd + K` - Add link
- [ ] `Ctrl/Cmd + Z` - Undo
- [ ] `Ctrl/Cmd + Shift + Z` - Redo
- [ ] `Ctrl/Cmd + S` - Save
- [ ] `Ctrl/Cmd + Enter` - Publish
- [ ] `/` - Show card menu
- [ ] `Esc` - Exit card/focus mode

### 10. Content Features (LOW PRIORITY)
- [ ] **Word count** in status bar
- [ ] **Auto-save** indicator
- [ ] **Character count** (for meta descriptions)
- [ ] **Table support**
- [ ] **Anchor links** (table of contents)
- [ ] **Footnotes**
- [ ] **Comments** (inline)

### 11. Mobile Responsive Editor (LOW PRIORITY)
- [ ] Touch-optimized toolbar
- [ ] Mobile-friendly card insertion
- [ ] Swipe gestures
- [ ] Simplified UI for small screens

### 12. Advanced Features (LOW PRIORITY)
- [ ] **Lexical editor** (Ghost's current editor engine)
- [ ] **Collaborative editing** (multiple users)
- [ ] **Version history** (track changes)
- [ ] **Content revert** (rollback)
- [ ] **Duplicate post**
- [ ] **Post preview** in new tab
- [ ] **Analytics integration** (view count)

## Implementation Priority

### Phase 1 (Immediate) ⚡
1. Content Cards system (Image, Gallery, Embed, Markdown, HTML, Divider)
2. Markdown shortcuts
3. Enhanced SEO panel with URL slug and preview
4. Featured post toggle
5. Word count display

### Phase 2 (Next Week) 📅
1. Internal linking with @ mention
2. Image editing tools
3. Content snippets library
4. Publishing options (access control, featured, etc.)
5. Settings sidebar

### Phase 3 (Future) 🚀
1. Advanced cards (Product, Email CTA, etc.)
2. Keyboard shortcuts
3. Table support
4. Version history
5. Mobile optimization

## Technical Considerations

### TipTap Extensions Needed
- @tiptap/extension-code-block
- @tiptap/extension-code-block-lowlight
- @tiptap/extension-table
- @tiptap/extension-table-row
- @tiptap/extension-table-cell
- @tiptap/extension-table-header
- @tiptap/extension-mention (for internal linking)
- @tiptap/extension-youtube
- @tiptap/extension-task-list
- @tiptap/extension-task-item

### Custom Components Needed
- Card insertion menu (/)
- Settings sidebar
- Image editor modal
- Snippets library
- Internal link search
- SEO preview component

### Database Schema Updates
- Snippets table
- Post versions table (for history)
- Featured posts flag
- Access level field

## Notes
- Focus on user experience matching Ghost's simplicity
- All features should work seamlessly with existing Ghost CMS backend
- Maintain visual consistency with current design
- Ensure mobile responsiveness
- Add keyboard shortcuts for power users

