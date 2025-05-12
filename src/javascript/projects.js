const projectsData = [
    {
        id: 1,
        title: "Personal Website",
        description: "This site is my space to share what I'm working on, explore what I'm learning, and showcase my projects. Whether you're here to check out my work or just get to know me, I'm glad you stopped by!",
        tags: ["web", "design", "app", "roblox"],
        demoLink: "https://bexxi.dev",
        githubLink: "https://github.com/bexxi002/bexxi.dev-parking"
    },
    {
        id: 2,
        title: "Personal Website Parking Page",
        description: "This site is my space to share what I'm working on, explore what I'm learning, and showcase my projects. Whether you're here to check out my work or just get to know me, I'm glad you stopped by!",
        tags: ["web", "design", "app", "roblox"],
        demoLink: "https://bexxi.dev",
        githubLink: "https://github.com/bexxi002/bexxi.dev-parking"
    }
];

const ThumbnailManager = {
    cache: {},
    
    parseGitHubUrl(url) {
        if (!url) return null;
        
        try {
            const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
            if (match && match.length >= 3) {
                return {
                    username: match[1],
                    repo: match[2]
                };
            }
        } catch (error) {
            console.error('Error parsing GitHub URL:', error);
        }
        
        return null;
    },
    
    getCacheKey(project) {
        if (project.githubLink) {
            const parsed = this.parseGitHubUrl(project.githubLink);
            if (parsed) {
                return `${parsed.username}_${parsed.repo}`;
            }
        }
        return `project_${project.id}`;
    },
    
    saveThumbnailsToCache() {
        try {
            localStorage.setItem('project_thumbnails_cache', JSON.stringify({
                timestamp: Date.now(),
                thumbnails: this.cache
            }));
        } catch (e) {
            console.warn('Could not save thumbnails to cache:', e);
        }
    },
    
    loadThumbnailsFromCache() {
        try {
            const cached = localStorage.getItem('project_thumbnails_cache');
            if (!cached) return false;
            
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('project_thumbnails_cache');
                return false;
            }
            
            this.cache = data.thumbnails || {};
            return true;
        } catch (e) {
            console.warn('Could not retrieve from localStorage', e);
            return false;
        }
    },
    
    generateRepoCardUrl(username, repo) {
        return `https://opengraph.githubassets.com/1/${username}/${repo}`;
    },
    
    getUserAvatarUrl(username) {
        return `https://github.com/${username}.png`;
    },
    
    generateColorImage(projectId, title) {
        const hash = title.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        const hue = Math.abs(hash) % 360;
        const colorHex = this.hslToHex(hue, 70, 60);
        
        return `https://dummyimage.com/400x300/${colorHex}/ffffff&text=${encodeURIComponent(title.substring(0, 15))}`;
    },
    
    hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `${f(0)}${f(8)}${f(4)}`;
    },
    
    async getThumbnailUrl(project) {
        const cacheKey = this.getCacheKey(project);
        
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
        }
        
        let thumbnailUrl;
        
        if (project.githubLink) {
            const parsed = this.parseGitHubUrl(project.githubLink);
            
            if (parsed) {
                thumbnailUrl = this.generateRepoCardUrl(parsed.username, parsed.repo);
            }
        }
        
        if (!thumbnailUrl) {
            thumbnailUrl = this.generateColorImage(project.id, project.title);
        }
        
        this.cache[cacheKey] = thumbnailUrl;
        this.saveThumbnailsToCache();
        
        return thumbnailUrl;
    },
    
    async prefetchThumbnails(projects) {
        const cacheLoaded = this.loadThumbnailsFromCache();
        if (cacheLoaded) {
            return this.cache;
        }
        
        const thumbnails = {};
        
        for (const project of projects) {
            const cacheKey = this.getCacheKey(project);
            thumbnails[cacheKey] = await this.getThumbnailUrl(project);
        }
        
        this.cache = thumbnails;
        this.saveThumbnailsToCache();
        
        return thumbnails;
    }
};

const ProjectsManager = {
    initialized: false,
    thumbnails: {},
    
    createSkeletonUI() {
        const container = document.getElementById('projects-container');
        if (!container) return false;
        
        if (container.querySelector('.skeleton-project-card')) {
            return true;
        }
        
        container.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const skeletonCard = document.createElement('div');
            skeletonCard.className = 'skeleton-project-card';
            skeletonCard.innerHTML = `
                <div class="skeleton-image skeleton-loading"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title skeleton-loading"></div>
                    <div class="skeleton-description skeleton-loading"></div>
                    <div class="skeleton-description-2 skeleton-loading"></div>
                    <div class="skeleton-tags">
                        <div class="skeleton-tag skeleton-loading"></div>
                        <div class="skeleton-tag skeleton-loading"></div>
                        <div class="skeleton-tag skeleton-loading"></div>
                    </div>
                    <div class="skeleton-links">
                        <div class="skeleton-link skeleton-loading"></div>
                        <div class="skeleton-link skeleton-loading"></div>
                    </div>
                </div>
            `;
            container.appendChild(skeletonCard);
        }
        
        return true;
    },
    
    async renderProjects(projects) {
        const container = document.getElementById('projects-container');
        if (!container) return false;
        
        if (Object.keys(this.thumbnails).length === 0) {
            this.thumbnails = await ThumbnailManager.prefetchThumbnails(projects);
        }
        
        container.innerHTML = '';

        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-tags', project.tags.join(' '));

            const tagsHTML = project.tags.map(tag => 
                `<span class="project-tag">${tag}</span>`
            ).join('');

            const demoLinkHTML = project.demoLink ? 
                `<a href="${project.demoLink}" class="project-link" target="_blank">Live Demo</a>` : '';
            
            const githubLinkHTML = project.githubLink ? 
                `<a href="${project.githubLink}" class="project-link" target="_blank">GitHub</a>` : '';
            
            const cacheKey = ThumbnailManager.getCacheKey(project);
            const thumbnailUrl = this.thumbnails[cacheKey];
            
            const imgElement = document.createElement('img');
            imgElement.src = thumbnailUrl;
            imgElement.alt = project.title;
            imgElement.className = 'project-image';
            
            imgElement.onerror = function() {
                this.src = ThumbnailManager.generateColorImage(project.id, project.title);
            };
            
            const contentElement = document.createElement('div');
            contentElement.className = 'project-content';
            contentElement.innerHTML = `
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <div class="project-links">
                    ${demoLinkHTML}
                    ${githubLinkHTML}
                </div>
            `;
            
            projectCard.appendChild(imgElement);
            projectCard.appendChild(contentElement);
            container.appendChild(projectCard);
        });
        
        return true;
    },
    
    filterProjects(filter) {
        const buttons = document.querySelectorAll('.filter-btn');
        
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-filter') === filter) {
                button.classList.add('active');
            }
        });

        if (filter === 'all') {
            this.renderProjects(projectsData);
            return;
        }
        
        const actualFilter = filter === 'game' ? 'roblox' : filter;

        const filteredProjects = projectsData.filter(project => 
            project.tags.includes(actualFilter)
        );

        this.renderProjects(filteredProjects);
    },
    
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', () => {
                this.filterProjects(newButton.getAttribute('data-filter'));
            });
        });
    },
    
    async initialize() {
        if (this.initialized) {
            return;
        }
        
        const skeletonCreated = this.createSkeletonUI();
        
        if (!skeletonCreated) {
            console.error('Could not find projects container');
            return;
        }
        
        this.setupFilterButtons();
        
        localStorage.removeItem('project_thumbnails_cache');
        
        try {
            this.thumbnails = await ThumbnailManager.prefetchThumbnails(projectsData);
        } catch (error) {
            console.error('Error prefetching thumbnails:', error);
        }
        
        setTimeout(() => {
            this.renderProjects(projectsData);
        }, 1000);
        
        this.initialized = true;
    },
    
    reset() {
        this.initialized = false;
    }
};

if (typeof window.navigateTo === 'function' && !window.projectsNavigatePatched) {
    const currentNavigateTo = window.navigateTo;
    
    window.navigateTo = function(urlPath, shouldPush = true) {
        currentNavigateTo(urlPath, shouldPush);
        
        if (urlPath === '/projects') {
            setTimeout(() => {
                document.dispatchEvent(new Event('page:projects-loaded'));
                
                ProjectsManager.reset();
                ProjectsManager.initialize();
            }, 100);
        }
    };

    window.projectsNavigatePatched = true;
    
} else if (!window.projectsNavigatePatched) {
    console.warn('Could not patch router, using fallback method instead');
}

document.addEventListener('page:projects-loaded', () => {
    ProjectsManager.reset();
    ProjectsManager.initialize();
});

function checkIfProjectsPage() {
    if (window.location.pathname === '/projects') {
        ProjectsManager.initialize();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkIfProjectsPage();
});

if (!window.projectsContentObserver) {
    window.projectsContentObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const projectsContainer = document.getElementById('projects-container');
                if (projectsContainer && !ProjectsManager.initialized) {
                    ProjectsManager.initialize();
                    break;
                }
            }
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        const contentElement = document.getElementById('content');
        if (contentElement && !window.projectsObserverStarted) {
            window.projectsContentObserver.observe(contentElement, { childList: true, subtree: true });
            window.projectsObserverStarted = true;
        }
    });
}