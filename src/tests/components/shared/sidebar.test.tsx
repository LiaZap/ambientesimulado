import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/shared/sidebar'
import { vi, expect, test } from 'vitest'

// Mock usePathname
vi.mock('next/navigation', () => ({
    usePathname: () => '/dashboard',
}))

test('Sidebar renders user name', () => {
    const user = { name: 'Test User', email: 'test@example.com' }
    render(<Sidebar user={user} />)
    expect(screen.getByText('Test User')).toBeDefined()
})

test('Sidebar renders initials when no image', () => {
    const user = { name: 'Test User', email: 'test@example.com' }
    render(<Sidebar user={user} />)
    // Expect at least one element with T (initials)
    const initials = screen.getAllByText('T')
    expect(initials.length).toBeGreaterThan(0)
})
