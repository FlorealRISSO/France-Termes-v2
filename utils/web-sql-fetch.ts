import { SqlHelper } from "./sql-helper";
import { Statut } from "./statut";
import { Article, Domain, Term } from "./types";

const executeQuery = (db, query: string): any[] => {
    const stmt = db.exec(query);
    if (!stmt || !stmt[0] || !stmt[0].values) {
        return [];
    }
    return stmt[0].values;
}

class WebSqlFetch {
    static fetchResults(db: any, query: string, filterParam: string): Term[] {
        const sql = SqlHelper.buildResultsQuery(query, filterParam);
        const stmt = executeQuery(db, sql);
        const terms = []
        for (const row of stmt) {
            terms.push({ id: row[0], term: row[1], domain: row[3], englishTerm: row[2] });
        }
        return terms;
    }

    static fetchSuggestions(db: any, query: string, selectedDomain: string): [number, string][] {
        let sql: string;
        if (!selectedDomain || selectedDomain.length == 0) {
            sql = SqlHelper.buildSuggestionsQuery(query);
        } else {
            sql = SqlHelper.buildSuggestionsWithDomainQuery(query, selectedDomain);
        }

        return executeQuery(db, sql) as [number, string][];
    }

    static fetchAllDomains(db: any): string[] {
        return executeQuery(db, SqlHelper.queryFetchAllDomains);
    }

    static fetchNewTerms(db: any): Term[] {
        const stmt = executeQuery(db, SqlHelper.queryFetchNewTerms);
        return stmt.map((row: any[]) => ({
            id: row[0],
            term: row[1],
            domain: row[3],
            englishTerm: row[2],
        }));
    }

    static fetchDiscoverTerms(db: any): Term[] {
        const stmt = executeQuery(db, SqlHelper.queryFetchDiscoverTerms);
        return stmt.map((row: any[]) => ({
            id: row[0],
            term: row[1],
            domain: row[3],
            englishTerm: row[2],
        }));
    }

    static fetchToSee = (db, articleId: number): number[] => {
        const query = SqlHelper.buildToSeeQuery(articleId);
        const stmt = executeQuery(db, query);
        return stmt;
    }

    static fetchArticle = (db, articleId: number): Article => {
        const query = SqlHelper.buildArticleQuery(articleId);
        const stmt = executeQuery(db, query);
        const articleArr = stmt[0];
        return { id: articleArr[0], numero: articleArr[1], date: articleArr[2], definition: articleArr[3], note: articleArr[4] };
    }

    static fetchTerms = (db, articleId: number): [string, string[], string[], string[]] => {
        const query = SqlHelper.buildTermsQuery(articleId);

        const antonyms = [];
        const synonyms = [];
        const translations = [];
        let term = '';

        const stmt = executeQuery(db, query);
        for (const [word, statut] of stmt) {
            switch (statut) {
                case Statut.SYNONYME:
                    synonyms.push(word);
                    break;
                case Statut.ANTONYME:
                    antonyms.push(word);
                    break;
                case Statut.EQUIVALENT:
                    translations.push(word);
                    break;
                default:
                    term = word;
                    break;
            }
        }
        return [term, synonyms, antonyms, translations];
    }

    static fetchPreview = (db, articleId: number): Term | null => {
        const query = SqlHelper.buildPreviewQuery(articleId);
        const stmt = executeQuery(db, query);
        const [term, domain, translation] = stmt[0];
        return { id: articleId, term: term, domain: domain, englishTerm: translation };
    }


    static fetchDomains = (db, articleId: number): Domain[] => {
        const query = SqlHelper.buildDomainsQuery(articleId);
        const stmt = executeQuery(db, query);

        const domains = new Map<string, Domain>();
        for (const [domain, subdomain] of stmt) {
            if (!domains.has(domain)) {
                const field = { field: domain, subfields: [] }
                domains.set(domain, field);
            }
            if (subdomain) {
                domains.get(domain).subfields.push(subdomain);
            }
        }

        return Array.from(domains.values());
    }

    static fetchToponym = (db, articleId: number): [string, string, string] => {
        const query = SqlHelper.buildToponymQuery(articleId);
        const stmt = executeQuery(db, query);
        return stmt[0];
    }
}

export { WebSqlFetch };

