import { RANKUP_CONFIG } from '../config'

/** @typedef {import('../types').CartridgeItem} CartridgeItem */
/** @typedef {import('../types').MetricPanel} MetricPanel */

const { initialVisibleCartridges, loadMoreStep } = RANKUP_CONFIG

export const INITIAL_VISIBLE_CARTRIDGES = initialVisibleCartridges
export const LOAD_MORE_STEP = loadMoreStep

/** @type {MetricPanel[]} */
export const METRIC_PANELS = [
  {
    label: 'MONITOR_01: VIEWS',
    value: '40%',
    width: '40%',
    detail: 'PRIMARY_IMPACT_RATING',
    emphasized: true,
  },
  {
    label: 'MONITOR_02: LIKES',
    value: '30%',
    width: '30%',
    detail: 'SOCIAL_POWER_LEVEL',
  },
  {
    label: 'MONITOR_03: COMMS',
    value: '20%',
    width: '20%',
    detail: 'ENGAGEMENT_DEPTH',
  },
  {
    label: 'MONITOR_04: TIME',
    value: '10%',
    width: '10%',
    detail: 'RECENCY_CHRONO_BONUS',
  },
]

/** @type {CartridgeItem[]} */
export const CARTRIDGES = [
  {
    title: 'SYNTHWAVE_RADIO_RELAX',
    author: 'RANKUP_CHANNEL',
    publishedAt: 'Hace 2 días',
    hype: 0.84,
  },
  { title: 'MAC_1984_BUILD_LOG', author: 'RETRO_STUDIO', publishedAt: 'Hace 1 semana', hype: 0.62 },
  { title: 'CYBERPUNK_FILM_TOP_10', author: 'NEON_FEED', publishedAt: 'Hace 3 días', hype: 0.55 },
  { title: 'PACMAN_PERFECT_PLAY', author: 'ARCADE_ARCHIVE', publishedAt: 'Hace 10 días', hype: 0.48 },
  { title: 'AI_ART_OR_GLITCH', author: 'PIXEL_LAB', publishedAt: 'Hace 1 mes', hype: 0.4 },
  { title: 'NEON_WHITE_SPEEDRUN', author: 'GLITCH_RUNNER', publishedAt: 'Hace 8 horas', hype: 0.73 },
  { title: 'DARK_FOREST_THEORY', author: 'SCI_FI_BYTES', publishedAt: 'Hace 4 días', hype: 0.45 },
  { title: 'GLITCH_EFFECT_TUTORIAL', author: 'UI_FACTORY', publishedAt: 'Hace 6 días', hype: 0.67 },
  { title: 'RETRO_SHADER_BREAKDOWN', author: 'PIXEL_CRAFT', publishedAt: 'Hace 2 semanas', hype: 0.34 },
  { title: 'ARCADE_CABINET_RESTORE', author: 'WORKSHOP_X', publishedAt: 'Hace 5 días', hype: 0.51 },
  { title: 'PIXEL_UI_DESIGN_LOG', author: 'DESIGN_CORE', publishedAt: 'Hace 12 horas', hype: 0.77 },
  { title: 'SYNTH_BOSS_FIGHT_MIX', author: 'AUDIO_GRID', publishedAt: 'Hace 9 días', hype: 0.58 },
]
