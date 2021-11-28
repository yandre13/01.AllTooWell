import React from 'react'

const TooltipContext = React.createContext()

// const callAll =
//   (...fns) =>
//   (...args) =>
//     fns.forEach(fn => fn && fn(...args))

const VALID_EVENTS = ['click', 'hover']
const VALID_SCOPES = ['outComponent', 'inComponent']

function useTooltip() {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error('useTooltip must be used within a TooltipProvider')
  }
  return context
}
export function Tooltip({
  event = VALID_EVENTS[0],
  scope = VALID_SCOPES[0],
  ...props
}) {
  if (!VALID_EVENTS.includes(event)) {
    throw new Error('event must be click or hover')
  }
  if (!VALID_SCOPES.includes(scope)) {
    throw new Error('scope must be outComponent or inComponent')
  }

  const [open, setOpen] = React.useState(false)
  return (
    <TooltipContext.Provider value={{open, setOpen, event, scope}} {...props} />
  )
}

export function TooltipHandler({
  children,
  onOpen = () => {},
  onClose = () => {},
}) {
  const {open, setOpen, event, scope} = useTooltip()

  const handleOpen = React.useCallback(() => {
    if (!open) {
      setOpen(true)
      onOpen()
    }
  }, [onOpen, open, setOpen])

  const handleClose = React.useCallback(() => {
    if (open) {
      setOpen(false)
      onClose()
    }
  }, [onClose, open, setOpen])

  return React.Children.map(children, child =>
    React.cloneElement(child, {
      handleOpen,
      handleClose,
    }),
  )
}

export function TooltipVisible({children: child, handleOpen}) {
  const {open, scope, event} = useTooltip()
  let opts = {}
  if (event === VALID_EVENTS[1]) {
    opts = {
      onMouseEnter: e => {
        e.stopPropagation()
        handleOpen()
      },
    }
  } else {
    opts = {
      onClick: e => {
        e.stopPropagation()
        handleOpen()
      },
    }
  }

  return React.cloneElement(child, opts)
}

export function TooltipHidden({children: child, handleClose}) {
  const {open, scope, event} = useTooltip()

  let opts = {}
  if (event === VALID_EVENTS[1]) {
    opts = {
      onMouseLeave: e => {
        e.stopPropagation()
        handleClose()
      },
    }
  } else {
    opts = {
      onClick: e => {
        e.stopPropagation()
        handleClose()
      },
    }
  }

  React.useEffect(() => {
    if (scope === VALID_SCOPES[0]) {
      document.addEventListener('click', handleClose)
    }
    return () => document.removeEventListener('click', handleClose)
  }, [handleClose, scope])

  return open ? React.cloneElement(child, opts) : null
}
