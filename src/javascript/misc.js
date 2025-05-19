(function() {
    function getInitialTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
        } catch (e) {
            console.log('Could not access theme preference');
        }
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    const initialTheme = getInitialTheme();
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    const themeColors = {
        dark: '#0d1b2b',
        light: '#d4e2f2'
    };
    
    const updateMetaThemeColor = () => {
        const themeColorMeta = document.getElementById('theme-color-meta');
        if (themeColorMeta) {
            themeColorMeta.content = themeColors[initialTheme];
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateMetaThemeColor);
    } else {
        updateMetaThemeColor();
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeColorMeta = document.getElementById('theme-color-meta');
    
    const themeColors = {
        dark: '#0d1b2b',
        light: '#d4e2f2'
    };
    
    function updateTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeColorMeta) {
            themeColorMeta.content = themeColors[theme];
        }
        
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.log('Could not save theme preference');
        }
        
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        updateTheme(newTheme);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        try {
            if (!localStorage.getItem('theme')) {
                updateTheme(e.matches ? 'dark' : 'light');
            }
        } catch (err) {
            updateTheme(e.matches ? 'dark' : 'light');
        }
    });

    const siteConfig = {
        version: '0.9.0-beta',
        githubRepo: 'bexxi002/bexxi.dev'
    };

    const pfp = document.getElementById('pfp');
    if (pfp) {
        pfp.onerror = () => {
            pfp.src = 'https://avatars.githubusercontent.com/u/207246128';
        };
    }

    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const versionElement = document.getElementById('site-version');
    if (versionElement) {
        versionElement.textContent = 'v' + siteConfig.version;
    }

    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const today = new Date();
        const formattedDate = today.getFullYear() + '-' + 
                            String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(today.getDate()).padStart(2, '0');
        lastUpdatedElement.textContent = formattedDate;
    }

    const commitHashElement = document.getElementById('commit-hash');
    const commitLinkElement = document.getElementById('commit-link');
    
    if (commitHashElement && commitLinkElement && siteConfig.githubRepo) {
        fetchLatestCommit();
    }

    function fetchLatestCommit() {
        const apiUrl = `https://api.github.com/repos/${siteConfig.githubRepo}/commits/main`;
        
        const headers = new Headers();
        
        fetch(apiUrl, { headers })
            .then(response => {
                if (!response.ok) {
                    throw new Error('GitHub API request failed');
                }
                return response.json();
            })
            .then(data => {
                const shortHash = data.sha.substring(0, 7);
                
                commitHashElement.textContent = shortHash;
                
                commitLinkElement.href = `https://github.com/${siteConfig.githubRepo}/commit/${data.sha}`;
                commitLinkElement.setAttribute('aria-label', `View commit ${shortHash} on GitHub`);
            })
            .catch(error => {
                console.error('Error fetching commit info:', error);
                commitHashElement.textContent = '-';
            });
    }
});