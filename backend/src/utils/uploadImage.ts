import type { UploadApiResponse } from "cloudinary";

import cloudinary from "../cloudinary/index.js";

export const uploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
        allowed_formats: ["jpg", "png", "webp"],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Image upload returned no result"));
          return;
        }

        resolve(result);
      },
    );
    stream.on("error", reject);
    stream.end(buffer);
  });
};
