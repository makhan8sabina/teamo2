const readMoreBtn = document.getElementById("readMoreBtn");
const moreStory = document.getElementById("moreStory");

readMoreBtn.addEventListener("click", function(){
    if (moreStory.style.display === "block") {
        moreStory.style.display = "none";
        readMoreBtn.textContent = "Read more";
    } else {
        moreStory.style.display = "block";
        readMoreBtn.textContent = "Read less";
    }
});
