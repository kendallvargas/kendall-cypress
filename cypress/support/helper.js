export const randomizeViewport = () => {
    const sizes = [
        [1280, 800],
        [1366, 768],
        [1920, 1080],
        [1600, 900],
    ];
    const i = Math.floor(Math.random() * sizes.length);
    return sizes[i];
};