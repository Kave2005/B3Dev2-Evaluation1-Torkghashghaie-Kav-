const projectsGrid = document.getElementById('projects-grid');
const loader = document.getElementById('loader');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close');

const techFiltersContainer = document.getElementById('tech-filters');
const catFiltersContainer = document.getElementById('cat-filters');

let projectsData = [];


async function loadProjects() {
  try {
    const response = await fetch('https://gabistam.github.io/Demo_API/data/projects.json');
    if (!response.ok) throw new Error('Erreur lors du chargement des projets');
    const data = await response.json();
    projectsData = data.projects;

    
    data.technologies.forEach(tech => {
      const btn = document.createElement('button');
      btn.dataset.tech = tech;
      btn.textContent = tech;
      techFiltersContainer.appendChild(btn);
    });

    
    data.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.dataset.cat = cat;
      btn.textContent = cat;
      catFiltersContainer.appendChild(btn);
    });

    addFilterEvents();
    displayProjects(projectsData);

  } catch (error) {
    projectsGrid.innerHTML = `<p>${error.message}</p>`;
  } finally {
    loader.style.display = 'none';
  }
}


function displayProjects(data) {
  projectsGrid.innerHTML = '';
  if(data.length === 0){
    projectsGrid.innerHTML = `<p>Aucun projet correspondant aux filtres.</p>`;
    return;
  }
  data.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${proj.image}" alt="${proj.title}">
      <div class="card-body">
        <h3>${proj.title}</h3>
        <p>Client: ${proj.client}</p>
        <p>Catégorie: ${proj.category}</p>
        <div class="badges">
          ${proj.technologies.map(t => `<span class="badge">${t}</span>`).join('')}
        </div>
        <button class="details-btn" data-id="${proj.id}">Voir détails</button>
      </div>
    `;
    projectsGrid.appendChild(card);
  });

  
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
  });
}

function openModal(id) {
  const proj = projectsData.find(p => p.id == id);
  modalBody.innerHTML = `
    <h2>${proj.title}</h2>
    <p><strong>Client:</strong> ${proj.client}</p>
    <p><strong>Année:</strong> ${proj.year} | <strong>Durée:</strong> ${proj.duration}</p>
    <p>${proj.description}</p>
    <ul>${proj.features.map(f => `<li>${f}</li>`).join('')}</ul>
    <a href="${proj.url}" target="_blank">Voir le site</a>
  `;
  modal.style.display = 'flex';
}


closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });


function addFilterEvents() {
  document.querySelectorAll('#tech-filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tech-filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
  document.querySelectorAll('#cat-filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#cat-filters button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function applyFilters() {
  const activeTech = document.querySelector('#tech-filters button.active').dataset.tech;
  const activeCat = document.querySelector('#cat-filters button.active').dataset.cat;

  let filtered = projectsData;

  if(activeTech !== 'all') filtered = filtered.filter(p => p.technologies.includes(activeTech));
  if(activeCat !== 'all') filtered = filtered.filter(p => p.category === activeCat);

  displayProjects(filtered);
}

loadProjects();
