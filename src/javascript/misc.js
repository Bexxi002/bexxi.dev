// Set theme based on system preferences
(function () {
    const themeColorMeta = document.getElementById('theme-color-meta');
    
    const themeColors = {
        dark: '#0d1b2b',
        light: '#d4e2f2'
    };
    
    function updateThemeColor(theme) {
        if (themeColorMeta) {
            themeColorMeta.content = themeColors[theme];
        }
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    updateThemeColor(systemPreference);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        updateThemeColor(e.matches ? 'dark' : 'light');
    });
})();

//---------------------------------------------------------------------
// Site configuration
const siteConfig = {
    version: '0.9.0-beta',
    githubRepo: 'bexxi002/bexxi.dev'
};

//---------------------------------------------------------------------
// 0.o
document.addEventListener('DOMContentLoaded', function() {
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