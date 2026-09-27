import { useNavigate } from "react-router";
import { useLogout } from "../hooks/useUsers";

const LogoutButton = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleClick = () => {
    console.log("Logout button clicked");
    logout.mutate(null, { onSuccess: navigate("/", { replace: true }) });
  };
  return (
    <button
      onClick={handleClick}
      disabled={logout.isPending}
      className="btn btn-ghost  btn-sm"
    >
      {logout.isPending ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "Logout"
      )}
    </button>
  );
};

export default LogoutButton;
