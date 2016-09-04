CREATE FUNCTION Omnia.GetSqlDataType
(
	@name nvarchar(256)
)
RETURNS int
AS
BEGIN
	set @name = lower(isnull(@name, ''))

	declare @dataType int

	set @dataType = case
						when 'image' = @name then 7
						when 'text' = @name then 18
						when 'uniqueidentifier' = @name then 14
						when 'date' = @name then 31
						when 'time' = @name then 32
						when 'datetime2' = @name then 33
						when 'datetimeoffset' = @name then 34
						when 'tinyint' = @name then 20
						when 'smallint' = @name then 16
						when 'int' = @name then 8
						when 'smalldatetime' = @name then 15
						when 'real' = @name then 13
						when 'money' = @name then 9
						when 'datetime' = @name then 4
						when 'float' = @name then 6
						when 'sql_variant' = @name then 23
						when 'ntext' = @name then 11
						when 'bit' = @name then 2
						when 'decimal' = @name then 5
						when 'numeric' = @name then 5
						when 'smallmoney' = @name then 17
						when 'bigint' = @name then 0
						when 'hierarchyid' = @name then null
						when 'geometry' = @name then null
						when 'geography' = @name then null
						when 'varbinary' = @name then 21
						when 'varchar' = @name then 22
						when 'binary' = @name then 1
						when 'char' = @name then 3
						when 'timestamp' = @name then 19
						when 'nvarchar' = @name then 12
						when 'nchar' = @name then 10
						when 'xml' = @name then 25
						when 'sysname' = @name then null
						else null
					end

	return @dataType
END
