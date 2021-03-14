# @alloc/types

Common types for TypeScript

### Basic

- `Solve<T>` for solving generic types

- `Remap<T>` to simplify `&` out of an object type

- `Pick<T, K>` the same as built-in `Pick` but wrapped with `Solve`

- `Overwrite<T, U>` for merging two object types (where `U` takes precedence)

- `MergeUnknown<T, U>` for merging two object types (where `T` takes precedence)

- `MergeDefaults<T, U>` for making `T` properties optional if they exist in `U`

### React

- `ElementType<P>` as a workaround for [#34237](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34237)

- `ComponentPropsWithRef<T>` which uses `ElementType`
