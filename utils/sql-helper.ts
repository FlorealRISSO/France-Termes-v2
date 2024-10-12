class SqlHelper {
    static queryFetchAllDomains = `SELECT domain.name from Domain domain;`;

    static queryFetchNewTerms = `
WITH RecentArticles AS (
   -- Fetch the most recent 100 articles
   SELECT Article.id
   FROM Article
   ORDER BY Article.date DESC
   LIMIT 100
),
TermsWithStatus AS (
    -- Fetch terms with statut = 2 or statut = 0, prioritize statut = 2
    SELECT 
        t.idArticle,
        t.word,
        t.statut,
        ROW_NUMBER() OVER (PARTITION BY t.idArticle ORDER BY CASE WHEN t.statut = 2 THEN 1 ELSE 2 END, t.id) AS rn
    FROM Term t
    WHERE t.statut IN (2, 0)
),
FirstTermWithStatus6 AS (
    -- Fetch the first term with statut = 6 for each article
    SELECT 
        t.idArticle,
        t.word AS term_status_6,
        ROW_NUMBER() OVER (PARTITION BY t.idArticle ORDER BY t.id) AS rn
    FROM Term t
    WHERE t.statut = 6
)

SELECT 
    ra.id AS article_id,
    
    -- Get the prioritized term (statut = 2 if available, otherwise statut = 0)
    t2.word AS term_status_2_or_0,

    -- Get the first term with statut = 6
    ft.term_status_6,
    
    -- Get the first domain
    MIN(d.name) AS first_domain

FROM RecentArticles ra

-- Join for terms with statut = 2 or 0, prioritized by ROW_NUMBER
LEFT JOIN TermsWithStatus t2 ON t2.idArticle = ra.id AND t2.rn = 1

-- Join for the first term with statut = 6
LEFT JOIN FirstTermWithStatus6 ft ON ft.idArticle = ra.id AND ft.rn = 1

-- Join to get domains
JOIN ArticleDomains ad ON ra.id = ad.articleId
JOIN Domain d ON d.id = ad.domainId

GROUP BY ra.id, t2.word, ft.term_status_6
ORDER BY ra.id;
`;

    static queryFetchDiscoverTerms = `
WITH RandomArticles AS (
    SELECT DISTINCT Article.id
    FROM Article
    ORDER BY RANDOM()
    LIMIT 100
),
TermsWithStatus AS (
    -- Fetch terms with statut = 2 or statut = 0, prioritize statut = 2
    SELECT 
        t.idArticle,
        t.word,
        t.statut,
        ROW_NUMBER() OVER (PARTITION BY t.idArticle ORDER BY CASE WHEN t.statut = 2 THEN 1 ELSE 2 END, t.id) AS rn
    FROM Term t
    WHERE t.statut IN (2, 0)
),
FirstTermWithStatus6 AS (
    -- Fetch the first term with statut = 6 for each article
    SELECT 
        t.idArticle,
        t.word AS term_status_6,
        ROW_NUMBER() OVER (PARTITION BY t.idArticle ORDER BY t.id) AS rn
    FROM Term t
    WHERE t.statut = 6
)

SELECT 
    ra.id AS article_id,
    
    -- Get the prioritized term (statut = 2 if available, otherwise statut = 0)
    t2.word AS term_status_2_or_0,

    -- Get the first term with statut = 6
    ft.term_status_6,
    
    -- Get the first domain
    MIN(d.name) AS first_domain

FROM RandomArticles ra

-- Join for terms with statut = 2 or 0, prioritized by ROW_NUMBER
LEFT JOIN TermsWithStatus t2 ON t2.idArticle = ra.id AND t2.rn = 1

-- Join for the first term with statut = 6
LEFT JOIN FirstTermWithStatus6 ft ON ft.idArticle = ra.id AND ft.rn = 1

-- Join to get domains
JOIN ArticleDomains ad ON ra.id = ad.articleId
JOIN Domain d ON d.id = ad.domainId

GROUP BY ra.id, t2.word, ft.term_status_6
ORDER BY ra.id;
`

    static buildResultsQuery = (query: string, selectedDomain: string) => {
        if (selectedDomain.length == 0) {
            return `
WITH MatchingArticles AS (
  SELECT DISTINCT t.idArticle AS article_id
  FROM Term t
  WHERE t.word LIKE "${query}%"
),
TermsWithStatus AS (
    SELECT 
        t.idArticle,
        t.word,
        t.statut,
        ROW_NUMBER() OVER (PARTITION BY t.idArticle ORDER BY 
            CASE 
                WHEN t.statut = 2 THEN 1 
                WHEN t.statut = 0 THEN 2 
                WHEN t.statut = 6 THEN 3 
                ELSE 4 
            END, 
            t.word) AS rn
    FROM Term t
    WHERE t.idArticle IN (SELECT article_id FROM MatchingArticles)
),
FirstDomains AS (
    SELECT 
        ad.articleId,
        d.name,
        ROW_NUMBER() OVER (PARTITION BY ad.articleId ORDER BY d.name) AS rn
    FROM Domain d
    JOIN ArticleDomains ad ON ad.domainId = d.id
    WHERE ad.articleId IN (SELECT article_id FROM MatchingArticles)
)

SELECT 
    ma.article_id,
    MAX(CASE WHEN tws.rn = 1 THEN tws.word END) AS term_status_2_or_0,
    MAX(CASE WHEN tws.statut = 6 THEN tws.word END) AS first_term_statut_6,
    MAX(CASE WHEN fd.rn = 1 THEN fd.name END) AS first_domain

FROM MatchingArticles ma

LEFT JOIN TermsWithStatus tws ON tws.idArticle = ma.article_id
LEFT JOIN FirstDomains fd ON fd.articleId = ma.article_id

GROUP BY ma.article_id
ORDER BY ma.article_id;
`
        } else {
            return `
WITH MatchingArticles AS (
  SELECT DISTINCT t.idArticle AS article_id
  FROM Term t
  WHERE t.word LIKE "${query}%"
),
TermsWithStatus AS (
    SELECT 
        t.idArticle,
        t.word,
        t.statut,
        ROW_NUMBER() OVER (PARTITION BY t.idArticle ORDER BY 
            CASE 
                WHEN t.statut = 2 THEN 1 
                WHEN t.statut = 0 THEN 2 
                WHEN t.statut = 6 THEN 3 
                ELSE 4 
            END, 
            t.word) AS rn
    FROM Term t
    WHERE t.idArticle IN (SELECT article_id FROM MatchingArticles)
),
MatchingDomains AS (
    SELECT 
        ad.articleId,
        d.name AS domain_name
    FROM Domain d
    JOIN ArticleDomains ad ON ad.domainId = d.id
    WHERE ad.articleId IN (SELECT article_id FROM MatchingArticles)
    AND d.name = "${selectedDomain}"
)

SELECT 
    ma.article_id,
    MAX(CASE WHEN tws.rn = 1 THEN tws.word END) AS term_status_2_or_0,
    MAX(CASE WHEN tws.statut = 6 THEN tws.word END) AS first_term_statut_6,
    md.domain_name AS matching_domain

FROM MatchingArticles ma

JOIN MatchingDomains md ON md.articleId = ma.article_id
LEFT JOIN TermsWithStatus tws ON tws.idArticle = ma.article_id

GROUP BY ma.article_id, md.domain_name
ORDER BY ma.article_id;
            `
        }

    }

    static buildToSeeQuery(articleId: number) {
        return `SELECT ArticleRelations.idArticleB FROM ArticleRelations WHERE ArticleRelations.idArticleA == ${articleId}`;
    }
    static buildArticleQuery(articleId: number) {
        return `SELECT * FROM Article WHERE Article.id == ${articleId}`;
    }
    static buildTermsQuery(articleId: number) {
        return `SELECT t.word AS term_word, t.statut AS term_status
FROM Article a
JOIN Term t ON t.idArticle = a.id
WHERE a.id = ${articleId};`
    }

    static buildDomainsQuery(articleId: number) {
        return `SELECT d.name AS domain_name, COALESCE(sd.name, null) AS subdomain_name
FROM Article a
JOIN ArticleDomains ad ON a.id = ad.articleId
JOIN Domain d ON d.id = ad.domainId
LEFT JOIN ArticleSubDomains asd ON a.id = asd.articleId
LEFT JOIN SubDomain sd ON sd.id = asd.subDomainId AND sd.idDomain = d.id  -- Ensure subdomain is related to the domain
WHERE a.id = ${articleId}`;
    }

    static buildPreviewQuery(articleId: number) {
        return `
WITH TermStatut2 AS (
    SELECT t.word AS word_statut_2
    FROM Term t
    WHERE t.idArticle = ${articleId} AND t.statut = 2
    LIMIT 1
),
TermStatut6 AS (
    SELECT t.word AS word_statut_6
    FROM Term t
    WHERE t.idArticle = ${articleId} AND t.statut = 6
    LIMIT 1
),
ArticleDomain AS (
    SELECT d.name AS domain_name
    FROM ArticleDomains ad
    JOIN Domain d ON d.id = ad.domainId
    WHERE ad.articleId = ${articleId} 
    LIMIT 1
)
SELECT 
    ts2.word_statut_2,
    ad.domain_name,
    ts6.word_statut_6
FROM TermStatut2 ts2
JOIN ArticleDomain ad ON 1 = 1
LEFT JOIN TermStatut6 ts6 ON 1 = 1; 
        `
    }

    static buildToponymQuery(articleId: number) {
        return `
SELECT 
    MAX(CASE WHEN t.statut = 0 THEN t.word END) AS term_statut_0,
    MAX(CASE WHEN t.statut = 1 THEN t.word END) AS term_statut_1,
    MAX(CASE WHEN t.statut = 3 THEN t.word END) AS term_statut_3
FROM 
    Term t
WHERE 
    t.idArticle = ${articleId} 
GROUP BY 
    t.idArticle;
`
    }

    static buildSuggestionsQuery(query: string) {
        return `
            SELECT t.idArticle AS article_id, t.word AS term
            FROM Term t
            WHERE t.word LIKE "${query}%"
            ORDER BY t.word
            LIMIT 20;
            `;
    }

    static buildSuggestionsWithDomainQuery(query: string, selectedDomain: string) {
        return `
        SELECT t.idArticle AS article_id, t.word AS term
            FROM Term t
            JOIN ArticleDomains ad ON t.idArticle = ad.articleId 
            JOIN Domain d ON ad.domainId = d.id
            WHERE t.word LIKE "${query}%" 
            AND d.name = "${selectedDomain}" 
            ORDER BY t.word
            LIMIT 20;
        `
    }

}


export { SqlHelper };