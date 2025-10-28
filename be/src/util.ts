export function getTime(){
    const now  = new Date();

    const dateTime12Hr = now.toLocaleDateString("en-IN",{
        year : "numeric",
        month  : "2-digit",
        day:"2-digit",
        hour  : "2-digit",
        minute : "2-digit",
        second : "2-digit"
    })
    return dateTime12Hr;
}

