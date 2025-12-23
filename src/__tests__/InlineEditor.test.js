import { render, screen, fireEvent } from '@testing-library/react'
import { InlineEditor } from '../components/InlineEditor'

describe('InlineEditor', () => {
  test('should render with initial value', () => {
    render(
      <InlineEditor value="Test Value" onSave={jest.fn()} onCancel={jest.fn()} />
    )
    expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
  })

  test('should call onSave on Enter key', () => {
    const onSave = jest.fn()
    render(
      <InlineEditor value="Test" onSave={onSave} onCancel={jest.fn()} />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(onSave).toHaveBeenCalledWith('Test')
  })

  test('should call onCancel on Escape key', () => {
    const onCancel = jest.fn()
    render(
      <InlineEditor value="Test" onSave={jest.fn()} onCancel={onCancel} />
    )

    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })

  test('should update value on change', () => {
    render(
      <InlineEditor value="Test" onSave={jest.fn()} onCancel={jest.fn()} />
    )

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Value' } })
    expect(screen.getByDisplayValue('New Value')).toBeInTheDocument()
  })
})
