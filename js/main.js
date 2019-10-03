window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./sw.js');
  }
}

const keyEl = document.getElementById('key');
const msgEl = document.getElementById('msg');
const outEl = document.getElementById('output');
const helpTextEl = document.getElementById('help-text');

function encryptStringWithXORtoHex(input,key) {
  var c = '';
  while (key.length < input.length) {
       key += key;
  }
  for(var i=0; i<input.length; i++) {
      var value1 = input[i].charCodeAt(0);
      var value2 = key[i].charCodeAt(0);

      var xorValue = value1 ^ value2;

      var xorValueAsHexString = xorValue.toString("16");

      if (xorValueAsHexString.length < 2) {
          xorValueAsHexString = "0" + xorValueAsHexString;
      }

      c += xorValueAsHexString;
  }
  return c;
}

function decryptHexWithXORtoString(input, key) {
  let d = '';
  while (key.length < Math.ceil(input.length/2)) {
    key += key;
  }
  for(var i=0; i<input.length; i+=2) {
    let hexValueString = input.substring(i,i+2);

    let value1 = parseInt(hexValueString, 16);
    let value2 = key[Math.floor(i/2)].charCodeAt(0);

    let xorValue = value1 ^ value2;

    d += String.fromCharCode(xorValue);
  }
  return d;
}

function encrypt(event) {
  event.preventDefault();
  let key = keyEl.value;
  let message = msgEl.value;
  let output = encryptStringWithXORtoHex(message, key);
  outEl.textContent = output;

  helpTextEl.innerHTML = 'Tap output to copy';
}

function decrypt(event) {
  event.preventDefault();
  let key = keyEl.value;
  let message = msgEl.value;
  let output = decryptHexWithXORtoString(message, key);
  outEl.textContent = output;

  helpTextEl.innerHTML = 'Tap output to copy';
}

function copyText(event) {
  event.preventDefault();

  let range = document.createRange();
  range.selectNode(document.getElementById('output'));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  document.execCommand("copy");
  window.getSelection().removeAllRanges();

  helpTextEl.innerHTML = 'Copied';
}
