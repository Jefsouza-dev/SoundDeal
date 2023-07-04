import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";

interface IPanelHeader {
  novo?: string;
  dashboard?: string;
}

const PanelHeader = ({ novo, dashboard }: IPanelHeader) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth).then(() => {
      navigate("/");
    });
  };

  return (
    <div className="w-full flex items-center h-10 bg-red-500 rounded-lg text-white font-medium  px-4 mb-4">
      <Link to="/dashboard">{dashboard}</Link>
      <Link to="/dashboard/novo">{novo}</Link>

      <button className="ml-auto" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
};

export default PanelHeader;
