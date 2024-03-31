import {CoverType} from "./cover-type";
import {StatusType} from "./status-type";
import {Author} from "./author";
import {Keyword} from "./keyword";
import {Language} from "./language";

export interface Book extends BookBase {
  id: number;
  authors?: Author[];
  keywords?: Keyword[];
  languages?: Language[];
}

export interface BookDto extends BookBase {
  authors?: string[];
  keywords?: string[];
  languages?: string[];
}

interface BookBase {
  name: string;
  fullTitle?: string;
  description?: string;
  publisher?: string;
  isbn?: string;
  cover?: CoverType;
  publishYear?: number;
  pages?: number;
  barcode?: string;
  status: StatusType
}
