import React, { MouseEventHandler } from 'react'

import FormFactory from '../../components/FormFactory'
import { TranslateFunctionType } from '../../types/TranslationTypes'
import SimpleInput from './SimpleInput'

const FORM_COMPONENTS = {
  text: SimpleInput, // component for text input
}

const CONTACT_FORM_CONFIG = [
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
  },
]

type BasicFormProps = {
  t: TranslateFunctionType
}

const BasicForm = ({ t }: BasicFormProps) => {
  const submitButtonComponentCreator = (handleSubmit: MouseEventHandler<HTMLButtonElement>) => (
    <button onClick={handleSubmit}>{t('button.submit')}</button>
  )

  return (
    <FormFactory
      formComponents={FORM_COMPONENTS}
      formConfig={CONTACT_FORM_CONFIG}
      onSubmit={console.log}
      standalone
      t={t}
      submitButtonComponentCreator={submitButtonComponentCreator}
      placeholderPrefix="contactForm.placeholder."
      labelPrefix="contactForm.label."
    />
  )
}

export default BasicForm
