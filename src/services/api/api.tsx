import axios from 'axios';
import { useCookies } from 'react-cookie';

class API {

    url: string;

    constructor() {
        this.url = "http://157.230.215.132"

        const [cookies, setCookie, removeCookie] = useCookies();

        // setCookie("token", { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjE0NTI3NzQ0LCJleHAiOjE2MTQ1Mjg2NDR9.ziszuQqb8HOvMsiFgOCKepUpjwUBXR2CKi2F1D-Rl78" })

        // Add Auth header
        axios.interceptors.request.use( (config) => {

            config.headers["Accept"] = "application/json"
            config.headers["Content-Type"] = "application/json"
            config.headers["X-Requested-With"] = "XMLHttpRequest"
            if (cookies.token && !config?.headers?.skip) {
                config.headers["accessToken"] = cookies.token?.accessToken;
            }
            return (config);

        })

        // Handle 401
        axios.interceptors.response.use((response) => {
            if(!response)
                return Promise.reject(response)
            return response
        }, (error) => {
            
            const originalRequest = error?.response?.config;

            if (403 === error?.response?.status && error?.response?.data?.message === "refresh Token needed" && !originalRequest._retry) {

                originalRequest._retry = true;

                return axios.post( `${this.url}/dua/add`, {}, { headers: { "refreshToken": cookies.refresh_token?.refreshToken } } )
                .then((response: any) => {
                    if(response.data?.accessToken) {
                        setCookie("refresh_token", { refreshToken: response.data?.refreshToken })
                        setCookie("token", { accessToken: response.data?.accessToken })
                        originalRequest.headers["accessToken"] = response.data?.accessToken;
                        originalRequest.headers["skip"] = true
                        return axios(originalRequest);
                    }
                })
            }
            return Promise.reject(error);

        });
    }

    /**
     * Authentication APIs
     * @param {}
     */
    auth(): {
        login(query: {email: string, password: string}, name?: string): any;
    } {
        var endpoints:any = {}

        endpoints.login = ( query: any, name='user/login' ) => axios.post( `${this.url}/${name}`, { ...query, registrationToken: "mytoken" } )

        return endpoints
    }
    
    /**
     * Dialy Duas APIs
     * @param {}
     */
    duas(): {
        index( name?: string ): any;
        add( query: { textArabic?: string; textInbetween?: string; textEnglish?: string; }, name?: string ): any;
        update( query: { id?: number; textArabic?: string; textInbetween?: string; textEnglish?: string; }, name?: string ): any;
        delete( id: number, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.index = ( name='dua' ) => axios.get( `${this.url}/${name}` )

        endpoints.add = ( query: any, name='dua/add' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.update = ( query: any, name='dua/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( id: number, name='dua/delete' ) => axios.get( `${this.url}/${name}/${id}` )

        return endpoints
    }
    
    /**
     * Dialy Checklist APIs
     * @param {}
     */
    checklist(): {
        index( name?: string ): any;
        add( query: { name?: string; fixed?: boolean; }, name?: string ): any;
        update( query: { id?: number; name?: string; fixed?: boolean; }, name?: string ): any;
        delete( id: number, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.index = ( name='task' ) => axios.get( `${this.url}/${name}` )

        endpoints.add = ( query: any, name='task/add' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.update = ( query: any, name='task/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( id: number, name='task/delete' ) => axios.get( `${this.url}/${name}/${id}` )

        return endpoints
    }

}

export default API