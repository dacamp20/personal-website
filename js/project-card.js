class ProjectCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open"});
    }

    static get observedAttributes() {
        return ['title', 'img', 'alt', 'desc', 'date', 'course', 'link'];
    }

    attributeChangedCallback() {
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // read attributes OR fallback to safe defaults
        const title = this.getAttribute('title') || "Project Title";
        const img = this.getAttribute('img') || "blue-emoji.jpg";
        const alt = this.getAttribute('alt') || "Project image";
        const desc = this.getAttribute('desc') || "Description goes here...";
        const date = this.getAttribute('date') || "Quarter";
        const course = this.getAttribute('course') || "Course";
        const link = this.getAttribute('link') || "#";

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --light-background-color: #d0fbc7;
                    --light-text-color: #3b3b3b;
                    --light-text-box-color: white;
                    --light-input-box-color: lightgrey;
                    --dark-background-color: #121212;
                    --dark-text-color: #fafafa;    
                    --dark-text-box-color: grey;   
                    --dark-input-box-color: white;

                    display: block;

                    --card-radius: 12px;
                    --card-padding: 1rem;
                    --card-shadow: 0 10px 20px light-dark(var(--light-text-color, black), var(--dark-text-color, white));

                    color-scheme: light dark;
                    color: light-dark(var(--light-text-color, black), var(--dark-text-color, white));
                    background-color: light-dark(var(--light-background-color, white), var(--dark-background-color, black));

                }
                
                .card {
                    background-color: light-dark(var(--light-text-box-color, white), var(--dark-text-box-color, black));
                    color: light-dark(var(--light-text-color, black), var(--dark-text-color, white));
                    border-radius: var(--card-radius);
                    padding: var(--card-padding);
                    display: flex;
                    flex-direction: column; 
                    gap: 1rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--card-shadow);
                }

                picture {
                    width: 100%;
                    height: 150px;
                    overflow: hidden;
                    border-radius: var(--card-radius);
                    display: block;
                    
                }

                picture img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    align-items: center;
                    justify-content: center;

                }

                @media screen  and (max-width:767px){
                    .card {
                        padding: 0.75rem;
                    }
                    picture {
                        height: 100px;
                    }
                    h2 {
                        font-size: 1.5rem;
                    }
                    
                }

                .meta {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                a {
                    color: blue;
                    font-weight: 600;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>

            <div class="card">
                <h2>${title}</h2>

                ${
                    date || course
                        ? `<p class="meta">${date} ${course ? " - " + course : ""}</p>`
                        : ""
                }

                <picture>
                    <img src="${img}" alt="${alt}" />
                </picture>

                <p>${desc}</p>

                <a href="${link}" target="_blank">Learn more</a>
            </div>        
        `;
    }
}
customElements.define('project-card', ProjectCard);