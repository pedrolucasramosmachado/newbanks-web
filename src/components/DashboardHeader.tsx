import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DashboardHeaderProps = {
  name: string;
  email: string;
};

export function DashboardHeader({
  name,
  email,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("newbanks_token");
    navigate("/login", { replace: true });
  }

  return (
    <header className="dashboard-header">
      <div className="brand">
        <span className="brand-icon">↗</span>
        <strong>NEWBANKS</strong>
      </div>

      <div className="header-user">
        <div className="header-user-info">
          <strong>{name}</strong>
          <span>{email}</span>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </header>
  );
}