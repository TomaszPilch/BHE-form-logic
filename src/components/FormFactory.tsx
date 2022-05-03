import React, { useState, useEffect, useCallback, Dispatch, SetStateAction, FormEvent, ReactElement } from 'react'
import { assoc } from 'ramda'

// components
import FormComponentItem from './FormComponentItem'

// utils
import { validate } from '../utilities/validation'

// types
import {
  DefaultFieldActionProps,
  CustomFormComponentType,
  FormDataType,
  ActionOnBlur,
  ActionOnChange,
  FormConfig,
  CustomValidationRules,
} from '../types/FormTypes'
import { FetchResourceType } from '../utilities/selects'
import { TranslateFunctionType } from '../types/TranslationTypes'

interface PropTypes<CustomFormConfig extends FormConfig> extends DefaultFieldActionProps<any> {
  defaultData?: FormDataType
  editable: boolean
  fetchResources: FetchResourceType
  formComponents: CustomFormComponentType
  formConfig: CustomFormConfig
  labelPrefix: string
  onSubmit: (data: Object) => void
  t: TranslateFunctionType
  touched?: boolean
  customValidationRules?: CustomValidationRules
  rowCreator?: (key: string, children: JSX.Element) => JSX.Element
  columnCreator?: (key: string, children: JSX.Element) => JSX.Element
  submitButtonComponentCreator?: (
    submitFn: (event: FormEvent<HTMLFormElement> | React.MouseEvent<any | HTMLSpanElement>) => void,
  ) => ReactElement
  standalone?: boolean
  data?: FormDataType
  placeholderPrefix?: string
}

export type FormComponentProps<CustomFormConfig extends FormConfig> = PropTypes<CustomFormConfig>

export const formComponentDefaultProps = {
  editable: true,
  fetchResources: () => [],
  labelPrefix: '',
  onBlur: () => {},
  onChange: () => {},
  onSubmit: () => {},
}

function useFormComponentHooksFunction<CustomFormConfig extends FormConfig>(
  props: FormComponentProps<CustomFormConfig>,
): [
  boolean,
  FormDataType,
  Dispatch<SetStateAction<FormDataType>>,
  boolean,
  Dispatch<SetStateAction<boolean>>,
  ActionOnBlur<any>,
  ActionOnChange<any>,
] {
  const [standalone] = useState<boolean>(!props.data)
  const [data, setData] = useState<FormDataType>(props.defaultData ? props.defaultData : {})
  const [touched, setTouched] = useState<boolean>(false)

  useEffect(() => {
    if (props.defaultData) {
      setData(props.defaultData)
    }
  }, [props.defaultData])

  useEffect(() => {
    if (typeof props.touched === 'boolean') {
      setTouched(props.touched)
    }
  }, [props.touched])

  const handleOnBlur = useCallback(
    (name: string, value: string) => {
      if (standalone) {
        setData((prevData: FormDataType) => assoc(name, value, prevData))
      }
      if (typeof props.onBlur === 'function') {
        props.onBlur(name, value)
      }
    },
    [props.onBlur],
  )

  const handleOnChange = useCallback(
    (name: string, value: string) => {
      if (standalone) {
        setData((prevData: FormDataType) => assoc(name, value, prevData))
      }
      if (typeof props.onChange === 'function') {
        props.onChange(name, value)
      }
    },
    [props.onChange],
  )

  return [standalone, data, setData, touched, setTouched, handleOnBlur, handleOnChange]
}

export const useFormComponentHooks = useFormComponentHooksFunction

function FormFactory<CustomFormConfig extends FormConfig>(props: FormComponentProps<CustomFormConfig>) {
  const [standalone, data, setData, touched, setTouched, handleOnBlur, handleOnChange] = useFormComponentHooks(props)

  const handleSubmit = (event: FormEvent<HTMLFormElement> | React.MouseEvent<any | HTMLSpanElement>) => {
    const { customValidationRules, formConfig, onSubmit } = props
    if (event && 'preventDefault' in event) {
      event.preventDefault()
    }
    const dataToValidate = (standalone ? data : props.data) as FormDataType
    const [isValid] = validate<any>(formConfig, dataToValidate, customValidationRules)
    if (isValid) {
      setTouched(false)
      setData(props.defaultData ? props.defaultData : {})
      onSubmit(dataToValidate)
    } else {
      setTouched(true)
    }
  }

  const {
    columnCreator,
    editable,
    fetchResources,
    formComponents,
    formConfig,
    labelPrefix,
    rowCreator,
    submitButtonComponentCreator,
    t,
    placeholderPrefix,
  } = props

  return (
    <form className="w-100" onSubmit={handleSubmit}>
      {formConfig.map((fieldConfig: any) => {
        if (fieldConfig.visible === false) {
          return null
        }
        let formComponent = (
          <FormComponentItem
            key={fieldConfig.name}
            data={!standalone && props.data ? props.data : data}
            editable={editable}
            fetchResources={fetchResources}
            fieldConfig={fieldConfig}
            formComponents={formComponents}
            labelPrefix={labelPrefix}
            onBlur={handleOnBlur}
            onChange={handleOnChange}
            placeholderPrefix={placeholderPrefix}
            t={t}
            touched={touched}
          />
        )
        if (typeof columnCreator === 'function') {
          formComponent = columnCreator(fieldConfig.name, formComponent)
        }
        if (fieldConfig.startOfRow && typeof rowCreator === 'function') {
          formComponent = rowCreator(fieldConfig.name, formComponent)
        }
        return formComponent
      })}
      {typeof submitButtonComponentCreator === 'function' && submitButtonComponentCreator(handleSubmit)}
    </form>
  )
}

FormFactory.defaultProps = formComponentDefaultProps
export default FormFactory
