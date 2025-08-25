import { Store } from '../../types/schemas/store'
import { CreateStoreDTO } from '../../types/dtos/store.dto'

export const formatStore = (store: any) => ({
  id: store.id,
  name: store.name,
  status: store.status,
  owner: store.owner,
  category: store.category,
  email: store.email,
  description: store.description ?? undefined,
  phone: store.phone,
  website: store.website ?? undefined,
  cnpj: store.cnpj,
  ie: store.ie,
  logoUrl: store.logoUrl ?? undefined,
  bannerUrl: store.bannerUrl ?? undefined,
  createdAt: store.createdAt,
  updatedAt: store.updatedAt,
  address: {
    street: store.addressStreet,
    number: store.addressNumber,
    neighborhood: store.addressNeighborhood,
    city: store.addressCity,
    state: store.addressState,
    zipCode: store.addressZipCode,
    country: store.addressCountry,
    complement: store.addressComplement ?? undefined,
  },
})

// Função que recebe o array do Prisma e retorna o array mapeado
export const formatStores = (stores: any[]): Store[] => {
  return stores.map(formatStore)
}

export const mapCreateDtoToPrisma = (payload: CreateStoreDTO) => {
  const { ownerId, address, category, ...restOfStoreData } = payload

  return {
    ...restOfStoreData,
    // Conecta o dono usando a sintaxe de relação do Prisma
    owner: {
      connect: {
        id: ownerId,
      },
    },
    category,
    // Mapeia o objeto 'address' para os campos planos do banco de dados
    addressStreet: address.street,
    addressNumber: address.number,
    addressComplement: address.complement,
    addressNeighborhood: address.neighborhood,
    addressCity: address.city,
    addressState: address.state,
    addressZipCode: address.zipCode,
    addressCountry: address.country,
  }
}
