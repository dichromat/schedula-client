export const formatDate = (date: string) => {
    const [year, month, day] = date.split("-")
    return `${month}/${day}/${year}`
}

export const compareFormattedDates = (a: string, b: string) => {
    const [a_month, a_day, a_year] = a.split("/").map(value => parseInt(value))
    const [b_month, b_day, b_year] = b.split("/").map(value => parseInt(value))
    if (a_year != b_year) {
        return a_year-b_year
    }
    else if (a_month != b_month) {
        return a_month-b_month
    }
    else {
        return a_day-b_day
    }
}