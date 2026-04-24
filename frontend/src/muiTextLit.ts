import { LitElement, html, css } from "lit";
import type { CSSResultGroup, TemplateResult, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

type Variant = "outlined" | "filled" | "standard";

@customElement("mui-text-lit")
export class MuiText extends LitElement {
  static formAssociated = true;

  static styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      min-width: 200px;
      vertical-align: top;
      margin-top: 8px;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

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
      color: rgba(0, 0, 0, 0.87);
      display: block;
    }

    .floating-label {
      position: absolute;
      top: 0;
      transform-origin: left top;
      font-size: 1rem;
      line-height: 1.4375em;
      letter-spacing: 0.00938em;
      color: rgba(0, 0, 0, 0.6);
      pointer-events: none;
      transition:
        color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
        transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
        max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
      z-index: 1;
      white-space: nowrap;
    }

    .field-wrapper:hover .floating-label {
      color: rgba(0, 0, 0, 0.87);
    }
    .field-wrapper:focus-within .floating-label {
      color: #1976d2;
    }

    .variant-outlined {
      border-radius: 4px;
    }

    .variant-outlined fieldset {
      position: absolute;
      inset: -5px 0 0 0;
      border: 1px solid rgba(0, 0, 0, 0.23);
      border-radius: inherit;
      margin: 0;
      padding: 0 8px;
      pointer-events: none;
      transition: border-color 0.2s ease;
    }

    .variant-outlined:hover fieldset {
      border-color: rgba(0, 0, 0, 0.87);
    }
    .variant-outlined:focus-within fieldset {
      border: 2px solid #1976d2;
    }

    .variant-outlined legend {
      display: block;
      visibility: hidden;
      height: 11px;
      font-size: 0.75em;
      max-width: 0.01px;
      white-space: nowrap;
      padding: 0;
      transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
      overflow: hidden;
    }

    .variant-outlined legend span {
      padding: 0 5px;
    }

    .variant-outlined:focus-within legend,
    .variant-outlined.has-value legend {
      max-width: 100%;
    }

    .variant-outlined input {
      padding: 16.5px 14px;
      background: transparent;
    }

    .variant-outlined .floating-label {
      left: 14px;
      transform: translate(0, 16px) scale(1);
    }

    .variant-outlined:focus-within .floating-label,
    .variant-outlined.has-value .floating-label {
      transform: translate(0, -9px) scale(0.75);
      color: #1976d2;
      padding: 0 5px;
      left: 9px;
    }

    .variant-filled {
      border-radius: 4px 4px 0 0;
      background: rgba(0, 0, 0, 0.06);
      transition: background 0.2s;
    }

    .variant-filled:hover {
      background: rgba(0, 0, 0, 0.09);
    }
    .variant-filled:focus-within {
      background: rgba(0, 0, 0, 0.09);
    }
    .variant-filled fieldset {
      display: none;
    }

    .variant-filled input {
      padding: 25px 12px 8px;
      background: transparent;
    }

    .variant-filled .floating-label {
      left: 12px;
      transform: translate(0, 16px) scale(1);
    }

    .variant-filled:focus-within .floating-label,
    .variant-filled.has-value .floating-label {
      transform: translate(0, 8px) scale(0.75);
      color: #1976d2;
    }

    .variant-standard {
      position: relative;
    }

    .variant-standard fieldset {
      display: none;
    }

    .variant-standard input {
      padding: 4px 0 5px;
      background: transparent;
    }

    .variant-standard .floating-label {
      left: 0;
      transform: translate(0, 0px) scale(1);
    }

    .variant-standard:focus-within .floating-label,
    .variant-standard.has-value .floating-label {
      transform: translate(0, -15px) scale(0.75);
      color: #1976d2;
    }

    .underline {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(0, 0, 0, 0.42);
    }

    .underline::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      right: 50%;
      height: 2px;
      background: #1976d2;
      transition:
        left 0.2s ease,
        right 0.2s ease;
    }

    .field-wrapper:focus-within .underline::after {
      left: 0;
      right: 0;
    }
  `;

  private _internals: ElementInternals;

  @property({ type: String, reflect: true }) width?: string;
  @property({ type: String, reflect: true }) height?: string;
  @property({ type: String, reflect: true }) label: string = "";
  @property({ type: String, reflect: true }) variant: Variant = "outlined";
  @property({ type: Boolean, reflect: true }) required: boolean = false;

  @state() private _hasValue: boolean = false;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("width")) this.style.width = this.width ?? "";
    if (changed.has("height")) this.style.height = this.height ?? "";
  }

  private _onInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this._internals.setFormValue(val);
    this._hasValue = !!val;
  }

  get value(): string {
    return (
      (this.shadowRoot?.querySelector("input") as HTMLInputElement | null)
        ?.value ?? ""
    );
  }

  set value(val: string) {
    const input = this.shadowRoot?.querySelector(
      "input",
    ) as HTMLInputElement | null;
    if (!input) return;
    input.value = val;
    this._internals.setFormValue(val);
    this._hasValue = !!val;
  }

  protected render(): TemplateResult {
    const labelText = `${this.label}${this.required ? "\u00a0*" : ""}`;
    const showUnderline = this.variant !== "outlined";

    const wrapperClasses = {
      "field-wrapper": true,
      [`variant-${this.variant}`]: true,
      "has-value": this._hasValue,
    };

    return html`
      <div class=${classMap(wrapperClasses)}>
        <fieldset aria-hidden="true">
          <legend><span>${labelText}</span></legend>
        </fieldset>

        <span class="floating-label">${labelText}</span>

        <input type="text" placeholder="" @input=${this._onInput} />

        ${showUnderline ? html`<div class="underline"></div>` : ""}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mui-text-lit": MuiText;
  }
}
