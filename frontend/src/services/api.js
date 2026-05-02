import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: `${BASE_URL}/api` })

export const searchQuery = (q) => api.get('/search', { params: { q } })
export const getStocks = (ticker) => api.get('/stocks', { params: { ticker } })
export const getCities = () => api.get('/cities')
export const getTrends = (q) => api.get('/trends', { params: { q } })
export const describeTopic = (q, title = null) => api.get('/describe', { params: title ? { q, title } : { q } })
export const getSuggestions = (q) => api.get('/suggest', { params: { q } })
export const getCompanyOverview = (ticker) => api.get('/company', { params: { ticker } })
export const getCitySignal = (q) => api.get('/city-signal', { params: { q } })
export const getStocktwits = (ticker) => api.get('/stocktwits', { params: { ticker } })
export const getCityLookup = (city) => api.get('/city-lookup', { params: { city } })
