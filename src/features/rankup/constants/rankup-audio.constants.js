export const RANKUP_SOUND_STORAGE_KEY = 'rankup_sfx_enabled'
export const RANKUP_SOUND_DEFAULT_ENABLED = false
export const RANKUP_SOUND_VOLUME = 1

export const RANKUP_SOUND_EVENTS = Object.freeze({
  CLOSE_MODAL: 'closeModal',
  LOAD_MORE: 'loadMore',
  OPEN_MODAL: 'openModal',
  START_GAME: 'startGame',
  TOGGLE_LANGUAGE: 'toggleLanguage',
  UI: 'ui',
})

export const RANKUP_SOUND_RATE_BY_EVENT = Object.freeze({
  [RANKUP_SOUND_EVENTS.CLOSE_MODAL]: 0.78,
  [RANKUP_SOUND_EVENTS.LOAD_MORE]: 1.18,
  [RANKUP_SOUND_EVENTS.OPEN_MODAL]: 0.92,
  [RANKUP_SOUND_EVENTS.START_GAME]: 1.05,
  [RANKUP_SOUND_EVENTS.TOGGLE_LANGUAGE]: 1.12,
  [RANKUP_SOUND_EVENTS.UI]: 1,
})

export const RANKUP_SOUND_SRC = '/sounds/Arcade-fx.mp3'
