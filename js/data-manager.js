// Configuration
const CONFIG = {
    JSONBIN_ID: '692fc146ae596e708f7ff079', 
    JSONBIN_API_KEY: '$2a$10$5t.7w6Q8G.SrJUmpm.MoeOL3hXI/X6SPiut6rz6Zo8kBYIMOpSff.',
    LOCAL_STORAGE_KEY: 'projectCardsData'
};

// DOM Elements
let projectListContainer;
let loadLocalBtn;
let loadRemoteBtn;
let clearStorageBtn;
let saveToLocalBtn;
let statusMessage;

// Default data (fallback if nothing else works)
const defaultProjects = [
    {
        title: "Habitizer Android App",
        date: "Winter 2025",
        course: "CSE 110",
        img: "androidStudioLogo.png",
        alt: "Habitizer Android app icon",
        desc: "Team-built Android app with Android Studio for habit tracking using Java, MVP architecture, Strategy & Observer patterns, GitHub CI, and agile workflow.",
        link: "https://github.com/CSE-110-Winter-2025/habitizer-team-19/tree/master/lib"
    },
    {
        title: "CSE Educational Studies Portfolio",
        date: "Fall 2024",
        course: "EDS 124BR",
        img: "edsPortfolioSS.jpg",
        alt: "Screen shot of my published eds portfolio site",
        desc: "Built an educational Google Sites portfolio including videos where I explain coding programs to demonstrate understanding and teaching ability.",
        link: "https://sites.google.com/view/danielsedsportfolio/home"
    }
];

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    checkLocalStorage();
});

function initializeElements() {
    projectListContainer = document.getElementById('projectCardList');
    loadLocalBtn = document.getElementById('loadLocal');
    loadRemoteBtn = document.getElementById('loadRemote');
    clearStorageBtn = document.getElementById('clearStorage');
    saveToLocalBtn = document.getElementById('saveToLocal');
    statusMessage = document.getElementById('statusMessage');
}

function setupEventListeners() {
    loadLocalBtn.addEventListener('click', loadFromLocalStorage);
    loadRemoteBtn.addEventListener('click', loadFromRemote);
    clearStorageBtn.addEventListener('click', clearLocalStorage);
    saveToLocalBtn.addEventListener('click', saveDefaultToLocalStorage);
}

function checkLocalStorage() { 
    const hasData = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
    if (!hasData) {
        showStatus('No data in localStorage. save to local or load remote first', 'info');
    }
}

async function loadFromLocalStorage() {
    try {
        showStatus('loading from localStorage...', 'loading');
        const dataStr = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
        if (!dataStr) {
            showStatus('No data found in localStorage. Please save data first.', 'error');
            return;
        }
        
        const projects = JSON.parse(dataStr);
        renderProjects(projects);
        showStatus(`Successfully loaded ${projects.length} projects from localStorage.`, 'success');

    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showStatus('Error loading from localStorage. Data might be corrupted.', 'error');
    }
}

async function loadFromRemote() {
    try {
        showStatus('Fetching data from remote server...', 'loading');
        const response = await fetch(`https://api.jsonbin.io/v3/b/${CONFIG.JSONBIN_ID}/latest`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': CONFIG.JSONBIN_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        const projects = result.record || result; 
        
        // Save to localStorage for future use
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(projects));
        
        renderProjects(projects);
        showStatus(`Successfully loaded ${projects.length} projects from remote server.`, 'success');
    } catch (error) {
        console.error('Error fetching from remote:', error);
        showStatus('Failed to load from remote. Using default data.', 'error');
        renderProjects(defaultProjects);
    } 
}

// Save default data to localStorage
function saveDefaultToLocalStorage() {
    try {
        localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(defaultProjects));
        showStatus('Default data saved to localStorage. Click "Load Local" to view.', 'success');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showStatus('Error saving to localStorage.', 'error');
    }
}

//Clear localStorage
function clearLocalStorage() {
   if (confirm('Are you sure you want to clear all stored project data?')) {
       localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEY);
       clearProjects();
       showStatus('Local storage cleared. No projects displayed.', 'info');
   }
}
// Clear all projects from the container
function clearProjects() {
    projectListContainer.innerHTML = '';
}

function renderProjects(projects) {
    clearProjects();

    if (!Array.isArray(projects) || projects.length === 0) {
        showStatus('No projects to display.', 'info');
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('project-card');
        card.setAttribute('title', project.title || 'Untitled Project');
        card.setAttribute('date', project.date || 'Date not specified');
        card.setAttribute('course', project.course || 'Course not specified');
        card.setAttribute('img', project.img || 'defaultProjectIcon.jpg');
        card.setAttribute('alt', project.alt || 'Project icon');
        card.setAttribute('desc', project.desc || 'No description available');
        card.setAttribute('link', project.link || '#');

        projectListContainer.appendChild(card);
    });
}

function showStatus(message, type = 'info') {
    if (!statusMessage) return;
    
    statusMessage.textContent = message;
    statusMessage.className = 'status-message';
    
    switch (type) {
        case 'success':
            statusMessage.classList.add('success');
            break;
        case 'error':
            statusMessage.classList.add('error');
            break;
        case 'loading':
            statusMessage.classList.add('loading');
            break;
        case 'info':
        default:
            statusMessage.classList.add('info');
    }
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 3000);
    }
}