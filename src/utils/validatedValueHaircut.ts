export function validatedValueHaircut(price) {

    if (String(price).includes(",")) {
        const newPrice = price.replace(',', '.')
        return Number(newPrice).toFixed(2)
    }
    return Number(price).toFixed(2)
}