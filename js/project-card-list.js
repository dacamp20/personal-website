const list = document.querySelector("#projectCardList");

for (let i=0; i < 4; i++) {
    list.appendChild(new ProjectCard());
}