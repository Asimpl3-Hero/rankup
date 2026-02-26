import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import VideoInfoModal from '../../../../../src/features/rankup/components/ux/VideoInfoModal.jsx'
import { RANKUP_I18N_EN } from '../../../../../src/features/rankup/i18n/rankup.i18n.en.js'

const baseVideo = {
  id: 'video-01',
  title: 'TUTORIAL_RETRO',
  author: 'ARCADE_LAB',
  publishedAt: 'hace 2 dias',
  hype: 0.84,
  thumbnail: 'https://img.example/video-01.jpg',
  likes: 1200,
  comments: 33,
}

const rankingPool = [
  baseVideo,
  {
    id: 'video-02',
    title: 'SECOND_VIDEO',
    author: 'DEV_FEED',
    publishedAt: 'hace 4 dias',
    hype: 0.4,
  },
]

describe('VideoInfoModal component', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <VideoInfoModal
        i18n={RANKUP_I18N_EN}
        isOpen={false}
        onClose={() => {}}
        rankingPool={rankingPool}
        video={baseVideo}
      />,
    )

    expect(container).toBeEmptyDOMElement()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders modal data when open', () => {
    render(
      <VideoInfoModal
        i18n={RANKUP_I18N_EN}
        isOpen
        onClose={() => {}}
        rankingPool={rankingPool}
        video={baseVideo}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Video details' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'TUTORIAL_RETRO' })).toBeInTheDocument()
    expect(screen.getByText('ARCADE_LAB')).toBeInTheDocument()
    expect(screen.getByText('1,200')).toBeInTheDocument()
    expect(screen.getByText('33')).toBeInTheDocument()
  })

  it('calls onClose on close button and escape key', () => {
    const onClose = jest.fn()
    render(
      <VideoInfoModal
        i18n={RANKUP_I18N_EN}
        isOpen
        onClose={onClose}
        rankingPool={rankingPool}
        video={baseVideo}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('locks and restores body scroll on open/unmount', () => {
    const { unmount } = render(
      <VideoInfoModal
        i18n={RANKUP_I18N_EN}
        isOpen
        onClose={() => {}}
        rankingPool={rankingPool}
        video={baseVideo}
      />,
    )

    expect(document.body.style.overflow).toBe('hidden')

    unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('shows placeholder and fallback engagement when thumbnail fails or metrics are missing', () => {
    render(
      <VideoInfoModal
        i18n={RANKUP_I18N_EN}
        isOpen
        onClose={() => {}}
        rankingPool={rankingPool}
        video={{
          ...baseVideo,
          likes: undefined,
          comments: undefined,
        }}
      />,
    )

    const image = screen.getByRole('img', { name: /Video details:/i })
    fireEvent.error(image)

    expect(screen.queryByRole('img', { name: /Video details:/i })).not.toBeInTheDocument()
    expect(document.querySelector('.svr-modal-preview-placeholder')).not.toBeNull()
    expect(screen.getAllByText('--')).toHaveLength(2)
  })
})
