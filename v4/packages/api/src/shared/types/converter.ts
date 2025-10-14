export interface Converter<V> {
  to: (value: V) => any
  from: (page: any) => V
}

export type ReadonlyConverter<C extends Converter<any>> = {
  from: C['from']
}

export type WriteonlyConverter<C extends Converter<any>> = {
  to: C['to']
}
