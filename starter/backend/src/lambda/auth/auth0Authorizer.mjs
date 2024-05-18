import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-ihi34x4bcw3plrdr.us.auth0.com/.well-known/jwks.json'

async function getPublicKey() {
  const response = await Axios.get(jwksUrl)
  const key = response.data.keys[0].x5c[0] // get public key from JWKS response
  return `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`
}

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  try {
    const publicKey = await getPublicKey()
    const decoded = jsonwebtoken.verify(token, publicKey, { algorithms: ['RS256'] })
    logger.info(`verifyToken - decoded ${decoded}`)
    return decoded
  } catch (error) {
    logger.error('Error verifying token', { error: error.message })
    throw new Error('Token is invalid')
  }
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]
  logger.info(`getToken - authHeader ${authHeader}`)
  logger.info(`getToken - token ${token}`)

  return token
}
