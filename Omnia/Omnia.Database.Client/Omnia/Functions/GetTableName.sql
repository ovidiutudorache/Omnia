CREATE FUNCTION Omnia.[GetTableName]
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
		return @name

	set @name = SUBSTRING(@name, @pos + 1, len(@name) - @pos)

	return @name
END
