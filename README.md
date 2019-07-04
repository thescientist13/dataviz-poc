# dataviz-poc

## Overview 
This repository was created as an oppourtunity to explore some ideas inspired from creating this [other POC](https://github.com/ProjectEvergreen/random-plot-generator) of a random plot generator using [lit-html](https://lit-html.polymer-project.org/).  

The idea behind this POC is to see if there is a viable path towards creating a modern ES2015+ based charting / vizualization library based off tagged template literals, SVG, and web components.

## Motivations
The primary motivation of this project is to promote an alternative approach to creating visualizations for the web leveraging more of the native capabilities already available in today's modern browsers.  By combining SVG and JavaScript, a more declarative method of authoring vizualizations can be achieved while also improving maintainability, testability, and performance.

### A long time ago...
If we start by thinking about HTML and it's declarivate nature, we can arrive at one of it's most compelling features for developers, in that it is fairly easy to visualize the output of the code you write to the output you see in the browser.  Without any library or framework involved, essentially the code you write is `1:1` as you would expect when viewing the source.  This is further reinforced given that HTML is structure component of the web.  (CSS being presentation, and JavaScript being interactivity.)

For example, this can be pretty easily understood, in terms of what the output would be.
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

HTML even has tags that can be used for drawing shapes like `<circle>` and `<line>` through the use of [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG).


### A JavaScript Templating Engine
This will become more influential in a later section, but worth intorducing as it is a foundational element to the over all API design, and that is one of the coolest new feartures introduced into JavaScript lately; the tagged [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

With this syntax, dynamic string interpolation (templating) now becomes a first class citizen in JavaScript, bring powerful syntax like this now for free to the browser:
```javascript
const name = 'John';
const greeting = `Hello, ${name}!`

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

Not particularly declarivate or predictive, is it?  While not necessarily a bad thing and certainly not picking on D3 as it can / does provide a lot of value in calculating things like scaling and points, but from an authoring perspective, it's a lot of JavaScript, when (IMO) some HTML might provide a little more of an ergonomic and intuitive developer experience.  

### Bringing It All Together
So really though, where are you going with this?  

If we take a look at the random plot generator this POC was inpired from, we can see that to achieve the output of 
1. A set of points (0<=x<=100)
1. In a plot (square)
1. With a line drawn down the middle diagonally
1. With points ordered on either side of the line, by color (blue vs green) 
1. And filling all those dots

We can see that by combining SVG + JavaScript, we are able [achieve that output](https://github.com/ProjectEvergreen/random-plot-generator/blob/master/src/components/plot-generator.js#L86) with code that looks like this (and a little help from **lit-html**):
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

This bring a much more declarative approach to creating visualizations, one that is:
- Closer to native web languages (HTML / XML and JavaScript)
- Works great with Web Components
- Provides a much clearer, almost pure `1:1` mapping of input (source code) to output (HTML)
- Integrates JavaScript and the ability to work within a scope, but still author HTML primarily
- Tagged template literals (lit-html, `import { svg }`) provides efficient management of the DOM, only updating when data changes

This is of course a very low level solution, and so this repository aims to try and find any patterns and conventions that can be extrapolated into a library or set of packages that can be documented, tested, and published for others to use.


## API Design (WIP)
So with the random plot generator in mind and our desire to achieve a development workflow combinging SVG + JavaScript, there is definitely oppourtunity to see if this can be expanded upon and essentially turned into a library and / or set of packages.

What the full scope of this project is yet is still being worked on (see _Objectives_) but there are still a few design elements we can keep in mind as we go, in terms of determining viablity of the idea overall: 
- Establish a consistent terminology / domain specific concepts through documentation
- Create a set of primitives that can be composed together to create fully realized and robust solutions (possibly as wrappers around all standard SVG elements to start with like `<circle>`, `<line>`, etc?)
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