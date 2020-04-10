/**
 * @prettier
 */
const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const AllPagesInfo = require("../../src/info.js");
const {
  assert,
  itMacro,
  beforeEachMacro,
  describeMacro,
  lintHTML,
} = require("./utils");

// Load fixture data.
const fixtureData = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "fixtures", "allTitles2.json"),
    "utf8"
  )
);

const locales = {
  "en-US": {
    ResourcesURI: "Resources and URIs",
  },
  es: {
    ResourcesURI: "Recursons y URIs",
  },
};

function checkSidebarDom(dom, locale) {
  let section = dom.querySelector("section");
  assert(
    section.classList.contains("Quick_links"),
    "Section does not contain Quick_links class"
  );

  let summaries = dom.querySelectorAll("summary");
  assert.equal(summaries[0].textContent, locales[locale].ResourcesURI);
}

describeMacro("HTTPSidebar", function () {
  beforeEachMacro(function (macro) {
    macro.ctx.env.path = "/en-US/docs/Web/HTTP/Overview";
    macro.ctx.info = new AllPagesInfo(fixtureData);
  });

  itMacro("Creates a sidebar object for en-US", function (macro) {
    macro.ctx.env.locale = "en-US";
    return macro.call().then(function (result) {
      expect(lintHTML(result)).toBeFalsy();
      let dom = jsdom.JSDOM.fragment(result);
      checkSidebarDom(dom, "en-US");
    });
  });

  itMacro("Creates a sidebar object for es", function (macro) {
    macro.ctx.env.locale = "es";
    return macro.call().then(function (result) {
      expect(lintHTML(result)).toBeFalsy();
      let dom = jsdom.JSDOM.fragment(result);
      checkSidebarDom(dom, "es");
    });
  });
});
