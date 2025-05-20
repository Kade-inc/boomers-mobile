import axios from "axios"

export class GenericHttpService {
    private baseUrl: string = 'http://192.168.100.49:5001/api'

    constructor() {
        // Add request interceptor for logging
        axios.interceptors.request.use(request => {
            console.log('Starting Request:', request)
            return request
        })

        // Add response interceptor for logging
        axios.interceptors.response.use(
            response => {
                console.log('Response:', response)
                return response
            },
            error => {
                console.log('Error Response:', error.response || error)
                return Promise.reject(error)
            }
        )
    }

    buildUrl(url: string) {
        return `${this.baseUrl}/${url}`
    }

    async httpGet(url: string) {
        try {
            const response = await axios.get(this.buildUrl(url))
            return { data: response.data, success: true }
        } catch (error) {
            return { data: null, error, success: false }
        }
    }

    async httpPut(url: string, data: any) {
        try {
            const response = await axios.put(this.buildUrl(url), data)
            return { data: response.data, success: true }
        } catch (error) {
            return { data: null, error, success: false }
        }
    }

    async httpDelete(url: string) {
        try {
            const response = await axios.delete(this.buildUrl(url))
            return { data: response.data, success: true }
        } catch (error) {
            return { data: null, error, success: false }
        }
    }

    async httpPost(url: string, data: any) {
        try {
            const response = await axios.post(this.buildUrl(url), data)
            return { data: response.data, success: true }
        } catch (error) {
            return { data: null, error, success: false }
        }
    }
}