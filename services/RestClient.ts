
export class RestClient {

     static BASE_URL: string ="https://mensa.projekt-ipa.tech/api/v1/"
     static ENDPOINT_CANTEEN: string = "canteen"
     static ENDPOINT_MEAL: string = "meal"
     static ENDPOINT_MENUE: string = "menue"
     static API_KEY: string = "IxzGn/rZqdwcAEWYiRh7d6+goi+8IjQiwJXNuXcCqcxCF80yUjGYFpjtYhlJZ1mSpermRXL7Iz6jarukJxGsbTpBXfWNAx79H2iDMyWed/zlilSwJ87mI6jMViiYVxzwZJvNo8CptnSn/ECXtJIpcD8tj51fLaydAigxeqz0Vgy1MMs4wV6zX8x62iFP8nN7+B3fIfYHj+73aCM1e9Mqv3oIHIwbZTMK84KeAeMDq/5zL8NaWXOrDlvmmCi04DV9V7d7FPlEVbNeBCsjQOUIOdhbq+3z5G6jTrzjpC/El7EhXohaaiOyFgFJdmDiUrWGmF1VIJdB9QyMRyqZ+HUD9A==";

    private static getHeaders() {
        const headers = new Headers();
  //      const config = useRuntimeConfig()
   //     this.API_KEY = config.public.apiKey
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
            const fetchedCanteens = await this.fetchAllCanteens();
            return fetchedCanteens;
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

