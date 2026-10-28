//Beka
const months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function showDateTime(){
    const now=new Date();
    const month=months[now.getMonth()];
    const day=now.getDate();
    const year = now.getFullYear();

    let hours=now.getHours();
    let minutes=now.getMinutes();
    let seconds=now.getSeconds();

   let ampm="AM"
    if (hours>=12){
        ampm="PM";}

    if(hours>12){
        hours=hours-12;}

    if (hours===0){
        hours=12;}

    if (minutes<10){
        minutes="0"+minutes;}

    if (seconds<10){
        seconds="0"+seconds;}

    document.getElementById("datetime").textContent=month+" "+day+" ("+year+"), "+
    hours+":"+minutes+":"+seconds+" "+"  "+ampm;

}
showDateTime();
setInterval(showDateTime, 1000);



function showGreeting(){
    const hour = new Date().getHours();
    const partOfDay = Math.floor(hour / 6); 
    let greeting = "";

    switch (partOfDay) {
        case 1:
            greeting = "Good morning! Perfect time for a training session.";
            break;
        case 2:
            greeting = "Good afternoon! Check the events and find a match.";
            break;
        case 3:
            greeting = "Good evening! Our evening league games start at 19:00.";
            break;
        default:
            greeting = "Good night! Rest well before the next match.";
    }

    document.getElementById("greeting").textContent = greeting;
}
showGreeting();