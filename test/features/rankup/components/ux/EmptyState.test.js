import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import EmptyState from '../../../../../src/features/rankup/components/ux/EmptyState.jsx'

describe('EmptyState component', () => {
  it('renders default message', () => {
    render(<EmptyState />)
    const message = screen.getByText('SIN_DATOS_DISPONIBLES')
    expect(message).toHaveClass('ux-empty-state')
  })

  it('renders custom message and className', () => {
    render(<EmptyState className="warning" message="NO_RESULTS" />)
    const message = screen.getByText('NO_RESULTS')
    expect(message).toHaveClass('ux-empty-state', 'warning')
  })
})
