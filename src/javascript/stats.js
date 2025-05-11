const statsURL = "https://raw.githubusercontent.com/bexxi002/github-stats/master/generated/overview.svg";

function formatNumber(n) {
    n = parseInt(n.replace(/,/g, ""));
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
    return n.toString();
}

async function fetchStatsFromSVG() {
    try {
        const bustCacheURL = `${statsURL}?t=${Date.now()}`;
        const res = await fetch(bustCacheURL);
        const svgText = await res.text();

        const commitsMatch = svgText.match(/All-time contributions<\/td><td>(\d+)<\/td>/);
        const linesMatch = svgText.match(/Lines of code changed<\/td><td>([\d,]+)<\/td>/);
        const reposMatch = svgText.match(/Repositories with contributions<\/td><td>(\d+)<\/td>/);

        const commits = commitsMatch?.[1] || "0";
        const lines = linesMatch?.[1] || "0";
        const repos = reposMatch?.[1] || "0";

        document.getElementById("amount-projects").textContent = repos;
        document.getElementById("amount-commits").textContent = formatNumber(commits);
        document.getElementById("amount-lines").textContent = formatNumber(lines);
    } catch (err) {
        console.error("Failed to load GitHub stats:", err);
    }
}

fetchStatsFromSVG();

document.addEventListener("page:home-loaded", () => {
    fetchStatsFromSVG();
});