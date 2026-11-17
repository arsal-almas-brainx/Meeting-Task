import { Component } from '@theme/component';

/**
 * Live countdown to a fixed end time.
 * Liquid renders the initial values, so the markup is meaningful before this module runs.
 *
 * @typedef {Object} Refs
 * @property {HTMLElement} [days]
 * @property {HTMLElement} [hours]
 * @property {HTMLElement} [minutes]
 * @property {HTMLElement} [seconds]
 *
 * @extends {Component<Refs>}
 */
class CountdownTimer extends Component {
  /** @type {number | undefined} */
  #timer;

  connectedCallback() {
    super.connectedCallback();
    this.#start();
  }

  updatedCallback() {
    super.updatedCallback();
    this.#start();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#stop();
  }

  get endTime() {
    return Number(this.dataset.end) * 1000;
  }

  #start() {
    this.#stop();
    if (!Number.isFinite(this.endTime) || this.endTime <= 0) return;

    this.#tick();
    this.#timer = window.setInterval(() => this.#tick(), 1000);
  }

  #stop() {
    if (this.#timer) window.clearInterval(this.#timer);
    this.#timer = undefined;
  }

  #tick() {
    const remaining = Math.max(0, this.endTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };

    for (const [key, value] of Object.entries(values)) {
      const ref = this.refs[/** @type {keyof Refs} */ (key)];
      if (ref) ref.textContent = String(value).padStart(2, '0');
    }

    if (remaining === 0) {
      this.#stop();
      this.setAttribute('data-expired', '');
      if (this.dataset.expiredBehavior === 'hide') {
        const owner = this.closest('[data-countdown-owner]');
        if (owner instanceof HTMLElement) owner.hidden = true;
        else this.hidden = true;
      }
    }
  }
}

if (!customElements.get('countdown-timer')) {
  customElements.define('countdown-timer', CountdownTimer);
}
