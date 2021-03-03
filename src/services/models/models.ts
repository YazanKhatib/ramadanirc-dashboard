export interface User {
    username: string,
    name: string,
    email: string,
    phone: string,
    birth: string,
    gender: string,
    address: string
}


export interface Watch {
    name: string,
    model: string,
    description: string,
    condition: string,
    location: string,
    delivery: string,
    price: number,
    proposed_price?: number,
    production_year: number,
    case_material: string,
    movement: string,
    bracelet_material: string,
    gender: string,
    calibar: string,
    base_calibar: string,
    power_reserve: number,
    jewels: number,
    case_diameter: number,
    water_resistance: number,
    bezel_material: string,
    crystal: string,
    dial: string,
    dial_numbers: string,
    bracelet_color: string,
    clasp: string,
    clasp_material: string,
}

export interface Brand {
    name: string,
}