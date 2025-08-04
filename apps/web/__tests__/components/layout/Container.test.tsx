import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Container } from '@/components/layout/Container'

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <p>Test content</p>
      </Container>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies default max-width class', () => {
    const { container } = render(
      <Container>
        <p>Test content</p>
      </Container>
    )
    
    const containerElement = container.firstChild
    expect(containerElement).toHaveClass('max-w-screen-xl')
  })

  it('applies custom max-width class', () => {
    const { container } = render(
      <Container maxWidth="lg">
        <p>Test content</p>
      </Container>
    )
    
    const containerElement = container.firstChild
    expect(containerElement).toHaveClass('max-w-screen-lg')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Container className="custom-class">
        <p>Test content</p>
      </Container>
    )
    
    const containerElement = container.firstChild
    expect(containerElement).toHaveClass('custom-class')
  })

  it('applies responsive padding classes', () => {
    const { container } = render(
      <Container>
        <p>Test content</p>
      </Container>
    )
    
    const containerElement = container.firstChild
    expect(containerElement).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8')
  })
})