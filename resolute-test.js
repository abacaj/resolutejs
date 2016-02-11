var somePromiseOperation = function(err) {
  // Simulated promise operation - this will always fail;
  return new Promise(function(resolve, reject) {
    if (err) return reject(err);
    resolve("success");
  });
};
var resolute_options = {
  operation: somePromiseOperation.bind(null, "Will fail."),
  maxRetry: 5,
  delay: 2000
};
var resolute_callback = function(retryCount) {
  console.log(retryCount);
};

var resolute = new Resolute(resolute_options, resolute_callback);
resolute.run().then(null).catch(function(err) {
  console.log("failed after trying: " + resolute.maxRetry + " times, with error: " + err);
});