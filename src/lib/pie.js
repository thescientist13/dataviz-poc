import { render, svg } from 'https://unpkg.com/lit-html@0.10.2/lit-html.js';
import { repeat } from 'https://unpkg.com/lit-html@0.10.2/lib/repeat.js';


class PieChartComponent extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'closed' });
        this._slices = [];

        render(this.template(), this.root);
    }

    static get observedAttributes() {
        return ['slices'];
      }

      attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
    
          case 'slices':
            this._slices = JSON.parse(newVal);
    
            render(this.template(), this.root);
    
            break;
          default:
    
        }
      }

    cumulativePercent = 0;

    getCoordinatesForPercent(percent) {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    }

    template() {
        return svg`
        <svg viewBox="-1 -1 2 2"
        style="transform: rotate(-90deg); height:400px;">
        slices = [
          ${repeat(this._slices, (slice) => {

            const [startX, startY] = this.getCoordinatesForPercent(this.cumulativePercent);

            // each slice starts where the last slice ended, so keep a cumulative percent
            this.cumulativePercent += slice.percent;

            const [endX, endY] = this.getCoordinatesForPercent(this.cumulativePercent);

            // if the slice is more than 50%, take the large arc (the long way around)
            const largeArcFlag = slice.percent > .5 ? 1 : 0;

            const pathData = [
                `M ${startX} ${startY}`, // Move
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                `L 0 0`, // Line
            ].join(' ');

            return svg`<path  d=${pathData} fill=${slice.color}>
             </path>`;
        })}
        
        </svg>
      `;
    }
}

customElements.define('pie-chart', PieChartComponent);