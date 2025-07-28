import { Signup } from './signup'

export async function POST(request) {
  return await Signup(request)
}
