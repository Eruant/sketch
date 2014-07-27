(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = /^loaded|^i|^c/.test(doc.readyState)

  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],2:[function(require,module,exports){
var domready = require('domready');

var WIDTH = 800,
  HEIGHT = 600;

module.exports = {

  boot: function () {

    var self = this;
    window.app = this;

    this.isDrawing = false;
    this.lines = [];
    this.points = [];

    domready(function () {
      self.canvas = window.document.getElementById('pad');
      self.canvas.width = WIDTH;
      self.canvas.height = HEIGHT;
      self.ctx = self.canvas.getContext('2d');
      self.ctx.lineJoin = 'round';
      self.ctx.lineCap = 'round';
      self.ctx.shadowBlur = 5;
      self.ctx.shadowColor = 'rgb(0, 0, 0)';

      self.addListeners();
    });
  },

  addListeners: function () {
    this.canvas.addEventListener('mousedown', this.startEvent.bind(this), false);
    this.canvas.addEventListener('mousemove', this.moveEvent.bind(this), false);
    this.canvas.addEventListener('mouseup', this.endEvent.bind(this), false);
  },

  startEvent: function (event) {
    this.isDrawing = true;
    this.points.push({
      x: event.clientX,
      y: event.clientY
    });
  },

  moveEvent: function (event) {

    var i, il;

    if (!this.isDrawing) {
      return;
    }

    //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.points.push({
      x: event.clientX,
      y: event.clientY
    });

    // draw current line
    this.drawLine2(this.points);

    //il = this.lines.length;
    //for (i = 0; i < il; i++) {
      //this.drawLine2(this.lines[i]);
    //}
  },

  endEvent: function () {
    this.isDrawing = false;
    //this.lines.push(this.points);
    //this.points = [];
  },

  drawLineFromArray: function (array) {

    var i = 1,
      il = array.length,
      p1 = array[0],
      p2 = array[1],
      midPoint,
      nearPoint;

    this.ctx.beginPath();
    this.ctx.moveTo(array[0].x, array[0].y);
    for (i = 1; i < il; i++) {
      midPoint = this.getMidPointBetweenPoints(p1, p2);
      this.ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);

      // draw a secondary line
      nearPoint = array[i - 5];
      if (nearPoint) {
        this.ctx.lineTo(nearPoint.x, nearPoint.y);
        this.ctx.moveTo(midPoint.x, midPoint.y);
      }

      p1 = array[i];
      p2 = array[i + 1];
    }
    this.ctx.lineTo(p1.x, p1.y);
    this.ctx.stroke();
  },

  drawLine2: function (array) {

    var i, il, dx, dy, d;

    il = array.length;

    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.moveTo(array[il - 2].x, array[il - 2].y);
    this.ctx.lineTo(array[il - 1].x, array[il - 1].y);
    this.ctx.stroke();

    for (i = 0; i < il; i++) {
      dx = array[i].x - array[il - 1].x;
      dy = array[i].y - array[il - 1].y;
      d = dx * dx + dy * dy;

      if (d < 1000) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.moveTo(array[il - 1].x + (dx * 0.2), array[il - 1].y + (dy * 0.2));
        this.ctx.lineTo(array[i].x + (dx * 0.2), array[i].y + (dy * 0.2));
        this.ctx.stroke();
      }
    }

  },

  getMidPointBetweenPoints: function (point1, point2) {
    return {
      x: point1.x + (point2.x - point1.x) / 2,
      y: point1.y + (point2.y - point1.y) / 2
    };
  }

};

module.exports.boot();

},{"domready":1}]},{},[2])