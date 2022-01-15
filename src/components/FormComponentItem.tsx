import React, { memo } from 'react'

// types
import {
  ActionOnBlur,
  ActionOnChange,
  CustomFormComponentType,
  DefaultFieldActionProps,
  FieldConfigBasicType,
  FormDataType,
} from '../types/FormTypes'
import { FetchResourceType } from '../utilities/selects'
import { TranslateFunctionType } from '../types/TranslationTypes'

export interface FormComponentItemProps extends DefaultFieldActionProps<any> {
  data: FormDataType
  editable?: boolean
  fetchResources?: FetchResourceType
  fieldConfig: FieldConfigBasicType<string>
  formComponents: CustomFormComponentType
  labelPrefix: string
  onBlur?: ActionOnBlur<any>
  onChange?: ActionOnChange<any>
  placeholderPrefix?: string
  resourceVersion?: number
  t: TranslateFunctionType
  touched?: boolean
}

const FormComponentItem = (props: FormComponentItemProps) => {
  const {
    data,
    editable,
    fetchResources,
    fieldConfig,
    formComponents,
    labelPrefix,
    onBlur,
    onChange,
    placeholderPrefix,
    t,
    touched,
  } = props
  const fieldKey = fieldConfig.column

  if (!fieldConfig) {
    return <span key={fieldKey}>Field config not defined for {fieldKey}</span>
  }

  let Component = null
  if (formComponents && formComponents[fieldConfig.type]) {
    Component = formComponents[fieldConfig.type]
  }
  if (!Component) {
    return (
      <span key={fieldKey}>
        Component not defined for {fieldKey} - {fieldConfig.type}
      </span>
    )
  }

  let value = data[fieldConfig.column]
  if (typeof value === 'undefined') {
    value = ''
  }
  return (
    <Component
      key={fieldKey}
      data={fieldConfig.sendFullData ? data : undefined}
      editable={editable}
      fetchResources={fetchResources}
      formFieldConfig={fieldConfig}
      label={t(`${labelPrefix}${fieldConfig.name}`)}
      onBlur={onBlur}
      onChange={onChange}
      placeholder={fieldConfig.showPlaceholder ? t(`${placeholderPrefix || 'placeholder.'}${fieldConfig.name}`) : ''}
      t={t}
      touched={touched}
      value={value}
    />
  )
}

export default memo(FormComponentItem)
