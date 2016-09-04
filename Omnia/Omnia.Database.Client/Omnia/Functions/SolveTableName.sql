CREATE FUNCTION Omnia.[SolveTableName]
(
	@name nvarchar(max),
	@addQuotes bit = 0
)
RETURNS nvarchar(max)
AS
BEGIN
	if @addQuotes = 1
		return '[' + Omnia.GetTableSchema(@name) + '].[' + Omnia.GetTableName(@name) + ']'

	return Omnia.GetTableSchema(@name) + '.' + Omnia.GetTableName(@name)
END