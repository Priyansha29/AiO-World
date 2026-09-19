import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__mark" aria-hidden="true">
            X
          </span>
          <span className="footer__name">Project X</span>
        </div>
        <p className="footer__note">
          Made by students, for students. No downloads, no drama — just a tab
          that works as hard as you do.
        </p>
        <p className="footer__legal">
          © {new Date().getFullYear()} Project X · Built with care, not hype.
        </p>
      </div>
    </footer>
  )
}

export default Footer
