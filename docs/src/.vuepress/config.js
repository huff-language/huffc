const { description } = require("../../package");

module.exports = {
  title: "Huff Documentation",
  description: description,

  head: [
    ["meta", { name: "theme-color", content: "#c70202" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
  ],

  themeConfig: {
    docsDir: "/",
    nav: [{ text: "Get Started", link: "/get-started/" }],
    sidebarDepth: 10,
    sidebar: "auto",
    smoothScroll: true,
  },
};
