import { LitElement, html, css } from 'lit';

/**
 * CounterApp web component
 * A simple counter with min/max limits and confetti effect
 */
export class CounterApp extends LitElement {
  static get properties() {
    return {
      counter: { type: Number },
      min: { type: Number },
      max: { type: Number }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        font-family: var(--ddd-font-primary);
      }

      .wrapper {
        text-align: center;
      }

      .counter-value {
        font-size: 64px;
        font-weight: bold;
        margin: 16px 0;
        color: var(--ddd-theme-default-potentialMidnight);
      }

      .counter-value.eighteen {
        color: var(--ddd-theme-default-original87Pink);
      }

      .counter-value.twentyone {
        color: var(--ddd-theme-default-opportunityGreen);
      }

      .counter-value.min-max {
        color: var(--ddd-theme-default-nittanyNavy);
      }

      .button-container {
        display: flex;
        gap: 16px;
        justify-content: center;
        margin-top: 16px;
      }

      button {
        padding: 16px 32px;
        font-size: 24px;
        font-weight: bold;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.08s ease;
      }

      /* Specific colors for decrement and increment so they are visible */
      .decrement {
        background-color: #1e88e5; /* blue */
      }

      .decrement:hover {
        background-color: #1565c0;
        transform: translateY(-1px);
      }

      .increment {
        background-color: #e53935; /* red */
      }

      .increment:hover {
        background-color: #b71c1c;
        transform: translateY(-1px);
      }

      button:focus {
        outline: 2px solid var(--ddd-theme-default-keystoneYellow);
        outline-offset: 4px;
      }

      button:disabled {
        background-color: var(--ddd-theme-default-limestoneLight);
        cursor: not-allowed;
        opacity: 0.6;
      }
    `;
  }

  /**
   * Constructor - sets default values for counter, min, and max
   */
  constructor() {
    super();
    this.counter = 0;
    this.min = 0;
    this.max = 100;
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
   * Render method - returns the HTML template for the component
   */
  render() {
    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
          <div class="counter-value ${this.getCounterClass()}">
            ${this.counter}
          </div>
          <div class="button-container">
            <button 
              class="decrement"
              @click="${this.decrement}" 
              ?disabled="${this.min === this.counter}">
              -
            </button>
            <button 
              class="increment"
              @click="${this.increment}" 
              ?disabled="${this.max === this.counter}">
              +
            </button>
          </div>
        </div>
      </confetti-container>
    `;
  }
}

customElements.define('counter-app', CounterApp);
