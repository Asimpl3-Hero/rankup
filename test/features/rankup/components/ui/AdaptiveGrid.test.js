import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import AdaptiveGrid from '../../../../../src/features/rankup/components/ui/AdaptiveGrid.jsx'

describe('AdaptiveGrid component', () => {
  it('renders children and applies default CSS variables', () => {
    render(
      <AdaptiveGrid>
        <span>Card A</span>
      </AdaptiveGrid>,
    )

    const child = screen.getByText('Card A')
    const grid = child.parentElement

    expect(grid).toHaveClass('ui-adaptive-grid')
    expect(grid.style.getPropertyValue('--ui-grid-gap')).toBe('1rem')
    expect(grid.style.getPropertyValue('--ui-grid-min')).toBe('220px')
  })

  it('converts numeric props and merges custom style', () => {
    render(
      <AdaptiveGrid
        className="extra-grid"
        gap={20}
        minItemWidth={300}
        style={{ backgroundColor: 'rgb(1, 2, 3)' }}
      >
        <span>Card B</span>
      </AdaptiveGrid>,
    )

    const child = screen.getByText('Card B')
    const grid = child.parentElement

    expect(grid).toHaveClass('ui-adaptive-grid', 'extra-grid')
    expect(grid.style.getPropertyValue('--ui-grid-gap')).toBe('20px')
    expect(grid.style.getPropertyValue('--ui-grid-min')).toBe('300px')
    expect(grid).toHaveStyle({ backgroundColor: 'rgb(1, 2, 3)' })
  })
})
