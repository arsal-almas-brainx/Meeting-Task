import { Component } from '@theme/component';

/**
 * Accessible tabs (WAI-ARIA tabs pattern, automatic activation) for the Product tabs section.
 * Without JavaScript the first panel stays visible and the others remain hidden.
 *
 * @typedef {Object} Refs
 * @property {HTMLButtonElement[]} [tabs]
 * @property {HTMLElement[]} [panels]
 *
 * @extends {Component<Refs>}
 */
class ProductTabsComponent extends Component {
  get tabs() {
    return this.refs.tabs || [];
  }

  get panels() {
    return this.refs.panels || [];
  }

  /**
   * @param {MouseEvent} event
   */
  select(event) {
    const tab = event.target;
    if (!(tab instanceof HTMLButtonElement)) return;
    this.#activate(this.tabs.indexOf(tab), false);
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeydown(event) {
    const tab = event.target;
    if (!(tab instanceof HTMLButtonElement)) return;

    const count = this.tabs.length;
    const current = this.tabs.indexOf(tab);
    const rtl = getComputedStyle(this).direction === 'rtl';
    let next = -1;

    switch (event.key) {
      case 'ArrowRight':
        next = (current + (rtl ? -1 : 1) + count) % count;
        break;
      case 'ArrowLeft':
        next = (current + (rtl ? 1 : -1) + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#activate(next, true);
  }

  /**
   * @param {number} index
   * @param {boolean} moveFocus
   */
  #activate(index, moveFocus) {
    if (index < 0) return;

    for (const [i, tab] of this.tabs.entries()) {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) {
        if (moveFocus) tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }

    for (const [i, panel] of this.panels.entries()) {
      panel.hidden = i !== index;
    }
  }
}

if (!customElements.get('product-tabs-component')) {
  customElements.define('product-tabs-component', ProductTabsComponent);
}
