export type Perfil = 'usuario' | 'admin'

export interface Usuario {
  id: string
  nome: string
  email: string
  perfil: Perfil
}

export interface Credenciais {
  email: string
  senha: string
}

/** Resposta do login: o usuário e o perfil vêm dentro das claims do JWT. */
export interface LoginResponse {
  token: string
}
