import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  FileTextIcon,
  ImageIcon,
  SparklesIcon,
  TypeIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { useCreateProducts } from "../hooks/useProducts";

const CreatePage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProducts();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [imageSelection, setImageSelection] = useState(null);

  const image = imageSelection?.file;
  const url = imageSelection?.url;

  // remove the url when imageSelection is destroyed
  useEffect(() => {
    if (!imageSelection) {
      return;
    }
    return () => URL.revokeObjectURL(url);
  }, [url, imageSelection]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (createProduct.isPending) {
      return;
    }

    if (!image) {
      toast.error("Please select a product image");
      return;
    }
    const body = new FormData();
    body.append("title", formData.title.trim());
    body.append("description", formData.description.trim());
    body.append("image", image);

    createProduct.mutate(body, { onSuccess: () => navigate("/") });
  };

  // this function handles the image change
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageSelection(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Choose a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    // set the image selection
    setImageSelection({ file, url: URL.createObjectURL(file) });
  };
  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeftIcon className="size-4" />
        Back
      </Link>
      <div className="card base-300">
        <div className="card-body">
          <h1 className="card-title">
            <SparklesIcon className="size-5 text-primary" />
            New Product
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Title Input */}
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

              <input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
                disabled={createProduct.isPending}
                required
              />

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
              disabled={createProduct.isPending}
            >
              {createProduct.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Create Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
