export const formatDate = (timestamp: number, multiplier = 1000) => {
    return timestamp? Intl.DateTimeFormat("en-US",{year: 'numeric', month: 'short', day: 'numeric'}).format(new Date(timestamp * multiplier)) : ""
}

export const formatTime = (timestamp: number, multiplier = 1000) => {
    return timestamp? Intl.DateTimeFormat("en-GB",{hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date(timestamp * multiplier)) : ""
}

export const formatDateAndTime = (timestamp: number, multiplier = 1000) => {
    return timestamp? Intl.DateTimeFormat("en-GB",{year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'}).format(new Date(timestamp * multiplier)) : ""
}