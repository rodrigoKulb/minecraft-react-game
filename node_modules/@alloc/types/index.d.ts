export * from './react'

/** @deprecated For solving generic types */
export type Solve<T> = T

/** Try to simplify `&` out of an object type */
export type Remap<T> = {} & {
  [P in keyof T]: T[P]
}

export type Pick<T, K extends keyof T> = {} & {
  [P in K]: T[P]
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Partial<T> = {} & {
  [P in keyof T]?: T[P] | undefined
}

export type Overwrite<T, U> = Remap<Omit<T, keyof U> & U>

export type MergeUnknown<T, U> = Remap<T & Omit<U, keyof T>>

export type MergeDefaults<T extends object, U extends Partial<T>> = Remap<
  Omit<T, keyof U> & Partial<Pick<T, Extract<keyof U, keyof T>>>
>

export type OneOrMore<T> = T | readonly T[]

export type Falsy = false | null | undefined

// https://github.com/microsoft/TypeScript/issues/14829#issuecomment-504042546
export type NoInfer<T> = [T][T extends any ? 0 : never]

export type StaticProps<T> = Omit<T, keyof T & 'prototype'>

export interface Lookup<T = any> {
  [key: string]: T
}

/** Intersected with other object types to allow for unknown properties */
export interface UnknownProps extends Lookup<unknown> {}

/** Use `[T] extends [Any]` to know if a type parameter is `any` */
export class Any {
  private _: never
}

export type AnyFn<In extends ReadonlyArray<any> = any[], Out = any> = (
  ...args: In
) => Out

/** Ensure the given type is an object type */
export type ObjectType<T> = T extends object ? T : {}

/** Intersect a union of objects but merge property types with _unions_ */
export type ObjectFromUnion<T extends object> = Remap<
  {
    [P in keyof Intersect<T>]: T extends infer U
      ? P extends keyof U
        ? U[P]
        : never
      : never
  }
>

/** Convert a union to an intersection */
type Intersect<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never

export type Exclusive<T> = keyof T extends infer Keys
  ? Keys extends infer Key
    ? Remap<
        { [P in Extract<keyof T, Key>]: T[P] } &
          { [P in Exclude<keyof T, Key>]?: undefined }
      >
    : never
  : never

/** An object that needs to be manually disposed of */
export interface Disposable {
  dispose(): void
}
