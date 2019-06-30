import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';
import './lib/chart.js';

class App extends HTMLElement {
  
  constructor() {
    super();

    this.points = JSON.stringify(this.generatePoints(200));
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

      </div>
    `;
  }
}
  
customElements.define('app-root', App);