# App Icon Instructions

Your app needs icons for PWA (Progressive Web App) installation. You need two PNG files:

- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels

## Quick Options

### Option 1: Use a Logo Generator (Easiest)

1. Go to https://www.canva.com/ (free account)
2. Create a 512x512 design
3. Add American Fork High School logo or:
   - Football icon
   - Text: "AFHS"
   - School colors (Red & Black)
4. Download as PNG
5. Use https://realfavicongenerator.net/ to resize to 192x192

### Option 2: Use AFHS School Logo

If you have the official American Fork High School logo:
1. Open in image editor (Photoshop, GIMP, etc.)
2. Resize to 512x512 pixels
3. Save as `icon-512.png`
4. Resize to 192x192 pixels
5. Save as `icon-192.png`

### Option 3: Use This Simple Design

Create a simple but professional icon:

**Design Elements:**
- Background: Red (#DC2626)
- Text: "AFHS" in white, bold font
- Optional: Football outline or shield icon

**Tools:**
- Canva (https://canva.com) - Free
- Figma (https://figma.com) - Free
- Adobe Express (https://adobe.com/express) - Free
- Photopea (https://photopea.com) - Free Photoshop alternative

### Option 4: AI Generator

Use an AI image generator:
1. Go to https://www.bing.com/images/create
2. Prompt: "American Fork High School football logo, red and black colors, simple icon design, shield with football"
3. Download and resize to 192x192 and 512x512

## Design Guidelines

✅ **Do:**
- Use high contrast colors
- Keep design simple and recognizable
- Use school colors (red, black, white)
- Make sure text is readable at small sizes
- Use square dimensions

❌ **Don't:**
- Use photos (they don't scale well)
- Include too much detail
- Use light colors on light backgrounds
- Make text too small

## Testing Your Icons

After adding the icons:

1. Replace the placeholder files in `/public/`
   - `/public/icon-192.png`
   - `/public/icon-512.png`

2. Test the PWA installation:
   - Deploy your app
   - Try installing on iPhone (Safari)
   - Try installing on Android (Chrome)
   - Check that your icon appears

## Current Status

⚠️ **Action Required:** The current icon files are placeholders. 

Replace them with actual PNG images before deploying to production.

## Need Help?

If you need help creating icons:
1. Contact your school's marketing/graphics department
2. Ask a student in graphic design class
3. Use one of the online tools mentioned above
4. Hire a designer on Fiverr ($5-10)

## Example Specification

If you're working with a designer, send them this:

```
Icon Specifications for AFHS Football Inventory App

Required Files:
- icon-192.png (192x192 pixels, PNG format)
- icon-512.png (512x512 pixels, PNG format)

Design Requirements:
- Square format (same width and height)
- American Fork High School branding
- School colors: Red (#DC2626), Black, White
- Football/sports theme
- Simple, bold design that works at small sizes
- Text: "AFHS Football" or "AFHS Inventory"
- Professional appearance

Use Case:
- Mobile app icon when installed on home screen
- Should be recognizable at phone icon size
- Will appear on iOS and Android devices
```

---

Once you have your icons, simply replace the placeholder files in `/public/` and redeploy your app!

