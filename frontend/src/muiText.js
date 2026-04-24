class MuiText extends HTMLElement {
  static formAssociated = true;

  static get observedAttributes() {
    return ["width", "height", "label", "variant", "required"];
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
    this._applyDimensions();
    this._bindEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "width" || name === "height") {
      this._applyDimensions();
    } else {
      this._render();
      this._bindEvents();
    }
  }

  _getVariant() {
    return this.getAttribute("variant") || "outlined";
  }

  _render() {
    const label = this.getAttribute("label") || "";
    const required = this.hasAttribute("required");
    const variant = this._getVariant();

    const variantStyles = {
      outlined: `
        .field-wrapper {
          position: relative;
          border-radius: 4px;
        }
        fieldset {
          position: absolute;
          inset: -5px 0 0 0;
          border: 1px solid rgba(0,0,0,0.23);
          border-radius: inherit;
          margin: 0;
          padding: 0 8px;
          pointer-events: none;
          transition: border-color 0.2s ease;
        }
        .field-wrapper:hover fieldset {
          border-color: rgba(0,0,0,0.87);
        }
        .field-wrapper:focus-within fieldset {
          border: 2px solid #1976d2;
        }
        legend {
          display: block;
          visibility: hidden;
          height: 11px;
          font-size: 0.75em;
          max-width: 0.01px;
          white-space: nowrap;
          padding: 0;
          transition: max-width 100ms cubic-bezier(0,0,0.2,1) 50ms;
          overflow: hidden;
        }
        legend span { padding: 0 5px; }
        .field-wrapper:focus-within legend,
        .field-wrapper.has-value legend {
          max-width: 100%;
        }
        input {
          padding: 16.5px 14px;
          background: transparent;
        }
        .floating-label {
          left: 14px;
          transform: translate(0, 16px) scale(1);
        }
        .field-wrapper:focus-within .floating-label,
        .field-wrapper.has-value .floating-label {
          transform: translate(0, -9px) scale(0.75);
          color: #1976d2;
          background: transparent;
          padding: 0 5px;
          left: 9px;
        }
      `,
      filled: `
        .field-wrapper {
          position: relative;
          border-radius: 4px 4px 0 0;
          background: rgba(0,0,0,0.06);
          transition: background 0.2s;
        }
        .field-wrapper:hover {
          background: rgba(0,0,0,0.09);
        }
        .field-wrapper:focus-within {
          background: rgba(0,0,0,0.09);
        }
        fieldset { display: none; }
        .underline {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(0,0,0,0.42);
        }
        .underline::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%; right: 50%;
          height: 2px;
          background: #1976d2;
          transition: left 0.2s ease, right 0.2s ease;
        }
        .field-wrapper:focus-within .underline::after {
          left: 0; right: 0;
        }
        input {
          padding: 25px 12px 8px;
          background: transparent;
        }
        .floating-label {
          left: 12px;
          transform: translate(0, 16px) scale(1);
        }
        .field-wrapper:focus-within .floating-label,
        .field-wrapper.has-value .floating-label {
          transform: translate(0, 8px) scale(0.75);
          color: #1976d2;
        }
      `,
      standard: `
        .field-wrapper {
          position: relative;
        }
        fieldset { display: none; }
        .underline {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(0,0,0,0.42);
        }
        .underline::after {
          content: '';
          position: absolute;
          bottom: 0; left: 50%; right: 50%;
          height: 2px;
          background: #1976d2;
          transition: left 0.2s ease, right 0.2s ease;
        }
        .field-wrapper:focus-within .underline::after {
          left: 0; right: 0;
        }
        input {
          padding: 4px 0 5px;
          background: transparent;
        }
        .floating-label {
          left: 0;
          transform: translate(0, 0px) scale(1);
        }
        .field-wrapper:focus-within .floating-label,
        .field-wrapper.has-value .floating-label {
          transform: translate(0, -15px) scale(0.75);
          color: #1976d2;
        }
      `,
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-flex;
          flex-direction: column;
          min-width: 200px;
          vertical-align: top;
          margin-top: 8px;
        }

        /* ── Reset base ── */
        *, *::before, *::after { box-sizing: border-box; }

        .field-wrapper {
          position: relative;
          cursor: text;
        }

        fieldset {
          margin: 0;
          padding: 0;
          border: none;
        }

        input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          color: rgba(0,0,0,0.87);
          display: block;
        }

        /* ── Label flotante ── */
        .floating-label {
          position: absolute;
          top: 0;
          transform-origin: left top;
          font-size: 1rem;
          line-height: 1.4375em;
          letter-spacing: 0.00938em;
          color: rgba(0,0,0,0.6);
          pointer-events: none;
          transition: color 200ms cubic-bezier(0,0,0.2,1) 0ms,
                      transform 200ms cubic-bezier(0,0,0.2,1) 0ms,
                      max-width 200ms cubic-bezier(0,0,0.2,1) 0ms;
          z-index: 1;
          white-space: nowrap;
        }

        .field-wrapper:hover .floating-label { color: rgba(0,0,0,0.87); }
        .field-wrapper:focus-within .floating-label { color: #1976d2; }

        ${variantStyles[variant] || variantStyles.outlined}
      </style>

      <div class="field-wrapper">
        <fieldset aria-hidden="true">
          <legend><span>${label}${required ? "\u00a0*" : ""}</span></legend>
        </fieldset>
        <span class="floating-label">${label}${required ? "\u00a0*" : ""}</span>
        <input type="text" placeholder="" />
        ${variant !== "outlined" ? '<div class="underline"></div>' : ""}
      </div>
    `;
  }

  _bindEvents() {
    const wrapper = this.shadowRoot.querySelector(".field-wrapper");
    const input = this.shadowRoot.querySelector("input");
    if (!wrapper || !input) return;

    const sync = () => {
      wrapper.classList.toggle("has-value", !!input.value);
    };

    input.addEventListener("input", () => {
      this._internals.setFormValue(input.value);
      sync();
    });

    sync();
  }

  _applyDimensions() {
    this.style.width = this.getAttribute("width") || "";
    this.style.height = this.getAttribute("height") || "";
  }

  get value() {
    return this.shadowRoot.querySelector("input")?.value ?? "";
  }

  set value(val) {
    const input = this.shadowRoot.querySelector("input");
    if (!input) return;
    input.value = val;
    this._internals.setFormValue(val);
    this.shadowRoot.querySelector(".field-wrapper")
      ?.classList.toggle("has-value", !!val);
  }
}

customElements.define("mui-text", MuiText);