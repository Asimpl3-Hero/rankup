import { Button } from './ui'
import { SearchField } from './ux'

function RankupHeader({ searchTerm, onSearchChange }) {
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
          <a href="#insert_coin">INSERT_COIN</a>
          <a href="#hi_scores">HI_SCORES</a>
          <a href="#players">PLAYERS</a>
        </nav>
      </div>

      <div className="svr-header-right">
        <SearchField
          placeholder="FIND_GAME..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        <Button type="button">LOGIN_P1</Button>
      </div>
    </header>
  )
}

export default RankupHeader
