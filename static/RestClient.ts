
export class RestClient {

    static BASE_URL: string ="https://mensa.projekt-ipa.tech/api/v1/"
    static ENDPOINT_CANTEEN: string = "canteen"
    static ENDPOINT_MEAL: string = "meal"
    static ENDPOINT_MENUE: string = "menue"
    static API_KEY: string = "j9z44OyH2kfIO8g26AaR4y3iOAThP+3qxo56A5290C0VCXPhYKjbvpE21pGD+Y0KI8s66yrdEZQQ/HZFnO5ijLg06ORBRJWsAuCg/9RuewOTwvmw8cdloEVBlIg5gdkSWnILeJc8a9FNHBc+fY93K1DpXEDdmcjnn1zsl7yoN989Q+cWZTgg9x4kbIY3wF+VEyTpuObzNFGUK3S5cn04KGogb4GEGQDGmSZ0gpTOKxQH8PBBUJ+DXaSCv1lWhYhH1Rxb7e+8Cxm84ohPQQcsuJFPVyWo/XuETUpRkP/bK/JPyJC0CdKwc4TreArj/ilqNKszJwfc4D9oDaEWPPHweQ=="

    private static getHeaders() {
        const headers = new Headers();
        headers.append("X-API-KEY", RestClient.API_KEY)
        return headers
    }

    static async fetchFromApi(endpoint: string, params: Record<string, string> = {}) {
        const urlParams = new URLSearchParams(params).toString();
        const url = `${this.BASE_URL}${endpoint}?${urlParams}`;

        return await fetch(url, {
            method: "GET",
            headers: this.getHeaders(),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data =>  JSON.stringify(data))
            .catch(error => {
                console.error("Error:", error);
            });
    }

    static async getCanteenById(canteenId: string) {
        const params = {
            ID: canteenId
        }
        return await this.fetchFromApi(this.ENDPOINT_CANTEEN, params);
    }

    static async getAllCanteens() {
        return await this.fetchFromApi(this.ENDPOINT_CANTEEN);
    }

    static async getMealById(mealId: string) {
        const params = {
            ID: mealId
        }
        return await this.fetchFromApi(this.ENDPOINT_MEAL, params);
    }

    static async getMenueForCanteenInPeriod(canteenId: string, startDate: string, endDate: string) {
        const params = {
            canteenId: canteenId,
            startdate: startDate,
            enddate: endDate
        }
        return await this.fetchFromApi(this.ENDPOINT_MENUE, params);
    }








}

