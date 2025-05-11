const GITHUB_USERNAME = "bexxi002";
const MAX_ACTIVITIES = 5;

async function fetchGitHubActivity() {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const timestamp = new Date().getTime();
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?_=${timestamp}`, {
            cache: 'no-store'
        });
        
        if (!response.ok) {
            console.warn(`GitHub API error: ${response.status}`);
            return [];
        }
        
        return await response.json();
    } catch (error) {
        console.error("Error fetching GitHub activity:", error);
        return [];
    }
}

function formatRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diffSeconds = Math.floor((now - date) / 1000);
    
    if (diffSeconds < 60) {
        return "Just Now";
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffSeconds < 2592000) {
        const days = Math.floor(diffSeconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
        const months = Math.floor(diffSeconds / 2592000);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
}

function convertGitHubEvents(events) {
    return events.map(event => {
        let title, description, link;
        const repoName = event.repo.name.split('/')[1];

        const thumbnail = event.actor.avatar_url;
        
        switch (event.type) {
            case "PushEvent":
                const commits = event.payload.commits || [];
                const commitCount = commits.length;
                let commitMessage = commits.length > 0 ? commits[0].message : "Updated repository";
                if (commitMessage.length > 60) {
                    commitMessage = commitMessage.substring(0, 57) + "...";
                }
                
                title = `Pushed ${commitCount} ${commitCount === 1 ? 'commit' : 'commits'} to ${repoName}`;
                description = commitMessage;
                
                if (commits.length > 0 && commits[0].sha) {
                    link = `https://github.com/${event.repo.name}/commit/${commits[0].sha}`;
                } else {
                    link = `https://github.com/${event.repo.name}/commits`;
                }
                break;
                
            case "CreateEvent":
                if (event.payload.ref_type === "repository") {
                    title = `Created repository ${repoName}`;
                    description = event.payload.description || `New ${event.payload.ref_type}`;
                } else {
                    title = `Created ${event.payload.ref_type} in ${repoName}`;
                    description = `Created ${event.payload.ref_type} ${event.payload.ref || ''}`;
                }
                
                if (event.payload.ref_type === "branch" || event.payload.ref_type === "tag") {
                    link = `https://github.com/${event.repo.name}/tree/${event.payload.ref}`;
                } else {
                    link = `https://github.com/${event.repo.name}`;
                }
                break;
                
            case "PullRequestEvent":
                const prAction = event.payload.action;
                const prTitle = event.payload.pull_request?.title || '';
                
                title = `${prAction === 'opened' ? 'Opened' : prAction === 'closed' ? 'Closed' : 'Updated'} PR in ${repoName}`;
                description = prTitle;
                link = event.payload.pull_request?.html_url || `https://github.com/${event.repo.name}/pulls`;
                break;
                
            case "IssuesEvent":
                const issueAction = event.payload.action;
                const issueTitle = event.payload.issue?.title || '';
                
                title = `${issueAction === 'opened' ? 'Opened' : issueAction === 'closed' ? 'Closed' : 'Updated'} issue in ${repoName}`;
                description = issueTitle;
                link = event.payload.issue?.html_url || `https://github.com/${event.repo.name}/issues`;
                break;
                
            case "ForkEvent":
                title = `Forked ${event.repo.name}`;
                description = `Created fork of ${repoName}`;
                link = `https://github.com/${event.actor.login}/${repoName}`;
                break;
                
            case "WatchEvent":
                title = `Starred ${repoName}`;
                description = `Starred repository ${event.repo.name}`;
                link = `https://github.com/${event.repo.name}`;
                break;
                
            case "ReleaseEvent":
                title = `Released ${event.payload.release?.name || 'new version'} for ${repoName}`;
                description = event.payload.release?.body?.substring(0, 60) || 'New release published';
                if (description.length > 60) description += '...';
                link = event.payload.release?.html_url || `https://github.com/${event.repo.name}/releases`;
                break;
                
            case "DeleteEvent":
                title = `Deleted ${event.payload.ref_type} in ${repoName}`;
                description = `Deleted ${event.payload.ref_type} ${event.payload.ref || ''}`;
                link = `https://github.com/${event.repo.name}`;
                break;
                
            case "CommitCommentEvent":
                title = `Commented on commit in ${repoName}`;
                description = event.payload.comment?.body?.substring(0, 60) || 'New comment added';
                if (description.length > 60) description += '...';
                link = event.payload.comment?.html_url || `https://github.com/${event.repo.name}`;
                break;
                
            default:
                title = `${event.type.replace('Event', '')} on ${repoName}`;
                description = `Activity on ${event.repo.name}`;
                link = `https://github.com/${event.repo.name}`;
        }
        
        return {
            title,
            description,
            time: formatRelativeTime(event.created_at),
            thumbnail,
            link
        };
    });
}

function getFallbackActivities() {
    return [
        {
            title: "Hmm, something went wrong. ",
            description: "In the meantime, feel free to explore my repositories and activity on GitHub!",
            time: "Just now",
            thumbnail: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
            link: `https://github.com/${GITHUB_USERNAME}`
        }
    ];
}

function saveActivitiesToCache(activities) {
    try {
        const cacheData = {
            timestamp: new Date().getTime(),
            activities: activities
        };
        localStorage.setItem('github_activities_cache', JSON.stringify(cacheData));
    } catch (e) {
        console.warn('Could not save to localStorage', e);
    }
}

function getActivitiesFromCache() {
    try {
        const cacheData = localStorage.getItem('github_activities_cache');
        if (!cacheData) return null;
        
        const data = JSON.parse(cacheData);
        const timestamp = data.timestamp;
        const now = new Date().getTime();
        
        if (now - timestamp > 60 * 60 * 1000) { // 1 hour
            localStorage.removeItem('github_activities_cache');
            return null;
        }
        
        return data.activities;
    } catch (e) {
        console.warn('Could not retrieve from localStorage', e);
        return null;
    }
}

async function updateActivities(forceRefresh = false) {
    try {
        if (!forceRefresh) {
            const cachedActivities = getActivitiesFromCache();
            if (cachedActivities && cachedActivities.length > 0) {
                console.log('Using cached GitHub activities');
                return cachedActivities;
            }
        }

        console.log('Fetching fresh GitHub activities');
        const githubEvents = await fetchGitHubActivity();
        
        if (!githubEvents || githubEvents.length === 0) {
            console.log('No GitHub events found, using fallback');
            return getFallbackActivities();
        }
        
        const githubActivities = convertGitHubEvents(githubEvents);
        const activities = githubActivities.slice(0, MAX_ACTIVITIES);
        
        saveActivitiesToCache(activities);
        
        return activities;
    } catch (error) {
        console.error("Error updating activities:", error);
        
        const cachedActivities = getActivitiesFromCache();
        if (cachedActivities && cachedActivities.length > 0) {
            console.log('API failed, using cached activities');
            return cachedActivities;
        }
        
        return getFallbackActivities();
    }
}

async function main(forceRefresh = false) {
    const footer = document.querySelector('footer');

    const container = document.getElementById('recent-activity-container-of-container');
    if (!container) return;
    
    const skeletonContainers = container.querySelectorAll('.skeleton-container');
    skeletonContainers.forEach(skeleton => {
        skeleton.style.display = 'flex';
    });
    
    try {
        const activities = await updateActivities(forceRefresh);
        
        container.innerHTML = '';

        if (!activities || activities.length === 0) {
            container.innerHTML = `
                <p>0.o</p>
            `;
            footer.style.opacity = "1";
            return;
        }

        activities.forEach(activity => {
            const activityDiv = document.createElement('a');
            activityDiv.classList.add('recent-activity-container');
            
            if (activity.link) {
                activityDiv.href = activity.link;
                activityDiv.target = "_blank";
                activityDiv.rel = "noopener noreferrer";
            }
            
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('recent-activity-container-thumbnail');
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = activity.thumbnail;
            thumbnailImg.alt = 'GitHub Avatar';
            thumbnailImg.onerror = () => {
                thumbnailImg.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
            };
            thumbnailDiv.appendChild(thumbnailImg);
            
            const activityContentDiv = document.createElement('div');
            activityContentDiv.classList.add('recent-activity-container--container');
            
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('recent-activity-container-container--title');
            titleDiv.innerHTML = `<span>${activity.title}</span>`;
            
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('recent-activity-container-container--description');
            descriptionDiv.innerHTML = `<span>${activity.description}</span>`;
            
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('recent-activity-container-container--time');
            timeDiv.innerHTML = `<span>${activity.time}</span>`;
            
            activityContentDiv.appendChild(titleDiv);
            activityContentDiv.appendChild(descriptionDiv);
            activityDiv.appendChild(thumbnailDiv);
            activityDiv.appendChild(activityContentDiv);
            activityDiv.appendChild(timeDiv);
            container.appendChild(activityDiv);
        });
        footer.style.opacity = "1";
    } catch (error) {
        footer.style.opacity = "1";
        console.error("Failed to load GitHub activities:", error);

        container.innerHTML = '';
        const fallbackActivities = getFallbackActivities();
        
        fallbackActivities.forEach(activity => {
            const activityDiv = document.createElement('a');
            activityDiv.classList.add('recent-activity-container');
            
            if (activity.link) {
                activityDiv.href = activity.link;
                activityDiv.target = "_blank";
                activityDiv.rel = "noopener noreferrer";
            }
            
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.classList.add('recent-activity-container-thumbnail');
            const thumbnailImg = document.createElement('img');
            thumbnailImg.src = activity.thumbnail;
            thumbnailImg.alt = 'GitHub Avatar';
            thumbnailDiv.appendChild(thumbnailImg);
            
            const activityContentDiv = document.createElement('div');
            activityContentDiv.classList.add('recent-activity-container--container');
            
            const titleDiv = document.createElement('div');
            titleDiv.classList.add('recent-activity-container-container--title');
            titleDiv.innerHTML = `<span>${activity.title}</span>`;
            
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('recent-activity-container-container--description');
            descriptionDiv.innerHTML = `<span>${activity.description}</span>`;
            
            const timeDiv = document.createElement('div');
            timeDiv.classList.add('recent-activity-container-container--time');
            timeDiv.innerHTML = `<span>${activity.time}</span>`;
            
            activityContentDiv.appendChild(titleDiv);
            activityContentDiv.appendChild(descriptionDiv);
            activityDiv.appendChild(thumbnailDiv);
            activityDiv.appendChild(activityContentDiv);
            activityDiv.appendChild(timeDiv);
            container.appendChild(activityDiv);
        });
    }
}

document.addEventListener("page:home-loaded", () => {
    main(true);
});

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        const lastRefresh = parseInt(localStorage.getItem('github_last_refresh') || '0');
        const now = new Date().getTime();
        
        if (now - lastRefresh > 15 * 60 * 1000) { // 15 minutes
            main(true);
        }
    }
});

// Periodic refresh (every 15 minutes)
setInterval(() => {
    main(true);
    localStorage.setItem('github_last_refresh', new Date().getTime().toString());
}, 900000);