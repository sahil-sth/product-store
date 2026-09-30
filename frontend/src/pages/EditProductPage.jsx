import { Link, useParams } from "react-router";
import { useProduct } from "../hooks/useProducts";

import EditProductForm from "../components/EditProductForm";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const EditProductPage = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const { data: product, isLoading } = useProduct(id);

  // show loading when the product is being retrieved
  if (isLoading) return <LoadingSpinner />;

  // when no product is there, then display an error
  if (!product || product.userId !== userId) {
    return (
      <div className="card bg-base-300 max-w-md mx-auto">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-error">
            {!product ? "Product not found!" : "Access Denied"}
          </h2>
          <Link to="/" className="btn btn-primary btn-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return <EditProductForm product={product} />;
};

export default EditProductPage;
