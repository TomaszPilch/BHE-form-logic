# BHE form logic

Use for rendering forms, just pass your input components. Form contains validation and custom row/column render.

```
yarn add @bheui/form-logic
```

## Basic usage

```typescript jsx
import FormFactory from '@bheui/form-logic/lib/components/FormFactory'

const CONTACT_FORM_CONFIG: FormConfig = [
  {
    type: 'text',
    name: 'name',
    column: 'name',
    showPlaceholder: true,
    validation: { isRequired: true },
  },
  {
    type: 'text',
    name: 'title',
    column: 'title',
    showPlaceholder: true,
    validation: { isRequired: true },
  }
]

const FORM_COMPONENTS = {
  text: Input, // component for text input
}

const Form = ({ t }) => {
  const submitButtonComponentCreator = (handleSubmit) => (
    <Button variant="primary" onClick={handleSubmit}>
      {t('button.submit')}
    </Button>
  )
  
  return (
    <FormFactory
      formComponents={FORM_COMPONENTS}
      formConfig={CONTACT_FORM_CONFIG}
      onSubmit={console.log}
      standalone
      t={t}
      submitButtonComponentCreator={submitButtonComponentCreator}
      defaultData={{}}
      placeholderPrefix="contactForm.placeholder."
      labelPrefix="contactForm.label."
    />
  )
}

export default Form
```

### You can specify row and column creators (simple grid)

```typescript jsx

// wraps every item
const columnCreator = (_name: string, component) => (
  <div className="flex-row">
    <div className="form">{component}</div>
  </div>
)

const Form = ({ t }) => {
  const submitButtonComponentCreator = (handleSubmit) => (
    <Button variant="primary" onClick={handleSubmit}>
      {t('button.submit')}
    </Button>
  )
  
  return (
    <FormFactory
      formComponents={FORM_COMPONENTS}
      formConfig={CONTACT_FORM_CONFIG}
      onSubmit={console.log}
      standalone
      t={t}
      submitButtonComponentCreator={submitButtonComponentCreator}
      columnCreator={columnCreator}
      // rowCreator={...} - it triggers on config.startOfRow
      defaultData={{}}
      placeholderPrefix="contactForm.placeholder."
      labelPrefix="contactForm.label."
    />
  )
}
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
