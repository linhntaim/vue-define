import dotenvConversion from 'dotenv-conversion'

export function getenv(name = null, def = null) {
    return dotenvConversion.getenv(name, def)
}