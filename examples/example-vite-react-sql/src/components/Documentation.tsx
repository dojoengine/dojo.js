export function Documentation() {
    return (
        <div className="documentation">
            <h2>Torii SQL Endpoint Documentation</h2>

            <section>
                <h3>Why creating an sql endpoint ?</h3>
                <p>
                    Because Torii already provides a fully featured ECS query
                    system (grpc & graphql) to retrieve your world state, SQL
                    endpoint is not meant to vbe used as a state query system.
                </p>
                <p>
                    We suggest you to use sql endpoint as a sidecar query tool
                    to get those aggregation queries that would be complicated
                    to get with grpc
                </p>

                <div className="endpoint">
                    <h4>GET /sql</h4>
                    <p>Execute SQL queries against torii db.</p>

                    <h5>Example Usage</h5>
                    <pre>
                        {`fetch(\`\$\{process.env.TORII_URL\}\`/sql?' + 
new URLSearchParams({ q: "SELECT name from contracts", }))`}
                    </pre>
                </div>

                <div className="endpoint">
                    <h4>POST /sql</h4>
                    <p>Execute SQL queries against torii db.</p>

                    <h5>Example Usage</h5>
                    <pre>
                        {`fetch(\`\$\{process.env.TORII_URL\}\`/sql', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: "SELECT name from contracts",
}))`}
                    </pre>
                </div>
                <div className="endpoint">
                    <h4>Response</h4>
                    <p>
                        Torii will always return data you've queried in a JSON
                        formatted object
                    </p>

                    <h5>Example</h5>
                    <pre>
                        {`SELECT 
        m.name as table_name,
        p.name as column_name,
        p.type as data_type,
        p."notnull" as is_nullable,
        p.pk as is_primary_key
    FROM sqlite_master m
    JOIN pragma_table_info(m.name) p
    WHERE m.type = 'table'
    AND m.name NOT LIKE 'sqlite_%'
    ORDER BY m.name, p.cid;
  `}
                    </pre>
                    <h5>JSON Response</h5>
                    <pre>
                        {`
[
	{
		"column_name": "version",
		"data_type": "BIGINT",
		"is_nullable": 0,
		"is_primary_key": 1,
		"table_name": "_sqlx_migrations"
	},
	{
		"column_name": "description",
		"data_type": "TEXT",
		"is_nullable": 1,
		"is_primary_key": 0,
		"table_name": "_sqlx_migrations"
	},
	{
		"column_name": "installed_on",
		"data_type": "TIMESTAMP",
		"is_nullable": 1,
		"is_primary_key": 0,
		"table_name": "_sqlx_migrations"
	},
...
]
`}
                    </pre>
                </div>

                <div className="notes">
                    <h4>Important Notes:</h4>
                    <ul>
                        <li>
                            Torii only exposes a way to use custom queries, NOT
                            db handle
                        </li>
                        <li>
                            Db access is <b>read only</b>
                        </li>
                        <li>
                            For now Torii relies on sqlite, double check if
                            sqlite supports your queries.
                        </li>
                    </ul>
                </div>
            </section>

            <style>{`
        .documentation {
          max-width: 800px;
          margin: 20px auto;
          padding: 20px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .endpoint {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        pre {
          background: #2d2d2d;
          color: #fff;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        }
        code {
          background: #eee;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .notes {
          border-left: 4px solid #ffd700;
          padding-left: 20px;
          margin: 20px 0;
        }
      `}</style>
        </div>
    );
}
