import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProdiver";

const Logout = () => {
  const { setAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAccess();
    navigate("/", { replace: true });
  };

  setTimeout(() => {
    handleLogout();
  }, 3 * 1000);

  return <>Logout Page</>;
};

export default Logout;