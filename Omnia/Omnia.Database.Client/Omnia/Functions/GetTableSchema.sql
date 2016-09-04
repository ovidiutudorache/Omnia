CREATE FUNCTION [Omnia].[GetTableSchema]
(
	@name nvarchar(max)
)
RETURNS nvarchar(max)
AS
BEGIN
	if @name is null
		return null

	declare @pos int
	set @pos = Omnia.LastIndexOf(@name, '.')
	if @pos < 0
		return SCHEMA_NAME()

	return substring(@name, 0, @pos)
END
