const events = [
    { date: "June 14", name: "Summer Five-a-Side Cup", place: "ASTANA IT UNIVERSITY", format: "5-a-side" },
    { date: "June 18", name: "Midweek League — Week 6", place: "BARYS ARENA", format: "7-a-side" },
    { date: "June 27", name: "Charity Shield Match", place: "BOTANICAL GARDEN", format: "11-a-side" },
    { date: "July 5–7", name: "Youth Development Camp", place: "NAZARBAYEV UNIVERSITY", format: "5-a-side" },
    { date: "July 19", name: "Summer League Final", place: "ASTANA ARENA", format: "7-a-side" }
];


const schedule = {
    items: events,


    getByFormat: function(format){
        switch (format) {
            case "5-a-side":
            case "7-a-side":
            case "11-a-side":
                return this.items.filter(function(item){
                    return item.format === format;
                });
            default:
                return this.items;
        }
    },


    makeRow: function(item){
        return "<tr><td>" + item.date + "</td><td>" + item.name + "</td><td>" +
               item.place + "</td><td>" + item.format + "</td></tr>";
    }
};

const tableBody = document.querySelector("#schedule tbody");
const tableCaption = document.querySelector("#schedule caption");
const filterBtns = document.querySelectorAll("[data-filter]");

function showEvents(format){
    const list = schedule.getByFormat(format);

    let rows = "";
    for (let i = 0; i < list.length; i++) {
        rows += schedule.makeRow(list[i]);
    }
    tableBody.innerHTML = rows;

    tableCaption.textContent = "This season's events (showing " + list.length + " of " + events.length + ")";
}

filterBtns.forEach(function(btn){
    btn.addEventListener("click", function(){
        filterBtns.forEach(function(b){
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        showEvents(btn.getAttribute("data-filter"));
    });
});


showEvents("all");
