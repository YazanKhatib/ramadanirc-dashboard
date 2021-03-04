let lastId = 0;
export const uid = (prefix: string='id') => {
    lastId++;
    return `${prefix}-${lastId}`;
}

export const addToDate = ( date: Date, type: "minutes" | "hours" | "years", value: number ) => {
    let processed_date = date;

    switch(type){
        case "minutes":
            processed_date.setMinutes( date.getMinutes() + value )
            break;
        case "hours":
            processed_date.setHours( date.getHours() + value )
            break;
        case "years":
            processed_date.setFullYear(date.getFullYear() + value);
            break;
    }

    return processed_date
}

export const formatDate = (date: Date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}