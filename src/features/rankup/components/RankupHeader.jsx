import { Button } from './ui'
import { SearchField } from './ux'

function RankupHeader({
  i18n,
  searchTerm,
  onSearchChange,
  onToggleLanguage,
}) {
  return (
    <header className="svr-header">
      <div className="svr-header-left">
        <div className="svr-logo">
          <span className="material-symbols-outlined svr-logo-icon">videogame_asset</span>
          <h1>
            RANK<span>UP</span>
          </h1>
        </div>
        <nav className="svr-nav">
          <a href="#insertar_moneda">{i18n.header.insertCoin}</a>
          <a href="#puntajes_altos">{i18n.header.scores}</a>
          <a href="#jugadores">{i18n.header.players}</a>
        </nav>
      </div>

      <div className="svr-header-right">
        <SearchField
          placeholder={i18n.header.searchPlaceholder}
          value={searchTerm}
          onChange={onSearchChange}
        />
        <Button type="button" onClick={onToggleLanguage}>
          {i18n.header.languageToggleLabel}
        </Button>
      </div>
    </header>
  )
}

export default RankupHeader
