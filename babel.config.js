module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [['inline-import', { extensions: ['.sql'] }]], // Required for Drizzle migrations if used
    };
};
