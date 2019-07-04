# dataviz-poc

## Overview 
An oppourtunity to explore some ideas inspired from creating this [other POC](https://github.com/ProjectEvergreen/random-plot-generator), of a random plot generator using [lit-html](https://lit-html.polymer-project.org/).  

The idea behind this POC is to see if there is a viable option for creating a charting / vizualization library based of tagged template literals / web components.

## Motivations
Although the first couple of goals will be to build up some general domain konwledge around charting / visualizations / etc, the primary motivations around this project are to try and simplify the process of making visualizations for web applications from an authoring perspective as well as improving maintainability, testability, and performance.

### A long time ago...
If we think about HTML and it's declarivate nature, a side effect to that can also be one of it's most compelling features, in how easy it can be to map the markup you write to the output sent to the browser.  As it is literally 1:1, writing HTML can be extremely predictive in terms of structure and end result.  

For example, this can be pretty easily understood as to what the final output would be.
```html
<html>
  <head>
    <title>My Website</title>
  </head>

  <body>
    <header>
      <h1>Welcome to my website!</h1>
    </header>

    <h3>Below is an example of an unorderd list:</h3>
    <ul>
      <li>Tada!</li>
      <li>Item 2</li>
      <li>42</li>
    </ul>

    <footer>
      <span>So long and thanks for all the fish!</span>
    </footer>

  </body>
</html>
```
In fact, HTML even has tags for drawing shapes like `<circle>` and `<line>` through [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG).

### The Templating Engine is coming from inside the computer!
This will become more apparent later but wanted to side track for a moment to specifically touch upon one of the coolest new feartures introduced into JavaScript lately; the tagged template literal.

With this feature, dynamica string interpolation now becomes first class in JavaScript allowing powerful syntax like this now for free in the browser
```javascript
const name = 'John';
const greeting `Hello, ${name}!`

console.log(greeting); // Hello, John!
```

### So what about visualizations, then?
So to pick up with the main thread again, let's take a look at the source code of [an example](https://bl.ocks.org/mbostock/b5935342c6d21928111928401e2c8608) taken from the D3 docs.
```javascript
var data = [
  {month: "Q1-2016", apples: 3840, bananas: 1920, cherries: -1960, dates: -400},
  {month: "Q2-2016", apples: 1600, bananas: 1440, cherries: -960, dates: -400},
  {month: "Q3-2016", apples:  640, bananas:  960, cherries: -640, dates: -600},
  {month: "Q4-2016", apples:  320, bananas:  480, cherries: -640, dates: -400}
];

var series = d3.stack()
    .keys(["apples", "bananas", "cherries", "dates"])
    .offset(d3.stackOffsetDiverging)
    (data);

var svg = d3.select("svg"),
    margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = +svg.attr("width"),
    height = +svg.attr("height");

var x = d3.scaleBand()
    .domain(data.map(function(d) { return d.month; }))
    .rangeRound([margin.left, width - margin.right])
    .padding(0.1);

var y = d3.scaleLinear()
    .domain([d3.min(series, stackMin), d3.max(series, stackMax)])
    .rangeRound([height - margin.bottom, margin.top]);

var z = d3.scaleOrdinal(d3.schemeCategory10);

svg.append("g")
  .selectAll("g")
  .data(series)
  .enter().append("g")
    .attr("fill", function(d) { return z(d.key); })
  .selectAll("rect")
  .data(function(d) { return d; })
  .enter().append("rect")
    .attr("width", x.bandwidth)
    .attr("x", function(d) { return x(d.data.month); })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })

svg.append("g")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(y));

function stackMin(serie) {
  return d3.min(serie, function(d) { return d[0]; });
}

function stackMax(serie) {
  return d3.max(serie, function(d) { return d[1]; });
}

</script>
```

Not particularly declarivate or predictive, is it?  While not necessarily a bad thing and certainly not picking on D3 as it can / does provide a lot of value in calculating things like scaling and points, but from an authoring perspective, it's a lot of JavaScript, when some HTML might provide a little more of an ergonomic and intuitive developer experience.  

### Putting It All Together
So what's the point of all this?  

If we take the random plot generator this POC was inpired from, we can see that to achieve the output of a set of points in a plot with a line down the middle seperating these points conditionally (blue vs green), we can see that by combining SVG + JavaScript, we are able [achieve that output](https://github.com/ProjectEvergreen/random-plot-generator/blob/master/src/components/plot-generator.js#L86) with code that looks like this (and a little help from **lit-html**):
```javascript
import { svg } from 'https://unpkg.com/lit-html@0.10.2/lit-html.js';

const width = 500;
const height = 500;

const template = svg`
  <svg width="${width}" height="${height}" style="border: 1px solid #020202">
    ${repeat(this._points, (point) => point.id, (point) => {
      const color = this.getTeamColorForPoint(point);

      return svg`<circle 
        cx="${point.x}" 
        cy="${point.y}" 
        r="2" 
        stroke-width="3" 
        fill="${color}"
        stroke="${color}">
      </circle>`;
    })}

    <line x1="0" x2="${height}" y1="0" y2="${width}" stroke="black"/>
  </svg>
`;
}
```

## API Design (WIP)
So with the random plot generator in mind and it's example of combinging SVG + JavaScript, there is definitely an oppourtunity to see if this can be expanded upon and essentially turned into a library.

What the full scope of this project is still being worked on (see OBjectives), there are still a few design elements we can keep in mind as we go, in terms of determining viablity of the idea overall. 
- Consistent terminology / domain specific concepts through documentation
- Set of primitives that can be composed together to create fully realized and robust solutions (possibly as wrappers around all standard SVG elements to start?)
- Determine best way to interop / interface with different data services and sources, like a D3 or maybe a products custom backend data.  Maybe write the project in TypeScript?

## Objectives
1. Identify and implement some (three - five?) basic charts stand alone, just single file examples in the sandbox environment)
  - Pie Chart
  - Bar Chart
  - Line Graph
  - others?
1. Identify some examples from the [D3 Gallery](https://github.com/d3/d3/wiki/Gallery) using D3 as a data engine, but do all the rendering with lit-html (no optimizations, just single file examples in the sandbox environment)
  - TBD
  - TBD
1. Identify oppourtunities for common primitives (code that could become standalong packages for creating charts) or even standard charts the project itself could offer (bar, line, graph, etc)
1. Identify oppourtunities for resuing different types of data engines, aside from D3 (default?), like Vega or even a custom one?

## Development
To develop for this project, first:
1. Have NodeJS installed (LTS)
1. Clone the repo
1. Run `npm ci`

Then, you can just run:
```shell
$ npm start
```

> Your browser should automatically open to `http://127.0.0.1:8080/`

## Thoughts / Questions
1. Also depend on [LitElement](https://lit-element.polymer-project.org) or just stick to native `HTMLElement`?


## Links / References
= [D3.js](https://d3js.org/)
- [D3 + React](https://www.youtube.com/watch?v=ladXdJ3KKd4)
- [Data Visualizations](https://www.youtube.com/watch?v=S1PDU2Ckt5w)