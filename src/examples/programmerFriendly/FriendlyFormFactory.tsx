import React, { FormEvent, ReactElement } from 'react'

import {
  DefaultFieldActionProps,
  FieldConfigBasicType,
  FieldConfigValidation,
  FormDataType,
} from '../../types/FormTypes'
// import { validate } from '../../utilities/validation'
import { FormComponentProps, useFormComponentHooks } from '../../components/FormFactory'
import { FetchResourceType } from '../../utilities/selects'
import { TranslateFunctionType } from '../../types/TranslationTypes'

export type ChildPropsT = {
  name: string
  column: string
  sendFullData?: boolean
  editable?: boolean
  showPlaceholder?: boolean
  startOfRow?: boolean
  validation?: FieldConfigValidation
}

export type ChildPropsFromFormT = {
  data: Object
  fetchResources: FetchResourceType
  formFieldConfig: FieldConfigBasicType<any>
  label: string
  onBlur: DefaultFieldActionProps<any>['onBlur']
  onChange: DefaultFieldActionProps<any>['onChange']
  placeholder: string
  t: TranslateFunctionType
  touched: boolean
  value: any
}

const FriendlyFormFactory = (props: FormComponentProps<never> & { children: ReactElement | ReactElement[] }) => {
  const [standalone, data, , touched, , handleOnBlur, handleOnChange] = useFormComponentHooks(props)

  const handleSubmit = (event: FormEvent<HTMLFormElement> | React.MouseEvent<any | HTMLSpanElement>) => {
    const { onSubmit } = props
    if (event && 'preventDefault' in event) {
      event.preventDefault()
    }
    const dataToValidate = (standalone ? data : props.data) as FormDataType
    // const [isValid] = validate<any>([], dataToValidate, customValidationRules) // todo
    // if (isValid) {
    //   setTouched(false)
    //   setData(props.defaultData ? props.defaultData : {})
    onSubmit(dataToValidate)
    // } else {
    //   setTouched(true)
    // }
  }

  const { columnCreator, fetchResources, labelPrefix, rowCreator, submitButtonComponentCreator, t, placeholderPrefix } =
    props

  return (
    <form className="w-100" onSubmit={handleSubmit}>
      {React.Children.map(props.children, (child: ReactElement<ChildPropsT & ChildPropsFromFormT>) => {
        console.log(React.isValidElement(child))
        if (!React.isValidElement(child)) {
          return null
        }

        let formComponent = React.cloneElement(child, {
          name: child.props.name,
          key: child.props.name,
          data: child.props.sendFullData ? (!standalone && props.data ? props.data : data) : undefined,
          editable: typeof child.props.editable === 'boolean' ? child.props.editable : true,
          fetchResources,
          label: t(`${labelPrefix}${child.props.name}`),
          onBlur: handleOnBlur,
          onChange: handleOnChange,
          placeholder: child.props.showPlaceholder
            ? t(`${placeholderPrefix || 'placeholder.'}${child.props.name}`)
            : '',
          t,
          touched,
          value: data[child.props.column],
        })
        if (typeof columnCreator === 'function') {
          formComponent = columnCreator(child.props.name, formComponent)
        }
        if (child.props.startOfRow && typeof rowCreator === 'function') {
          formComponent = rowCreator(child.props.name, formComponent)
        }
        return formComponent
      })}
      {typeof submitButtonComponentCreator === 'function' && submitButtonComponentCreator(handleSubmit)}
    </form>
  )
}

export default FriendlyFormFactory
