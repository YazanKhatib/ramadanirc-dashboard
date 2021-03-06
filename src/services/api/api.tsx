import axios from 'axios';
import { useCookies } from 'react-cookie';

class API {

    url: string;

    constructor() {
        this.url = "https://www.ircanada.info"

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
        login(query: {email: string, password: string, date: string}, name?: string): any;
        reset_password(query: {newPassword: string}, token: string, name?: string): any;
    } {
        var endpoints:any = {}

        endpoints.login = ( query: any, name='user/login' ) => axios.post( `${this.url}/${name}`, { ...query, registrationToken: "mytoken" } )

        endpoints.reset_password = ( query: any, token: string, name='user/reset-password' ) => axios.post( `${this.url}/${name}/${token}`, { ...query, registrationToken: "mytoken" } )

        return endpoints
    }
    
    /**
     * Dialy Duas APIs
     * @param {}
     */
    users(): {
        index( name?: string ): any;
        update( query: { id?: number; username?: string; email?: string; age?: number; location?: string; gender?: string; password?: string; }, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.index = ( name='user' ) => axios.get( `${this.url}/${name}` )
        
        endpoints.update = ( query: any, name='user/update' ) => axios.post( `${this.url}/${name}`, query )

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
        add( query: { name?: string; nameFrench?: string; fixed?: boolean; }, name?: string ): any;
        update( query: { id?: number; name?: string; nameFrench?: string; fixed?: boolean; }, name?: string ): any;
        delete( id: number, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.index = ( name='task' ) => axios.get( `${this.url}/${name}` )

        endpoints.add = ( query: any, name='task/add' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.update = ( query: any, name='task/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( id: number, name='task/delete' ) => axios.get( `${this.url}/${name}/${id}` )

        return endpoints
    }
    
    /**
     * Dialy Checklist APIs
     * @param {}
     */
    tidbits(): {
        index( name?: string ): any;
        add( query: { textEnglish?: string; textFrench?: string; }, name?: string ): any;
        update( query: { id?: number; textEnglish?: string; textFrench?: string; }, name?: string ): any;
        delete( id: number, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.index = ( name='tidbit' ) => axios.get( `${this.url}/${name}` )

        endpoints.add = ( query: any, name='tidbit/add' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.update = ( query: any, name='tidbit/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( id: number, name='tidbit/delete' ) => axios.get( `${this.url}/${name}/${id}` )

        return endpoints
    }

    
    /**
     * Deed of the day APIs
     * @param {}
     */
    deed_of_the_day(): {
        get( name?: string ): any;
        set( query: { id: number; value: string; }, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.get = ( name='deedoftheday' ) => axios.get( `${this.url}/${name}` )

        endpoints.set = ( query: any, name='deedoftheday/set' ) => axios.post( `${this.url}/${name}`, query )

        return endpoints
    }

    /**
     * Notifications APIs
     * @param {}
     */
     notifications(): {
        index( name?: string ): any;
        add( query: { titleEnglish?: string; titleFrench?: string; bodyEnglish?: string; bodyFrench?: string; date?: string; }, name?: string ): any;
        update( query: { id?: number; titleEnglish?: string; titleFrench?: string; bodyEnglish?: string; bodyFrench?: string; date?: string; }, name?: string ): any;
        delete( id: number, name?: string ): any;
    } {
        var endpoints:any = {}

        endpoints.index = ( name='message/get' ) => axios.get( `${this.url}/${name}` )

        endpoints.add = ( query: any, name='message/add' ) => axios.post( `${this.url}/${name}`, query )
        
        endpoints.update = ( query: any, name='message/update' ) => axios.post( `${this.url}/${name}`, query )

        endpoints.delete = ( id: number, name='message/delete' ) => axios.get( `${this.url}/${name}/${id}` )

        return endpoints
    }

}

export default API