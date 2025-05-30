export interface Word {
  word: string;
  meanings: string[];
}

export interface WordDetail extends Word {
  examples?: Example[];
}

export interface Example {
  usage: string;
  explanation: string;
}