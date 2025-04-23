import { AbstractFileProviderService } from "@medusajs/framework/utils";
import { ProviderUploadFileDTO, ProviderFileResultDTO, ProviderDeleteFileDTO, ProviderGetFileDTO } from "@medusajs/framework/types";
import path from 'path'
import axios from 'axios';
class MyFileProviderService extends AbstractFileProviderService {
    static identifier = "my-file"

    private uploadDir: string
  
    constructor(container, options) {
      super()
      this.uploadDir = options.uploadDir || path.join(process.cwd(), 'static')
    }

  
async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
console.log(file,"uploadingfile");

  try {


    const res = await axios.post(`${process.env.IMAGE_SERVER_URL}/upload`, file);

    if (res.status !== 200) {
      throw new Error("Upload failed");
    }

    console.log("Upload success", res.data);
    return res.data; // Must contain { url, key }

  } catch (error) {
    console.error("Upload Error:", error.response?.data || error.message);
    throw new Error("Upload failed");
  }
}

    async delete(file: ProviderDeleteFileDTO): Promise<void> {
      console.log("Deleting file:", file);

    
    }

       async getPresignedDownloadUrl(
         fileData: ProviderGetFileDTO
       ): Promise<string> {
        console.log("getPresignedDownloadUrlsadss", fileData);

        return `${process.env.IMAGE_SERVER_URL}/static/${fileData?.fileKey}`
       }
     
}

export default MyFileProviderService;