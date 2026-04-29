# Deployment Watermark

This directory contains the watermark component that is automatically injected into all generated HTML artifacts when deployed or shared.

## Overview

The watermark displays "Made by open-design" with a GitHub icon in the bottom-right corner of all generated designs, linking back to https://github.com/nexu-io/open-design.

## Features

- **Fixed positioning**: Bottom-right corner, always visible
- **Subtle styling**: Semi-transparent background with backdrop blur
- **Responsive**: Adapts to mobile viewports
- **Dark mode support**: Automatically adjusts colors based on `prefers-color-scheme`
- **Accessible**: Proper focus states and ARIA labels
- **Print-friendly**: Hidden when printing
- **Non-intrusive**: High z-index but doesn't block content interaction

## Files

- `watermark.html` - The watermark component (styles + markup)
- `../scripts/inject-watermark.js` - Script to inject watermark into templates

## Usage

### Automatic Injection (Recommended)

Run the injection script to add the watermark to all template files:

```bash
node scripts/inject-watermark.js
```

This will:
1. Scan all HTML templates in `skills/*/assets/` and `templates/`
2. Check if watermark is already present
3. Inject the watermark component before `</body>`
4. Skip files that already have the watermark

### Manual Injection

To manually add the watermark to a custom HTML file:

1. Copy the contents of `public/watermark.html`
2. Paste it right before the closing `</body>` tag in your HTML file

Example:
```html
<!doctype html>
<html>
<body>
  <!-- Your content here -->
  
  <!-- Watermark injected here -->
  <style>
    .od-watermark { ... }
  </style>
  <div class="od-watermark">
    <a href="https://github.com/nexu-io/open-design">...</a>
  </div>
</body>
</html>
```

## Styling

The watermark uses:
- **Light theme**: `rgba(0, 0, 0, 0.05)` background, `rgba(0, 0, 0, 0.6)` text
- **Dark theme**: `rgba(255, 255, 255, 0.08)` background, `rgba(255, 255, 255, 0.7)` text
- **Font**: System font stack (`-apple-system`, `BlinkMacSystemFont`, etc.)
- **Size**: 12px on desktop, 11px on mobile
- **Position**: 16px from bottom and right (12px on mobile)

## Customization

To customize the watermark appearance, edit `public/watermark.html`:

- Colors: Adjust the `rgba()` values in the `.od-watermark a` styles
- Position: Change `bottom` and `right` values in `.od-watermark`
- Size: Modify `font-size`, `padding`, and icon dimensions
- Text: Update the `<span>` content (keep the link URL unchanged)

After making changes, re-run the injection script.

## Testing

To verify the watermark appears correctly:

1. Open any template file in `skills/*/assets/template.html`
2. Look for the watermark component before `</body>`
3. Open the HTML file in a browser
4. Check that the watermark appears in the bottom-right corner
5. Hover to verify the hover state works
6. Test on mobile viewport (should be slightly smaller)
7. Toggle dark mode to verify color adaptation

## Implementation Details

The watermark is injected at build/generation time rather than runtime to ensure:
- Zero runtime JavaScript overhead
- Works in any environment (no build tool dependencies)
- Can't be easily removed by users (compiled into the artifact)
- Compatible with all skill types and templates

The injection script:
- Preserves existing indentation
- Only injects once (checks for `od-watermark` class)
- Skips files without `</body>` tags
- Reports all actions (injected/skipped)

## Related

- Issue: [#41 - Add deployment sharing with open-design watermark](https://github.com/nexu-io/open-design/issues/41)
- PR: _[To be filled]_
