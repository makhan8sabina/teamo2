const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("keydown", function(event){
        let next = i;

        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                next = i + 1;
                break;
            case "ArrowLeft":
            case "ArrowUp":
                next = i - 1;
                break;
            case "Home":
                next = 0;
                break;
            case "End":
                next = navLinks.length - 1;
                break;
            default:
                return; 
        }

        event.preventDefault();

  
        if (next >= navLinks.length) {
            next = 0;
        }
        if (next < 0) {
            next = navLinks.length - 1;
        }
        navLinks[next].focus();
    });
}
