import { Button } from './ui'
import { SearchField } from './ux'

function RankupHeader({
  isSoundEnabled,
  i18n,
  onToggleSound,
  searchTerm,
  onSearchChange,
  onToggleLanguage,
}) {
  return (
    <header className="svr-header">
      <div className="svr-header-left">
        <div className="svr-logo" aria-label="Rankup">
          <svg
            className="svr-logo-icon"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            shapeRendering="crispEdges"
          >
            <rect x="28" y="8" width="8" height="8" fill="currentColor" />
            <rect x="30" y="16" width="4" height="10" fill="currentColor" />
            <rect x="10" y="28" width="44" height="22" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="14" y="32" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="20" y="34" width="4" height="10" fill="currentColor" />
            <rect x="16" y="38" width="12" height="4" fill="currentColor" />
            <rect x="40" y="34" width="4" height="4" fill="currentColor" />
            <rect x="46" y="38" width="4" height="4" fill="currentColor" />
          </svg>
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
        <Button
          type="button"
          className="svr-header-sound-toggle"
          data-sound-enabled={isSoundEnabled ? 'true' : 'false'}
          aria-label={i18n.header.soundToggleAriaLabel}
          onClick={onToggleSound}
        >
          {isSoundEnabled ? i18n.header.soundOnLabel : i18n.header.soundOffLabel}
        </Button>
        <Button
          type="button"
          className="svr-header-language-toggle"
          onClick={onToggleLanguage}
        >
          {i18n.header.languageToggleLabel}
        </Button>
      </div>
    </header>
  )
}

export default RankupHeader
