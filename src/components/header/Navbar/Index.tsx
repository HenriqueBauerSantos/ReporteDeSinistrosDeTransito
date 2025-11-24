import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Auth/useAuth";
import './Index.css'
import { RequirePermission } from "../../../Auth/RequirePermission";

export function Navbar() {
  const { isAuthenticated, logout, permissions } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    console.log("Permissões carregadas:", permissions);
  }, [permissions]);

  return (
    <nav className="navbar">

      <div className="nav-left">
        <Link to="/sobre" className="nav-button">Sobre</Link>
        {isAuthenticated && (<Link to="/cadastro" className="nav-button">Cadastro</Link>)}
        <RequirePermission claim="Sinistros" action="VI">
          <Link to="/listaSinistros" className="nav-button">Lista de Sinistros</Link>
        </RequirePermission>
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>

    </nav>
  );
}