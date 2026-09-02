let totalRequests = 0;
let totalErrors = 0;

const incrementRequests = () => totalRequests++;
const incrementErrors = () => totalErrors++;

const getMetrics = () => ({
    totalRequests,
    totalErrors,
})

module.exports = {
    incrementRequests,
    incrementErrors,
    getMetrics,
}
