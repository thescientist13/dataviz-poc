import { render, svg } from 'https://unpkg.com/lit-html@0.10.2/lit-html.js';
import { repeat } from 'https://unpkg.com/lit-html@0.10.2/lib/repeat.js';

class ChartComponent extends HTMLElement {
  constructor() {
    super();
    this._points = [];
    this.root = this.attachShadow({ mode: 'closed' });
    
    render(this.template(), this.root);
  }

  static get observedAttributes() {
    return ['points'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {

      case 'points':
        this._points = JSON.parse(newVal);

        render(this.template(), this.root);

        break;
      default:

    }
  }

  /* eslint-disable indent */
  template() {
    return svg`
      <svg width="500" height="500" style="border: 1px solid #020202">
        ${repeat(this._points, (point) => point.id, (point) => {
          const color = 'green';
      
          return svg`<circle 
            cx="${point.x}" 
            cy="${point.y}" 
            r="2" 
            stroke-width="3"
            fill="${color}"
            color="${color}">
          </circle>`;
        })}
      
      </svg>
    `;
  }
  /* eslint-enable */
}
  
customElements.define('chart-lib', ChartComponent);