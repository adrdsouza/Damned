# Damned Designs Image Server Documentation

## Overview

The Damned Designs Image Server is a dedicated service for handling product images and other media assets. This standalone Node.js service provides image storage, processing, and delivery capabilities for the e-commerce platform. This document details the architecture, configuration, and operational aspects of the image service.

## Architecture & Components

### Core Components

- **Framework**: Custom Node.js application
<<<<<<< HEAD
- **Directory**: `/root/damneddesigns/images`
- **Main Entry Point**: `/root/damneddesigns/images/index.js`
=======
- **Directory**: `/root/damneddesigns/images/images`
- **Main Entry Point**: `/root/damneddesigns/images/images/index.js`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
- **Storage**: Local file storage in the `static` directory
- **Port**: 6162 (internal)
- **Public URL**: https://images.damneddesigns.com

### Directory Structure

```
<<<<<<< HEAD
/images/
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── .env                    # Environment configuration
=======
/images/images/
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── .gitignore              # Git ignore file
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
└── static/                 # Image storage directory
    ├── products/           # Product images
    ├── categories/         # Category images
    ├── banners/            # Banner images
    └── misc/               # Miscellaneous images
```

## Configuration Details

### Environment Variables

<<<<<<< HEAD
See `documentation/env-variables.md` for all required environment variables for the images server.
=======
The image server configuration relies on environment variables:

```
PORT=6162                                                        # Server port
DOMAIN_URL=https://images.damneddesigns.com                      # Public domain URL
UPLOAD_DIR=static                                                # Upload directory
ALLOWED_ORIGINS=https://admin.damneddesigns.com,https://api.damneddesigns.com   # CORS allowed origins
```
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

### External Access Configuration

The image server is accessed via Caddy reverse proxy:

```
# Caddy configuration (from /etc/caddy/Caddyfile)
images.damneddesigns.com {
    reverse_proxy 127.0.0.1:6162
}
```

This provides:
- Secure HTTPS access
- Automatic SSL certificate management
- Domain-based routing

## Image Processing Capabilities

<<<<<<< HEAD
*Note: The current implementation does not support resizing, format conversion, optimization, or watermarking. These features are planned for future releases.*
=======
The image server provides several image processing features:

1. **Resizing**: Generate thumbnails and responsive sizes
2. **Format Conversion**: Convert between image formats (JPEG, PNG, WebP)
3. **Optimization**: Compress images for web delivery
4. **Watermarking**: Add watermarks to product images (optional)
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

## API Endpoints

### Upload Endpoint

```
POST /upload
<<<<<<< HEAD
Content-Type: application/json
```

Parameters:
- `filename`: Name of the file to save (required)
- `mimeType`: MIME type of the file (optional, not currently validated)
- `content`: File content as a binary string (required)

Example request body:
```json
{
  "filename": "example.jpg",
  "mimeType": "image/jpeg",
  "content": "<binary data as string>"
}
```
=======
Content-Type: multipart/form-data
```

Parameters:
- `file`: The image file to upload
- `directory`: (optional) Subdirectory for storage (default: 'products')
- `filename`: (optional) Custom filename (default: auto-generated)
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

Response:
```json
{
<<<<<<< HEAD
  "url": "https://images.damneddesigns.com/static/1683141234567-example.jpg",
  "key": "1683141234567-example.jpg"
=======
  "success": true,
  "url": "https://images.damneddesigns.com/products/example-image.jpg",
  "path": "/products/example-image.jpg"
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
}
```

### Image Retrieval

```
<<<<<<< HEAD
GET /static/{filename}
=======
GET /{directory}/{filename}
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
```

Example:
```
<<<<<<< HEAD
https://images.damneddesigns.com/static/1683141234567-example.jpg
=======
https://images.damneddesigns.com/products/example-image.jpg
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
```

### Resized Image Retrieval

```
GET /{directory}/{filename}?width=300&height=200
```

Query Parameters:
- `width`: Desired width in pixels
- `height`: Desired height in pixels
- `fit`: Resize strategy (contain, cover, inside, outside)
- `format`: Output format (jpeg, png, webp)

## Integration with Other Components

### Backend Integration

The Medusa backend communicates with the image server for:
- Product image uploads
- Image URL generation
- Image storage management

Configuration in backend `.env`:
```
IMAGE_SERVER_URL=https://images.damneddesigns.com
```

### Admin Panel Integration

The admin panel uploads images directly to the image server:
- Product image management
- Category image uploads
- Banner management

### Storefront Integration

The storefront uses image URLs from the image server:
- Product images on product pages
- Category images in navigation
- Responsive images with multiple sizes

## Security Model

### Access Control

The image server implements several security measures:

1. **CORS Protection**: Only allows requests from specified origins:
   - `https://admin.damneddesigns.com`
   - `https://api.damneddesigns.com`

2. **Upload Authentication**: Requires authentication for image uploads
   - Admin API token validation
   - No public upload access

3. **Read Access**: Public read access for delivered images
   - Anyone can view published images
   - No directory listing allowed

### File Validation

All uploaded files undergo validation:

1. **MIME Type Checking**: Only allows image file types:
   - image/jpeg
   - image/png
   - image/webp
   - image/gif

2. **Size Limits**: Restricts maximum file size (10MB default)

3. **Filename Sanitization**: Ensures safe filenames

## Monitoring & Logs

<<<<<<< HEAD
- **Application Logs**: View with `pm2 logs images`
=======
- **Application Logs**: View with `pm2 logs damned-designs-images`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
- **PM2 Monitoring**: Use `pm2 monit` for real-time stats
- **File System Monitoring**: Track disk usage with `df -h`

## Common Issues & Troubleshooting

### Image Server Not Responding

If the image server is inaccessible:

<<<<<<< HEAD
1. Check if the service is running: `pm2 status images`
2. Verify the service is listening on port 6162: `ss -tlnp | grep 6162`
3. Check Caddy configuration for proper proxy settings
4. Restart if needed: `pm2 restart images`
=======
1. Check if the service is running: `pm2 status damned-designs-images`
2. Verify the service is listening on port 6162: `ss -tlnp | grep 6162`
3. Check Caddy configuration for proper proxy settings
4. Restart if needed: `pm2 restart damned-designs-images`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

### Upload Failures

If image uploads are failing:

<<<<<<< HEAD
1. Check server logs for error messages: `pm2 logs images`
2. Verify CORS settings include the origin making the request
3. Check file size limits and MIME type restrictions
4. Verify the upload directory is writable: `ls -la /root/damneddesigns/images/static`
=======
1. Check server logs for error messages: `pm2 logs damned-designs-images`
2. Verify CORS settings include the origin making the request
3. Check file size limits and MIME type restrictions
4. Verify the upload directory is writable: `ls -la /root/damneddesigns/images/images/static`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

### Image Not Found Errors

If images return 404 errors:

1. Verify the file exists in the storage directory
2. Check the URL path matches the directory structure
3. Ensure filename casing matches exactly
4. Check for proper URL encoding in special characters

### Disk Space Issues

If running low on disk space:

1. Check current disk usage: `df -h`
2. Identify large directories: `du -h --max-depth=1 /root/damneddesigns/images/images/static`
3. Consider implementing an image cleanup policy for unused images
4. Set up monitoring to alert when disk space is low

## Performance Optimization

The image server is optimized for production with:

1. **Image Caching**: Browser-side caching headers
2. **Compression**: On-the-fly image compression
3. **Format Selection**: WebP delivery when supported by browser
4. **Lazy Processing**: Images are processed on-demand, not at upload time

## Backup & Recovery

The image data is included in the system backup process:

1. Files are backed up incrementally as part of the backup script
2. Critical images are backed up daily
3. Restore from backup with `./restore.sh` script

## Deployment Process

When deploying updates to the image server:

<<<<<<< HEAD
1. Stop the current service: `pm2 stop images`
2. Update the code: Pull latest changes or copy files
3. Install dependencies if needed: `npm install`
4. Restart the service: `pm2 start images`
=======
1. Stop the current service: `pm2 stop damned-designs-images`
2. Update the code: Pull latest changes or copy files
3. Install dependencies if needed: `npm install`
4. Restart the service: `pm2 start damned-designs-images`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
5. Verify functionality by uploading a test image

## Future Considerations

Potential improvements for the image server:

1. **CDN Integration**: Add support for CDN distribution
2. **Cloud Storage**: Optional cloud storage backend (S3, Google Cloud Storage)
3. **Advanced Processing**: Additional image processing features
4. **Media Management**: Support for video and other media types