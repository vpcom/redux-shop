import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../Types/product'
import { mockProducts } from '../../mockProducts'

type ProductsState = {
  data: Product[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}
const initialState: ProductsState = { data: [], status: 'idle' }

// fetchProducts now loads from mockProducts instead of API
export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchAll',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockProducts
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, s => {
        s.status = 'loading'
        s.error = undefined
      })
      .addCase(fetchProducts.fulfilled, (s, action: PayloadAction<Product[]>) => {
        s.status = 'succeeded'
        s.data = action.payload
      })
      .addCase(fetchProducts.rejected, (s, action) => {
        s.status = 'failed'
        s.error = action.error.message
      })
  },
})

export default productsSlice.reducer