CREATE FUNCTION [Omnia].[CanImportTable]
(
	@table nvarchar(500)
)
RETURNS int
AS
BEGIN
	declare @errorMessage nvarchar(max)

	if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_SCHEMA + '.' + TABLE_NAME = Omnia.SolveTableName(@table, 0))
		return 1

	if exists(select * from Omnia.Collections where [Name] = @table)
		return 2

	if (select count(ColumnName) from Omnia.GetPrimaryKeys(Omnia.SolveTableName(@table, 0))) > 1
		return 3

	return 0
END
