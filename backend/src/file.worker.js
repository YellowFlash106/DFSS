const logger = require("./utils/logger");

worker.on("completed", (job) => {
  logger.info("Job completed", {
    jobId: job.id,
    fileId: job.data.fileId,
  });
});

worker.on("failed", (job, err) => {
  logger.error("Job failed", {
    jobId: job.id,
    error: err.message,
    stack: err.stack,
  });
});