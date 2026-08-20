/*
  Cosmic Dream Bog — Koda glyph renderer
  Asset expected next to this file: koda-glyphs.png

  Usage:
    KodaGlyphs.render("Mutant Ape Yacht Club", element);

  This renders A-Z as Koda glyphs using the sprite.
  Spaces, numbers and punctuation remain readable.
*/

(() => {
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const CELL = 64;
  const SPRITE = "koda-glyphs.png";

  function injectStyles() {
    if (document.getElementById("koda-glyph-styles")) return;

    const style = document.createElement("style");
    style.id = "koda-glyph-styles";
    style.textContent = `
      .koda-word {
        display: inline-flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1px;
        min-height: 1.25em;
      }

      .koda-glyph {
        display: inline-block;
        width: 0.82em;
        height: 1.05em;
        background-image: url("${SPRITE}");
        background-repeat: no-repeat;
        background-size: calc(26 * 100%) 100%;
        background-position-y: center;
        background-color: transparent;
        flex: 0 0 auto;
      }

      .koda-space {
        width: 0.42em;
        flex: 0 0 auto;
      }

      .koda-plain {
        display: inline-block;
        line-height: 1;
      }
    `;
    document.head.appendChild(style);
  }

  function glyphSpan(letter) {
    const index = LETTERS.indexOf(letter);
    if (index < 0) return null;

    const span = document.createElement("span");
    span.className = "koda-glyph";
    span.setAttribute("aria-hidden", "true");

    // Each glyph occupies exactly 1/26th of the sprite width.
    const x = index === 25 ? 100 : (index / 25) * 100;
    span.style.backgroundPositionX = `${x}%`;
    span.dataset.letter = letter;

    return span;
  }

  function render(text, target) {
    injectStyles();

    if (!target) return;

    const value = String(text ?? "");
    const wrapper = document.createElement("span");
    wrapper.className = "koda-word";
    wrapper.setAttribute("aria-label", value);

    for (const char of value) {
      const upper = char.toUpperCase();

      if (upper >= "A" && upper <= "Z") {
        wrapper.appendChild(glyphSpan(upper));
      } else if (char === " ") {
        const space = document.createElement("span");
        space.className = "koda-space";
        space.setAttribute("aria-hidden", "true");
        wrapper.appendChild(space);
      } else {
        const plain = document.createElement("span");
        plain.className = "koda-plain";
        plain.textContent = char;
        wrapper.appendChild(plain);
      }
    }

    target.replaceChildren(wrapper);
  }

  window.KodaGlyphs = {
    render
  };
})();