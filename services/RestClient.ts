import { openDB } from 'idb';

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



    static async getCachedData(endpoint: string) {
        console.log("Getting cached data");
        const db = await openDB('my-app-db', 1);
        const data = await db.get('apiData', endpoint);
        return data?.data || null;
    }




}

