import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/layout.css";
import "../styles/pages.css";
import "../styles/game.css";

export default function MainLayout() {
  const { user, admin, logout, adminLogout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function close() {
    setOpen(false);
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <NavLink to="/" className="brand" onClick={close}>
          <span className="brand-mark" aria-hidden="true">
            🏍
          </span>
          <span>TYPERIDER</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/play">Play Game</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/how-to-play">How to Play</NavLink>
          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {admin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-cta">
          {user ? (
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink className="btn btn-ghost" to="/login">
                Login
              </NavLink>
              <NavLink className="btn btn-primary" to="/signup">
                Sign Up
              </NavLink>
            </>
          )}
          {admin ? (
            <button className="btn btn-ghost" type="button" onClick={adminLogout}>
              Admin Out
            </button>
          ) : (
            <NavLink className="btn btn-gold" to="/admin/login">
              Admin Login
            </NavLink>
          )}
        </div>
        <button
          className="hamburger"
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <NavLink to="/" onClick={close}>
          Home
        </NavLink>
        <NavLink to="/play" onClick={close}>
          Play Game
        </NavLink>
        <NavLink to="/leaderboard" onClick={close}>
          Leaderboard
        </NavLink>
        <NavLink to="/how-to-play" onClick={close}>
          How to Play
        </NavLink>
        {user && (
          <NavLink to="/dashboard" onClick={close}>
            Dashboard
          </NavLink>
        )}
        {admin && (
          <NavLink to="/admin" onClick={close}>
            Admin
          </NavLink>
        )}
        {user ? (
          <button
            type="button"
            onClick={() => {
              logout();
              close();
              navigate("/");
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" onClick={close}>
              Login
            </NavLink>
            <NavLink to="/signup" onClick={close}>
              Sign Up
            </NavLink>
          </>
        )}
        {admin ? (
          <button
            type="button"
            onClick={() => {
              adminLogout();
              close();
            }}
          >
            Admin Logout
          </button>
        ) : (
          <NavLink to="/admin/login" onClick={close}>
            Admin Login
          </NavLink>
        )}
      </div>
      <Outlet />
      <footer className="footer">
        <strong>TypeRider</strong>
        <span>Type Fast. Ride Faster.</span>
      </footer>
    </div>
  );
}
