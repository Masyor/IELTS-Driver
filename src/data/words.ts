import vocabData from "./vocab.json";

export interface IELTSWord {
  word: string;
  definition: string;
  category: "Academic" | "General" | "Advanced";
  difficulty: "Easy" | "Medium" | "Hard";
  example: string;
}

export const IELTS_WORDS: IELTSWord[] = vocabData as IELTSWord[];

