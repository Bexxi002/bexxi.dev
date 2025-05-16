(function() {
    function setFavicon(src, fallbackSrc, radius = 8) {
        const favicon = document.getElementById('favicon');
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 32;
            canvas.width = size;
            canvas.height = size;
            
            ctx.beginPath();
            ctx.arc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
            ctx.lineTo(size - radius, 0);
            ctx.arc(size - radius, radius, radius, 1.5 * Math.PI, 0);
            ctx.lineTo(size, size - radius);
            ctx.arc(size - radius, size - radius, radius, 0, 0.5 * Math.PI);
            ctx.lineTo(radius, size);
            ctx.arc(radius, size - radius, radius, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(0, radius);
            ctx.closePath();
            ctx.clip();
            
            ctx.drawImage(image, 0, 0, size, size);
            
            favicon.href = canvas.toDataURL('image/png');
        };
        image.onerror = () => {
            if (src !== fallbackSrc) {
                console.log('Primary favicon failed to load, trying fallback...');
                setFavicon(fallbackSrc, fallbackSrc, radius);
            } else {
                console.log('Both primary and fallback favicons failed to load.');
            }
        };
        image.src = src;
    }
    
    let favicon = document.getElementById('favicon');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.id = 'favicon';
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        document.head.appendChild(favicon);
    }

    const discordAvatarUrl = 'https://cdn.discordapp.com/avatars/1058244018770817095/9c3a6dac3485d9c0ca653ce717367775?size=1024';
    const githubAvatarUrl = 'https://avatars.githubusercontent.com/u/207246128';
    
    setFavicon(discordAvatarUrl, githubAvatarUrl, 8);
})();