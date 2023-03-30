
import { InventoryController } from "./controllers/inventory-controller";
import { Inventory } from "./models/inventory";
import { InventoryFilterMethod } from "./services/interfaces";

async function run() {
    try {
        const inventory: Inventory[] = await InventoryController.getInventory("chicago")
        console.log("Index.ts: " + inventory)

        InventoryController.addPhone({name: "Google Pixel 6 Pro", fiveG: true, price: 500})
        InventoryController.deletePhoneByIndex(1)
        InventoryController.deletePhoneByName("Google Pixel 6 Pro")
        InventoryController.filter5G()
        InventoryController.filterPriceLessThan(100)
        InventoryController.filterPriceGreaterThan(100)
        InventoryController.findPhoneByName("Galaxy S10")
        InventoryController.calcAverageCost()
        InventoryController.doWeHaveA5GPhone()
        InventoryController.phoneFlashSale(25)
        InventoryController.phoneFlashSaleV2("Galaxy S10", 25)
    } catch (error) {
        console.error("An error has occurred: \n\t" + error)
    }
}

run()