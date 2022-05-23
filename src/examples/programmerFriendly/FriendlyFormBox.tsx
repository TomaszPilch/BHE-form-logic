import React from 'react'
import { omit } from 'ramda'

export type FriendlyFormBoxPropsT = {
  className?: string
  children: React.ReactElement | React.ReactElement[]
}

const FriendlyFormBox = (props: FriendlyFormBoxPropsT) => {
  return (
    <div {...(props.className ? { className: props.className } : {})}>
      {React.Children.map(props.children, (child) => React.cloneElement(child, omit(['className', 'children'], props)))}
    </div>
  )
}

export default FriendlyFormBox
