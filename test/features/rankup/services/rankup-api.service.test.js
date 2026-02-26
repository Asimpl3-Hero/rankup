import { beforeEach, describe, expect, it, jest } from '@jest/globals'

async function loadServiceWithConfig(configOverride = {}) {
  jest.resetModules()
  jest.unstable_mockModule('../../../../src/features/rankup/config/index.js', () => ({
    RANKUP_CONFIG: {
      apiBaseUrl: 'http://localhost:3000/',
      videosEndpoint: 'api/videos',
      ...configOverride,
    },
  }))

  return import('../../../../src/features/rankup/services/rankup-api.service.js')
}

describe('rankup-api.service', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('fetches and maps API payload to cartridge model', async () => {
    const { fetchRankupVideos } = await loadServiceWithConfig()

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ([
        {
          id: '  vid-1  ',
          thumbnail: '  https://img.example/thumb.jpg  ',
          videoUrl: '  https://video.example/watch?v=1  ',
          title: '  Video Title  ',
          author: '  Arcade Channel  ',
          publishedAt: '  Hace 2 dias  ',
          hype: 85,
        },
        {
          video: '  https://video.example/watch?v=2  ',
          hype: 150,
        },
        {
          mediaUrl: ' https://video.example/watch?v=3 ',
          hype: -10,
        },
      ]),
    })

    const result = await fetchRankupVideos()

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    )

    expect(result).toEqual([
      {
        id: 'vid-1',
        thumbnail: 'https://img.example/thumb.jpg',
        videoUrl: 'https://video.example/watch?v=1',
        title: 'Video Title',
        author: 'Arcade Channel',
        publishedAt: 'Hace 2 dias',
        hype: 0.85,
      },
      {
        id: undefined,
        thumbnail: undefined,
        videoUrl: 'https://video.example/watch?v=2',
        title: 'UNTITLED_VIDEO',
        author: 'UNKNOWN_CHANNEL',
        publishedAt: 'NO_DATE',
        hype: 1,
      },
      {
        id: undefined,
        thumbnail: undefined,
        videoUrl: 'https://video.example/watch?v=3',
        title: 'UNTITLED_VIDEO',
        author: 'UNKNOWN_CHANNEL',
        publishedAt: 'NO_DATE',
        hype: 0,
      },
    ])
  })

  it('supports relative endpoint when base URL is empty', async () => {
    const { fetchRankupVideos } = await loadServiceWithConfig({
      apiBaseUrl: '',
      videosEndpoint: 'api/videos',
    })

    fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    })

    await fetchRankupVideos()
    expect(fetch).toHaveBeenCalledWith(
      '/api/videos',
      expect.any(Object),
    )
  })

  it('throws explicit error when status is not ok', async () => {
    const { fetchRankupVideos } = await loadServiceWithConfig()

    fetch.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({}),
    })

    await expect(fetchRankupVideos()).rejects.toThrow('Solicitud fallida con estado 503')
  })

  it('throws explicit error when payload is not an array', async () => {
    const { fetchRankupVideos } = await loadServiceWithConfig()

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    })

    await expect(fetchRankupVideos()).rejects.toThrow('La respuesta de videos no es un arreglo')
  })
})
