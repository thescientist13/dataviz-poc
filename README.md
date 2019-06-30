# dataviz-poc

## Overview 
An oppourtunity to explore some ideas inspired from creating this [other POC](https://github.com/ProjectEvergreen/random-plot-generator), of a random plot generator using [lit-html](https://lit-html.polymer-project.org/).  

The idea behind this POC is to see if there is a viable option for creating a charting / vizualization library based of tagged template literals / web components.

## Objectives
1. Identify and implement some (three - five?) common charts found in the D3 library using lit-html (no optimizations, just single file examples in the sandbox environment)
1. Identify oppourtunities for common primitives (code that could become standalong packages for creating charts)
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

## Thoughts / Questions
1. Also depend on LitElement or just stick to native `HTMLElement`?


## Links / References
= [D3.js](https://d3js.org/)
- [D3 + React](https://www.youtube.com/watch?v=ladXdJ3KKd4)
- [Data Visualizations](https://www.youtube.com/watch?v=S1PDU2Ckt5w)