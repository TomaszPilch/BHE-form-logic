import React, { ChangeEvent } from 'react'

import { DefaultFieldProps, FieldConfigBasicType } from '../../types/FormTypes'
import { useFieldValidation } from '../../utilities/validation'
import { getErrorText } from '../../utilities/utilities'

export type SimpleInputFormFieldConfig = FieldConfigBasicType<'text'>
export interface SimpleInputProps extends DefaultFieldProps<undefined | string> {
  formFieldConfig: SimpleInputFormFieldConfig
}

const SimpleInput = ({ formFieldConfig, value, onChange, editable, label, t, ...otherProps }: SimpleInputProps) => {
  // use validation hook, when value is changed, validate it
  const [isValid, errors, , touched, setTouched] = useFieldValidation(formFieldConfig, value, otherProps.touched)

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (typeof onChange !== 'undefined') {
      onChange(formFieldConfig.column, newValue)
      setTouched(true) // set touched, to show error (if there are any)
    }
  }

  if (!editable) {
    return (
      <div>
        <span>{label}</span>
        <span>{value}</span>
      </div>
    )
  }

  const errorText = isValid ? '' : getErrorText(errors, t)
  return (
    <>
      <input value={value} onChange={handleOnChange} />
      {!isValid && touched && (
        <p className="error-message">
          <span>{errorText}</span>
        </p>
      )}
    </>
  )
}

export default SimpleInput
