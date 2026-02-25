import { RANKUP_CONFIG } from '../config'

/** @typedef {import('../types').CartridgeItem} CartridgeItem */
/** @typedef {import('../types').MetricPanel} MetricPanel */

const { initialVisibleCartridges, loadMoreStep } = RANKUP_CONFIG

export const INITIAL_VISIBLE_CARTRIDGES = initialVisibleCartridges
export const LOAD_MORE_STEP = loadMoreStep

/** @type {MetricPanel[]} */
export const METRIC_PANELS = [
  {
    label: 'MONITOR_01: VISTAS',
    value: '40%',
    width: '40%',
    detail: 'IMPACTO_PRINCIPAL',
    emphasized: true,
  },
  {
    label: 'MONITOR_02: ME_GUSTA',
    value: '30%',
    width: '30%',
    detail: 'PODER_SOCIAL',
  },
  {
    label: 'MONITOR_03: COMENTARIOS',
    value: '20%',
    width: '20%',
    detail: 'PROFUNDIDAD_INTERACCION',
  },
  {
    label: 'MONITOR_04: TIEMPO',
    value: '10%',
    width: '10%',
    detail: 'BONUS_RECIENCIA',
  },
]

/** @type {CartridgeItem[]} */
export const CARTRIDGES = [
  {
    title: 'RADIO_SYNTHWAVE_CALMA',
    author: 'CANAL_RANKUP',
    publishedAt: 'Hace 2 dias',
    hype: 0.84,
  },
  { title: 'BITACORA_MAC_1984', author: 'RETRO_STUDIO', publishedAt: 'Hace 1 semana', hype: 0.62 },
  { title: 'TOP_10_CIBERPUNK', author: 'NEON_FEED', publishedAt: 'Hace 3 dias', hype: 0.55 },
  { title: 'PACMAN_PARTIDA_PERFECTA', author: 'ARCADE_ARCHIVE', publishedAt: 'Hace 10 dias', hype: 0.48 },
  { title: 'ARTE_IA_O_FALLO', author: 'PIXEL_LAB', publishedAt: 'Hace 1 mes', hype: 0.4 },
  { title: 'CARRERA_NEON_WHITE', author: 'GLITCH_RUNNER', publishedAt: 'Hace 8 horas', hype: 0.73 },
  { title: 'TEORIA_BOSQUE_OSCURO', author: 'SCI_FI_BYTES', publishedAt: 'Hace 4 dias', hype: 0.45 },
  { title: 'TUTORIAL_EFECTO_FALLO', author: 'UI_FACTORY', publishedAt: 'Hace 6 dias', hype: 0.67 },
  { title: 'ANALISIS_SOMBREADOR_RETRO', author: 'PIXEL_CRAFT', publishedAt: 'Hace 2 semanas', hype: 0.34 },
  { title: 'RESTAURACION_ARCADE', author: 'WORKSHOP_X', publishedAt: 'Hace 5 dias', hype: 0.51 },
  { title: 'BITACORA_INTERFAZ_PIXEL', author: 'DESIGN_CORE', publishedAt: 'Hace 12 horas', hype: 0.77 },
  { title: 'MEZCLA_BOSS_FIGHT_SYNTH', author: 'AUDIO_GRID', publishedAt: 'Hace 9 dias', hype: 0.58 },
]
