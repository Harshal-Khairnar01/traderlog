import { getTrade } from './[tradeId]/getTrade'

export async function GET(request) {
  return getTrade(request)
}
