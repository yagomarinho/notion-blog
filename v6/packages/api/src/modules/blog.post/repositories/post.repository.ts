import { MongoClient, ObjectId } from 'mongodb'

import config from '../../../config'

import {
  MongoDBRepository,
  ProjectFields,
} from '../../../shared/repositories/mongodb.repository'
import { Converter } from '../../../shared/types'
import { Post } from '../entities/post'

const converter: Converter<Post> = {
  to: ({ id, ...props }: any) => ({
    ...props,
    _id: id ? ObjectId.createFromHexString(id) : new ObjectId(),
  }),
  from: ({ _id, ...raw }: any) => ({ ...raw, id: _id?.toString() ?? '' }),
}

export interface Config {
  client?: MongoClient
  projection?: ProjectFields<Post>
}

export const PostRepository = ({ projection, client }: Config = {}) =>
  MongoDBRepository<Post>({
    ...config.databases.post,
    client: client as any,
    converter,
    projection,
  })
