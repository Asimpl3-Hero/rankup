function RankupFooter({ i18n }) {
  return (
    <footer className="svr-footer">
      <div className="svr-footer-title">{i18n.footer.title}</div>
      <nav className="svr-footer-links">
        <a href="#reglas">{i18n.footer.rules}</a>
        <a href="#privacidad">{i18n.footer.privacy}</a>
        <a href="#creditos">{i18n.footer.credits}</a>
      </nav>
      <small>{i18n.footer.rights}</small>
    </footer>
  )
}

export default RankupFooter
