import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { processTradeData } from '@/lib/tradeUtils'
import { toast } from 'react-toastify'

const initialState = {
  tradeHistory: [],
  loading: false,
  error: null,
}

export const fetchTrades = createAsyncThunk(
  'trades/fetchTrades',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/v1/trades')
      return processTradeData(res.data.tradeHistory)
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const addTrade = createAsyncThunk(
  'trades/addTrade',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      toast.info('Adding trade...')
      await axios.post('/api/v1/trades', formData)
      toast.success('Trade added successfully!')
      await dispatch(fetchTrades())
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const updateTrade = createAsyncThunk(
  'trades/updateTrade',
  async ({ tradeId, payload }, { dispatch, rejectWithValue }) => {
    try {
      toast.info('Updating trade...')
      await axios.put(`/api/v1/trades/${tradeId}`, payload)
      toast.success('Trade updated successfully!')
      await dispatch(fetchTrades())
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

export const deleteTrade = createAsyncThunk(
  'trades/deleteTrade',
  async (tradeId, { dispatch, rejectWithValue }) => {
    try {
      toast.info('Deleting trade...')
      await axios.delete(`/api/v1/trades/${tradeId}`)
      toast.success('Trade deleted successfully!')
      await dispatch(fetchTrades())
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
      return rejectWithValue(err.response?.data?.message || err.message)
    }
  },
)

const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrades.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrades.fulfilled, (state, action) => {
        state.loading = false
        state.tradeHistory = action.payload
      })
      .addCase(fetchTrades.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default tradesSlice.reducer
