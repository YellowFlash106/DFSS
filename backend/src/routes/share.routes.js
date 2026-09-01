const router = require('express').Router();
const { shareFile, getSharedFiles } = require('../controllers/share.controller');
const authenticate = require('../middleware/auth.middleware');

router.post('/', authenticate, shareFile);
router.get('/shared-files', authenticate, getSharedFiles);

module.exports = router;
