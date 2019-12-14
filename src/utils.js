import dotenvConversion from 'dotenv-conversion'

export function getenv(name = null) {
    return dotenvConversion.getenv(name)
}