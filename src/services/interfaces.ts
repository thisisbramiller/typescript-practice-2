export interface ServiceResponseSuccess {
    message?: string
    data: {}
    status: 'success';
}

export interface ServiceResponseFail {
    message: string
    errors: Array<ResponseError>
    status: 'failed'
}

export interface ServiceResponseError {
    status: 'error'
    message: string
    cause?: Error
}

export type ResponseError = {
    path?: any
    message: string
    value?: any
}

export type ServiceResponse =
  | ServiceResponseSuccess
  | ServiceResponseFail
  | ServiceResponseError

export enum InventoryFilterMethod {
    PRICE = "price",
    MOBILE_NETWORK_GENERATION_5 = "5G"
}

export enum PriceFilterOption {
    LESS_THAN = "<",
    LESS_THAN_OR_EQUAL_TO = "<=",
    EQUAL_TO = "=",
    GREATER_THAN = ">",
    GREATER_THAN_OR_EQUAL_TO = ">=",

}