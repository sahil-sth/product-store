import { Link } from "react-router";
import useAuth from "../hooks/useAuth";
import {
  ShoppingBagIcon,
  PlusIcon,
  UserIcon,
  UserPlus2Icon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="navbar bg-base-300">
      <div className="max-w-5xl mx-auto w-full px-4 flex justify-between items-center">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            <span className="text-lg font-bold font-mono uppercase tracking-tight">
              Product Store
            </span>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <ThemeSelector />
          {isSignedIn ? (
            <>
              <Link to="/create" className="btn btn-primary btn-sm gap-1">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Product</span>
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-sm gap-1">
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm gap-1">
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>

              <Link to="/register" className="btn btn-ghost btn-sm gap-1">
                <UserPlus2Icon className="size-4" />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
