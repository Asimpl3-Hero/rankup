import { Button } from './ui'

function RankupHero() {
  return (
    <article className="svr-hero">
      <div className="svr-hero-image" />
      <div className="svr-hero-overlay" />

      <div className="svr-hero-content">
        <div>
          <div className="svr-chip">GAME_OF_THE_DAY</div>
          <h2>ARCADE KING CHALLENGE: NEON SYNTHESIS</h2>
        </div>

        <div className="svr-hero-footer">
          <p>
            [INSTRUCTION MANUAL]: MASTER THE RETRO-FUTURE FLOW. ACHIEVE MAXIMUM
            ENGAGEMENT RATIO TO UNLOCK LEVEL 99. HIGHEST SCORE DETECTED.
          </p>
          <div className="svr-hero-actions">
            <Button type="button">START_GAME</Button>
            <div className="svr-score-box">
              <span>P1_SCORE:</span>
              <strong>1,240,500</strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default RankupHero
