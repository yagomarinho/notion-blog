import { Service } from '../../../shared/core/service'
import {
  Readable,
  ReadonlyMode,
  Repository,
} from '../../../shared/core/repository'
import { Left, Right } from '../../../shared/core/either'
import { Post } from '../entities/post'
import { ExtractedPostProps } from '../repositories/extracted.post.props.repository'
import { ExtractedPostContent } from '../repositories/extracted.post.content.repository'
import { decideIntent } from '../helpers/decide.intent'
import { Batch } from '../../../shared/core/repository/batch'

interface Env {
  posts: Repository<Post>
  props: ReadonlyMode<Repository<ExtractedPostProps>>
  contents: Readable<Repository<ExtractedPostContent>>
}

export const ETLReconciler = Service(
  () =>
    async ({ posts, props, contents }: Env) => {
      /*
       * Tem que buscar as informações do repositório do NotionAPI
       * armazenar num cache chave=external_ref valor=JSON.stringify({props, content})
       *
       * Tem que buscar as informações do repositório de Posts
       * Fazer um  cache de chave=external_ref valor=JSON.stringify(post) para facilitar o encontro
       * armazenar num cache
       */
      const [listProps, listPosts] = await Promise.all([
        props.query(),
        posts.query(),
      ])

      // Fazer uma listagem única de external_ref presente nos dois sistemas (notionAPI e PostRepository)
      const uniqueRefs = [
        ...new Set(
          listProps
            .map(prop => prop.id)
            .concat(listPosts.map(post => post.external_ref)),
        ).values(),
      ]

      // Criar uma lista de intent.kind para cada external_ref único
      const intents = await Promise.all(
        uniqueRefs.map(async external_ref => {
          const post = listPosts.find(p => p.external_ref === external_ref)
          const properties = listProps.find(p => p.id === external_ref)
          const content = properties
            ? await contents.get(external_ref)
            : undefined

          const intent = decideIntent({ properties, content, post })

          return {
            id: external_ref,
            intent,
          }
        }),
      )

      // Mapear a transformação de acordo com cada intent.kind
      const batch = intents
        .filter(intent => intent.intent.kind !== 'none')
        .map(intent => ({
          type: intent.intent.kind,
          data: intent.intent.data,
        })) as Batch<Post>

      if (!batch.length)
        return Left({ message: 'The reconciler is not necessary' })

      // Realizar um batch no repositório de Posts
      const result = await posts.batch(batch)

      if (result.status === 'failed') return Left({ message: 'Batch failed' })

      return Right()
    },
)
