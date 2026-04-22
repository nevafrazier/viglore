import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000/api' })

export const searchQuery = (q) => api.get('/search', { params: { q } })
export const getStocks = (ticker) => api.get('/stocks', { params: { ticker } })
export const getCities = () => api.get('/cities')
export const getTrends = (q) => api.get('/trends', { params: { q } })
export const describeTopic = (q, title = null) => api.get('/describe', { params: title ? { q, title } : { q } })
export const getSuggestions = (q) => api.get('/suggest', { params: { q } })
export const getCompanyOverview = (ticker) => api.get('/company', { params: { ticker } })
