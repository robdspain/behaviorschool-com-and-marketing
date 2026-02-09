---
title: Welcome to Your New File-Based Blog
excerpt: Your blog posts are now stored as markdown files in your repository - no Ghost CMS needed!
date: "2025-12-01T10:00:00.000Z"
author: Rob Spain
featured_image: null
tags:
  - Updates
  - Getting Started
status: draft
meta_title: Welcome to Your New File-Based Blog
meta_description: Learn about the new markdown-based blog system for BehaviorSchool.com
---

## Ghost CMS has been replaced! 🎉

Your blog is now powered by a simple, file-based system. Here's what changed:

### What's Better:

1. **No Subscriptions** - Everything runs from files in your repo
2. **Version Control** - Every post is backed up in Git forever
3. **Faster** - No external API calls or databases
4. **Simpler** - Write in markdown, commit, deploy

### How to Create Posts:

1. Go to `/admin/content`
2. Click "Create New Post"
3. Write in markdown or use the editor
4. Click "Publish"

### File Format:

Posts are stored in `content/blog/` as markdown files with frontmatter:

```markdown
---
title: My Post Title
excerpt: A brief description
date: '2026-01-30T00:00:00.000Z'
status: published
tags:
  - Tag1
  - Tag2
---

Your content here in **markdown**.
```

### Migrating Old Content:

If you have old blog posts saved somewhere:
1. Convert them to markdown
2. Add the frontmatter at the top
3. Save as `.md` files in `content/blog/`
4. Commit and push

That's it! Your blog is back online, completely free, and under your control.

---

*This post was auto-generated to demonstrate the new system.*
