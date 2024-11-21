import clientApi from "../client-api/rest-client-api"

const searchBooking = async (data) => {
    return clientApi.service("booking").get(data);
}
export default {
    searchBooking
}