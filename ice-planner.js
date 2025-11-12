/**
 * Copyright 2025 kadenmangin
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./cost-input.js";

/**
 * `ice-planner`
 * Hockey team cost calculator for ice time, coaching, and jerseys
 * 
 * @demo index.html
 * @element ice-planner
 */
export class IcePlanner extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "ice-planner";
  }

  constructor() {
    super();
    this.teamName = "Team Hawks";
    this.logo = "";
    this.iceHours = 50;
    this.iceCostPerHour = 300;
    this.coachCost = 3000;
    this.jerseyCost = 88;
    this.numberOfPlayers = 1;
    this.feePercentage = 2;
    this.fixedFee = 0.99;
    this.subtotal = 0;
    this.totalFees = 0;
    this.totalCost = 0;
    this.costPerPlayer = 0;
    
    this._loadFromStorage();
    this._loadFromURL();
    this._calculateTotals();

    this.t = this.t || {};
    this.t = {
      ...this.t,
      teamName: "Team Name",
      iceHours: "Ice Hours", 
      coaches: "Coaches",
      jerseys: "Jerseys",
      players: "# of Players",
      feePercent: "Fee %"
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/ice-planner.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      teamName: { type: String, attribute: 'team-name' },
      logo: { type: String },
      iceHours: { type: Number, attribute: 'ice-hours' },
      iceCostPerHour: { type: Number, attribute: 'ice-cost-per-hour' },
      coachCost: { type: Number, attribute: 'coach-cost' },
      jerseyCost: { type: Number, attribute: 'jersey-cost' },
      numberOfPlayers: { type: Number, attribute: 'number-of-players' },
      feePercentage: { type: Number, attribute: 'fee-percentage' },
      fixedFee: { type: Number, attribute: 'fixed-fee' },
      subtotal: { type: Number },
      totalFees: { type: Number },
      totalCost: { type: Number },
      costPerPlayer: { type: Number }
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-default-coalyGray);
        background-color: var(--ddd-theme-default-white);
        font-family: var(--ddd-font-primary);
        padding: var(--ddd-spacing-4);
        min-height: 100vh;
      }

      .wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--ddd-spacing-6);
        border-radius: var(--ddd-radius-md);
        background: var(--ddd-theme-default-white);
        box-shadow: var(--ddd-boxShadow-md);
      }

      .header {
        text-align: center;
        margin-bottom: var(--ddd-spacing-6);
        padding-bottom: var(--ddd-spacing-4);
        border-bottom: var(--ddd-border-sm);
        border-color: var(--ddd-theme-default-limestoneLight);
      }

      .logo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 0 auto var(--ddd-spacing-4);
        background: var(--ddd-theme-default-nittanyNavy);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ddd-theme-default-white);
        font-size: var(--ddd-font-size-xl);
        font-weight: var(--ddd-font-weight-bold);
      }

      .logo img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      h1 {
        color: var(--ddd-theme-default-nittanyNavy);
        font-size: var(--ddd-font-size-3xl);
        margin: 0;
        font-weight: var(--ddd-font-weight-bold);
      }

      .subtitle {
        color: var(--ddd-theme-default-slateGray);
        font-size: var(--ddd-font-size-s);
        margin-top: var(--ddd-spacing-2);
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--ddd-spacing-6);
        margin-bottom: var(--ddd-spacing-8);
      }

      .form-section {
        background: var(--ddd-theme-default-limestoneLight);
        padding: var(--ddd-spacing-5);
        border-radius: var(--ddd-radius-sm);
        border-left: 4px solid var(--ddd-theme-default-keystoneYellow);
      }

      .form-section h3 {
        margin: 0 0 var(--ddd-spacing-4) 0;
        color: var(--ddd-theme-default-nittanyNavy);
        font-size: var(--ddd-font-size-l);
        font-weight: var(--ddd-font-weight-bold);
      }

      .input-group {
        margin-bottom: var(--ddd-spacing-4);
      }

      .input-group:last-child {
        margin-bottom: 0;
      }

      label {
        display: block;
        margin-bottom: var(--ddd-spacing-2);
        color: var(--ddd-theme-default-coalyGray);
        font-weight: var(--ddd-font-weight-medium);
        font-size: var(--ddd-font-size-s);
      }

      input[type="text"],
      input[type="number"],
      input[type="url"] {
        width: 100%;
        padding: var(--ddd-spacing-3);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-xs);
        font-family: var(--ddd-font-primary);
        font-size: var(--ddd-font-size-s);
        background: var(--ddd-theme-default-white);
        border-color: var(--ddd-theme-default-limestoneMaxLight);
        box-sizing: border-box;
      }

      input:focus {
        outline: none;
        border-color: var(--ddd-theme-default-keystoneYellow);
        box-shadow: 0 0 0 2px var(--ddd-theme-default-keystoneYellow)20;
      }

      .number-input-wrapper {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-2);
      }

      .number-input-wrapper input {
        flex: 1;
        min-width: 0;
      }

      .btn-group {
        display: flex;
        gap: var(--ddd-spacing-1);
      }

      button {
        padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
        border: var(--ddd-border-sm);
        border-radius: var(--ddd-radius-xs);
        background: var(--ddd-theme-default-nittanyNavy);
        color: var(--ddd-theme-default-white);
        cursor: pointer;
        font-family: var(--ddd-font-primary);
        font-size: var(--ddd-font-size-s);
        font-weight: var(--ddd-font-weight-medium);
        min-width: 32px;
        transition: all 0.2s ease;
      }

      button:hover:not(:disabled) {
        background: var(--ddd-theme-default-originalPrimary);
        transform: translateY(-1px);
        box-shadow: var(--ddd-boxShadow-sm);
      }

      button:disabled {
        background: var(--ddd-theme-default-disabled);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .results {
        background: var(--ddd-theme-default-nittanyNavy);
        color: var(--ddd-theme-default-white);
        padding: var(--ddd-spacing-6);
        border-radius: var(--ddd-radius-md);
        margin-top: var(--ddd-spacing-6);
      }

      .results h2 {
        margin: 0 0 var(--ddd-spacing-4) 0;
        font-size: var(--ddd-font-size-xl);
        text-align: center;
      }

      .cost-breakdown {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--ddd-spacing-4);
        margin-bottom: var(--ddd-spacing-6);
      }

      .cost-item {
        padding: var(--ddd-spacing-3);
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--ddd-radius-xs);
        text-align: center;
      }

      .cost-label {
        font-size: var(--ddd-font-size-s);
        opacity: 0.8;
        margin-bottom: var(--ddd-spacing-1);
      }

      .cost-value {
        font-size: var(--ddd-font-size-l);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-keystoneYellow);
      }

      .final-cost {
        text-align: center;
        font-size: var(--ddd-font-size-3xl);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-keystoneYellow);
        padding: var(--ddd-spacing-4);
        background: rgba(255, 255, 255, 0.1);
        border-radius: var(--ddd-radius-sm);
        margin-bottom: var(--ddd-spacing-4);
      }

      .actions {
        display: flex;
        justify-content: center;
        gap: var(--ddd-spacing-4);
        flex-wrap: wrap;
      }

      .btn-primary {
        background: var(--ddd-theme-default-keystoneYellow);
        color: var(--ddd-theme-default-nittanyNavy);
        padding: var(--ddd-spacing-3) var(--ddd-spacing-6);
        font-size: var(--ddd-font-size-s);
      }

      .btn-secondary {
        background: transparent;
        color: var(--ddd-theme-default-white);
        border-color: var(--ddd-theme-default-white);
        padding: var(--ddd-spacing-3) var(--ddd-spacing-6);
        font-size: var(--ddd-font-size-s);
      }

      .btn-secondary:hover:not(:disabled) {
        background: var(--ddd-theme-default-white);
        color: var(--ddd-theme-default-nittanyNavy);
      }

      @media (max-width: 768px) {
        .wrapper {
          margin: 0;
          padding: var(--ddd-spacing-4);
          border-radius: 0;
          box-shadow: none;
        }

        .form-grid {
          grid-template-columns: 1fr;
          gap: var(--ddd-spacing-4);
        }

        .cost-breakdown {
          grid-template-columns: 1fr;
        }

        .actions {
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
          justify-self: stretch;
        }
      }
    `];
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="header">
          <div class="logo">
            ${this.logo ? html`<img src="${this.logo}" alt="${this.teamName} logo">` : html`🏒`}
          </div>
          <h1>${this.teamName}</h1>
          <div class="subtitle">Ice Time Cost Calculator</div>
        </div>

        <div class="form-grid">
          <div class="form-section">
            <h3>Team Information</h3>
            <div class="input-group">
              <label for="teamName">Team Name</label>
              <input
                id="teamName"
                type="text"
                .value="${this.teamName}"
                @input="${this._handleTeamNameChange}"
                placeholder="Enter team name"
              />
            </div>
            <div class="input-group">
              <label for="logo">Team Logo URL</label>
              <input
                id="logo"
                type="url"
                .value="${this.logo}"
                @input="${this._handleLogoChange}"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div class="input-group">
              <label for="numberOfPlayers"># of Players</label>
              <cost-input
                id="numberOfPlayers"
                .value="${this.numberOfPlayers}"
                .min="${1}"
                .max="${50}"
                @value-changed="${this._handlePlayersChange}"
              ></cost-input>
            </div>
          </div>

          <div class="form-section">
            <h3>Ice Time Costs</h3>
            <div class="input-group">
              <label for="iceHours">Ice Hours (Season)</label>
              <cost-input
                id="iceHours"
                .value="${this.iceHours}"
                .min="${1}"
                .max="${200}"
                .step="${0.5}"
                @value-changed="${this._handleIceHoursChange}"
              ></cost-input>
            </div>
            <div class="input-group">
              <label for="iceCostPerHour">Cost per Hour ($)</label>
              <cost-input
                id="iceCostPerHour"
                .value="${this.iceCostPerHour}"
                .min="${50}"
                .max="${1000}"
                .step="${10}"
                @value-changed="${this._handleIceCostChange}"
              ></cost-input>
            </div>
          </div>

          <div class="form-section">
            <h3>Additional Costs</h3>
            <div class="input-group">
              <label for="coachCost">Coach Cost ($)</label>
              <cost-input
                id="coachCost"
                .value="${this.coachCost}"
                .min="${0}"
                .max="${10000}"
                .step="${100}"
                @value-changed="${this._handleCoachCostChange}"
              ></cost-input>
            </div>
            <div class="input-group">
              <label for="jerseyCost">Jersey Cost per Player ($)</label>
              <cost-input
                id="jerseyCost"
                .value="${this.jerseyCost}"
                .min="${0}"
                .max="${300}"
                .step="${5}"
                @value-changed="${this._handleJerseyCostChange}"
              ></cost-input>
            </div>
          </div>

          <div class="form-section">
            <h3>Fees</h3>
            <div class="input-group">
              <label for="feePercentage">Transaction Fee (%)</label>
              <cost-input
                id="feePercentage"
                .value="${this.feePercentage}"
                .min="${0}"
                .max="${10}"
                .step="${0.1}"
                @value-changed="${this._handleFeePercentageChange}"
              ></cost-input>
            </div>
            <div class="input-group">
              <label for="fixedFee">Fixed Fee ($)</label>
              <cost-input
                id="fixedFee"
                .value="${this.fixedFee}"
                .min="${0}"
                .max="${50}"
                .step="${0.01}"
                @value-changed="${this._handleFixedFeeChange}"
              ></cost-input>
            </div>
          </div>
        </div>

        <div class="results">
          <h2>Cost Breakdown</h2>
          <div class="cost-breakdown">
            <div class="cost-item">
              <div class="cost-label">Ice Time</div>
              <div class="cost-value">$${this._formatCurrency(this.iceHours * this.iceCostPerHour)}</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">Coaches</div>
              <div class="cost-value">$${this._formatCurrency(this.coachCost)}</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">Jerseys</div>
              <div class="cost-value">$${this._formatCurrency(this.jerseyCost * this.numberOfPlayers)}</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">Subtotal</div>
              <div class="cost-value">$${this._formatCurrency(this.subtotal)}</div>
            </div>
            <div class="cost-item">
              <div class="cost-label">Fees (${this.feePercentage}%)</div>
              <div class="cost-value">$${this._formatCurrency(this.totalFees)}</div>
            </div>
          </div>
          
          <div class="final-cost">
            <div style="font-size: var(--ddd-font-size-s); opacity: 0.8; margin-bottom: var(--ddd-spacing-2);">
              Cost Per Player
            </div>
            $${this._formatCurrency(this.costPerPlayer)}
          </div>

          <div style="text-align: center; font-size: var(--ddd-font-size-l); margin-bottom: var(--ddd-spacing-4);">
            <strong>Total Team Cost: $${this._formatCurrency(this.totalCost)}</strong>
          </div>

          <div class="actions">
            <button class="btn-primary" @click="${this._shareResults}">Share Results</button>
            <button class="btn-secondary" @click="${this._resetCalculator}">Reset</button>
          </div>
        </div>
      </div>
    `;
  }

  _handleTeamNameChange(e) {
    this.teamName = e.target.value;
    this._saveToStorage();
  }

  _handleLogoChange(e) {
    this.logo = e.target.value;
    this._saveToStorage();
  }

  _handleIceHoursChange(e) {
    this.iceHours = parseFloat(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _handleIceCostChange(e) {
    this.iceCostPerHour = parseFloat(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _handleCoachCostChange(e) {
    this.coachCost = parseFloat(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _handleJerseyCostChange(e) {
    this.jerseyCost = parseFloat(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _handlePlayersChange(e) {
    this.numberOfPlayers = parseInt(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _handleFeePercentageChange(e) {
    this.feePercentage = parseFloat(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _handleFixedFeeChange(e) {
    this.fixedFee = parseFloat(e.detail.value);
    this._calculateTotals();
    this._saveToStorage();
  }

  _calculateTotals() {
    const iceCost = this.iceHours * this.iceCostPerHour;
    const jerseyTotal = this.jerseyCost * this.numberOfPlayers;
    this.subtotal = iceCost + this.coachCost + jerseyTotal;
    
    const percentageFee = this.subtotal * (this.feePercentage / 100);
    this.totalFees = percentageFee + this.fixedFee;
    this.totalCost = this.subtotal + this.totalFees;
    this.costPerPlayer = this.totalCost / this.numberOfPlayers;
  }

  _formatCurrency(amount) {
    return amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  _saveToStorage() {
    const data = {
      teamName: this.teamName,
      logo: this.logo,
      iceHours: this.iceHours,
      iceCostPerHour: this.iceCostPerHour,
      coachCost: this.coachCost,
      jerseyCost: this.jerseyCost,
      numberOfPlayers: this.numberOfPlayers,
      feePercentage: this.feePercentage,
      fixedFee: this.fixedFee
    };
    localStorage.setItem('ice-planner-data', JSON.stringify(data));
  }

  _loadFromStorage() {
    const saved = localStorage.getItem('ice-planner-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.assign(this, data);
      } catch (e) {
        console.warn('Failed to load saved data:', e);
      }
    }
  }

  _loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('teamName')) this.teamName = params.get('teamName');
    if (params.has('logo')) this.logo = params.get('logo');
    if (params.has('iceHours')) this.iceHours = parseFloat(params.get('iceHours'));
    if (params.has('iceCostPerHour')) this.iceCostPerHour = parseFloat(params.get('iceCostPerHour'));
    if (params.has('coachCost')) this.coachCost = parseFloat(params.get('coachCost'));
    if (params.has('jerseyCost')) this.jerseyCost = parseFloat(params.get('jerseyCost'));
    if (params.has('numberOfPlayers')) this.numberOfPlayers = parseInt(params.get('numberOfPlayers'));
    if (params.has('feePercentage')) this.feePercentage = parseFloat(params.get('feePercentage'));
    if (params.has('fixedFee')) this.fixedFee = parseFloat(params.get('fixedFee'));
  }

  _shareResults() {
    const params = new URLSearchParams({
      teamName: this.teamName,
      logo: this.logo,
      iceHours: this.iceHours,
      iceCostPerHour: this.iceCostPerHour,
      coachCost: this.coachCost,
      jerseyCost: this.jerseyCost,
      numberOfPlayers: this.numberOfPlayers,
      feePercentage: this.feePercentage,
      fixedFee: this.fixedFee
    });
    
    const shareURL = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${this.teamName} - Ice Time Calculator`,
        text: `Cost per player: $${this._formatCurrency(this.costPerPlayer)}`,
        url: shareURL
      });
    } else {
      navigator.clipboard.writeText(shareURL).then(() => {
        alert('Share URL copied to clipboard!');
      });
    }
  }

  _resetCalculator() {
    if (confirm('Are you sure you want to reset all values to defaults?')) {
      this.teamName = "Team Hawks";
      this.logo = "";
      this.iceHours = 50;
      this.iceCostPerHour = 300;
      this.coachCost = 3000;
      this.jerseyCost = 88;
      this.numberOfPlayers = 1;
      this.feePercentage = 2;
      this.fixedFee = 0.99;
      
      this._calculateTotals();
      localStorage.removeItem('ice-planner-data');
      
      // Clear URL parameters
      const url = new URL(window.location);
      url.search = '';
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(IcePlanner.tag, IcePlanner);