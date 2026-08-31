import React from 'react'
import { useInput } from 'react-admin'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export default function DateTimePickerInput({ source, label, validate, ...rest }) {
  const {
    field,
    fieldState: { error, invalid },
  } = useInput({ source, validate, ...rest })

  const handleChange = (newValue) => {
    field.onChange(newValue ? newValue.toISOString() : null)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={field.value ? new Date(field.value) : null}
        onChange={handleChange}
        ampm={false}
        format="dd/MM/yyyy HH:mm"
        slotProps={{
          textField: {
            fullWidth: true,
            error: invalid,
            helperText: error?.message,
            onClick: (e) => e.currentTarget.querySelector('button')?.click(),
          },
        }}
      />
    </LocalizationProvider>
  )
}