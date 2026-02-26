import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import SectionHeader from '../../../../../src/features/rankup/components/ui/SectionHeader.jsx'

describe('SectionHeader component', () => {
  it('renders title and meta when provided', () => {
    render(
      <SectionHeader
        className="header-shell"
        titleClassName="header-title"
        metaClassName="header-meta"
        title="Ranking"
        meta="12 videos"
      />,
    )

    const title = screen.getByRole('heading', { level: 3, name: 'Ranking' })
    const meta = screen.getByText('12 videos')

    expect(title).toHaveClass('header-title')
    expect(meta).toHaveClass('header-meta')
    expect(title.closest('div')).toHaveClass('ui-section-header', 'header-shell')
  })

  it('does not render meta element when meta is absent', () => {
    render(<SectionHeader title="Only title" />)
    expect(screen.getByRole('heading', { level: 3, name: 'Only title' })).toBeInTheDocument()
    expect(screen.queryByText('12 videos')).not.toBeInTheDocument()
  })
})
