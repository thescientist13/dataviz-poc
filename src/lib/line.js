import { render, svg } from 'https://unpkg.com/lit-html@0.10.2/lit-html.js';

class LineChartComponent extends HTMLElement {

  constructor() {
    super();
    this._linePoints = '';
    this.root = this.attachShadow({ mode: 'closed' });

    render(this.template(), this.root);
  }

  static get observedAttributes() {
    return ['lines'];
  }

  attributeChangedCallback(name, oldVal, newVal) {

    switch (name) {

      case 'lines':
        this._linePoints = newVal;

        render(this.template(), this.root);

        break;
      default:

    }
  }

  template() {
    return svg`

    <div style="padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;">
    
    <svg width="500" height="500" viewBox="0 0 500 100" style="background: white;
        width: 500px;
        height: 100px;
        border-left: 1px dotted #555;
        border-bottom: 1px dotted #555;
        padding: 20px 20px 20px 0;
      ">
  
    <polyline
       fill="none"
       stroke="#0074d9"
       stroke-width="2"
       points= "${this._linePoints}"
     />
    
  </svg>

  </div>
    `;
  }
}

customElements.define('line-chart', LineChartComponent);