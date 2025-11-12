/**
 * Copyright 2025 kadenmangin
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `cost-input`
 * A number input component with increment/decrement buttons and validation
 * 
 * @demo index.html
 * @element cost-input
 */
export class CostInput extends DDDSuper(LitElement) {

  static get tag() {
    return "cost-input";
  }

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.step = 1;
    this.disabled = false;
    this.placeholder = "";
    this.label = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      value: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      disabled: { type: Boolean },
      placeholder: { type: String },
      label: { type: String }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        font-family: var(--ddd-font-primary);
      }

      .input-wrapper {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-2);
        position: relative;
      }

      input {
        flex: 1;
        padding: var(--ddd-spacing-3);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-xs);
        font-family: var(--ddd-font-primary);
        font-size: var(--ddd-font-size-s);
        background: var(--ddd-theme-default-white);
        border-color: var(--ddd-theme-default-limestoneMaxLight);
        box-sizing: border-box;
        text-align: center;
        min-width: 0;
        -moz-appearance: textfield; /* Firefox */
      }

      /* Hide spinner arrows for Webkit browsers */
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input:focus {
        outline: none;
        border-color: var(--ddd-theme-default-keystoneYellow);
        box-shadow: 0 0 0 2px var(--ddd-theme-default-keystoneYellow)20;
      }

      input:disabled {
        background: var(--ddd-theme-default-disabled);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .btn-group {
        display: flex;
        flex-direction: column;
        gap: var(--ddd-spacing-1);
      }

      button {
        padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-xs);
        background: var(--ddd-theme-default-nittanyNavy);
        color: var(--ddd-theme-default-white);
        cursor: pointer;
        font-family: var(--ddd-font-primary);
        font-size: var(--ddd-font-size-xs);
        font-weight: var(--ddd-font-weight-bold);
        min-width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        user-select: none;
      }

      button:hover:not(:disabled) {
        background: var(--ddd-theme-default-originalPrimary);
        transform: scale(1.05);
        box-shadow: var(--ddd-boxShadow-sm);
      }

      button:active:not(:disabled) {
        transform: scale(0.95);
      }

      button:disabled {
        background: var(--ddd-theme-default-disabled);
        cursor: not-allowed;
        opacity: 0.4;
      }

      .increment-btn {
        border-bottom: none;
        border-radius: var(--ddd-radius-xs) var(--ddd-radius-xs) 0 0;
      }

      .decrement-btn {
        border-top: none;
        border-radius: 0 0 var(--ddd-radius-xs) var(--ddd-radius-xs);
      }

      /* Compact horizontal layout option */
      :host([layout="horizontal"]) .input-wrapper {
        flex-direction: row;
      }

      :host([layout="horizontal"]) .btn-group {
        flex-direction: row;
        gap: var(--ddd-spacing-1);
      }

      :host([layout="horizontal"]) .increment-btn {
        border-radius: 0 var(--ddd-radius-xs) var(--ddd-radius-xs) 0;
        border-left: none;
      }

      :host([layout="horizontal"]) .decrement-btn {
        border-radius: var(--ddd-radius-xs) 0 0 var(--ddd-radius-xs);
        border-right: none;
      }

      :host([layout="horizontal"]) button {
        min-width: 32px;
        height: auto;
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
      }

      /* Error state */
      :host([error]) input {
        border-color: var(--ddd-theme-default-original87Pink);
        box-shadow: 0 0 0 2px var(--ddd-theme-default-original87Pink)20;
      }

      .validation-message {
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-original87Pink);
        margin-top: var(--ddd-spacing-1);
        min-height: var(--ddd-font-size-xs);
        display: block;
      }

      /* Success state for visual feedback */
      :host([success]) input {
        border-color: var(--ddd-theme-default-creekTeal);
        box-shadow: 0 0 0 2px var(--ddd-theme-default-creekTeal)20;
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        input {
          background: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
          border-color: var(--ddd-theme-default-slateGray);
        }

        input:disabled {
          background: var(--ddd-theme-default-slateMaxLight);
        }
      }
    `];
  }

  render() {
    return html`
      <div class="input-wrapper">
        <input
          type="number"
          .value="${this.value}"
          .min="${this.min}"
          .max="${this.max}"
          .step="${this.step}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          @input="${this._handleInput}"
          @blur="${this._handleBlur}"
          @keydown="${this._handleKeyDown}"
        />
        <div class="btn-group">
          <button 
            class="increment-btn"
            @click="${this._increment}"
            ?disabled="${this.disabled || this.value >= this.max}"
            title="Increase value"
          >
            +
          </button>
          <button 
            class="decrement-btn"
            @click="${this._decrement}"
            ?disabled="${this.disabled || this.value <= this.min}"
            title="Decrease value"
          >
            -
          </button>
        </div>
      </div>
      <span class="validation-message">${this._getValidationMessage()}</span>
    `;
  }

  _handleInput(e) {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      this.value = newValue;
      this._validateAndEmit();
    }
  }

  _handleBlur(e) {
    // Ensure value is within bounds when user finishes editing
    this.value = this._clampValue(parseFloat(e.target.value) || this.min);
    this._validateAndEmit();
  }

  _handleKeyDown(e) {
    // Allow arrow keys to increment/decrement
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._decrement();
    }
  }

  _increment() {
    if (this.value < this.max) {
      this.value = this._clampValue(this.value + this.step);
      this._validateAndEmit();
    }
  }

  _decrement() {
    if (this.value > this.min) {
      this.value = this._clampValue(this.value - this.step);
      this._validateAndEmit();
    }
  }

  _clampValue(value) {
    return Math.min(this.max, Math.max(this.min, value));
  }

  _validateAndEmit() {
    // Remove error state if value is now valid
    if (this.value >= this.min && this.value <= this.max) {
      this.removeAttribute('error');
    }
    
    // Emit custom event with the new value
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  _getValidationMessage() {
    if (this.value < this.min) {
      return `Value must be at least ${this.min}`;
    }
    if (this.value > this.max) {
      return `Value must be no more than ${this.max}`;
    }
    return '';
  }

  // Update validation state when properties change
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }

    if (changedProperties.has('value') || changedProperties.has('min') || changedProperties.has('max')) {
      const isValid = this.value >= this.min && this.value <= this.max;
      
      if (isValid) {
        this.removeAttribute('error');
      } else {
        this.setAttribute('error', '');
      }
    }
  }

  // Method to programmatically set value
  setValue(value) {
    this.value = this._clampValue(parseFloat(value) || this.min);
    this._validateAndEmit();
  }

  // Method to reset to minimum value
  reset() {
    this.value = this.min;
    this._validateAndEmit();
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CostInput.tag, CostInput);