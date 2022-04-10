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
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/get-started/" },
      { text: "Tutorial", link: "/tutorial/overview/" },
    ],
    sidebarDepth: 10,
    sidebar: {
      "/get-started/": [
        {
          title: "Get Started",
          collapsable: false,
        },
      ],

      "/tutorial/": [
        {
          title: "Tutorial",
          collapsable: false,
          children: [
            "/tutorial/overview/",
            "/tutorial/evm-basics/",
            "/tutorial/setup/",
            "/tutorial/new-project/",
          ],
        },
      ],
    },
    sidebar: "auto",
    smoothScroll: true,
  },
};
