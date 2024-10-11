const fetchGitHubRepoContents = async () => {
    const url = 'https://api.github.com/repos/FlorealRISSO/France-Terme-SQL-DB/contents/france-termes.db';
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch data: ${error}`);
    }
};

const getShaFromJson = (json: any): string => {
    return json.sha;
}

export { fetchGitHubRepoContents };