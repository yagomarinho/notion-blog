import { App } from './app'

const PORT = process.env.PORT || 3333
const app = App()

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server Start Running at Port: ${PORT}`))
