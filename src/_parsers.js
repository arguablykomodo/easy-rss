/** @type {Parser[]} */
exports.parsers = [
  {
    pattern: /<rss [\w\d\s]*version="2\.0"/gm,
    bodyDepth: 2,
    entryName: "item",
    items: [
      {
        property: "title",
        name: "title",
        text: true
      },
      {
        property: "link",
        name: "link",
        text: true
      },
      {
        property: "date",
        name: "pubDate",
        text: true
      }
    ]
  },
  {
    pattern: /<feed [\w\d\s]*xmlns:yt="http:\/\/www\.youtube\.com\/xml\/schemas\/2015"/gm,
    bodyDepth: 1,
    entryName: "entry",
    items: [
      {
        property: "title",
        name: "title",
        text: true
      },
      {
        property: "link",
        name: "link",
        text: "href"
      },
      {
        property: "date",
        name: "published",
        text: true
      }
    ]
  },
  {
    pattern: /<feed [\w\d\s]*xmlns="http:\/\/www\.w3\.org\/2005\/Atom"/gm,
    bodyDepth: 1,
    entryName: "entry",
    items: [
      {
        property: "title",
        name: "title",
        text: true
      },
      {
        property: "link",
        name: "link",
        text: "href"
      },
      {
        property: "date",
        name: "updated",
        text: true
      }
    ]
  }
];