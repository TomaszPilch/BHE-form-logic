import { ComponentType } from 'react'

import { TranslateFunctionType } from './TranslationTypes'
import { FetchResourceType } from '../utilities/selects'
import { RangeType, ValidationError } from '../utilities/validationRules'

export type FieldConfigValidation = {
  isRequired?: boolean
  isEmail?: boolean
  canBeEmpty?: boolean
  regExp?: boolean
  minLength?: number
  maxLength?: number
  isPhone?: boolean
  isNumber?: boolean
  inRange?: RangeType
  isInteger?: boolean
  [key: string]: boolean | number | RangeType | any
}

export type CustomValidationRule = (value: any, configRuleValue: any) => true | ValidationError

export type CustomValidationRules = { [key: string]: CustomValidationRule }

export interface FieldConfigBasicType<Type extends string, InputProps = Object> {
  column: string
  inputProps?: InputProps
  name: string
  sendFullData?: boolean
  showPlaceholder?: boolean
  translated?: boolean
  type: Type
  validation?: FieldConfigValidation
  visible?: boolean
  startOfRow?: boolean
}

export type FormConfig = FieldConfigBasicType<string>[]

export type ActionOnBlur<ValueType> = (name: string, value: ValueType) => void

export type ActionOnChange<ValueType> = (name: string, value: ValueType) => void

export interface DefaultFieldActionProps<ValueType> {
  onChange?: ActionOnChange<ValueType>
  onBlur?: ActionOnBlur<ValueType>
}

export type FormDataType = { [key: string]: any }

export type DefaultFieldProps<ValueType = any> = {
  data?: FormDataType
  editable?: boolean
  fetchResources?: FetchResourceType
  formFieldConfig: FieldConfigBasicType<string>
  label: string
  onBlur?: ActionOnBlur<ValueType>
  onChange?: ActionOnChange<ValueType>
  placeholder: string
  t: TranslateFunctionType
  touched?: boolean
  value: ValueType
}

export type CustomFormComponentType<CustomProps extends DefaultFieldProps = any> = {
  [key: string]: ComponentType<CustomProps>
}
