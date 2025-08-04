import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

// Simple test component
function TestComponent() {
  return <div>Test Component</div>
}

describe('Sample Test', () => {
  it('renders test component', () => {
    render(<TestComponent />)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
})