import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import RankupCartridgeSection from '../../../../src/features/rankup/components/RankupCartridgeSection.jsx'
import { RANKUP_I18N_EN } from '../../../../src/features/rankup/i18n/rankup.i18n.en.js'

const baseCartridges = [
  {
    id: 'video-1',
    title: 'RETRO_TUTORIAL',
    author: 'ARCADE_LAB',
    publishedAt: 'hace 2 dias',
    hype: 0.84,
    thumbnail: 'https://img.example/video-1.jpg',
  },
  {
    id: 'video-2',
    title: 'PIXEL_ART',
    author: 'NEON_STUDIO',
    publishedAt: 'hace 1 mes',
    hype: 0.42,
    videoUrl: 'https://video.example/video-2.mp4',
  },
]

function buildProps(overrides = {}) {
  return {
    i18n: RANKUP_I18N_EN,
    cartridges: baseCartridges,
    countLabel: '2 CARTRIDGES FOUND',
    errorMessage: '',
    hasMore: true,
    isLoading: false,
    onLoadMore: jest.fn(),
    onSelectVideo: jest.fn(),
    ...overrides,
  }
}

describe('RankupCartridgeSection component', () => {
  it('shows loading state', () => {
    render(
      <RankupCartridgeSection
        {...buildProps({
          cartridges: [],
          isLoading: true,
        })}
      />,
    )

    expect(screen.getByText('CHOOSE_YOUR_CARTRIDGE')).toBeInTheDocument()
    expect(screen.getByText('LOADING_VIDEOS_FROM_API...')).toBeInTheDocument()
    expect(document.querySelector('.svr-cartridge-grid')).toBeNull()
  })

  it('shows empty state with explicit error message', () => {
    render(
      <RankupCartridgeSection
        {...buildProps({
          cartridges: [],
          hasMore: false,
          errorMessage: 'CUSTOM_ERROR',
        })}
      />,
    )

    expect(screen.getByText('CUSTOM_ERROR')).toBeInTheDocument()
  })

  it('renders cards, author, hype percent and localized date', () => {
    render(<RankupCartridgeSection {...buildProps()} />)

    expect(screen.getByText('RETRO_TUTORIAL')).toBeInTheDocument()
    expect(screen.getByText('PIXEL_ART')).toBeInTheDocument()
    expect(screen.getByText('ARCADE_LAB')).toBeInTheDocument()
    expect(screen.getByText('84%')).toBeInTheDocument()
    expect(screen.getByText('2 days ago')).toBeInTheDocument()
    expect(screen.getByText('1 month ago')).toBeInTheDocument()
  })

  it('calls onSelectVideo on click and keyboard activation', () => {
    const onSelectVideo = jest.fn()
    render(<RankupCartridgeSection {...buildProps({ onSelectVideo })} />)

    const firstCardTitle = screen.getByText('RETRO_TUTORIAL')
    const firstCard = firstCardTitle.closest('article')

    expect(firstCard).not.toBeNull()

    fireEvent.click(firstCard)
    fireEvent.keyDown(firstCard, { key: 'Enter' })
    fireEvent.keyDown(firstCard, { key: ' ' })
    fireEvent.keyDown(firstCard, { key: 'ArrowDown' })

    expect(onSelectVideo).toHaveBeenCalledTimes(3)
    expect(onSelectVideo).toHaveBeenNthCalledWith(1, baseCartridges[0])
  })

  it('calls onLoadMore when load more button is clicked', () => {
    const onLoadMore = jest.fn()
    render(
      <RankupCartridgeSection
        {...buildProps({
          onLoadMore,
          hasMore: true,
          isLoading: false,
        })}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'LOAD_MORE_LEVELS' }))
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })
})
