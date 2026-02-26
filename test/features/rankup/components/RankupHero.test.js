import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import RankupHero from '../../../../src/features/rankup/components/RankupHero.jsx'
import { HERO_FALLBACK_VIDEO_SRC } from '../../../../src/features/rankup/constants/rankup.constants.js'
import { RANKUP_I18N_EN } from '../../../../src/features/rankup/i18n/rankup.i18n.en.js'

function buildProps(overrides = {}) {
  return {
    i18n: RANKUP_I18N_EN,
    featuredVideo: {
      id: 'video-hero-1',
      title: 'RETRO_TUTORIAL',
      author: 'ARCADE_LAB',
      publishedAt: 'hace 2 dias',
      hype: 0.84,
      thumbnail: 'https://img.example/hero-1.jpg',
    },
    onStartAction: jest.fn(),
    ...overrides,
  }
}

describe('RankupHero component', () => {
  it('renders fallback content when featuredVideo is missing', () => {
    const { container } = render(
      <RankupHero {...buildProps({ featuredVideo: undefined })} />,
    )

    expect(screen.getByRole('heading', { level: 2, name: 'NO_ACTIVE_VIDEO' })).toBeInTheDocument()
    expect(screen.getByText('HYPE:')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()

    const video = container.querySelector('video.svr-hero-media')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('src', HERO_FALLBACK_VIDEO_SRC)
  })

  it('renders featured metadata and starts action on button click', () => {
    const onStartAction = jest.fn()
    render(
      <RankupHero
        {...buildProps({ onStartAction })}
      />,
    )

    expect(screen.getByText('VIDEO_OF_THE_DAY')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'RETRO_TUTORIAL' })).toBeInTheDocument()
    expect(
      screen.getByText(
        '[SOURCE_STREAM]: CHANNEL_ARCADE_LAB | 2 days ago | LIVE_HYPE_SIGNAL_84%',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('84%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'START_GAME' }))
    expect(onStartAction).toHaveBeenCalledTimes(1)
  })

  it('renders direct video source when provided', () => {
    const { container } = render(
      <RankupHero
        {...buildProps({
          featuredVideo: {
            title: 'DIRECT_VIDEO',
            author: 'NEON_FEED',
            publishedAt: 'hace 1 semana',
            hype: 0.5,
            videoUrl: 'https://video.example/hero.mp4',
          },
        })}
      />,
    )

    const video = container.querySelector('video.svr-hero-media')
    expect(video).not.toBeNull()
    expect(video).toHaveAttribute('src', 'https://video.example/hero.mp4')
  })

  it('switches from primary image to fallback video when image fails', () => {
    const { container } = render(
      <RankupHero
        {...buildProps({
          featuredVideo: {
            title: 'IMAGE_SOURCE',
            author: 'NEON_FEED',
            publishedAt: 'hace 1 semana',
            hype: 0.5,
            thumbnail: 'https://img.example/hero-image.jpg',
          },
        })}
      />,
    )

    const image = container.querySelector('img.svr-hero-media')
    expect(image).not.toBeNull()
    fireEvent.error(image)

    const fallbackVideo = container.querySelector('video.svr-hero-media')
    expect(fallbackVideo).not.toBeNull()
    expect(fallbackVideo).toHaveAttribute('src', HERO_FALLBACK_VIDEO_SRC)
  })

  it('hides media if fallback video also fails', () => {
    const { container } = render(
      <RankupHero {...buildProps({ featuredVideo: undefined })} />,
    )

    const fallbackVideo = container.querySelector('video.svr-hero-media')
    expect(fallbackVideo).not.toBeNull()
    fireEvent.error(fallbackVideo)

    expect(container.querySelector('.svr-hero-media')).toBeNull()
  })
})
