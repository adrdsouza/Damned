require('dotenv').config();
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();

// Load environment variables
const port = process.env.PORT || 6162;
const uploadDir = process.env.UPLOAD_DIR || 'static';
const domainUrl = process.env.DOMAIN_URL || 'http://localhost:6162';

// Parse allowed origins from environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ["http://localhost:9000", "https://admin.damneddesigns.com", "http://localhost:8000"];
  
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

 
// Enable CORS
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.post('/upload', async (req, res) => {
  try {  
    const { filename, mimeType, content } = req.body;
    if (!content) {
      throw new Error("File content is missing. Ensure file is uploaded correctly.");
    }
      await fs.mkdir(uploadDir, { recursive: true });  
    

      const fileName = `${Date.now()}-${filename}`
      const filePath = path.join(uploadDir, fileName)

      // Write file to server
      await fs.writeFile(filePath, content, 'binary')


    const fileUrl = `${domainUrl}/static/${fileName}`;

    return res.status(200).json({
      url: fileUrl,
      key: fileName,
    });
  } catch (error) {
    console.error('Error uploading JSON-based image:', error);
    return res.status(500).json({ error: 'Server error uploading image' });
  }
});


app.use('/static', express.static(path.join(__dirname, uploadDir)));

// File deletion endpoint
app.delete('/delete/:key', async (req, res) => {
  const { key } = req.params;
  try {
    const filePath = path.join(__dirname, uploadDir, key);
    await fs.unlink(filePath);  // Delete the file
    console.log(`File ${key} deleted successfully`);
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ error: 'Error deleting file' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({ 
    error: 'Server error', 
    message: process.env.NODE_ENV === 'production' ? null : err.message 
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Image server is running at http://localhost:${port}`);
  console.log(`Public domain: ${domainUrl}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
