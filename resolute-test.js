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
