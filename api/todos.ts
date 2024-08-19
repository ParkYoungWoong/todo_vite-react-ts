import axios from 'axios'
import type { VercelRequest, VercelResponse } from '@vercel/node'

interface RequestBody {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: '' | 'deletions' | 'reorder'
  data: { [key: string]: unknown }
}
export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    endpoint = '',
    method = 'GET',
    data
  } = (req.body || {}) as Partial<RequestBody>
  const { data: responseValue } = await axios({
    url: `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${endpoint}`,
    method,
    headers: {
      'content-type': 'application/json',
      apikey: process.env.TODO_APIKEY,
      username: process.env.TODO_USERNAME
    },
    data
  })
  res.status(200).json(responseValue)
}
