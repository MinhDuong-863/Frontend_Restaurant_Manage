import clientApi from "../client-api/rest-client-api"

const searchBooking = async (obj) => {
    // const queryString = new URLSearchParams(obj).toString();
    return clientApi.service("booking").find(obj);
}
export {
    searchBooking,
}