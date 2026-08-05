import vocabData from "./vocab.json";

export interface IELTSWord {
  word: string;
  definition: string;
  category: "Academic" | "General" | "Advanced";
  difficulty: "Easy" | "Medium" | "Hard";
  example: string;
}

export const DEFAULT_WORDS: IELTSWord[] = vocabData as IELTSWord[];

export let IELTS_WORDS: IELTSWord[] = [...DEFAULT_WORDS];

export const setIELTSWords = (newWords: IELTSWord[]) => {
  if (Array.isArray(newWords) && newWords.length > 0) {
    IELTS_WORDS = newWords;
  }
};

