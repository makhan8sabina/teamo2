const questions=document.querySelectorAll(".faq-question");
const answers = document.querySelectorAll(".faq-answer");
const icons = document.querySelectorAll(".faq-icon");

for(let i=0; i<questions.length; i++){
    answers[i].style.maxHeight="0px";
    questions[i].addEventListener("click", function(){
        if (answers[i].style.maxHeight==="0px"){
            answers[i].style.maxHeight=answers[i].scrollHeight+"px";
            icons[i].textContent="-";
        }else{
            answers[i].style.maxHeight="0px";
            icons[i].textContent="+";
        }
    });
}