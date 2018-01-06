type Feed = {
  name: string
  type: "feed"
  url: string
}

type Folder = {
  name: string
  type: "folder"
  feeds: (Feed|Folder)[]
}

type Entry = {
  read: boolean
  title: string
  link: string
  author: string
  date: Date
  image?: {
    url: string
    width: number
    height: number
  }
}

type Parser = {
  pattern: RegExp
  bodyDepth: number
  entryName: string
  items: {
    property: string
    name: string
    text: boolean | string
  }[]
}

type XMLItem = {
  name: string
  type: "element" | "text"
  attributes: {
    [x: string]: string
  }
  elements: XMLItem[]
  text: string
}

type XML = {
  declaration: {
    attributes: {
      [x: string]: string
    }
  }
  elements: XMLItem[]
}
