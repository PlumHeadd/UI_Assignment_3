import { render, screen } from '@testing-library/react'
import { Header } from '../components/Header'

describe('Header', () => {
  test('should render header title', () => {
    render(<Header />)
    expect(screen.getByText('Kanban Board')).toBeInTheDocument()
  })

  test('should show online status', () => {
    Object.defineProperty(navigator, 'onLine', { value: true, writable: true })
    render(<Header />)
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  test('should have status indicator with role', () => {
    render(<Header />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
