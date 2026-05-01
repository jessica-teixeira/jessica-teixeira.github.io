// ========== LIGHT/DARK THEME ==========
const themeToggle = document.querySelector('.theme-toggle');
const icon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (icon) {
            if (document.body.classList.contains('dark-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkMode', isDark);
    });
}

// Check saved preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-theme');
    const savedIcon = document.querySelector('.theme-toggle i');
    if (savedIcon) {
        savedIcon.classList.remove('fa-moon');
        savedIcon.classList.add('fa-sun');
    }
}

// ========== GITHUB PROJECTS ==========
async function fetchGitHubProjects() {
    const username = 'jessica-teixeira';
    const projectsContainer = document.getElementById('github-projects');
    const excludedRepos = ['jessica-teixeira', 'jessica-teixeira.github.io', 'jessicaferreirateixeira-blip', 'qa-automation-hub', 'mit-license'];
    
    if (!projectsContainer) {
        console.warn('Container "github-projects" not found in HTML.');
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        let projects = await response.json();
        
        if (!Array.isArray(projects)) {
            throw new Error('Invalid response format from API');
        }
        
        projects = projects.filter(project => {
            const nameLower = project.name.toLowerCase();
            return !excludedRepos.includes(nameLower) && !project.fork;
        });
        
        projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        
        projectsContainer.innerHTML = '';
        
        if (projects.length === 0) {
            projectsContainer.innerHTML = `
                <div class="no-projects">
                    <i class="fas fa-folder-open"></i>
                    <p>No public projects found.</p>
                </div>
            `;
            return;
        }
        
        projects.forEach(project => {
            const updatedAt = new Date(project.updated_at);
            const formattedDate = updatedAt.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-header">
                    <i class="fas fa-folder"></i>
                    <div class="project-links">
                        <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
                            <i class="fab fa-github"></i>
                        </a>
                        ${project.homepage ? `
                            <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" aria-label="View demo">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.name}</h3>
                    <p>${project.description || 'No description available'}</p>
                </div>
                <div class="project-footer">
                    <div class="project-lang">
                        <span class="lang-dot" style="background-color: ${getLanguageColor(project.language)}"></span>
                        <span>${project.language || 'Markdown'}</span>
                    </div>
                    <div class="project-updated">
                        <i class="far fa-clock"></i>
                        <span>Updated on ${formattedDate}</span>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Could not load projects at this time.</p>
                <p><small>${error.message}</small></p>
                <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    View GitHub Profile
                </a>
            </div>
        `;
    }
}

// ========== LANGUAGE COLORS ==========
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Dart': '#00B4AB',
        'Shell': '#89e051',
        'PowerShell': '#012456',
        'Vue': '#2c3e50',
        'React': '#61dafb',
        'Angular': '#dd0031',
        'Svelte': '#ff3e00'
    };
    return colors[language] || '#cccccc';
}

// ========== CONTACT FORM ==========
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (!name.trim() || !email.trim() || !message.trim()) {
            console.warn('Please fill in all fields.');
            return;
        }
        
        // Send to email
        const mailtoLink = `mailto:jessyteixeira.qa@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(email)}`;
        window.location.href = mailtoLink;
        
        // Reset form
        this.reset();
    });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    fetchGitHubProjects();
});