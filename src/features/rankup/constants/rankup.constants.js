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
    views: '450K_V',
    likes: '32K_L',
  },
  { title: 'MAC_1984_BUILD_LOG' },
  { title: 'CYBERPUNK_FILM_TOP_10' },
  { title: 'PACMAN_PERFECT_PLAY' },
  { title: 'AI_ART_OR_GLITCH' },
  { title: 'NEON_WHITE_SPEEDRUN' },
  { title: 'DARK_FOREST_THEORY' },
  { title: 'GLITCH_EFFECT_TUTORIAL' },
  { title: 'RETRO_SHADER_BREAKDOWN' },
  { title: 'ARCADE_CABINET_RESTORE' },
  { title: 'PIXEL_UI_DESIGN_LOG' },
  { title: 'SYNTH_BOSS_FIGHT_MIX' },
]
