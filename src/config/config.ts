export default {
  port: process.env.PORT || 3000,
  testRunnerUrl:
    process.env.TEST_RUNNER_URL || "http://localhost:3001/run-tests",
  // coreServiceUrl:
  //   process.env.CORE_SERVICE_URL || "http://localhost:3002/webhook",
};
