import type { Look } from "./looks";

/** Twenty authored starting designs, all composed from the editable appearance engine. */
export const EXPANDED_LOOKS: Look[] = [
  {
    "id": "atelier",
    "name": "Atelier",
    "blurb": "Still life. Small places. Honest light.",
    "overrides": {
      "colors": {
        "background": "#f7f5f0",
        "text": "#242421",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#242421",
        "accentText": "#f7f5f0",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f7f5f0"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "editorial",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "index",
    "name": "Index",
    "blurb": "Thoughtful identities for people doing their own thing.",
    "overrides": {
      "colors": {
        "background": "#f1f1ee",
        "text": "#1c1c1b",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#1c1c1b",
        "accentText": "#f1f1ee",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f1f1ee"
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "lg",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "minimal",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "compact",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "kiln",
    "name": "Kiln",
    "blurb": "Objects for everyday rituals.",
    "overrides": {
      "colors": {
        "background": "#ede6dc",
        "text": "#3d342b",
        "muted": "#655f59",
        "surface": "#fffdf8",
        "accent": "#3d342b",
        "accentText": "#ede6dc",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#ede6dc"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "floating",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "tight",
        "desktop": "columns"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  {
    "id": "ritual",
    "name": "Ritual",
    "blurb": "A little stronger. A little more you.",
    "overrides": {
      "colors": {
        "background": "#f4f1eb",
        "text": "#34372e",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#34372e",
        "accentText": "#f4f1eb",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "gradient",
        "from": "#f4f1eb",
        "to": "#e5e5e0",
        "angle": 147,
        "motion": true
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "portrait",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "petal",
    "name": "Petal",
    "blurb": "Seasonal flowers. Never quite the same twice.",
    "overrides": {
      "colors": {
        "background": "#f1f2e9",
        "text": "#36412f",
        "muted": "#655f59",
        "surface": "#fffef8",
        "accent": "#36412f",
        "accentText": "#f1f2e9",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f1f2e9"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "strong"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "founder",
    "name": "Founder",
    "blurb": "Making useful things. Sharing what I learn.",
    "overrides": {
      "colors": {
        "background": "#f3f3ed",
        "text": "#252525",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#252525",
        "accentText": "#f3f3ed",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "shader",
        "style": "grain",
        "base": "#f3f3ed",
        "colors": [
          "#f3f3ed",
          "#ffffff",
          "#e0e0d9"
        ]
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "minimal",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "tight",
        "desktop": "columns"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "habitat",
    "name": "Habitat",
    "blurb": "Calmer spaces. Better everyday living.",
    "overrides": {
      "colors": {
        "background": "#eeeae3",
        "text": "#36322c",
        "muted": "#655f59",
        "surface": "#fffcf7",
        "accent": "#36322c",
        "accentText": "#eeeae3",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#eeeae3"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "floating",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "frame",
    "name": "Frame",
    "blurb": "Small crews. Films with a point of view.",
    "overrides": {
      "colors": {
        "background": "#111111",
        "text": "#f7f7f4",
        "muted": "#b6b8b5",
        "surface": "#242424",
        "accent": "#f7f7f4",
        "accentText": "#111111",
        "border": "#40423f"
      },
      "background": {
        "kind": "solid",
        "color": "#111111"
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "lg",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "poster",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "strong"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "none",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "advisory",
    "name": "Advisory",
    "blurb": "A clear next step for your next big thing.",
    "overrides": {
      "colors": {
        "background": "#f5f5f0",
        "text": "#2a342a",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#2a342a",
        "accentText": "#f5f5f0",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f5f5f0"
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "centered",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "tight",
        "desktop": "columns"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "lune",
    "name": "Lune",
    "blurb": "Good nails. A little time for yourself.",
    "overrides": {
      "colors": {
        "background": "#f6edef",
        "text": "#42323a",
        "muted": "#655f59",
        "surface": "#fffbfc",
        "accent": "#42323a",
        "accentText": "#f6edef",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "gradient",
        "from": "#f6edef",
        "to": "#e8dce2",
        "angle": 171,
        "motion": true
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "floating",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "center",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "batch",
    "name": "Batch",
    "blurb": "Up early. Gone when it is gone.",
    "overrides": {
      "colors": {
        "background": "#f6eee2",
        "text": "#3f3024",
        "muted": "#655f59",
        "surface": "#fffdf7",
        "accent": "#3f3024",
        "accentText": "#f6eee2",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f6eee2"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "cover",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "cursor",
    "name": "Cursor",
    "blurb": "Small websites. Big first impressions.",
    "overrides": {
      "colors": {
        "background": "#eeeeeb",
        "text": "#151515",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#151515",
        "accentText": "#eeeeeb",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#eeeeeb"
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "lg",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "editorial",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "tight",
        "desktop": "columns"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "archive",
    "name": "Archive",
    "blurb": "Found once. Worn again.",
    "overrides": {
      "colors": {
        "background": "#efebe4",
        "text": "#302c28",
        "muted": "#655f59",
        "surface": "#fffdf8",
        "accent": "#302c28",
        "accentText": "#efebe4",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#efebe4"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "cover",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  {
    "id": "social",
    "name": "Social",
    "blurb": "Good ideas deserve to be seen.",
    "overrides": {
      "colors": {
        "background": "#f9e9df",
        "text": "#422d25",
        "muted": "#655f59",
        "surface": "#fffbf7",
        "accent": "#422d25",
        "accentText": "#f9e9df",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "gradient",
        "from": "#f9e9df",
        "to": "#ecd6cc",
        "angle": 187,
        "motion": true
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "portrait",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "tempo",
    "name": "Tempo",
    "blurb": "Sound for the things you are making.",
    "overrides": {
      "colors": {
        "background": "#0e1011",
        "text": "#f2f4f5",
        "muted": "#b6b8b5",
        "surface": "#222629",
        "accent": "#f2f4f5",
        "accentText": "#0e1011",
        "border": "#40423f"
      },
      "background": {
        "kind": "shader",
        "style": "silk",
        "base": "#0e1011",
        "colors": [
          "#0e1011",
          "#222629",
          "#313435"
        ]
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "strong"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "none",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "tight",
        "desktop": "columns"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "canvas",
    "name": "Canvas",
    "blurb": "Drawn by hand. Made to mean something.",
    "overrides": {
      "colors": {
        "background": "#f5f0df",
        "text": "#3b3322",
        "muted": "#655f59",
        "surface": "#fffdf4",
        "accent": "#3b3322",
        "accentText": "#f5f0df",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f5f0df"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "lg",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "minimal",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  {
    "id": "stride",
    "name": "Stride",
    "blurb": "Find your pace. Keep going.",
    "overrides": {
      "colors": {
        "background": "#edf0e6",
        "text": "#29392b",
        "muted": "#655f59",
        "surface": "#fbfcf7",
        "accent": "#29392b",
        "accentText": "#edf0e6",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#edf0e6"
      },
      "text": {
        "headingFont": "barlowCondensed",
        "bodyFont": "inter",
        "size": "lg",
        "headingCase": "upper",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "feature",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "none",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "repair",
    "name": "Repair",
    "blurb": "Broken phone. Clear options.",
    "overrides": {
      "colors": {
        "background": "#f2f4f5",
        "text": "#273039",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#273039",
        "accentText": "#f2f4f5",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f2f4f5"
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "compact",
        "rhythm": "tight",
        "desktop": "columns"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "occasion",
    "name": "Occasion",
    "blurb": "The small details make the day.",
    "overrides": {
      "colors": {
        "background": "#f4efeb",
        "text": "#463c38",
        "muted": "#655f59",
        "surface": "#fffdfa",
        "accent": "#463c38",
        "accentText": "#f4efeb",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "solid",
        "color": "#f4efeb"
      },
      "text": {
        "headingFont": "instrumentSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "regular",
        "align": "left"
      },
      "header": {
        "layout": "poster",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "left",
        "actions": "none",
        "showLocation": true,
        "scrim": "strong"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "none",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "roomy"
      },
      "layout": {
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial",
        "desktop": "centered"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  {
    "id": "still",
    "name": "Still",
    "blurb": "A little room to slow down.",
    "overrides": {
      "colors": {
        "background": "#f0f2ed",
        "text": "#303a31",
        "muted": "#655f59",
        "surface": "#ffffff",
        "accent": "#303a31",
        "accentText": "#f0f2ed",
        "border": "#ddd9d2"
      },
      "background": {
        "kind": "shader",
        "style": "silk",
        "base": "#f0f2ed",
        "colors": [
          "#f0f2ed",
          "#ffffff",
          "#e0e0d9"
        ]
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingCase": "normal",
        "headingWeight": "bold",
        "align": "center"
      },
      "header": {
        "layout": "centered",
        "avatarShape": "logo",
        "avatarSize": "md",
        "align": "center",
        "actions": "none",
        "showLocation": true,
        "scrim": "soft"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even",
        "desktop": "split"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  }
];
