import {
  ArrowLeftIcon,
  EditIcon,
  Trash2Icon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
import { useAuth } from "@clerk/react";
import { useParams, Link, useNavigate } from "react-router";

import LoadingSpinner from "../components/LoadingSpinner";
import CommentsSection from "../components/CommentsSection";
import { useProduct, useDeleteProduct } from "../hooks/useProducts";

const ProductPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading, error } = useProduct(id);
  const deleteProduct = useDeleteProduct();
  const handleDelete = () => {
    if (confirm("Delete this product permanently?"))
      deleteProduct.mutate(id, { onSuccess: () => navigate("/") });
  };

  if (isLoading) return <LoadingSpinner />;

  if (error || !product) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">Product not found</h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }
  const isOwner = product.userId === userId; // checking if the product belongs to the authenticated user

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon className="size-4" />
          Back
        </Link>
        {isOwner && (
          <div className="flex gap-2">
            <Link to={`/edit/${id}`} className="btn btn-ghost btn-sm gap-1">
              <EditIcon className="size-4" /> Edit
            </Link>
            <button
              className="btn btn-error btn-sm gap-1"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                <Trash2Icon className="size-4" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="card bg-base-300">
          <figure className="p-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="rounded-xl w-full h-80 object-cover"
            />
          </figure>
        </div>
        <div className="card bg-base-300">
          <div className="card-body">
            <h1 className="card-title text-2xl">{product.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-base-content/60 my-2">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4" />
                {new Date(product.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="size-4" />
                {product.user?.name}
              </div>
            </div>
            <div className="divider my-2"></div>

            <p className="text-base-content/80 leading-relaxed">
              {product.description}
            </p>

            {product.user && (
              <>
                <div className="divider my-2"></div>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={product.user.imageUrl}
                        alt={product.user.name}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold">{product.user.name}</p>
                    <p className="text-xs text-base-content/50">Creator</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Comments Section */}
      <div className="card bg-base-300">
        <div className="card-body">
          <CommentsSection
            comments={product.comments}
            productId={id}
            currentUserId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
