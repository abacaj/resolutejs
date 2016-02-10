# resolute.js
<i>Determined, and unwavering.</i>

[![Github Releases (by Release)](https://img.shields.io/github/downloads/abacaj/resolutejs/v1.1.2/total.svg)](https://github.com/abacaj/resolutejs/releases/download/v1.1.2/resolute.js)
[![GitHub stars](https://img.shields.io/github/stars/abacaj/resolutejs.svg)](https://github.com/abacaj/resolutejs)

Finally get to retry during a Promise operation (works in modern browsers as well as node.js), zero dependencies.

It includes a very basic but reliable retry mechanism for a Promise operation.

Minimal requirements: 3kb unminified / 0 dependencies.

## Use Cases
- Database retry
- API retry
- Anything...

## Packages
None yet.

## Usage
Download resolute.js from [![Github Releases (by Release)](https://img.shields.io/github/downloads/abacaj/resolutejs/v1.1.2/total.svg)](https://github.com/abacaj/resolutejs/releases/download/v1.1.2/resolute.js), create a new instance as shown below
and optionally provide a callback that is executed every retry, which gives you the current retry count.
### Node.js
```javascript
var Resolute = require("./resolute");

var somePromiseOperation = new Promise(function(resolve, reject) {
    // Make it fail...
    if (err) return reject(err);
    resolve("success");
});

var resolute_options = {
    // Reference to your Promise function, note: this Promise will always fail.
    operation: somePromiseOperation,
    // Maximum number of times to attempt
    maxRetry: 5,
    // Delay between retries in milliseconds
    delay: 2000
};

var resolute_callback = function(retryCount) {
    console.log(retryCount);
};

var resolute = new Resolute(resolute_options, resolute_callback);

// Run the operation stored in options.
resolute.run().then(null).catch(function(err) {
    console.log("failed after trying: " + resolute.maxRetry + " times, with error: " + err);
});

// Pass in a new operation to perform using the same Resolute instance.
resolute.run(somePromiseOperation).then(null).catch(function(err) {
    console.log("failed after trying: " + resolute.maxRetry + " times, with error: " + err);
});

```
### Browser
```html
<script src="resolute.js"></script>
```
```javascript
var somePromiseOperation = new Promise(function(resolve, reject) {
    // Make it fail...
    if (err) return reject(err);
    resolve("success");
});

var resolute_options = {
    // Reference to your Promise function, note: this Promise will always fail.
    operation: somePromiseOperation,
    // Maximum number of times to attempt
    maxRetry: 5,
    // Delay between retries in milliseconds
    delay: 2000
};

var resolute_callback = function(retryCount) {
    console.log(retryCount);
};

var resolute = new Resolute(resolute_options, resolute_callback);

// Run the operation stored in options.
resolute.run().then(null).catch(function(err) {
    console.log("failed after trying: " + resolute.maxRetry + " times, with error: " + err);
});

// Pass in a new operation to perform using the same Resolute instance.
resolute.run(somePromiseOperation).then(null).catch(function(err) {
    console.log("failed after trying: " + resolute.maxRetry + " times, with error: " + err);
});


```
