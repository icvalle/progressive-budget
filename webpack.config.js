const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
    mode: "development",
    entry: "./public/assets/js/index.js",
    output: {
        path: __dirname + "/public/dist",
        filename: "bundle.js"
    },
    plugins: [
        new WebpackPwaManifest({
            fingerprints: false,
            name: "Budget Tracker App",
            short_name: "Budget App",
            description: "A Budget Tracker application that allows users to add expenses and deposits to their budget with or without a connection.",
            background_color: "#ffffff",
            theme_color: "#ffffff",
            start_url: "/",
            display: "standalone",
            icons: [
                {
                src: path.resolve("public/icons/icon-512x512.png"),
                sizes: [192, 512]
                }
            ]
        })
    ]
};

module.exports = config;