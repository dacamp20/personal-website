//Configuration
const LOCAL_STORAGE_KEY = 'projectCardsData';
//DOM elements
let projectForm;
let projectIdInput;
let titleInput;
let dateInput;
let courseInput;
let imgInput;
let altInput;
let descInput;
let linkInput;
let createBtn;
let updateBtn;
let cancelBtn;
let projectListContainer;
let loadProjectsBtn;
let clearAllBtn;
let formStatus;
let listStatus;
//State
let projects = [];
let editingId = null;
//initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
});
function initializeElements() {
    //form
    projectForm = document.getElementById('projectForm');
    projectIdInput = document.getElementById('projectId');
    titleInput = document.getElementById('title');
    dateInput = document.getElementById('date');
    courseInput = document.getElementById('course');
    imgInput = document.getElementById('img');
    altInput = document.getElementById('alt');
    descInput = document.getElementById('desc');
    linkInput = document.getElementById('link');
    createBtn = document.getElementById('createBtn');
    updateBtn = document.getElementById('updateBtn');
    cancelBtn = document.getElementById('cancelBtn');
    //list 
    projectListContainer = document.getElementById('projectListContainer');
    loadProjectsBtn = document.getElementById('loadProjects');
    clearAllBtn = document.getElementById('clearAll');
    
    //status elements
    formStatus = document.getElementById('formStatus');
    listStatus = document.getElementById('listStatus');
    // Hide update/cancel buttons initially
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}
function setupEventListeners() {
    projectForm.addEventListener('submit', handleFormSubmit);
    updateBtn.addEventListener('click', handleUpdate);
    cancelBtn.addEventListener('click',  handleCancelEdit);
    loadProjectsBtn.addEventListener('click', loadProjectsFromStorage);
    clearAllBtn.addEventListener('click', clearAllProjects);
}
function loadProjectsFromStorage() {
    try {
        showStatus(listStatus, 'Loading projects...', 'loading');
        const dataStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!dataStr) {
            projects = [];
            showStatus(listStatus, 'No projects found. Create some then load.', 'info');
            renderProjectList();
            return;
        }
        projects = JSON.parse(dataStr);
        //Ensure all projects have IDs
        projects = projects.map((project, index) => {
            // If project doesn't have an id, add one
            if (!project.id) {
                return {
                    ...project,
                    id: Date.now() + index // Unique ID
                };
            }
            return project;
        });
        
        // Save back with IDs
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
        
        renderProjectList();
        showStatus(listStatus, `Loaded ${projects.length} project(s)`, 'success');
    } catch (error) {
        console.error('Error loading projects:', error);
        showStatus(listStatus, 'Error loading projects', 'error');
        projects = [];        
    }
}
function saveProjectsToStorage() {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
        return true;
    } catch (error) {
        console.error('Error saving projects:', error);
        showStatus(formStatus, 'Error saving projects', 'error');
        return false;
    }
}
//CREATE: handle form submission for adding new project
function handleFormSubmit(event) {
    event.preventDefault();
    if (editingId !== null) {
        //if in editting mode then update on submit instead
        handleUpdate();
        return;
    }
    const newProject = {
        id: Date.now(),
        title: titleInput.value.trim(),
        date: dateInput.value.trim(),
        course: courseInput.value.trim(),
        img: imgInput.value.trim(),
        alt: altInput.value.trim(),
        desc: descInput.value.trim(),
        link: linkInput.value.trim() || '#'
    };
    if (!newProject.title || !newProject.date || !newProject.img || !newProject.alt || !newProject.desc) {
        showStatus(formStatus, 'Please fill in all required fields (*)', 'error');
        return;
    }
    projects.push(newProject);
    if (saveProjectsToStorage()) {
        showStatus(formStatus, 'Project created successfully!', 'success');
        renderProjectList();
        projectForm.reset();
    }
}
//READ: render list of projects
function renderProjectList() {
    projectListContainer.innerHTML = '';
    if(projects.length === 0) {
        projectListContainer.innerHTML = '<p class="empty-message">No projects yet. Create one!</p>';
        return;
    }
    projects.forEach((project, index) => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.dataset.id = project.id;
        
        projectItem.innerHTML = `
            <div class="project-item-header">
                <h3>${project.title}</h3>
                <div class="project-actions">
                    <button class="btn-small edit-btn" data-index="${index}">Edit</button>
                    <button class="btn-small delete-btn" data-index="${index}">Delete</button>
                </div>
            </div>
            <div class="project-item-details">
                <p><strong>Date:</strong> ${project.date}</p>
                <p><strong>Course:</strong> ${project.course || 'N/A'}</p>
                <p class="truncate"><strong>Description:</strong> ${project.desc.substring(0, 100)}...</p>
            </div>
        `;
        
        projectListContainer.appendChild(projectItem);
    });
    //add evenet listeners to the new buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            handleEdit(index);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            handleDelete(index);
        });
    });
}
//UPDATE: Handle editing a project
function handleEdit(index) {
    if (index < 0 || index >= projects.length) return;
    const project = projects[index];
    editingId = project.id;
    //fill form with project data
    projectIdInput.value = project.id;
    titleInput.value = project.title;
    dateInput.value = project.date;
    courseInput.value = project.course || '';
    imgInput.value = project.img;
    altInput.value = project.alt;
    descInput.value = project.desc;
    linkInput.value = project.link === '#' ? '' : project.link;
    //switch to update mode
    createBtn.style.display = 'none';
    updateBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    showStatus(formStatus, `Editing ${project.title}`, 'info');
    //scroll to form
    titleInput.focus();
}
//UPDATE: save edited project
function handleUpdate() {
    if (editingId === null) return;
    const index = projects.findIndex(p => p.id === editingId);
    if (index === -1) return;
    const updatedProject = {
        id: editingId,
        title: titleInput.value.trim(),
        date: dateInput.value.trim(),
        course: courseInput.value.trim(),
        img: imgInput.value.trim(),
        alt: altInput.value.trim(),
        desc: descInput.value.trim(),
        link: linkInput.value.trim() || '#'
    };
    if (!updatedProject.title || !updatedProject.date || !updatedProject.img || !updatedProject.alt || !updatedProject.desc) {
        showStatus(formStatus, 'Please fill in all required fields (*)', 'error');
        return;
    }
    projects[index] = updatedProject;
    if (saveProjectsToStorage()) {
        showStatus(formStatus, 'Project updated successfully!', 'success');
        renderProjectList();
        resetForm();        
    }
}
function handleCancelEdit() {
    resetForm();
    showStatus(formStatus, 'Edit cancelled', 'info');
}
function resetForm() {
    projectForm.reset();
    projectIdInput.value = '';
    editingId = null;
    createBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}
//DELETE: handle deleting a project
function handleDelete(index) {
    if (index < 0 || index >= projects.length) return;
    const projectTitle = projects[index].title;
    if (confirm(`Are you sure you want to delete "${projectTitle}"?`)) {
        projects.splice(index, 1);
        if (saveProjectsToStorage()) {
            showStatus(listStatus, `Deleted ${projectTitle}`, 'success');
            renderProjectList();
            //if we were editing this project, cancel edit
            if (editingId === projects[index]?.id) {
                resetForm();
            }
        }
    }
}
//DELETE: clear all projects
function clearAllProjects() {
    if (projects.length === 0) {
        showStatus(listStatus, 'No projects to clear', 'info');
        return;
    }
    if (confirm(`Are you sure you want to delete ALL ${projects.length} projects? This cannot be undone.`)) {
        projects = [];
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        renderProjectList();
        resetForm();
        showStatus(listStatus, 'All projects cleared', 'success');
    }
}
//show status messages
function showStatus(element, message, type = 'info') {
    if (!element) return;
    element.textContent = message;
    element.className = 'status-message';
    switch(type) {
        case 'success':
            element.classList.add('success');
            break;
        case 'error':
            element.classList.add('error');
            break;
        case 'loading':
            element.classList.add('loading');
            break;
        case 'info':
        default:
            element.classList.add('info');
    }
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'status-message';
        }, 3000);
    }
}

