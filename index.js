/*jshint esversion: 6 */
const alex = require("alex");

var elementsInsideBody = [...document.body.getElementsByTagName("*")];
// This makes an array of everything inside the body tag
var highlightRange = function(range, message) {
  // create wrapping i
  var iNode = document.createElement("i");
  iNode.title = message;
  iNode.classList.add("chrome-extension-snowflake");

  iNode.appendChild(range.extractContents());
  range.insertNode(iNode);
};

window.onload = () => {
  const style = document.createElement("style");
  style.innerText = `
    .chrome-extension-snowflake{
      text-decoration: underline;
      text-decoration-style: dashed;
      text-decoration-color: gray;
      cursor: pointer;
    }
  `;
  document.body.appendChild(style);
  findAndReplace();
};

//a function that loops through every single item
function findAndReplace() {
  elementsInsideBody.forEach(element => {
    element.childNodes.forEach(child => {
      if (child.nodeType === 3) {
        requestIdleCallback(() => {
          let startingIndex = 0;
          alex.text(child.nodeValue).messages.forEach(mes => {
            if (mes.expected && mes.expected.length) {
              let value = child.nodeValue;
              console.log(mes.actual, "->", mes.expected[0]);
              value = value.replace(
                new RegExp(mes.actual, "g"),
                mes.expected[0]
              );
              startingIndex = value.indexOf(mes.expected[0], startingIndex + 1);

              child.nodeValue = value;
              if (startingIndex !== -1) {
                const wordRange = document.createRange();
                wordRange.setStart(child, startingIndex);
                wordRange.setEnd(child, startingIndex + mes.expected[0].length);
                highlightRange(wordRange, mes.message);
              }
            }
          });
        });
      }
    });
  });
}
