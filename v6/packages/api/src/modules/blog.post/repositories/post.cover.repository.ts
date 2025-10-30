import { MongoClient } from 'mongodb'
import {
  MongoDBRepository,
  ProjectFields,
} from '../../../shared/repositories/mongodb.repository'
import { Post } from '../entities/post'
import { PostRepository } from './post.repository'

export interface PostCover extends Omit<Post, 'external_ref' | 'content'> {}

const projection: ProjectFields<Post> = {
  content: 0,
  external_ref: 0,
}

export interface Config {
  client?: MongoClient
}

export const PostCoverRepository = ({
  client,
}: Config = {}): MongoDBRepository<PostCover> =>
  PostRepository({ projection, client }) as any
