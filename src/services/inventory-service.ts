import { Inventory } from "../models/inventory";
import * as path from 'path';
import * as fs from 'fs';
import humps from 'humps';
import { InventoryFilterMethod, PriceFilterOption, ServiceResponse } from "./interfaces";

let warehouseRegistry = new Map()
let inventory: Inventory[] = []

export const InventoryService = {
    async getAllInventory(): Promise<Inventory[]> {
        let allInventory: Inventory[] = []
        await this.loadWarehouses()
        .then((result) => console.log("Warehouses: " + result))
        .catch((error) => console.log("An error occurred: " + error))

        let promise = new Promise<Inventory[]>(function(resolve, reject) {
            if (warehouseRegistry.size !== 0) {
                warehouseRegistry.forEach((value, key) => {
                    const inventory = warehouseRegistry.get(key)[key] as Inventory[]
                    
                    inventory.forEach((item) => {
                        allInventory.push(item)
                    })
                })
            } else {
                reject("Warehouse registry is empty. Unable to load registry")
            }

            resolve(allInventory)
        })

        return promise 
    },

    async getInventoryByLocation(location: string): Promise<Inventory[]> {
        let warehouse
        const searchPattern = location + "Warehouse"

        await this.loadWarehouses()
        .then((result) => console.log("Warehouses: " + result))
        .catch((error) => console.log("An error occurred: " + error))
        
        let promise = new Promise<Inventory[]>(function(resolve, reject) {
            warehouse = warehouseRegistry.get(searchPattern)
            
            if (warehouse) {
                inventory = warehouseRegistry.get(searchPattern)[searchPattern] as Inventory[]
                resolve(inventory)
            } else {
                reject("No inventory: Warehouse location not found")
            }
        })

        return promise
    },

    async loadWarehouses(): Promise<string[]> {
        const dirPath = path.join(process.cwd(), 'src/models')
        let warehouses: string[] = []

        let promise = new Promise<string[]>(function(resolve, reject) {
            fs.readdir(dirPath, function (error, files) {
                if (error) {
                    reject('Unable to load models: ' + error)
                }
                
                warehouses = files.filter((file) => {
                    if (file.includes("warehouse")) {
                        const objName = transformFilenameToObjName(file)
                        return warehouseRegistry.set(objName, require(path.resolve('src/models/' + file)))
                    }
                })

                resolve(warehouses)
            })
        })
        return promise
    },

    addItem(item: Inventory): ServiceResponse {
        try {
            inventory.push(item)
            return {status: 'success', data: inventory, message: 'Item Added Successfully'}
        } catch (e: any) {
            return {status: 'error', message: "An error occurred while trying to add item to inventory", cause: e}
        }
    },

    deleteItemByIndex(index: number): ServiceResponse {
        try {
            inventory.splice(index,1)
            return {status: 'success', data: inventory, message: 'Item Deleted Successfully'}
        } catch (e: any) {
            return {status: 'error', message: "An error occurred while trying to delete item from inventory", cause: e}
        }
    },

    deleteItemByName(name: string): ServiceResponse {
        try {
            const index = findItemByName(name)
            
            if (index >= 0) {
                inventory.splice(index,1)
                return {status: 'success', data: inventory, message: 'Item Deleted Successfully'}
            } else {
                return {status: 'failed', message: "Unable to delete, item not found in inventory", errors: [{message: "Item not found in inventory"}]}
            }

        } catch (e: any) {
            return {status: 'error', message: "An error occurred while trying to delete item from inventory", cause: e}
        }
    },

    findItemByName(name: string): ServiceResponse {
        try {
            const index = findItemByName(name)
            
            if (index >= 0) {
                return {status: 'success', data: inventory, message: 'Successfully Found Item'}
            } else {
                return {status: 'failed', message: "Item not found in inventory", errors: [{message: "Item not found in inventory"}]}
            }

        } catch (e: any) {
            return {status: 'error', message: "An error occurred while trying to search item from inventory", cause: e}
        }
    },

    filterInventory(filterBy: InventoryFilterMethod, price?: number, priceFilterOption?: PriceFilterOption): ServiceResponse {
        let filteredInventory

        switch (filterBy) {
            case InventoryFilterMethod.PRICE:
                filteredInventory = inventory.filter((item) => {
                    if ((priceFilterOption === PriceFilterOption.LESS_THAN) && price) {
                        return item.price < price
                    } else if ((priceFilterOption === PriceFilterOption.GREATER_THAN) && price) {
                        return item.price > price
                    } else {
                        throw Error("PriceFilterOption: " + priceFilterOption + " not yet supported")
                    }
                })
                break;
            case InventoryFilterMethod.MOBILE_NETWORK_GENERATION_5:
                filteredInventory = inventory.filter((item) => item.fiveG)
                break;   
            default:
                return {status: 'error', message: "Unsupported Filter Method"}
        }
        
        if (filteredInventory) {
            return {status: 'success', data: filteredInventory, message: "Inventory Filtered Successfully"}
        } else {
            return {status: 'failed', message: "No search results found", errors: []}
        }
    },

    calcAverageCost(): ServiceResponse {
        let averageCost
        try {
            averageCost = inventory.reduce((total, item) => total += item.price, 0) / inventory.length
            return {status: 'success', data: averageCost, message: 'Average Cost Calculated Successfully'}
        } catch (e: any) {
            return {status: 'error', message: "An error occurred while trying to add item to inventory", cause: e}
        }
    }, 

    is5GDeviceAvailable(): ServiceResponse {
        let result
        try {
            result = inventory.find((item) => item.fiveG)?.fiveG
            return {status: 'success', data: {result}, message: '5G is available'}
        } catch (e: any) {
            return {status: 'error', message: "An error occurred while trying to add item to inventory", cause: e}
        }
    }
}

const transformFilenameToObjName = (filename: string) => {
    return humps.camelize(filename.substring(0, filename.lastIndexOf(".")))
}


function findItemByName(name: string) {
    return inventory.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
}

