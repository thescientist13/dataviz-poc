import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';
import './lib/chart.js';
import './lib/pie.js';
import './lib/line.js';

class App extends HTMLElement {
  
  constructor() {
    super();

    this.points = JSON.stringify(this.generatePoints(200));
    this.slices = JSON.stringify([
      { percent: 0.1, color: 'Coral' },
      { percent: 0.65, color: 'CornflowerBlue' },
      { percent: 0.2, color: '#00ab6b' }
    ]);
    this.linePoints = '00,120 20,60 40,80 60,20 80,80 100,80 120,60 140,100 160,90 180,80 200,110 220,50 240,70 260,100 280,100 300,40 320,10 340,100 360,100 380,120 400,60 420,70 440,80';
    
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

        <h2>Line Chart</h2>
        <line-chart lines$=${this.linePoints}></line-chart>
      </div>
    `;
  }
}
  
customElements.define('app-root', App);