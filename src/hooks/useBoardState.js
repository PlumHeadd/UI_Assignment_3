import { useContext } from 'react'
import { BoardContext, BoardDispatchContext } from '../context/BoardProvider'

export function useBoardState() {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error('useBoardState must be used within BoardProvider')
  }
  return context
}

export function useBoardDispatch() {
  const dispatch = useContext(BoardDispatchContext)
  if (!dispatch) {
    throw new Error('useBoardDispatch must be used within BoardProvider')
  }
  return dispatch
}
