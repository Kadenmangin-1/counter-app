/**
 * Copyright 2025 elliebluejay
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * A simple counter web component with min/max limits and confetti effect
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  /**
   * Constructor - initializes default values for counter, min, and max
   */
  constructor() {
    super();
    this.counter = 0;
    this.min = 0;
    this.max = 100;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      counter: { type: Number },
      min: { type: Number },
      max: { type: Number }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        padding: var(--ddd-spacing-4);
        font-family: var(--ddd-font-primary);
      }

      .wrapper {
        text-align: center;
      }

      .counter {
        font-size: var(--ddd-font-size-4xl);
        font-weight: var(--ddd-font-weight-bold);
        margin: var(--ddd-spacing-4) 0;
        color: var(--ddd-theme-default-potentialMidnight);
      }

      .counter.eighteen {
        color: var(--ddd-theme-default-original87Pink);
      }

      .counter.twentyone {
        color: var(--ddd-theme-default-opportunityGreen);
      }

      .counter.min-max {
        color: var(--ddd-theme-default-nittanyNavy);
      }

      .buttons {
        display: flex;
        justify-content: center;
        gap: var(--ddd-spacing-4);
        margin-top: var(--ddd-spacing-4);
      }

      button {
        padding: var(--ddd-spacing-4) var(--ddd-spacing-8);
        font-size: var(--ddd-font-size-xl);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-white);
        border: none;
        border-radius: var(--ddd-radius-sm);
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.05s ease;
      }

      /* Explicit, high-contrast colors for visibility */
      button.decrement {
        background-color: #dc3545; /* red */
      }
      button.decrement:hover:not(:disabled) {
        background-color: #c82333;
      }

      button.increment {
        background-color: #007bff; /* blue */
      }
      button.increment:hover:not(:disabled) {
        background-color: #0056b3;
      }

      button:active:not(:disabled) {
        transform: translateY(1px);
      }

      button:focus {
        outline: 2px solid var(--ddd-theme-default-keystoneYellow);
        outline-offset: var(--ddd-spacing-1);
      }

      button:disabled {
        background-color: var(--ddd-theme-default-limestoneLight);
        cursor: not-allowed;
        opacity: 0.5;
      }
    `,  
    ];
  }

  /**
   * Render method - returns the HTML template for the component
   */
  render() {
    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
          <div class="counter ${this.getCounterClass()}">
            ${this.counter}
          </div>
          <div class="buttons">
            <button
              class="decrement"
              @click="${this.decrement}"
              ?disabled="${this.counter === this.min}"
              aria-label="Decrement"
              title="Decrement"
            >
              -
            </button>
            <button
              class="increment"
              @click="${this.increment}"
              ?disabled="${this.counter === this.max}"
              aria-label="Increment"
              title="Increment"
            >
              +
            </button>
          </div>
        </div>
      </confetti-container>
    `;
  }

  /**
   * Increment the counter by 1, but don't exceed max
   */
  increment() {
    if (this.counter < this.max) {
      this.counter++;
    }
  }

  /**
   * Decrement the counter by 1, but don't go below min
   */
  decrement() {
    if (this.counter > this.min) {
      this.counter--;
    }
  }

  /**
   * Get the CSS class for the counter value based on current value
   */
  getCounterClass() {
    if (this.counter === this.min || this.counter === this.max) {
      return 'min-max';
    }
    if (this.counter === 21) {
      return 'twentyone';
    }
    if (this.counter === 18) {
      return 'eighteen';
    }
    return '';
  }

  /**
   * Lifecycle method called when properties change
   * Triggers confetti when counter reaches 21
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('counter')) {
      if (this.counter === 21) {
        this.makeItRain();
      }
    }
  }

  /**
   * Dynamically imports confetti library and triggers the confetti effect
   */
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);
