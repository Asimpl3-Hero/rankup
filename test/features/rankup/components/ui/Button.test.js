import { describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen } from '@testing-library/react'
import Button from '../../../../../src/features/rankup/components/ui/Button.jsx'

describe('Button component', () => {
  it('renders with default type and primary variant', () => {
    render(<Button>Play</Button>)

    const button = screen.getByRole('button', { name: 'Play' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveClass('ui-button', 'ui-button--primary')
  })

  it('applies custom variant, className and forwards events', () => {
    const onClick = jest.fn()
    render(
      <Button type="submit" variant="ghost" className="custom-btn" onClick={onClick}>
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })
    fireEvent.click(button)

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveClass('ui-button--ghost', 'custom-btn')
  })
})
