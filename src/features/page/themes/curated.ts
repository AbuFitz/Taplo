import type { StyleOverrides } from "../contracts/style";
/** Complete art directions authored with the owner editor’s controls. No template-specific CSS. */
export const CURATED_DESIGNS: Record<string, { blurb: string; style: StyleOverrides }> = {
  "open": {
    "blurb": "Fresh mineral colour, a floating introduction and clear appointment blocks.",
    "style": {
      "colors": {
        "background": "#f1f4f2",
        "text": "#153e39",
        "muted": "#4e6964",
        "surface": "#ffffff",
        "accent": "#126c5a",
        "accentText": "#ffffff",
        "border": "#cddad7"
      },
      "background": {
        "kind": "solid",
        "color": "#f1f4f2"
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "center"
      },
      "header": {
        "layout": "centered",
        "align": "center",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "service": {
    "blurb": "A photographic shopfront, warm paper and precise service panels.",
    "style": {
      "colors": {
        "background": "#f5f1ec",
        "text": "#29221d",
        "muted": "#73665b",
        "surface": "#ffffff",
        "accent": "#85442f",
        "accentText": "#ffffff",
        "border": "#d6d2cd"
      },
      "background": {
        "kind": "solid",
        "color": "#f5f1ec"
      },
      "text": {
        "headingFont": "geist",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "compact",
        "rhythm": "tight"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "personal": {
    "blurb": "A personal introduction with a soft lilac wash and spacious contact blocks.",
    "style": {
      "colors": {
        "background": "#f3f1ff",
        "text": "#27233c",
        "muted": "#676078",
        "surface": "#ffffff",
        "accent": "#5f4b91",
        "accentText": "#ffffff",
        "border": "#d4d2e2"
      },
      "background": {
        "kind": "gradient",
        "from": "#f3f1ff",
        "to": "#d8d3eb",
        "angle": 165,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "bricolage",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "ink": {
    "blurb": "Deep graphite, a full photographic opening and cool silver actions.",
    "style": {
      "colors": {
        "background": "#080a0d",
        "text": "#f4f7fa",
        "muted": "#a6adb6",
        "surface": "#191d23",
        "accent": "#d3e4ed",
        "accentText": "#101820",
        "border": "#2b2e31"
      },
      "background": {
        "kind": "solid",
        "color": "#080a0d"
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "strong"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "silver": {
    "blurb": "Silver grain, translucent surfaces and a compact professional identity.",
    "style": {
      "colors": {
        "background": "#edf0f1",
        "text": "#263237",
        "muted": "#5c6a70",
        "surface": "#ffffff",
        "accent": "#324f5d",
        "accentText": "#ffffff",
        "border": "#cfd4d5"
      },
      "background": {
        "kind": "shader",
        "style": "grain",
        "base": "#edf0f1",
        "colors": [
          "#edf0f1",
          "#c2cbcf",
          "#f6f8f8"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "geist",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "glass",
        "opacity": 94,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "smoke": {
    "blurb": "Plum charcoal with moving silk and quiet glass blocks.",
    "style": {
      "colors": {
        "background": "#19161f",
        "text": "#faf3ff",
        "muted": "#bdb0c7",
        "surface": "#2c2535",
        "accent": "#e8d8f4",
        "accentText": "#271b32",
        "border": "#3b3741"
      },
      "background": {
        "kind": "shader",
        "style": "silk",
        "base": "#19161f",
        "colors": [
          "#19161f",
          "#494350",
          "#221e2a"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "strong"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "glass",
        "opacity": 94,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "folio": {
    "blurb": "A warm editorial portfolio with serif type and open space for the work.",
    "style": {
      "colors": {
        "background": "#f8f2ea",
        "text": "#3d2d25",
        "muted": "#796b60",
        "surface": "#fffdf8",
        "accent": "#8c4e3a",
        "accentText": "#ffffff",
        "border": "#dcd4cc"
      },
      "background": {
        "kind": "solid",
        "color": "#f8f2ea"
      },
      "text": {
        "headingFont": "sourceSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
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
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  "showroom": {
    "blurb": "Cool showroom paper, clear stock photography and confident blue-grey actions.",
    "style": {
      "colors": {
        "background": "#e9edee",
        "text": "#182b35",
        "muted": "#52636b",
        "surface": "#ffffff",
        "accent": "#274f65",
        "accentText": "#ffffff",
        "border": "#cad0d2"
      },
      "background": {
        "kind": "gradient",
        "from": "#e9edee",
        "to": "#c6d1d5",
        "angle": 135,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "geist",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "journal": {
    "blurb": "Butter paper, strong type and an editorial rhythm for ideas and writing.",
    "style": {
      "colors": {
        "background": "#fff4d8",
        "text": "#332d20",
        "muted": "#766b52",
        "surface": "#fffcf4",
        "accent": "#3d5030",
        "accentText": "#ffffff",
        "border": "#e0d6bc"
      },
      "background": {
        "kind": "solid",
        "color": "#fff4d8"
      },
      "text": {
        "headingFont": "bricolage",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "clay": {
    "blurb": "Moving warm linen, a floating caf\u00e9 profile and readable menu panels.",
    "style": {
      "colors": {
        "background": "#ede8df",
        "text": "#492f22",
        "muted": "#816954",
        "surface": "#fffaf2",
        "accent": "#403c32",
        "accentText": "#ffffff",
        "border": "#dbccbd"
      },
      "background": {
        "kind": "solid",
        "color": "#ede8df"
      },
      "text": {
        "headingFont": "bricolage",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "orchard": {
    "blurb": "Sage paper, compact details and grounded green actions.",
    "style": {
      "colors": {
        "background": "#e8efd9",
        "text": "#263d23",
        "muted": "#5b6d4e",
        "surface": "#fbfff6",
        "accent": "#45633b",
        "accentText": "#ffffff",
        "border": "#cbd4be"
      },
      "background": {
        "kind": "solid",
        "color": "#e8efd9"
      },
      "text": {
        "headingFont": "lexend",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "forge": {
    "blurb": "Forest graphite, condensed type and a citrus training accent.",
    "style": {
      "colors": {
        "background": "#151b18",
        "text": "#f2f5dd",
        "muted": "#b0b7a5",
        "surface": "#26332b",
        "accent": "#d9ee99",
        "accentText": "#233019",
        "border": "#363c36"
      },
      "background": {
        "kind": "solid",
        "color": "#151b18"
      },
      "text": {
        "headingFont": "barlowCondensed",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "strong"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "columns",
        "width": "wide",
        "density": "compact",
        "rhythm": "tight"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "atelier": {
    "blurb": "An open photographic portfolio on warm gallery paper.",
    "style": {
      "colors": {
        "background": "#efeee9",
        "text": "#343b32",
        "muted": "#6a7064",
        "surface": "#ffffff",
        "accent": "#5d6b43",
        "accentText": "#ffffff",
        "border": "#dad8d0"
      },
      "background": {
        "kind": "solid",
        "color": "#efeee9"
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
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
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "index": {
    "blurb": "A typographic studio index with vermilion accents and concise project blocks.",
    "style": {
      "colors": {
        "background": "#f2f0ec",
        "text": "#251f1b",
        "muted": "#74675d",
        "surface": "#fffbf7",
        "accent": "#b24128",
        "accentText": "#ffffff",
        "border": "#d3d1cd"
      },
      "background": {
        "kind": "solid",
        "color": "#f2f0ec"
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "md",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "compact",
        "rhythm": "tight"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "kiln": {
    "blurb": "Clay silk, a maker\u2019s mark and a tactile product collection.",
    "style": {
      "colors": {
        "background": "#efdfce",
        "text": "#523a2b",
        "muted": "#7c6655",
        "surface": "#fffaf2",
        "accent": "#7c482c",
        "accentText": "#ffffff",
        "border": "#d7c6b6"
      },
      "background": {
        "kind": "shader",
        "style": "silk",
        "base": "#efdfce",
        "colors": [
          "#efdfce",
          "#d5bca9",
          "#f7ece0"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "fraunces",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
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
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  "ritual": {
    "blurb": "Soft green flow with a personal portrait and clear session choices.",
    "style": {
      "colors": {
        "background": "#e9efdc",
        "text": "#2c3a29",
        "muted": "#63715c",
        "surface": "#fcfff6",
        "accent": "#526d43",
        "accentText": "#ffffff",
        "border": "#cdd4c1"
      },
      "background": {
        "kind": "shader",
        "style": "aurora",
        "base": "#e9efdc",
        "colors": [
          "#e9efdc",
          "#c6d1b9",
          "#f2f7e9"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "petal": {
    "blurb": "Blush and berry, a floating photo and expressive floral work.",
    "style": {
      "colors": {
        "background": "#f7e8ee",
        "text": "#4a293a",
        "muted": "#805c70",
        "surface": "#fffafc",
        "accent": "#8e3f67",
        "accentText": "#ffffff",
        "border": "#ddcbd3"
      },
      "background": {
        "kind": "gradient",
        "from": "#f7e8ee",
        "to": "#e4cad6",
        "angle": 135,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "fraunces",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "founder": {
    "blurb": "A precise founder profile, drifting silver and individually raised project blocks.",
    "style": {
      "colors": {
        "background": "#eef0f3",
        "text": "#20262e",
        "muted": "#646e7a",
        "surface": "#ffffff",
        "accent": "#223a46",
        "accentText": "#ffffff",
        "border": "#d9dfe4"
      },
      "background": {
        "kind": "shader",
        "style": "aurora",
        "base": "#eef0f3",
        "colors": [
          "#ffffff",
          "#dce3e9",
          "#eef0f3"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "geist",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "compact",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "lively"
    }
  },
  "habitat": {
    "blurb": "Mineral grain, open photography and editorial serif type.",
    "style": {
      "colors": {
        "background": "#eee8df",
        "text": "#443b32",
        "muted": "#786b5d",
        "surface": "#fffcf6",
        "accent": "#6f604c",
        "accentText": "#ffffff",
        "border": "#d4cec5"
      },
      "background": {
        "kind": "shader",
        "style": "grain",
        "base": "#eee8df",
        "colors": [
          "#eee8df",
          "#d1c9bd",
          "#f6f2ea"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
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
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "frame": {
    "blurb": "Midnight slate, cinematic imagery and separate production offers.",
    "style": {
      "colors": {
        "background": "#10151d",
        "text": "#f5f5f1",
        "muted": "#a9b2bd",
        "surface": "#202936",
        "accent": "#cfdfef",
        "accentText": "#15202e",
        "border": "#32373d"
      },
      "background": {
        "kind": "solid",
        "color": "#10151d"
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "strong"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "advisory": {
    "blurb": "A blue-grey wash, compact introduction and calm professional services.",
    "style": {
      "colors": {
        "background": "#e3ecf3",
        "text": "#283a4d",
        "muted": "#5f7284",
        "surface": "#ffffff",
        "accent": "#285778",
        "accentText": "#ffffff",
        "border": "#c7d1da"
      },
      "background": {
        "kind": "gradient",
        "from": "#e3ecf3",
        "to": "#c1d1dd",
        "angle": 165,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "manrope",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
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
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "lune": {
    "blurb": "Lilac silk and translucent surfaces for a personal beauty studio.",
    "style": {
      "colors": {
        "background": "#eae5f1",
        "text": "#43324f",
        "muted": "#776482",
        "surface": "#fcfaff",
        "accent": "#755288",
        "accentText": "#ffffff",
        "border": "#d1cad9"
      },
      "background": {
        "kind": "shader",
        "style": "silk",
        "base": "#eae5f1",
        "colors": [
          "#eae5f1",
          "#cfc3d9",
          "#f3f0f8"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "bricolage",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "glass",
        "opacity": 94,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "batch": {
    "blurb": "A warm bakery cover with a compact menu and collection information.",
    "style": {
      "colors": {
        "background": "#fff3da",
        "text": "#54321d",
        "muted": "#86694b",
        "surface": "#fffcf5",
        "accent": "#9c4828",
        "accentText": "#ffffff",
        "border": "#e5d6be"
      },
      "background": {
        "kind": "solid",
        "color": "#fff3da"
      },
      "text": {
        "headingFont": "fraunces",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "columns",
        "width": "wide",
        "density": "compact",
        "rhythm": "tight"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "cursor": {
    "blurb": "A crisp digital portfolio with a drifting periwinkle wash.",
    "style": {
      "colors": {
        "background": "#edf2ff",
        "text": "#23385b",
        "muted": "#5d7090",
        "surface": "#ffffff",
        "accent": "#315dba",
        "accentText": "#ffffff",
        "border": "#cfd6e6"
      },
      "background": {
        "kind": "gradient",
        "from": "#edf2ff",
        "to": "#cbd7f3",
        "angle": 165,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "geist",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "archive": {
    "blurb": "Espresso and parchment, a curated collection with warm serif type.",
    "style": {
      "colors": {
        "background": "#31241e",
        "text": "#f9efdf",
        "muted": "#c5b3a1",
        "surface": "#49382d",
        "accent": "#eed3a4",
        "accentText": "#3f2c19",
        "border": "#4f423b"
      },
      "background": {
        "kind": "solid",
        "color": "#31241e"
      },
      "text": {
        "headingFont": "sourceSerif",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
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
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  "social": {
    "blurb": "Peach flow, centred identity and distinct creative offers.",
    "style": {
      "colors": {
        "background": "#f7e4dc",
        "text": "#5a2f29",
        "muted": "#8c625c",
        "surface": "#fff8f5",
        "accent": "#b94c37",
        "accentText": "#ffffff",
        "border": "#dfc9c1"
      },
      "background": {
        "kind": "shader",
        "style": "aurora",
        "base": "#f7e4dc",
        "colors": [
          "#f7e4dc",
          "#e9c1b6",
          "#fbeee8"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "bricolage",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "center"
      },
      "header": {
        "layout": "centered",
        "align": "center",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "lively"
    }
  },
  "tempo": {
    "blurb": "Petrol silk, mint actions and layered sound-studio blocks.",
    "style": {
      "colors": {
        "background": "#172628",
        "text": "#eef7f2",
        "muted": "#acc3bd",
        "surface": "#243f40",
        "accent": "#bce6d4",
        "accentText": "#203d33",
        "border": "#374546"
      },
      "background": {
        "kind": "shader",
        "style": "silk",
        "base": "#172628",
        "colors": [
          "#172628",
          "#3d5250",
          "#1e3234"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "spaceGrotesk",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "center"
      },
      "header": {
        "layout": "centered",
        "align": "center",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "strong"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "glass",
        "opacity": 94,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "canvas": {
    "blurb": "Ochre paper, an editorial introduction and original illustration.",
    "style": {
      "colors": {
        "background": "#f7e4c1",
        "text": "#553b29",
        "muted": "#896b4d",
        "surface": "#fff9ed",
        "accent": "#9b492d",
        "accentText": "#ffffff",
        "border": "#dfcbaa"
      },
      "background": {
        "kind": "solid",
        "color": "#f7e4c1"
      },
      "text": {
        "headingFont": "bricolage",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
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
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "grain",
      "motion": "subtle"
    }
  },
  "stride": {
    "blurb": "A photographic fade, athletic type and grounded evergreen actions.",
    "style": {
      "colors": {
        "background": "#e0e9e4",
        "text": "#1c3a30",
        "muted": "#5d7368",
        "surface": "#f7fffa",
        "accent": "#26513e",
        "accentText": "#ffffff",
        "border": "#c3cfc9"
      },
      "background": {
        "kind": "gradient",
        "from": "#e0e9e4",
        "to": "#bfcec6",
        "angle": 165,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "barlowCondensed",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "split",
        "width": "wide",
        "density": "compact",
        "rhythm": "tight"
      },
      "decoration": "none",
      "motion": "lively"
    }
  },
  "repair": {
    "blurb": "A precise repair counter in cool paper and confident blue.",
    "style": {
      "colors": {
        "background": "#e9edf2",
        "text": "#263546",
        "muted": "#627085",
        "surface": "#ffffff",
        "accent": "#2d5f91",
        "accentText": "#ffffff",
        "border": "#ccd1d8"
      },
      "background": {
        "kind": "solid",
        "color": "#e9edf2"
      },
      "text": {
        "headingFont": "geist",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "sm",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "rounded",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "solid",
        "opacity": 100,
        "radius": "lg",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "columns",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "even"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "occasion": {
    "blurb": "Rose grain, floating imagery and translucent event details.",
    "style": {
      "colors": {
        "background": "#f7eae6",
        "text": "#663b42",
        "muted": "#95717a",
        "surface": "#fffaf8",
        "accent": "#934758",
        "accentText": "#ffffff",
        "border": "#e1d0cd"
      },
      "background": {
        "kind": "shader",
        "style": "grain",
        "base": "#f7eae6",
        "colors": [
          "#f7eae6",
          "#e0c5c5",
          "#fbf2ef"
        ],
        "source": "manual",
        "motion": true
      },
      "text": {
        "headingFont": "fraunces",
        "bodyFont": "manrope",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "banner",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
      },
      "buttons": {
        "shape": "pill",
        "fill": "solid",
        "shadow": "soft",
        "showIcons": true
      },
      "cards": {
        "surface": "glass",
        "opacity": 94,
        "radius": "xl",
        "border": "none",
        "shadow": "soft",
        "padding": "comfortable"
      },
      "layout": {
        "desktop": "centered",
        "width": "regular",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  },
  "still": {
    "blurb": "Quiet olive gradients, a personal introduction and open breathing room.",
    "style": {
      "colors": {
        "background": "#f1efe1",
        "text": "#3b4733",
        "muted": "#737b65",
        "surface": "#fffef7",
        "accent": "#61734d",
        "accentText": "#ffffff",
        "border": "#d6d6c7"
      },
      "background": {
        "kind": "gradient",
        "from": "#f1efe1",
        "to": "#d7d9c6",
        "angle": 135,
        "motion": true,
        "source": "manual"
      },
      "text": {
        "headingFont": "lexend",
        "bodyFont": "inter",
        "size": "md",
        "headingWeight": "bold",
        "headingCase": "normal",
        "align": "left"
      },
      "header": {
        "layout": "side",
        "align": "left",
        "avatarShape": "logo",
        "avatarSize": "md",
        "scrim": "medium"
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
        "desktop": "split",
        "width": "wide",
        "density": "comfortable",
        "rhythm": "editorial"
      },
      "decoration": "none",
      "motion": "subtle"
    }
  }
};
