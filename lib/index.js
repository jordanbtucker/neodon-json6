'use strict';
var util = require('util');

var info = {
  lpr: 'left parenthesis',
  rpr: 'right parenthesis',
  lcb: 'left curly brace',
  rcb: 'right curly brace',
  lsb: 'left square bracket',
  rsb: 'right square bracket',
  cln: 'colon',
  cma: 'comma',
  dqt: 'double quote',
  sqt: 'single quote',
  mlq: 'multi-line quote',
  num: 'number',
  txt: 'text',
  dot: 'dot',
  nln: 'newline',
  eof: 'eof',
  smc: 'semicolon',
  spc: 'space',
  hyp: 'hyphen',
  usc: 'underscore'
};

var terms = {
  '(' : 'lpr',
  ')' : 'rpr',
  '{' : 'lcb',
  '}' : 'rcb',
  '[' : 'lsb',
  ']' : 'rsb',
  ':' : 'cln',
  ',' : 'cma',
  '"' : 'dqt',
  "'" : 'sqt',
  '`' : 'acc',
  '.' : 'dot',
  ';' : 'smc',
  "\n": 'nln',
  "\r": 'car',
  "\t": 'spc',
  ' ' : 'spc',
  '-' : 'hyp',
  '_' : 'usc'
};

var nums = {
  '-': 'num',
  '+': 'num',
  '0': 'num',
  '1': 'num',
  '2': 'num',
  '3': 'num',
  '4': 'num',
  '5': 'num',
  '6': 'num',
  '7': 'num',
  '8': 'num',
  '9': 'num',
  '.': 'num'
};

function tokenize(text) {
  return text
  .split('')
  .map(function(char) {
    var type = terms[char] || nums[char] || 'txt';
    return { type: type, char: char };
  });
}

function parse(tokens) {
  var token;

  function next() {
    token = tokens.shift() || { type: 'eof' };
    console.log(token);
  }

  function peek(type, offset) {
    console.log('peek '+offset+' is '+tokens[offset].type);
    offset = offset || 0;
    if (tokens.length <= offset) return false;

    if (tokens[offset].type == type) {
      return true;
    }

    return false;
  }

  function accept(type) {
    if (token.type == type) {
      console.log('accepted '+type);
      next();
      return true;
    }

    return false;
  }

  function expect(type) {
    if (accept(type)) {
      return true;
    }

    throw new Error(util.format('Unexpected type for token: %s did not match %j', type, token));
  }

  function ws() {
    while (accept('spc') || accept('nln') || accept('car') || accept('tab')) {}
    return true;
  }

  function file() {
    var output;
    ws();
    if (accept('lcb')) {
      output = obj();
      expect('rcb');
    }
    else if (accept('lsb')) {
      output = arr();
      expect('rsb');
    }
    else if (accept('sqt')) {
      output = txt();
      expect('sqt');
    }
    else if (accept('dqt')) {
      output = txt();
      expect('dqt');
    }
    else if (token.type === 'num') {
      output = num();
    }
    else {
      throw new Error('Unknown type for root value');
    }
    ws();
    expect('eof');
    return output;
  }

  function obj() {
    var out = {};
    ws();
    while (true) {
      if (token.type === 'rcb') break;
      var k = key();
      console.log('key: '+k);
      expect('cln');
      console.log(':');
      var v = value();

      out[k] = v;

      console.log('Finished k:v');
      if (!accept('cma')) break;
      console.log('going to next pair');
    }
    console.log('done with obj');
    ws();
    return out;
  }

  function arr() {
    var out = [];
    ws();
    while (true) {
      if (token.type === 'rsb') break;
      var v = value();

      out.push(v);

      console.log('Finished element');
      if (!accept('cma')) break;
      console.log('going to next element');
    }
    console.log('done with arr');
    ws();
    return out;
  }

  function key() {
    var out;
    ws();
    if (accept('sqt')) {
      out = txt();
      expect('sqt');
    }
    else if (accept('dqt')) {
      out = txt();
      expect('dqt');
    }
    else {
      out = '';
      while (true) {
        if (token.type == 'txt') {
          out += txt();
        }
        else if (token.type == 'num') {
          out += num().toString();
        }
        else {
          break;
        }
      }
    }
    ws();
    console.log('Finished key');
    return out;
  }

  function value() {
    var out;
    ws();
    if (accept('lcb')) {
      out = obj();
      expect('rcb');
    }
    else if (accept('lsb')) {
      out = arr();
      expect('rsb');
    }
    else if (accept('sqt')) {
      out = txt();
      expect('sqt');
    }
    else if (accept('dqt')) {
      out = txt();
      expect('dqt');
    }
    else if (token.type == 'num') {
      out = num();
    }
    else if (token.char === 'f' || token.char === 't') {
      out = txt();
      if (out === 'false') {
        out = false;
      }
      else if (out === 'true') {
        out = true;
      }
      else {
        throw new Error('Invalid syntax for object value');
      }
    }
    else {
      throw new Error('Invalid syntax for object value');
    }
    ws();
    return out;
  }

  function txt() {
    var out = '';
    while (token.type == 'txt') {
      out += token.char;
      if (!accept('txt')) {
        break;
      }
    }
    return out;
  }
  function num() {
    var out = '';
    while (token.type == 'num') {
      out += token.char;
      if (!accept('num')) {
        break;
      }
    }
    out = Number(out) === out && out % 1 === 0 ? parseInt(out) : parseFloat(out);
    return out;
  }

  next();
  return file();
}

module.exports = function(text) {
  return parse( tokenize(text) );
};
