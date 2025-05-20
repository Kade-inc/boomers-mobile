import { Endpoints } from "../helpers/endpoints";
import { GenericHttpService } from "./genericHttpService"

export class AuthService {
    async register(data: any) {
        const genericService = new GenericHttpService();
        const response = await genericService.httpPost(Endpoints.AUTH_REGISTER, data)
        .then((res) => {
            return {success: true, data: res.data, error: null}
        })
        .catch((err) => {
            return {success: false, data: null, error: err}
        })

        return response
    }
}