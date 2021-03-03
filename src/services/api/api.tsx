import axios from 'axios';
import { useCookies } from 'react-cookie';

class API {

    url: string;

    constructor() {
        this.url = "http://157.230.215.132"

        const [cookies, _, removeCookie] = useCookies();

        // Add Auth header
        axios.interceptors.request.use( (config) => {

            config.headers["Accept"] = "application/json"
            config.headers["Content-Type"] = "application/json"
            config.headers["X-Requested-With"] = "XMLHttpRequest"
            if (cookies.token) {
                config.headers["accessToken"] = cookies.token?.accessToken;
            }
            return (config);

        })

        // Handle 401
        axios.interceptors.response.use((response) => {
            if(!response)
                return Promise.reject(response)
            return response
        }, function (error) {
            if(!error)
                return Promise.reject(error);
            if (403 === error.response?.status && error.response?.data?.message === "refresh Token needed") {
                // removeCookie("userinfo")
                // removeCookie("token")
                alert("HA")
            } else {
                return Promise.reject(error);
            }
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

}

export default API