# cpu-pct
Node module to get the current CPU usage in percent. This uses the `os` module and has no outside dependencies.

This function gets the CPU percentage _once_ and does not continue returning values.

# Install

```sh
$ npm install --save cpu-pct
```

# Usage

```js
const cpu = require('cpu-pct');

const options = {
  interval: 100, // time span to get average percent usage (in milliseconds)
  returnType: "string", // "fraction", "whole", or "string"
  decimals: 2
};

cpu.cpuPercent(options, function(pct) {
  console.log(pct);
});
```
