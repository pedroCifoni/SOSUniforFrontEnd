import { simulateRequest } from '@/api/client'
import { usuariosMock, type UsuarioMock } from '@/mocks/db'
import type { DadosUsuario, Usuario } from '@/models/usuario'

const semSenha = ({ senha: _senha, ...usuario }: UsuarioMock): Usuario => usuario

const porNome = (a: Usuario, b: Usuario) => a.nome.localeCompare(b.nome, 'pt-BR')

function validarEmailUnico(email: string, ignorarId?: string) {
  if (usuariosMock.some((u) => u.email === email && u.id !== ignorarId)) {
    throw new Error('Já existe um usuário com este e-mail.')
  }
}


function garantirAoMenosUmAdmin(restantes: UsuarioMock[]) {
  if (!restantes.some((u) => u.perfil === 'admin')) {
    throw new Error('Deve existir ao menos um administrador.')
  }
}

export const usuarioService = {

  listar(): Promise<Usuario[]> {
    return simulateRequest(() => usuariosMock.map(semSenha).sort(porNome))
  },


  listarSegurancas(): Promise<Usuario[]> {
    return simulateRequest(() => usuariosMock.filter((u) => u.perfil === 'seguranca').map(semSenha), 150)
  },


  criar(dados: DadosUsuario): Promise<Usuario> {
    return simulateRequest(() => {
      const email = dados.email.trim().toLowerCase()
      if (!dados.nome.trim()) throw new Error('Informe o nome.')
      if (!email.includes('@')) throw new Error('Informe um e-mail válido.')
      if (!dados.senha || dados.senha.length < 6) throw new Error('A senha deve ter ao menos 6 caracteres.')
      validarEmailUnico(email)
      const novo: UsuarioMock = {
        id: crypto.randomUUID(),
        nome: dados.nome.trim(),
        email,
        perfil: dados.perfil,
        senha: dados.senha,
      }
      usuariosMock.push(novo)
      return semSenha(novo)
    })
  },


  atualizar(id: string, dados: Partial<DadosUsuario>): Promise<Usuario> {
    return simulateRequest(() => {
      const indice = usuariosMock.findIndex((u) => u.id === id)
      if (indice < 0) throw new Error('Usuário não encontrado.')
      const atual = usuariosMock[indice]
      const email = dados.email !== undefined ? dados.email.trim().toLowerCase() : atual.email
      const nome = dados.nome !== undefined ? dados.nome.trim() : atual.nome
      if (!nome) throw new Error('Informe o nome.')
      if (!email.includes('@')) throw new Error('Informe um e-mail válido.')
      if (dados.senha && dados.senha.length < 6) throw new Error('A senha deve ter ao menos 6 caracteres.')
      validarEmailUnico(email, id)

      const atualizado: UsuarioMock = {
        ...atual,
        nome,
        email,
        perfil: dados.perfil ?? atual.perfil,
        senha: dados.senha || atual.senha,
      }
      garantirAoMenosUmAdmin(usuariosMock.map((u, i) => (i === indice ? atualizado : u)))
      usuariosMock[indice] = atualizado
      return semSenha(atualizado)
    }, 250)
  },


  excluir(id: string): Promise<void> {
    return simulateRequest(() => {
      const indice = usuariosMock.findIndex((u) => u.id === id)
      if (indice < 0) throw new Error('Usuário não encontrado.')
      garantirAoMenosUmAdmin(usuariosMock.filter((_, i) => i !== indice))
      usuariosMock.splice(indice, 1)
    }, 250)
  },
}
