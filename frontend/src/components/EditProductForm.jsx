import {
  ArrowLeftIcon,
  ImageIcon,
  TypeIcon,
  FileTextIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { useUpdateProduct } from "../hooks/useProducts";

const EditProductForm = ({ product }) => {
  const updateProduct = useUpdateProduct();
  const navigate = useNavigate();
  const [showImageChooser, setShowImageChooser] = useState();
  const [formData, setFormData] = useState({
    title: product?.title,
    description: product?.description,
  });

  const [imageSelection, setImageSelection] = useState({
    file: null,
    url: product?.imageUrl,
  });

  const image = imageSelection?.file;
  const url = imageSelection?.url;

  // remove the url when imageSelection is destroyed
  useEffect(() => {
    if (!imageSelection) {
      return;
    }
    return () => URL.revokeObjectURL(url);
  }, [url, imageSelection]);
  // handles the file change
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageSelection(null);
      return;
    }
    // check the selected file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }
    // check the size of the file
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    // set the image selection
    setImageSelection({ file, url: URL.createObjectURL(file) });
  };
  // submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateProduct.isPending) {
      return;
    }

    const body = new FormData();
    body.append("title", formData.title.trim());
    body.append("description", formData.description.trim());
    body.append("image", image);

    updateProduct.mutate(body, { onSuccess: () => navigate("/") });
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/profile" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" /> Back
      </Link>
      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SaveIcon className="size-5 text-primary" />
            Edit Product
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Title */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Product title"
                className="grow"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </label>
            {/* Image Input */}
            <div className="space-y-2">
              <label
                htmlFor="product-image"
                className="flex items-center gap-2"
              >
                <ImageIcon className="size-4 text-base-content/50" />
                Product image
              </label>
              {showImageChooser ? (
                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="file-input file-input-bordered w-full"
                  onChange={handleImageChange}
                  disabled={updateProduct.isPending}
                />
              ) : (
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setShowImageChooser(true);
                  }}
                >
                  Change product image
                </button>
              )}

              {imageSelection?.url && (
                <div className="rounded-box overflow-hidden">
                  <img
                    src={imageSelection.url}
                    alt="Selected product preview"
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-control">
              <div className="flex items-start gap-2 p-3 rounded-box bg-base-200 border border-base-300">
                <FileTextIcon className="size-4 text-base-content/50 mt-1" />
                <textarea
                  placeholder="Description"
                  className="grow bg-transparent resize-none focus:outline-none min-h-24"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={updateProduct.isPending}
            >
              {updateProduct.isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <span>Edit Product</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductForm;
