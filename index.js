/**
 * CPU percentage module
 * @module cpu-percent
 */
'use strict';

const os = require('os');

// Credit goes to @bag-man for the gist that this is based on
// https://gist.github.com/bag-man/5570809

module.exports = cpuPercent;

/**
 * Retrieve the current CPU percentage by checking the load twice (after opts.interval milliseconds) and computing
 *
 * @param {Object} opts
 * @param {Number} [opts.interval=100] - the number of ms between tick counts
 * @param {string} [opts.returnType="fraction"] - "fraction" (0.5542), "whole" (55.42), or "string" ("55.42%") - how to get the value back
 * @param {Number} [opts.decimals=0] - the number of decimals to round to
 * @param {any} callback
 */
function cpuPercent(opts, callback) {
  _getCurrentCPUPercent(opts.interval || 100, function(fraction) {
    if (opts.returnType === 'fraction' || !opts.returnType)
      return callback(_roundToDigits(fraction, opts.decimals || 0));
    else if (opts.returnType === 'whole')
      return callback(_fractionToWholePercentage(fraction, opts.decimals || 0));
    else
      return callback(_fractionToWholePercentage(fraction, opts.decimals || 0)) + '%';
  });
}

////////////////////

function _getCurrentCPUPercent(interval, callback) {
  const start = _getCpuAverage();

  setTimeout(function() {
    const end = _getCpuAverage();
    return callback(_calculatePercentageFromCpuAverages(start, end));
  }, interval);
}

function _calculatePercentageFromCpuAverages(first, second) {
  const idleDiff = second.idle - first.idle;
  const totalDiff = second.total - first.total;
  return idleDiff / totalDiff;
}

function _getCpuAverage() {
  let idle = 0;
  let tick = 0;
  const cpus = os.cpus();

  cpus.forEach((core) => {
    for (const tickType in core.times) {
      tick += core.times[tickType];
    }
    idle += core.times.idle;
  });

  return {
    idle: idle / cpus.length,
    total: tick / cpus.length,
  };
}

function _fractionToWholePercentage(fraction, digits) {
  return _roundToDigits(fraction * 100, digits);
}

function _roundToDigits(num, digits) {
  return Number((Math.round(num + 'e+' + digits) + 'e-' + digits)).toFixed(digits);
}
