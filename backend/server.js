require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const helmet = require('helmet');
app.use(helmet());

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const adminRoutes = require('./src/routes/admin.routes');
const folderRoutes = require('./src/routes/folder.routes');
const filerRoutes = require('./src/routes/file.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const shareRoutes = require('./src/routes/share.routes');

const errorHandler = require('./src/middleware/errorHandler.middleware');
const requestLogger = require('./src/middleware/requestLogger.middleware');

app.use(requestLogger);
app.use(errorHandler);


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/files', filerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/share', shareRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});


app.listen(port, () =>{
    console.log(`Server is running on port: ${port}...`);
});