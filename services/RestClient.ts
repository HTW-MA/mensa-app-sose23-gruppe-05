
export class RestClient {

    private static BASE_URL: string ="https://mensa.projekt-ipa.tech/api/v1/"
    private static ENDPOINT_CANTEEN: string = "canteen"
    private static ENDPOINT_MEAL: string = "meal"
    private static ENDPOINT_MENUE: string = "menue"
    private static API_KEY: string;

    private static getHeaders() {
        const headers = new Headers();
        const config = useRuntimeConfig()
        this.API_KEY = config.public.apiKey
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

    private static async fetchAllCanteens() {
        return await this.fetchFromApi(this.ENDPOINT_CANTEEN);
    }

    static async getAllCanteens() {

        let canteens = localStorage.getItem('canteens');

        if (canteens) {
            return Promise.resolve(JSON.parse(canteens));
        } else {
            const fetchedCanteens = await this.fetchAllCanteens();
            localStorage.setItem('canteens', JSON.stringify(fetchedCanteens));
            return fetchedCanteens;
        }
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

