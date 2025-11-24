import './Index.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <span className="footer-text">InfoTrânsito © {currentYear}</span>
    </footer>
  );
}