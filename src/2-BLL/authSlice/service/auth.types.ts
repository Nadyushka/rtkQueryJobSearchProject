export type ResponseTypeAuth = {
    "access_token": string,
    "refresh_token": string,
    "ttl": number | null,
    "expires_in": number | null,
    "token_type": string,
}
export type authParams = {
    login: string, password: string, client_id: number, client_secret: string, hr: number
}