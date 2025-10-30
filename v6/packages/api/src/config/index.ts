export default {
  databases: {
    post: {
      uri: process.env.MONGODB_POST_CONNECT_URI || 'mongodb://localhost:27017',
      database: process.env.MONGODB_POST_DATABASE || 'db',
      collection: process.env.MONGODB_POST_COLLECTION || 'col',
    },
  },
}
