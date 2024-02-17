import {Book} from "./book";
import {StatusType} from "./status-type";
import {CoverType} from "./cover-type";
import {Keyword} from "../relations/keyword";
import {Language} from "../relations/language";

const ART: string = "Art";
const ARCHITECTURE: string = "Architecture";
const FINANCE: string = "Finance";

const ENGLISH: string = "English";
const FRENCH: string = "French";
const ESTONIAN: string = "Estonian";

const LINDA: string = "Linda Kalijundi";
const BART: string = "Bart Pushaw";
const KADI: string = "Kadi Polli";

const ID_NOT_FOUND: number = 0;
const ART_MUSEUM_OF_ESTONIA: string = "Art Museum of Estonia";
const LANDSCAPES_OF_IDENTITY: string = "Landscapes of Identity";
const CONFLICTS_AND_ADAPTATIONS: string = "Conflicts and adaptations";
const _20TH_CENTURY_ESTONIAN_ARCHITECTURE: string = "100 Steps Through 20th Century Estonian Architecture";
const HOUSES_YOU_NEED_TO_VISIT_BEFORE_YOU_DIE: string = "150 Houses You Need to Visit Before You Die";
const CONFLICTS_PUBLISH_YEAR: number = 2023;
const ESTONIAN_ART_BOOKS_PAGE_NR: number = 111;
const LANNOO: string = "Lannoo";
const ESTONIAN_MUSEUM_OF_ARCHITECTURE: string = "Estonian Museum of Architecture";
const NOT_FOUND: string = "NOT_FOUND";
const KAJA: string = "Kaja Kahrik";
const CONFLICTS_AND_ADAPTATIONS_FULL_TITLE: string = "Conflicts and Adaptations. Estonian Art of the Soviet Era (1940-1991)";
const LOREM_IPSUM: string = "Lorem Ipsum";
const ISBN_HOUSES_YOU_NEED_TO_VISIT: string = "ISBN 978-940-14620-4-4";
const BARCODE_HOUSES_YOU_NEED_TO_VISIT: string = "9789401462044";
const estonianArtKeywords = (): Keyword[] => [
  {id: 1, name: "Kumu Art Museum"},
  {id: 2, name: ART},
  {
    id: 3, name: "Estonian Art"
  }];

export function landscapesOfIdentity(): Book {
  return {
    id: 1,
    name: LANDSCAPES_OF_IDENTITY,
    isbn: "ISBN 978-9949-687-32-9",
    status: StatusType.HAVE,
    fullTitle: "Landscapes of Identity: Estonian Art 1700-1945 The 3rd-floor permanent exhibition of the Kumu Art Museum",
    description: LOREM_IPSUM,
    authors: [{id: 1, name: LINDA}, {id: 2, name: KADI}, {id: 3, name: BART}, {id: 4, name: KAJA}],
    keywords: estonianArtKeywords(),
    languages: [{id: 1, name: ENGLISH}],
    publisher: ART_MUSEUM_OF_ESTONIA,
    cover: CoverType.SOFTCOVER_WITH_DUST_JACKET,
    publishYear: 2021,
    pages: ESTONIAN_ART_BOOKS_PAGE_NR,
    barcode: "9789949687329"
  };
}

export const anotherBookLikeLandscapes = (): Book => {
  let dto = landscapesOfIdentity();
  dto.id = 2;
  dto.name = _20TH_CENTURY_ESTONIAN_ARCHITECTURE;
  dto.isbn = "ISBN 978-9949-9078-6-1";
  dto.barcode = "9789949907861";
  dto.fullTitle = _20TH_CENTURY_ESTONIAN_ARCHITECTURE;
  return dto;
};

export const conflictsAndAdaptations = (): Book => {
  return {
    id: 2,
    name: CONFLICTS_AND_ADAPTATIONS,
    isbn: "ISBN 978-9949-687-44-2",
    status: StatusType.HAVE,
    fullTitle: "Conflicts and Adaptations. Estonian Art of the Soviet Era (1940-1991)",
    description: LOREM_IPSUM,
    authors: [{id: 5, name: "Anu Allas"}, {id: 6, name: "Sirje Helme"}, {id: 7, name: "Liisa Kaljula"}, {
      id: 4,
      name: KAJA
    }],
    keywords: estonianArtKeywords(),
    languages: [{id: 1, name: ENGLISH}],
    cover: CoverType.SOFTCOVER_WITH_DUST_JACKET,
    publisher: ART_MUSEUM_OF_ESTONIA,
    publishYear: CONFLICTS_PUBLISH_YEAR,
    pages: ESTONIAN_ART_BOOKS_PAGE_NR,
    barcode: "9789949687442"
  };
};

export const oneHundredStepsThrough20thCenturyEstonianArchitecture = (): Book => {
  return {
    id: 3,
    name: _20TH_CENTURY_ESTONIAN_ARCHITECTURE,
    isbn: "ISBN 978-9949-9078-6-1",
    status: StatusType.HAVE,
    languages: bothLanguages(),
    authors: [{id: 8, name: "Lilian Hansar"}, {id: 9, name: "Jaak Huimerind"}, {id: 10, name: "Karen Jagodin"},
      {id: 11, name: "Liina Jänes"}, {id: 12, name: "Mart Kalm"},
      {id: 13, name: "Epp Lankots"}, {id: 14, name: "Maris Mändel"},
      {id: 15, name: "Triin Ojari"}, {id: 16, name: "Oliver Orro"}],
    keywords: [{id: 4, name: "20th Century Architecture"}, {id: 5, name: "Architecture"}, {
      id: 6,
      name: "Estonian Architecture"
    }],
    cover: CoverType.SOFTCOVER_WITH_DUST_JACKET,
    publisher: ESTONIAN_MUSEUM_OF_ARCHITECTURE,
    publishYear: 2013,
    pages: 215,
    barcode: "9789949907861"
  };
};

export const bothLanguages = (): Language[] => {
  return [{id: 2, name: ESTONIAN}, {id: 1, name: ENGLISH}];
};


export const oneHundredFiftyHouses = (): Book => {
  return {
    id: 4,
    name: HOUSES_YOU_NEED_TO_VISIT_BEFORE_YOU_DIE,
    isbn: ISBN_HOUSES_YOU_NEED_TO_VISIT,
    status: StatusType.HAVE,
    languages: [{id: 1, name: ENGLISH}],
    authors: [{id: 17, name: "Thijs Demeulemeester"}, {id: 18, name: "Jacinthe Gigou"}],
    keywords: [{id: 5, name: "Architecture"}, {id: 6, name: "World Architecture"}, {
      id: 4,
      name: "20th Century Architecture"
    }],
    cover: CoverType.HARDCOVER,
    publisher: LANNOO,
    publishYear: 2021,
    pages: 253,
    barcode: BARCODE_HOUSES_YOU_NEED_TO_VISIT
  };
};

export const allBookNames = (): string[] => {
  return [
    LANDSCAPES_OF_IDENTITY,
    CONFLICTS_AND_ADAPTATIONS,
    HOUSES_YOU_NEED_TO_VISIT_BEFORE_YOU_DIE,
    _20TH_CENTURY_ESTONIAN_ARCHITECTURE
  ];
};

export const estonianBookNames = (): string[] => {
  return [
    LANDSCAPES_OF_IDENTITY,
    CONFLICTS_AND_ADAPTATIONS,
    _20TH_CENTURY_ESTONIAN_ARCHITECTURE
  ];
};

export const estonianArtBookNames = (): string[] => {
  return [CONFLICTS_AND_ADAPTATIONS, LANDSCAPES_OF_IDENTITY];
};

export const housesYouNeedToVisit = (): string[] => {
  return [HOUSES_YOU_NEED_TO_VISIT_BEFORE_YOU_DIE];
};

export const ALL_BOOKS =(): Book[] => [
  landscapesOfIdentity(),
  conflictsAndAdaptations(),
  oneHundredStepsThrough20thCenturyEstonianArchitecture(),
  oneHundredFiftyHouses()
];
