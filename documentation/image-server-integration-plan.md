# Plan: Implement Custom File Service for External Image Storage

This plan outlines the steps to create a custom File Service in your Medusa backend that will intercept image uploads from the Admin panel and forward them to your external image server, storing only the image URLs in the Medusa database.

## 1. Create the Custom File Service File

We will create a new file, `external-image-file-service.js`, in the `/root/damneddesigns/backend/src/services/` directory. This file will contain the implementation of our custom file service.

```javascript
// /root/damneddesigns/backend/src/services/external-image-file-service.js
import { BaseService } from "@medusajs/medusa"; // Use BaseService for v2
import fs from "fs";
import axios from "axios";
import FormData from "form-data"; // Need form-data for sending files

class ExternalImageFileService extends BaseService {
  constructor(container, options) {
    super(container);
    // Options passed from medusa-config.ts
    this.imageServerUrl = options.imageServerUrl;
    this.imageServerToken = options.imageServerToken; // Assuming token for auth
  }

  /**
   * Uploads a file to the external image server.
   * @param {Object} file - The file object provided by Medusa.
   * @returns {Promise<Object>} An object containing the URL and key of the uploaded file.
   */
  async upload(file) {
    const form = new FormData();
    // Append the file stream to the form data
    form.append("file", fs.createReadStream(file.path), file.originalname);

    try {
      const response = await axios.post(
        `${this.imageServerUrl}/upload`, // Adjust endpoint as per your image server API
        form,
        {
          headers: {
            ...form.getHeaders(), // Include form-data headers
            Authorization: `Bearer ${this.imageServerToken || ""}`, // Add authentication header
          },
        }
      );

      // Assuming your image server returns a JSON object with 'url' and 'key'
      const { url, path: key } = response.data; // Adjust property names based on your server's response

      // Return the structure expected by Medusa
      return { url, key };
    } catch (error) {
      console.error("Error uploading file to external image server:", error);
      throw new Error("Failed to upload image to external server.");
    }
  }

  /**
   * Deletes a file from the external image server.
   * @param {string} fileKey - The key of the file to delete.
   * @returns {Promise<void>}
   */
  async delete(fileKey) {
    try {
      // Assuming your image server has a delete endpoint
      await axios.delete(`${this.imageServerUrl}/images/${fileKey}`, {
        headers: {
          Authorization: `Bearer ${this.imageServerToken || ""}`,
        },
      });
    } catch (error) {
      console.error("Error deleting file from external image server:", error);
      // Depending on requirements, you might not want to throw an error here
      // if the file might have already been deleted or the delete is not critical.
    }
  }
}

export default ExternalImageFileService;
```

**Dependencies:**

This custom service requires `axios` and `form-data`. You may need to install them in your backend project if they are not already present:

```bash
npm install axios form-data
# or
yarn add axios form-data
```

## 2. Update Medusa Configuration

We will modify the `medusa-config.ts` file in `/root/damneddesigns/backend/` to replace the default file service configuration with our new `ExternalImageFileService`.

We will remove the existing `@medusajs/file-local` plugin entry and add the `projectConfig.fileService` entry pointing to our custom service.

## 3. Explain the Implementation

Once these changes are made, when an image is uploaded via the Medusa Admin panel, the request will be handled by our `ExternalImageFileService`. The `upload` method will send the file to your configured image server URL. Your image server should then process the file, store it, and return a response containing the public URL and a unique key for the image. Medusa will then save this URL and key in the product's image data in its database. The storefront and admin will then display the image using the URL provided by your image server.

## 4. Testing Steps

To test the integration:
*   Ensure your external image server is running and the upload/delete endpoints are accessible at the configured `imageServerUrl`.
*   Make sure the necessary environment variables (`IMAGE_SERVER_URL`, `IMAGE_SERVER_TOKEN`) are set in your backend's `.env` file.
*   Restart your Medusa backend.
*   Access the Medusa Admin panel.
*   Navigate to a product and attempt to upload a new image.
*   Verify that the image appears correctly in the Admin panel after uploading.
*   Check your external image server to confirm that the image file was received and stored.
*   Verify that the product image is displayed correctly on your storefront.
*   (Optional) Attempt to delete the image from the Admin panel and verify that it is removed from your external image server.