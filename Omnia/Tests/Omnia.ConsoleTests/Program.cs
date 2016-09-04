using RS.SQL;
using RS.SQL.Generator;
using RS.SQL.Generator.Clauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Omnia.ConsoleTests
{
    class Program
    {
        static void Main(string[] args)
        {
            var select = new SelectClause()
            {
                Select = new ClauseList()
            };

            select.Select.Add(new RS.SQL.Generator.Clauses.Functions.All());
            select.From = new FromClause(new ClauseList());
            ((FromClause)(select.From)).AddClause(new TableClause(new RS.SQL.Generator.Elements.DbTable("Persons")));

            var query = new Query(select);
            string sql = query.GenerateSQL();
        }
    }
}