import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Auth/useAuth";
import './Index.css'

export function Navbar() {
  const { isAuthenticated, logout, permissions } = useAuth();
  const navigate = useNavigate();
  const canAccessMyAccidents = permissions?.Sinistros?.includes("AD") ?? false;
  const canAccessAccidentList = permissions?.Sinistros?.includes("VI") ?? false;
  const canAccessMap = permissions?.Sinistros?.includes("VI") ?? false;
  const canAccessStatistics = permissions?.Sinistros?.includes("VI") ?? false;
  const canAccessDeletionRequests = permissions?.Sinistros?.includes("CANEX") ?? false;

  function handleLogout() {
    logout();
    navigate("/sobre", { replace: true });
  }

  useEffect(() => {
    console.log("Permissões carregadas:", permissions);
  }, [permissions]);

  return (
    <nav className="navbar">

      <div className="nav-left">
        <Link to="/sobre" className="nav-button">Sobre</Link>
        {isAuthenticated && (<Link to="/cadastro" className="nav-button">Cadastro</Link>)}

        {(canAccessMyAccidents || canAccessAccidentList) && (
          <div className="nav-dropdown">
            <button type="button" className="nav-button nav-dropdown-trigger">
              Sinistros <span aria-hidden="true">▾</span>
            </button>
            <div className="nav-dropdown-menu">
              {canAccessMyAccidents && (
                <Link to="/listaUserSinistros" className="nav-dropdown-item">Meus Sinistros</Link>
              )}
              {canAccessAccidentList && (
                <Link to="/listaSinistros" className="nav-dropdown-item">Lista de Sinistros</Link>
              )}
            </div>
          </div>
        )}

        {(canAccessMap || canAccessDeletionRequests) && (
          <div className="nav-dropdown">
            <button type="button" className="nav-button nav-dropdown-trigger">
              Análise de dados <span aria-hidden="true">▾</span>
            </button>
            <div className="nav-dropdown-menu">
              {canAccessStatistics && (
                <Link to="/estatisticas" className="nav-dropdown-item">Estatísticas</Link>
              )}
              {canAccessMap && (
                <Link to="/mapaSinistros" className="nav-dropdown-item">Mapa de Sinistros</Link>
              )}
              {canAccessDeletionRequests && (
                <Link to="/sinistros/listaExclusaoSinistros" className="nav-dropdown-item">
                  Solicitações de exclusão
                </Link>
              )}
            </div>
          </div>
        )}
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