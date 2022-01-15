# BHE form logic

Use for rendering forms, just pass your input components. Form contains validation and custom row/column render.

```
yarn add @bheui/form-logic
```

## Defining input component

```typescript jsx
import { useFieldValidation } from '../utilities/validation'
import { getErrorText } from '../utilities/utilities'

export type DateFormFieldConfig = FieldConfigBasicType<'date'>
export interface DateProps extends DefaultFieldProps<undefined | string>, DefaultFieldActionProps<string> {
  formFieldConfig: DateFormFieldConfig
}

const Date = (props: DateProps) => {
  // use validation hook, when value is changed, validate it
  const [isValid, errors, setValidationError, touched, setTouched] = useFieldValidation(props.formFieldConfig, props.value, props.touched)

  const handleOnChange = (date: Date | null | undefined) => {
    const dateFormatted = moment(date).format('YYYY-MM-DD')
    props.onChange(props.formFieldConfig.column, dateFormatted)
    props.onBlur(props.formFieldConfig.column, dateFormatted)
    setTouched(true) // set touched, to show error (if there are any)
  }

  const { editable, placeholder, value, label, t } = props
  
  if (!editable) {
    return <div><span>{label}</span><span>{value}</span></div>
  }

  const errorText = isValid ? '' : getErrorText(errors, t)
  return <>
    <DatePicker {...someProps} />
    {!isValid && touched && (
      <p className="error-message">
        <span>{errorText}</span>
      </p>
    )}
  </>
}

export default Date
```

## How to use form

TODO

## Changelog

[Changelog](./changelog.md)

## TODOs

 - [ ] Tests
