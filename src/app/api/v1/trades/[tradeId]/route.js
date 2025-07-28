import { getTrade } from './getTrade'

export async function GET(request) {
  return getTrade(request)
}
