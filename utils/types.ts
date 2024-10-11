type Term = {
    id: number;
    term: string;
    domain: string;
    englishTerm: string;
};

type Article = {
    id: number;
    numero: string;
    date: string;
    definition: string;
    note: string;
}

type ArticleData = {
    term: string;
    synonyms: string[];
    antonyms: string[];
    domains: Domain[]; 
    translation: string[];
    definition: string;
    note: string;
    date: string;
};

type Domain = {
    field: string;
    subfields: string[];
}

export { Term, Article, ArticleData, Domain};