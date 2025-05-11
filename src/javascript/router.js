const routes = {
  "/": { path: "./src/pages/home.html", title: "Home" },
  "/home": { path: "./src/pages/home.html", title: "Home" },
  "/about": { path: "./src/pages/about.html", title: "About" },
  "/projects": { path: "./src/pages/projects.html", title: "Projects" }
};

function navigateTo(urlPath, shouldPush = true) {
  const route = routes[urlPath];

  const toLoad = route || {
    path: "./src/pages/404.html",
    title: "404!"
  };

  fetch(toLoad.path)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load page");
      return res.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;
      document.title = `${toLoad.title} - Bexxi.dev`;

      if (shouldPush) {
        history.pushState({}, "", route ? urlPath : "/404");
      }

      if (urlPath === "/" || urlPath === "/home") {
        document.dispatchEvent(new Event("page:home-loaded"));
      }

      updateProfileLinks();
    })
    .catch(err => {
      console.error("Page loading error:", err);
      document.getElementById("content").innerHTML = `
       <div class="four0four">
          <h1>404</h1>
          <p>The page you're looking for doesn't exist, or it may have been moved elsewhere.</p>
          <a href="/" data-page="home" class="rainbow-hover" data-text="Return Home">Return Home</a>
      </div>
      `;
      document.title = "Error - Bexxi.dev";
      if (shouldPush) {
        history.pushState({}, "", "/404");
      }
    });
}

window.addEventListener("popstate", () => {
  navigateTo(location.pathname, false);
});

document.body.addEventListener("click", e => {
  const link = e.target.closest("a[data-page]");
  if (link) {
    e.preventDefault();
    navigateTo(link.getAttribute("href"));
  }
});

function updateProfileLinks() {
  const pfps = document.querySelectorAll('img[id="pfp"]');

  pfps.forEach((pfp) => {
    const pfpLink = pfp.closest('a');

    pfpLink.href = pfp.src;

    pfp.onerror = () => {
      pfp.src = 'https://avatars.githubusercontent.com/u/207246128';
      pfpLink.href = pfp.src;
    };
  });
}

// When first loading the page, DON'T push a new state
navigateTo(location.pathname, false);