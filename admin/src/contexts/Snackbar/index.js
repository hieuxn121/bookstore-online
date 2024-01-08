import * as React from 'react'
import {
  Snackbar,
  Alert
} from '@mui/material'

const SnackbarContext = React.createContext({})

const MuiAlert = React.forwardRef(function MuiAlert(props, ref) {
  return <Alert elevation={3} ref={ref} variant='filled' {...props} />
})

const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  const [severity, setSeverity] = React.useState('info')
  const [msg, setMsg] = React.useState('')
  const openSnackbar = (severity, msg) => {
    setSeverity(severity)
    setMsg(msg)
    setOpen(true)
  }
  const handleClose = (e, r) => {
    if (r === 'clickaway') return
    setOpen(false)
  }
  return (
    <SnackbarContext.Provider value={{ openSnackbar }} >
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} >
        <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%' }} >{msg}</MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

const useSnackbar = () => React.useContext(SnackbarContext)

export {
  SnackbarProvider,
  useSnackbar
}
