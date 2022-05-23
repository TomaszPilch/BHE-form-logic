import React, { JSXElementConstructor } from 'react'

import { ChildPropsT } from './FriendlyFormFactory'

const FriendlyFormInput = ({ component, ...rest }: ChildPropsT & { component: JSXElementConstructor<any> }) => {
  const Component = component
  return (
    <Component
      formFieldConfig={{
        type: 'any',
        name: rest.name,
        column: rest.column,
        validation: rest.validation,
      }}
      {...rest}
    />
  )
}

export default FriendlyFormInput
