import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';
import './lib/chart.js';
import './lib/pie.js';

class App extends HTMLElement {
  
  constructor() {
    super();

    this.points = JSON.stringify(this.generatePoints(200));
    this.slices = JSON.stringify([
      { percent: 0.1, color: 'Coral' },
      { percent: 0.65, color: 'CornflowerBlue' },
      { percent: 0.2, color: '#00ab6b' }
    ]);
    
    this.root = this.attachShadow({ mode: 'open' });
    
    render(this.template(), this.root);
  }

  generatePoints(size) {
    const floor = 500;

    return [...Array(size).keys()].map((index) => {
      const x = Math.floor(Math.random() * Math.floor(floor));
      const y = Math.floor(Math.random() * Math.floor(floor));
      
      return {
        id: index,
        x,
        y
      };
    });
  }

  template() {
    return html`
      <style>
        div#container {
          width: 60%;
          margin: 0 auto;
          text-align: center;
        }
      </style>

      <div id="container">
        
        <h2>Charting Library Sandbox</h2>
        <chart-lib points$=${this.points}></chart-lib>

        <h2>Pie Chart</h2>
        <pie-chart slices$=${this.slices}></pie-chart>

      </div>
    `;
  }
}
  
customElements.define('app-root', App);