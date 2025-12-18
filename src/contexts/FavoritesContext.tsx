import { createContext, useContext, useState, ReactNode } from 'react'

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
}

interface FavoritesContextType {
  items: FavoriteItem[]
  addToFavorites: (item: FavoriteItem) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])

  const addToFavorites = (item: FavoriteItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeFromFavorites = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const isFavorite = (id: string) => {
    return items.some((item) => item.id === id)
  }

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}



