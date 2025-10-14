import { Entity } from '../../core/entity'
import { Filter, Query } from '../../core/repository'
import { InMemoryRepository } from '../in.memory.repository'

type User = Entity & {
  name: string
  age: number
  score: number
  tags: string[]
}

describe('InMemoryRepository', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-01-01T12:00:00.000Z'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should create a new entity without id and assign id/created_at/updated_at', () => {
    const repo = InMemoryRepository<User>({})
    const saved: any = repo.set({
      id: '' as any,
      name: 'Ana',
      age: 28,
      score: 10,
      tags: [],
    } as any)

    expect(saved.id).toBe('0')
    expect(saved.created_at).toEqual(new Date('2025-01-01T12:00:00.000Z'))
    expect(saved.updated_at).toEqual(new Date('2025-01-01T12:00:00.000Z'))

    const fetched = repo.get(saved.id)
    expect(fetched).toEqual(saved)
  })

  it('should use a custom idProvider when provided', () => {
    let i = 100
    const idProvider = () => `u-${i++}`
    const repo = InMemoryRepository<User>({ idProvider })

    const a: any = repo.set({
      id: '' as any,
      name: 'A',
      age: 20,
      score: 1,
      tags: [],
    } as any)
    const b: any = repo.set({
      id: '' as any,
      name: 'B',
      age: 21,
      score: 2,
      tags: [],
    } as any)

    expect(a.id).toBe('u-100')
    expect(b.id).toBe('u-101')
  })

  it('should update an existing entity (same id) and refresh updated_at without duplicating', () => {
    const repo = InMemoryRepository<User>()
    const created: any = repo.set({
      name: 'Ana',
      age: 28,
      score: 10,
      tags: [],
    } as any)

    jest.setSystemTime(new Date('2025-01-02T08:00:00.000Z'))
    const updated: any = repo.set({ ...created, name: 'Ana Maria', score: 15 })

    expect(updated.id).toBe(created.id)

    expect(updated.created_at).toEqual(created.created_at)
    expect(updated.updated_at).toEqual(new Date('2025-01-02T08:00:00.000Z'))

    const all: any = repo.query(Query())
    expect(all.length).toBe(1)
    expect(all[0].name).toBe('Ana Maria')
  })

  it('should remove an entity by id', () => {
    const repo = InMemoryRepository<User>({})
    const a: any = repo.set({
      id: '' as any,
      name: 'A',
      age: 20,
      score: 1,
      tags: [],
    } as any)
    const b: any = repo.set({
      id: '' as any,
      name: 'B',
      age: 21,
      score: 2,
      tags: [],
    } as any)

    repo.remove({ id: a.id })
    expect(repo.get(a.id)).toBeUndefined()
    expect(repo.get(b.id)).toBeDefined()
  })

  it('should support limit and cursor for pagination', () => {
    const repo = InMemoryRepository<User>({})
    for (let i = 0; i < 7; i++) {
      repo.set({
        id: '' as any,
        name: `U${i}`,
        age: 20 + i,
        score: i,
        tags: [],
      } as any)
    }

    const page1: any = repo.query(Query.limit(3))
    const page2: any = repo.query(Query.cursor('1', Query.limit(3)))
    const page3: any = repo.query(Query.cursor('2', Query.limit(3)))

    expect(page1.map(u => u.name)).toEqual(['U0', 'U1', 'U2'])
    expect(page2.map(u => u.name)).toEqual(['U3', 'U4', 'U5'])
    expect(page3.map(u => u.name)).toEqual(['U6'])
  })

  it('should sort by single and multiple fields', () => {
    const repo = InMemoryRepository<User>({})
    repo.set({ id: '' as any, name: 'C', age: 30, score: 10, tags: [] } as any)
    repo.set({ id: '' as any, name: 'A', age: 20, score: 30, tags: [] } as any)
    repo.set({ id: '' as any, name: 'B', age: 30, score: 20, tags: [] } as any)

    const s1: any = repo.query({
      sorts: [{ property: 'name', direction: 'asc' }],
    } as any)
    expect(s1.map(v => v.name)).toEqual(['A', 'B', 'C'])

    const s2: any = repo.query({
      sorts: [
        { property: 'age', direction: 'asc' },
        { property: 'score', direction: 'desc' },
      ],
    } as any)

    expect(s2.map(v => `${v.age}:${v.score}`)).toEqual([
      '20:30',
      '30:20',
      '30:10',
    ])
  })

  describe('where filters (leaf operators)', () => {
    let repo = InMemoryRepository<User>({})

    beforeEach(() => {
      repo = InMemoryRepository<User>({})
      repo.set({
        id: '' as any,
        name: 'Ana',
        age: 28,
        score: 50,
        tags: ['a', 'b'],
      } as any)
      repo.set({
        id: '' as any,
        name: 'Bruno',
        age: 31,
        score: 40,
        tags: ['b', 'c'],
      } as any)
      repo.set({
        id: '' as any,
        name: 'Carla',
        age: 22,
        score: 60,
        tags: ['c'],
      } as any)
    })

    it('should filter with == and !=', () => {
      const eq: any = repo.query(Query.where('name', '==', 'Ana'))
      const ne: any = repo.query(Query.where('name', '!=', 'Ana'))

      expect(eq.map(v => v.name)).toEqual(['Ana'])
      expect(ne.map(v => v.name).sort()).toEqual(['Bruno', 'Carla'])
    })

    it('should filter with >, >=, <, <=', () => {
      const gt: any = repo.query(Query.where('age', '>', 28))
      const gte: any = repo.query(Query.where('age', '>=', 28))
      const lt: any = repo.query(Query.where('age', '<', 28))
      const lte: any = repo.query(Query.where('age', '<=', 28))

      expect(gt.map(v => v.name).sort()).toEqual(['Bruno'])
      expect(gte.map(v => v.name).sort()).toEqual(['Ana', 'Bruno'])
      expect(lt.map(v => v.name).sort()).toEqual(['Carla'])
      expect(lte.map(v => v.name).sort()).toEqual(['Ana', 'Carla'])
    })

    it('should filter with in and not-in', () => {
      const _in: any = repo.query(Query.where('name', 'in', ['Ana', 'X']))
      const nin: any = repo.query(Query.where('name', 'not-in', ['Ana', 'X']))

      expect(_in.map(v => v.name).sort()).toEqual(['Ana'])
      expect(nin.map(v => v.name).sort()).toEqual(['Bruno', 'Carla'])
    })

    it('should filter with between', () => {
      const between: any = repo.query(
        Query.where('score', 'between', { start: 45, end: 55 }),
      )
      expect(between.map(v => v.name)).toEqual(['Ana'])
    })

    it('should filter with array-contains and array-contains-any', () => {
      const contains: any = repo.query(
        Query.where('tags', 'array-contains', 'a'),
      )
      const any: any = repo.query(
        Query.where('tags', 'array-contains-any', ['a', 'z']),
      )

      expect(contains.map(v => v.name)).toEqual(['Ana'])
      expect(any.map(v => v.name)).toEqual(['Ana'])
    })
  })

  describe('composite where (and/or)', () => {
    let repo = InMemoryRepository<User>({})

    beforeEach(() => {
      repo = InMemoryRepository<User>({})
      repo.set({
        id: '' as any,
        name: 'Ana',
        age: 28,
        score: 50,
        tags: ['a', 'b'],
      } as any)
      repo.set({
        id: '' as any,
        name: 'Bruno',
        age: 31,
        score: 40,
        tags: ['b', 'c'],
      } as any)
      repo.set({
        id: '' as any,
        name: 'Carla',
        age: 22,
        score: 60,
        tags: ['c'],
      } as any)
    })

    it('should filter with AND composition', () => {
      const where = Filter.and<User>(
        Filter.where('age', '>=', 25),
        Filter.where('score', '>=', 50),
      )
      const res: any = repo.query(Query(where))
      expect(res.map(v => v.name)).toEqual(['Ana'])
    })

    it('should filter with OR composition', () => {
      const where = Filter.or<User>(
        Filter.where('age', '<', 23),
        Filter.where('name', '==', 'Bruno'),
      )
      const res: any = repo.query(Query(where))
      expect(res.map(v => v.name).sort()).toEqual(['Bruno', 'Carla'])
    })
  })

  it('should keep created_at stable across updates when caller preserves it', () => {
    const repo = InMemoryRepository<User>({})
    const first: any = repo.set({
      id: '' as any,
      name: 'Zoe',
      age: 18,
      score: 5,
      tags: [],
    } as any)

    jest.setSystemTime(new Date('2025-01-03T09:00:00.000Z'))
    const second: any = repo.set({ ...first, score: 7 } as any)

    expect(second.created_at).toEqual(first.created_at)
    expect(second.updated_at).toEqual(new Date('2025-01-03T09:00:00.000Z'))
  })

  it('should return empty array when no matches', () => {
    const repo = InMemoryRepository<User>({})
    repo.set({ id: '' as any, name: 'Only', age: 1, score: 1, tags: [] } as any)

    const res = repo.query(Query(Filter.where<User>('name', '==', 'None')))
    expect(res).toEqual([])
  })
})
