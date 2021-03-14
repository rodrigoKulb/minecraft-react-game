import * as React from 'react'
import { ReactElement, MutableRefObject } from 'react'

export type RefProp<T> = MutableRefObject<T | null | undefined>

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34237
export type ElementType<P = any> =
  | React.ElementType<P>
  | LeafFunctionComponent<P>

// Function component without children
type LeafFunctionComponent<P> = {
  (props: P): ReactElement | null
  displayName?: string
}

export type ComponentPropsWithRef<
  T extends ElementType
> = T extends React.ComponentClass<infer P>
  ? React.PropsWithoutRef<P> & React.RefAttributes<InstanceType<T>>
  : React.PropsWithRef<React.ComponentProps<T>>

// In @types/react, a "children" prop is required by the "FunctionComponent" type.
export type ComponentType<P = {}> =
  | React.ComponentClass<P>
  | LeafFunctionComponent<P>
