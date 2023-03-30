import { Inventory } from "../models/inventory"
import { InventoryFilterMethod, PriceFilterOption, ServiceResponse, ServiceResponseError } from "../services/interfaces"
import { InventoryService } from "../services/inventory-service"

export const InventoryController = {
    getInventory(warehouseLocation?: string): Promise<Inventory[]> {
        if (warehouseLocation) {
            return InventoryService.getInventoryByLocation(warehouseLocation)
        }
        return InventoryService.getAllInventory()    
    },

    addPhone(item: Inventory) {
        const resp: ServiceResponse = InventoryService.addItem(item)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                break
            case "failed":
                console.error("A bad request has been made")
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    deletePhoneByIndex(index: number): void {
        const resp: ServiceResponse = InventoryService.deleteItemByIndex(index)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                break
            case "failed":
                console.error("A bad request has been made")
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    deletePhoneByName(name: string): void {
        const resp: ServiceResponse = InventoryService.deleteItemByName(name)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                break
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    filter5G(): Inventory[] | undefined {
        const resp: ServiceResponse = InventoryService.filterInventory(InventoryFilterMethod.MOBILE_NETWORK_GENERATION_5)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                return resp.data as Inventory[]
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    filterPriceLessThan(price: number): Inventory[] | undefined {
        const resp: ServiceResponse = InventoryService.filterInventory(InventoryFilterMethod.PRICE, price, PriceFilterOption.LESS_THAN)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                return resp.data as Inventory[]
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    filterPriceGreaterThan(price: number): Inventory[] | undefined {
        const resp: ServiceResponse = InventoryService.filterInventory(InventoryFilterMethod.PRICE, price, PriceFilterOption.GREATER_THAN)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                return resp.data as Inventory[]
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    findPhoneByName(name: string): Inventory | undefined {
        const resp: ServiceResponse = InventoryService.findItemByName(name)

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                return resp.data as Inventory
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    calcAverageCost() {
        const resp: ServiceResponse = InventoryService.calcAverageCost()

        switch (resp.status) {
            case "success":
                console.log(resp.message)
                return resp.data as number
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    },

    doWeHaveA5GPhone() {
        const resp: ServiceResponse = InventoryService.is5GDeviceAvailable()

        switch (resp.status) {
            case "success":
                console.log(resp.data)
                return resp.data
            case "failed":
                console.error(resp.message)
                break
            case "error":
                const errResp = resp as ServiceResponseError
                throw errResp.cause
        }
    }, 

    phoneFlashSale(salePercentage: number): Inventory[] {
        return []
    },

    phoneFlashSaleV2(modelName: string, salePercentage: number): Inventory[] {
        return []    
    }
}
