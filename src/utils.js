import dotenvConversion from 'dotenv-conversion'

export function getenv(name) {
    return dotenvConversion.getenv(name)
}